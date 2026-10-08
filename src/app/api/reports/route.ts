import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { db, reports, evidence, activities } from "@/lib/db";
import { ALLOWED_EVIDENCE, MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES, VIOLATION_TYPES } from "@/lib/constants";
import { caseId as makeCaseId } from "@/lib/utils";
import { mail } from "@/lib/mail";
import { notify } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { deleteEvidence, readEvidence, saveEvidence, UPLOAD_PATH } from "@/lib/storage";

export const runtime = "nodejs";

// Files the browser already uploaded straight to storage (see /api/uploads)
const uploadedSchema = z.array(z.object({
  path: z.string().regex(UPLOAD_PATH),
  name: z.string().min(1).max(300),
  type: z.string().max(200),
})).max(MAX_EVIDENCE_FILES);

const opt = z.string().trim().max(5000).optional().transform((v) => (v ? v : null));
const schema = z.object({
  anonymous: z.enum(["yes", "no"]),
  reporterName: opt, reporterEmail: z.string().trim().email().max(200),
  reporterPhone: opt, reporterCity: opt, reporterCountry: opt, organization: opt, aboutWhom: opt,
  victimName: opt, victimAge: opt, victimGender: opt, victimNationality: opt, victimReligionEthnicity: opt,
  victimContact: opt, relationship: opt,
  violationType: z.enum(VIOLATION_TYPES),
  incidentDate: opt, incidentTime: opt, incidentCity: opt, incidentState: opt, incidentPostal: opt, incidentCountry: opt,
  description: z.string().trim().min(20, "Please describe what happened (at least 20 characters).").max(20000),
  involved: opt, authoritiesInvolved: opt, authoritiesDetail: opt, reportedBefore: opt, reportedBeforeDetail: opt,
  hasWitnesses: opt, witnessName: opt, witnessContact: opt, witnessStatement: opt, witnessConfidential: opt, comments: opt,
  consentTrue: z.literal("on"), consentReview: z.literal("on"), consentConfidential: z.literal("on"),
});

export async function POST(req: Request) {
  if (!rateLimit("report:" + clientIp(req.headers), 20, 30 * 60_000))
    return NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });

  let form: FormData;
  try { form = await req.formData(); } catch { return NextResponse.json({ error: "Invalid submission." }, { status: 400 }); }
  if (form.get("website")) return NextResponse.json({ ok: true, caseId: "HRS-0000-000000" }); // honeypot

  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: `${first?.path.join(".") || "Form"}: ${first?.message}` }, { status: 400 });
  }
  const d = parsed.data;
  const anonymous = d.anonymous === "yes";

  const files = form.getAll("evidence").filter((f): f is File => f instanceof File && f.size > 0);
  let uploadedRaw: unknown = [];
  try { uploadedRaw = JSON.parse(String(form.get("uploaded") || "[]")); } catch { uploadedRaw = null; }
  const uploadedParsed = uploadedSchema.safeParse(uploadedRaw);
  if (!uploadedParsed.success) return NextResponse.json({ error: "Evidence upload is invalid. Please attach the files again." }, { status: 400 });
  const uploaded = uploadedParsed.data;
  if (files.length + uploaded.length > MAX_EVIDENCE_FILES) return NextResponse.json({ error: `Maximum ${MAX_EVIDENCE_FILES} files.` }, { status: 400 });
  for (const f of [...files, ...uploaded]) {
    if (f instanceof File && f.size > MAX_EVIDENCE_BYTES) return NextResponse.json({ error: `${f.name} is larger than 25 MB.` }, { status: 400 });
    if (!ALLOWED_EVIDENCE.test(f.type)) return NextResponse.json({ error: `${f.name}: file type not accepted.` }, { status: 400 });
  }
  // Each uploaded object must exist, be within limits, and not already belong to another report
  const directFiles: { storedAs: string; name: string; type: string; buf: Buffer }[] = [];
  if (uploaded.length) {
    const taken = await db.select({ s: evidence.storedAs }).from(evidence).where(inArray(evidence.storedAs, uploaded.map((u) => u.path)));
    if (taken.length) return NextResponse.json({ error: "Evidence upload is invalid. Please attach the files again." }, { status: 400 });
    for (const u of uploaded) {
      const buf = await readEvidence(u.path);
      if (!buf) return NextResponse.json({ error: `${u.name} did not finish uploading. Please try again.` }, { status: 400 });
      if (buf.length > MAX_EVIDENCE_BYTES) {
        await deleteEvidence([u.path]);
        return NextResponse.json({ error: `${u.name} is larger than 25 MB.` }, { status: 400 });
      }
      directFiles.push({ storedAs: u.path, name: u.name, type: u.type, buf });
    }
  }
  const links = form.getAll("links").map(String).map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s)).slice(0, 4);

  const id = randomUUID();
  const caseId = makeCaseId();
  await db.insert(reports).values({
    id, caseId, anonymous,
    reporterName: anonymous ? null : d.reporterName,
    reporterEmail: d.reporterEmail.toLowerCase(),
    reporterPhone: anonymous ? null : d.reporterPhone,
    reporterCity: d.reporterCity, reporterCountry: d.reporterCountry,
    organization: anonymous ? null : d.organization, aboutWhom: d.aboutWhom,
    victimName: d.victimName, victimAge: d.victimAge, victimGender: d.victimGender, victimNationality: d.victimNationality,
    victimReligionEthnicity: d.victimReligionEthnicity, victimContact: d.victimContact, relationship: d.relationship,
    violationType: d.violationType, incidentDate: d.incidentDate, incidentTime: d.incidentTime, incidentCity: d.incidentCity,
    incidentState: d.incidentState, incidentPostal: d.incidentPostal, incidentCountry: d.incidentCountry,
    description: d.description, involved: d.involved, authoritiesInvolved: d.authoritiesInvolved, authoritiesDetail: d.authoritiesDetail,
    reportedBefore: d.reportedBefore, reportedBeforeDetail: d.reportedBeforeDetail,
    links: links.length ? JSON.stringify(links) : null,
    hasWitnesses: d.hasWitnesses, witnessName: d.witnessName, witnessContact: d.witnessContact, witnessStatement: d.witnessStatement,
    witnessConfidential: d.witnessConfidential !== "no", comments: d.comments,
    priority: /Killing|Torture|Disappearance|Trafficking|Sexual/.test(d.violationType) ? "HIGH" : "MEDIUM",
  });

  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer());
    directFiles.push({ storedAs: await saveEvidence(f.name, buf, f.type), name: f.name, type: f.type, buf });
  }
  for (const f of directFiles) {
    await db.insert(evidence).values({
      reportId: id, fileName: f.name.slice(0, 200), storedAs: f.storedAs, mimeType: f.type || "application/octet-stream", size: f.buf.length,
      sha256: createHash("sha256").update(f.buf).digest("hex"),
    });
  }

  const nFiles = directFiles.length;
  await db.insert(activities).values({ reportId: id, action: "SUBMITTED", detail: `Report received via secure form${nFiles ? ` with ${nFiles} evidence file(s)` : ""}` });
  await notify({ type: "NEW_REPORT", title: `New report ${caseId}`, body: `${d.violationType}${d.incidentCountry ? ` · ${d.incidentCountry}` : ""}`, href: `/dashboard/reports/${id}` });
  await Promise.all([
    mail.reportReceived(d.reporterEmail, caseId, anonymous ? null : d.reporterName),
    mail.teamNewReport(caseId, d.violationType, d.incidentCountry, id),
  ]);

  return NextResponse.json({ ok: true, caseId });
}

// Allow large multipart bodies
export const maxDuration = 60;
