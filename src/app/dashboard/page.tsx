import Link from "next/link";
import { and, count, desc, eq, gte, isNull, inArray, type SQL } from "drizzle-orm";
import { ArrowUpRight, CheckCircle2, Clock, FileWarning, Inbox, UserX } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db, reports, messages } from "@/lib/db";
import { reviewersWithLoad } from "@/lib/queries";
import { STATUSES } from "@/lib/constants";
import { Avatar, PageHeader, PriorityLabel, StatusBadge, Empty } from "@/components/dashboard/ui";
import { AssignSelect } from "@/components/dashboard/assign-select";
import { timeAgo } from "@/lib/utils";

export default async function Overview() {
  const me = await requireUser();
  const isAdmin = me.role === "ADMIN";
  const scope: SQL | undefined = isAdmin ? undefined : eq(reports.reviewerId, me.id);
  const since = new Date(Date.now() - 13 * 86400000); since.setHours(0, 0, 0, 0);

  const [byStatus, recent, unassigned, last14, byType, team, [msg]] = await Promise.all([
    db.select({ status: reports.status, n: count() }).from(reports).where(scope).groupBy(reports.status),
    db.query.reports.findMany({ where: scope, orderBy: desc(reports.createdAt), limit: 6, with: { reviewer: true } }),
    isAdmin ? db.query.reports.findMany({ where: isNull(reports.reviewerId), orderBy: desc(reports.createdAt), limit: 5 }) : Promise.resolve([]),
    db.select({ createdAt: reports.createdAt }).from(reports).where(scope ? and(scope, gte(reports.createdAt, since)) : gte(reports.createdAt, since)),
    db.select({ t: reports.violationType, n: count() }).from(reports).where(scope).groupBy(reports.violationType).orderBy(desc(count())).limit(5),
    isAdmin ? reviewersWithLoad() : Promise.resolve([]),
    isAdmin ? db.select({ n: count() }).from(messages).where(eq(messages.handled, false)) : Promise.resolve([{ n: 0 }]),
  ]);

  const s = Object.fromEntries(byStatus.map((x) => [x.status, x.n])) as Record<string, number>;
  const total = byStatus.reduce((a, b) => a + b.n, 0);
  const open = (s.NEW ?? 0) + (s.IN_REVIEW ?? 0) + (s.NEEDS_INFO ?? 0);

  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(since); d.setDate(d.getDate() + i); return d; });
  const perDay = days.map((d) => last14.filter((r) => new Date(r.createdAt).toDateString() === d.toDateString()).length);
  const maxDay = Math.max(1, ...perDay);
  const maxType = Math.max(1, ...byType.map((b) => b.n));

  const tiles = [
    { label: isAdmin ? "Total reports" : "Assigned to me", value: total, icon: FileWarning, tone: "bg-ink-900 text-gold-400" },
    { label: "Open cases", value: open, icon: Clock, tone: "bg-amber-50 text-amber-600" },
    isAdmin
      ? { label: "Unassigned", value: unassigned.length, icon: UserX, tone: "bg-red-50 text-red-600" }
      : { label: "Needs info", value: s.NEEDS_INFO ?? 0, icon: UserX, tone: "bg-violet-50 text-violet-600" },
    isAdmin
      ? { label: "Unread messages", value: msg?.n ?? 0, icon: Inbox, tone: "bg-sky-50 text-sky-600" }
      : { label: "Verified", value: s.VERIFIED ?? 0, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${me.name.split(" ")[0]}`}
        description={isAdmin ? "Here's what's happening across HRSAT today." : "Your assigned cases at a glance."}>
        <Link href="/dashboard/reports" className="btn bg-ink-900 text-white hover:bg-ink-800">{isAdmin ? "All reports" : "My cases"} <ArrowUpRight className="size-4" /></Link>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{t.label}</span>
              <span className={`grid size-9 place-items-center rounded-xl ${t.tone}`}><t.icon className="size-4" /></span>
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">{t.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div><h2 className="font-semibold">Submissions</h2><p className="text-xs text-slate-500">Last 14 days</p></div>
            <span className="text-2xl font-semibold tabular-nums">{perDay.reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {perDay.map((n, i) => (
              <div key={i} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                <span className="pointer-events-none absolute -top-6 rounded bg-ink-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{n}</span>
                <div className={`w-full rounded-md transition ${n ? "bg-ink-700 group-hover:bg-gold-500" : "bg-slate-100"}`} style={{ height: `${Math.max(4, (n / maxDay) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>{days[0]!.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span><span>Today</span>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Pipeline</h2>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
            {Object.entries(STATUSES).map(([k, v]) => (s[k] ? <div key={k} className={v.dot} style={{ width: `${(s[k]! / Math.max(1, total)) * 100}%` }} title={v.label} /> : null))}
          </div>
          <ul className="mt-5 space-y-2.5">
            {Object.entries(STATUSES).map(([k, v]) => (
              <li key={k}>
                <Link href={`/dashboard/reports?status=${k}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                  <span className="flex items-center gap-2"><span className={`size-2 rounded-full ${v.dot}`} />{v.label}</span>
                  <span className="font-medium tabular-nums">{s[k] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold">Recent reports</h2>
            <Link href="/dashboard/reports" className="text-xs font-medium text-slate-500 hover:text-slate-900">View all →</Link>
          </div>
          {recent.length === 0 ? <Empty title="No reports yet" text="New submissions from the website will appear here." /> : (
            <ul className="divide-y divide-slate-100">
              {recent.map((r) => (
                <li key={r.id}>
                  <Link href={`/dashboard/reports/${r.id}`} className="flex items-center gap-4 px-6 py-3.5 transition hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><span className="font-mono text-xs text-slate-500">{r.caseId}</span><PriorityLabel priority={r.priority} /></div>
                      <div className="truncate text-sm font-medium">{r.violationType}</div>
                      <div className="text-xs text-slate-500">{[r.incidentCity, r.incidentCountry].filter(Boolean).join(", ") || "Location not given"} · {timeAgo(r.createdAt)}</div>
                    </div>
                    {r.reviewer ? <Avatar name={r.reviewer.name} /> : <span className="text-xs text-slate-400">Unassigned</span>}
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          {isAdmin && (
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4"><h2 className="font-semibold">Needs a reviewer</h2><p className="text-xs text-slate-500">Assign straight from here</p></div>
              {unassigned.length === 0 ? <p className="px-6 py-8 text-center text-sm text-slate-500">Every report has a reviewer. 🎉</p> : (
                <ul className="divide-y divide-slate-100">
                  {unassigned.map((r) => (
                    <li key={r.id} className="space-y-2 px-6 py-3.5">
                      <Link href={`/dashboard/reports/${r.id}`} className="block"><span className="font-mono text-xs text-slate-500">{r.caseId}</span><span className="block truncate text-sm font-medium hover:underline">{r.violationType}</span></Link>
                      <AssignSelect compact reportId={r.id} value={null} reviewers={team} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="card p-6">
            <h2 className="font-semibold">{isAdmin ? "Reviewer workload" : "Top violation types"}</h2>
            {isAdmin ? (
              <ul className="mt-4 space-y-3">
                {team.map((t) => (
                  <li key={t.id} className="flex items-center gap-3">
                    <Avatar name={t.name} />
                    <div className="min-w-0 flex-1"><div className="truncate text-sm">{t.name}</div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-ink-700" style={{ width: `${Math.min(100, t.load * 12.5)}%` }} /></div></div>
                    <span className="text-xs tabular-nums text-slate-500">{t.load} open</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {!isAdmin && (
              <ul className="mt-4 space-y-3">
                {byType.map((b) => (
                  <li key={b.t}><div className="flex justify-between text-sm"><span className="truncate pr-2">{b.t}</span><span className="tabular-nums text-slate-500">{b.n}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gold-500" style={{ width: `${(b.n / maxType) * 100}%` }} /></div></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isAdmin && byType.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="font-semibold">Most reported violation types</h2>
          <ul className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {byType.map((b) => (
              <li key={b.t}><div className="flex justify-between text-sm"><span className="truncate pr-2">{b.t}</span><span className="tabular-nums text-slate-500">{b.n}</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gold-500" style={{ width: `${(b.n / maxType) * 100}%` }} /></div></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
