import { NextResponse } from "next/server";
import { and, desc, eq, inArray, isNull, or, count } from "drizzle-orm";
import { db, notifications } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function scopeFor() {
  const me = await currentUser();
  if (!me) return null;
  return me.role === "ADMIN" ? or(eq(notifications.userId, me.id), isNull(notifications.userId))! : eq(notifications.userId, me.id);
}

export async function GET() {
  const scope = await scopeFor();
  if (!scope) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [items, [{ unread }]] = await Promise.all([
    db.select().from(notifications).where(scope).orderBy(desc(notifications.createdAt)).limit(15),
    db.select({ unread: count() }).from(notifications).where(and(scope, eq(notifications.read, false))),
  ]);
  return NextResponse.json({ items, unread });
}

export async function PATCH(req: Request) {
  const scope = await scopeFor();
  if (!scope) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ids } = (await req.json().catch(() => ({}))) as { ids?: string[] };
  const where = ids?.length ? and(scope, inArray(notifications.id, ids)) : scope;
  await db.update(notifications).set({ read: true }).where(where);
  return NextResponse.json({ ok: true });
}
