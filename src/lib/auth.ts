import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, users } from "@/lib/db";
import { SESSION_COOKIE, signSession, verifySession, type SessionPayload } from "@/lib/session";

export async function createSession(p: SessionPayload) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(p), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns the signed-in, active user or redirects to /login */
export async function requireUser(role?: "ADMIN") {
  const s = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s) redirect("/login");
  const user = await db.query.users.findFirst({ where: eq(users.id, s.uid) });
  if (!user || !user.active) redirect("/login");
  if (role && user.role !== role) redirect("/dashboard");
  return user;
}

export async function currentUser() {
  const s = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, s.uid) });
  return user?.active ? user : null;
}
