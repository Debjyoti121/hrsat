import "server-only";
import { and, asc, count, eq, inArray } from "drizzle-orm";
import { db, reports, users } from "@/lib/db";

/** Active team members who can review, with their open-case workload */
export async function reviewersWithLoad() {
  const [team, loads] = await Promise.all([
    db.select({ id: users.id, name: users.name, title: users.title, role: users.role }).from(users).where(eq(users.active, true)).orderBy(asc(users.name)),
    db.select({ id: reports.reviewerId, n: count() }).from(reports)
      .where(and(inArray(reports.status, ["NEW", "IN_REVIEW", "NEEDS_INFO"])))
      .groupBy(reports.reviewerId),
  ]);
  const map = new Map(loads.map((l) => [l.id, l.n]));
  return team.map((t) => ({ ...t, load: map.get(t.id) ?? 0 }));
}
