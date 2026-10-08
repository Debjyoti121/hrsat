import { eq } from "drizzle-orm";
import { db, evidence, reports, activities } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { readEvidence } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await currentUser();
  if (!me) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const file = await db.query.evidence.findFirst({ where: eq(evidence.id, id) });
  if (!file) return new Response("Not found", { status: 404 });
  const report = await db.query.reports.findFirst({ where: eq(reports.id, file.reportId) });
  if (!report || (me.role !== "ADMIN" && report.reviewerId !== me.id)) return new Response("Forbidden", { status: 403 });

  const data = await readEvidence(file.storedAs);
  if (!data) return new Response("File missing from storage", { status: 410 });

  const download = new URL(req.url).searchParams.has("download");
  if (download) await db.insert(activities).values({ reportId: report.id, actorId: me.id, action: "EVIDENCE", detail: `Downloaded ${file.fileName}` });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'",
    },
  });
}
