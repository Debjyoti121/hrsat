"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, isNull, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { headers } from "next/headers";
import { db, users, reports, notes, activities, messages, notifications, evidence } from "@/lib/db";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { mail } from "@/lib/mail";
import { notify } from "@/lib/notify";
import { STATUSES, PRIORITIES } from "@/lib/constants";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { deleteEvidence } from "@/lib/storage";

type Result = { ok?: boolean; error?: string } | null;

/* ───────────── Auth ───────────── */
export async function login(_: Result, fd: FormData): Promise<Result> {
  if (!rateLimit("login:" + clientIp(await headers()), 10, 15 * 60_000))
    return { error: "Too many sign-in attempts. Try again in 15 minutes." };
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash)))
    return { error: "Incorrect email or password." };
  await createSession({ uid: user.id, role: user.role, name: user.name });
  const next = String(fd.get("next") || "");
  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

/* ───────────── Case access ───────────── */
async function loadCase(reportId: string) {
  const me = await requireUser();
  const r = await db.query.reports.findFirst({ where: eq(reports.id, reportId) });
  if (!r) throw new Error("Report not found");
  if (me.role !== "ADMIN" && r.reviewerId !== me.id) throw new Error("Not allowed");
  return { me, r };
}

const touch = (id: string) => db.update(reports).set({ updatedAt: new Date() }).where(eq(reports.id, id));

export async function assignReviewer(reportId: string, reviewerId: string | null): Promise<Result> {
  const me = await requireUser("ADMIN");
  const r = await db.query.reports.findFirst({ where: eq(reports.id, reportId) });
  if (!r) return { error: "Report not found" };
  if (reviewerId === r.reviewerId) return { ok: true };

  let reviewer = null;
  if (reviewerId) {
    reviewer = await db.query.users.findFirst({ where: eq(users.id, reviewerId) });
    if (!reviewer || !reviewer.active) return { error: "Reviewer not available" };
  }
  await db.update(reports).set({
    reviewerId,
    status: reviewerId && r.status === "NEW" ? "IN_REVIEW" : r.status,
    updatedAt: new Date(),
  }).where(eq(reports.id, reportId));
  await db.insert(activities).values({
    reportId, actorId: me.id, action: reviewerId ? "ASSIGNED" : "UNASSIGNED",
    detail: reviewer ? `Assigned to ${reviewer.name}` : "Reviewer removed",
  });
  if (reviewer) {
    await notify({ userId: reviewer.id, type: "ASSIGNED", title: `You were assigned ${r.caseId}`, body: `${me.name} assigned you · ${r.violationType}`, href: `/dashboard/reports/${r.id}` });
    await mail.reviewerAssigned(reviewer.email, reviewer.name, r.caseId, r.id, me.name);
  }
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function updateStatus(reportId: string, status: string, notifyReporter: boolean): Promise<Result> {
  if (!(status in STATUSES)) return { error: "Invalid status" };
  const { me, r } = await loadCase(reportId);
  if (r.status === status) return { ok: true };
  await db.update(reports).set({ status, updatedAt: new Date() }).where(eq(reports.id, reportId));
  await db.insert(activities).values({
    reportId, actorId: me.id, action: "STATUS",
    detail: `${STATUSES[r.status as keyof typeof STATUSES]?.label ?? r.status} → ${STATUSES[status as keyof typeof STATUSES].label}${notifyReporter ? " · reporter emailed" : ""}`,
  });
  if (me.role !== "ADMIN")
    await notify({ type: "STATUS", title: `${r.caseId} is now ${STATUSES[status as keyof typeof STATUSES].label}`, body: `Updated by ${me.name}`, href: `/dashboard/reports/${r.id}` });
  if (notifyReporter) await mail.statusUpdate(r.reporterEmail, r.caseId, status);
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}

export async function updatePriority(reportId: string, priority: string): Promise<Result> {
  if (!(priority in PRIORITIES)) return { error: "Invalid priority" };
  const { me, r } = await loadCase(reportId);
  await db.update(reports).set({ priority, updatedAt: new Date() }).where(eq(reports.id, reportId));
  await db.insert(activities).values({ reportId, actorId: me.id, action: "PRIORITY", detail: `${r.priority} → ${priority}` });
  revalidatePath(`/dashboard/reports/${reportId}`);
  return { ok: true };
}

export async function addNote(reportId: string, body: string): Promise<Result> {
  const text = body.trim();
  if (text.length < 2) return { error: "Note is empty" };
  const { me, r } = await loadCase(reportId);
  await db.insert(notes).values({ reportId, authorId: me.id, body: text.slice(0, 5000) });
  await db.insert(activities).values({ reportId, actorId: me.id, action: "NOTE", detail: "Added an internal note" });
  await touch(reportId);
  // let the other party know
  if (me.role === "ADMIN" && r.reviewerId && r.reviewerId !== me.id)
    await notify({ userId: r.reviewerId, type: "NOTE", title: `New note on ${r.caseId}`, body: `${me.name}: ${text.slice(0, 80)}`, href: `/dashboard/reports/${r.id}` });
  if (me.role !== "ADMIN")
    await notify({ type: "NOTE", title: `New note on ${r.caseId}`, body: `${me.name}: ${text.slice(0, 80)}`, href: `/dashboard/reports/${r.id}` });
  revalidatePath(`/dashboard/reports/${reportId}`);
  return { ok: true };
}

export async function deleteReport(reportId: string): Promise<Result> {
  await requireUser("ADMIN");
  const files = await db.select({ storedAs: evidence.storedAs }).from(evidence).where(eq(evidence.reportId, reportId));
  await deleteEvidence(files.map((f) => f.storedAs));
  await db.delete(reports).where(eq(reports.id, reportId));
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/reports");
}

/* ───────────── Team ───────────── */
const memberSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  title: z.string().trim().max(100).optional(),
  role: z.enum(["ADMIN", "REVIEWER"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
  sendInvite: z.string().optional(),
});

export async function createMember(_: Result, fd: FormData): Promise<Result> {
  await requireUser("ADMIN");
  const p = memberSchema.safeParse(Object.fromEntries(fd));
  if (!p.success) return { error: p.error.issues[0]?.message || "Invalid input" };
  const email = p.data.email.toLowerCase();
  if (await db.query.users.findFirst({ where: eq(users.email, email) })) return { error: "A member with this email already exists" };
  await db.insert(users).values({
    name: p.data.name, email, title: p.data.title || null, role: p.data.role,
    passwordHash: await bcrypt.hash(p.data.password, 10),
  });
  if (p.data.sendInvite) await mail.welcome(email, p.data.name, p.data.password);
  revalidatePath("/dashboard/team");
  return { ok: true };
}

export async function toggleMember(id: string): Promise<Result> {
  const me = await requireUser("ADMIN");
  if (id === me.id) return { error: "You can't deactivate yourself" };
  const u = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!u) return { error: "Not found" };
  await db.update(users).set({ active: !u.active }).where(eq(users.id, id));
  revalidatePath("/dashboard/team");
  return { ok: true };
}

export async function changePassword(_: Result, fd: FormData): Promise<Result> {
  const me = await requireUser();
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  if (next.length < 8) return { error: "New password must be at least 8 characters" };
  if (!(await bcrypt.compare(current, me.passwordHash))) return { error: "Current password is incorrect" };
  await db.update(users).set({ passwordHash: await bcrypt.hash(next, 10) }).where(eq(users.id, me.id));
  return { ok: true };
}

/* ───────────── Messages & notifications ───────────── */
export async function toggleMessageHandled(id: string): Promise<Result> {
  await requireUser("ADMIN");
  const m = await db.query.messages.findFirst({ where: eq(messages.id, id) });
  if (!m) return { error: "Not found" };
  await db.update(messages).set({ handled: !m.handled }).where(eq(messages.id, id));
  revalidatePath("/dashboard/messages");
  return { ok: true };
}

export async function markAllRead(): Promise<Result> {
  const me = await requireUser();
  const scope = me.role === "ADMIN" ? or(eq(notifications.userId, me.id), isNull(notifications.userId)) : eq(notifications.userId, me.id);
  await db.update(notifications).set({ read: true }).where(and(scope, eq(notifications.read, false)));
  revalidatePath("/dashboard", "layout");
  return { ok: true };
}
