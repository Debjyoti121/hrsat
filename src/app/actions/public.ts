"use server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db, reports } from "@/lib/db";
import { PUBLIC_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type TrackState = null | { ok?: boolean; error?: string; caseId?: string; status?: string; label?: string; submitted?: string };

export async function trackReport(_: TrackState, fd: FormData): Promise<TrackState> {
  if (!rateLimit("track:" + clientIp(await headers()), 10, 10 * 60_000))
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  const caseId = String(fd.get("caseId") || "").trim().toUpperCase();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  if (!caseId || !email) return { error: "Please enter both your case reference and email." };
  const r = await db.query.reports.findFirst({ where: and(eq(reports.caseId, caseId), eq(reports.reporterEmail, email)) });
  if (!r) return { error: "We couldn't find a report matching those details. Check the reference in your confirmation email." };
  return { ok: true, caseId: r.caseId, status: r.status, label: PUBLIC_STATUS[r.status] ?? r.status, submitted: formatDate(r.createdAt) };
}
