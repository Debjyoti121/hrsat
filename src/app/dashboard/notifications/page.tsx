import Link from "next/link";
import { desc, eq, isNull, or } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db, notifications } from "@/lib/db";
import { Empty, PageHeader } from "@/components/dashboard/ui";
import { markAllRead } from "@/app/actions/dashboard";
import { formatDate } from "@/lib/utils";

export default async function NotificationsPage() {
  const me = await requireUser();
  const scope = me.role === "ADMIN" ? or(eq(notifications.userId, me.id), isNull(notifications.userId)) : eq(notifications.userId, me.id);
  const list = await db.select().from(notifications).where(scope).orderBy(desc(notifications.createdAt)).limit(100);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Notifications" description="New reports, assignments, notes and messages.">
        <form action={async () => { "use server"; await markAllRead(); }}><button className="btn border border-slate-200 bg-white py-2">Mark all as read</button></form>
      </PageHeader>
      <div className="card divide-y divide-slate-100">
        {list.length === 0 && <Empty title="Nothing here yet" />}
        {list.map((n) => {
          const body = (
            <div className="flex items-start gap-4 px-6 py-4 transition hover:bg-slate-50">
              <span className={`mt-2 size-2 shrink-0 rounded-full ${n.read ? "bg-slate-200" : "bg-gold-500"}`} />
              <div className="flex-1"><p className={`text-sm ${n.read ? "" : "font-semibold"}`}>{n.title}</p><p className="text-sm text-slate-500">{n.body}</p></div>
              <span className="text-xs whitespace-nowrap text-slate-400">{formatDate(n.createdAt, true)}</span>
            </div>
          );
          return n.href ? <Link key={n.id} href={n.href} className="block">{body}</Link> : <div key={n.id}>{body}</div>;
        })}
      </div>
    </div>
  );
}
