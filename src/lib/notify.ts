import "server-only";
import { db, notifications } from "@/lib/db";

export async function notify(n: { userId?: string | null; type: string; title: string; body: string; href?: string }) {
  await db.insert(notifications).values({ userId: n.userId ?? null, type: n.type, title: n.title, body: n.body, href: n.href });
}
