"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db, reports } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Errors are codes so the tracking form can show them in the visitor's language.
export type TrackState = null | { ok?: boolean; error?: "tooMany" | "missing" | "notFound"; caseId?: string; status?: string; submittedAt?: number };

export async function trackReport(_: TrackState, fd: FormData): Promise<TrackState> {
  if (!rateLimit("track:" + clientIp(await headers()), 10, 10 * 60_000)) return { error: "tooMany" };
  const caseId = String(fd.get("caseId") || "").trim().toUpperCase();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  if (!caseId || !email) return { error: "missing" };
  const r = await db.query.reports.findFirst({ where: and(eq(reports.caseId, caseId), eq(reports.reporterEmail, email)) });
  if (!r) return { error: "notFound" };
  return { ok: true, caseId: r.caseId, status: r.status, submittedAt: new Date(r.createdAt).getTime() };
}
