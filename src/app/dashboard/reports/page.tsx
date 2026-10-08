import Link from "next/link";
import { and, count, desc, eq, isNull, like, or, type SQL } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db, reports } from "@/lib/db";
import { reviewersWithLoad } from "@/lib/queries";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { Avatar, Empty, PageHeader, PriorityLabel, StatusBadge } from "@/components/dashboard/ui";
import { AssignSelect } from "@/components/dashboard/assign-select";
import { cn, formatDate, timeAgo } from "@/lib/utils";

const PAGE = 20;

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const me = await requireUser();
  const isAdmin = me.role === "ADMIN";
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const base: SQL[] = [];
  if (!isAdmin) base.push(eq(reports.reviewerId, me.id));
  if (sp.q) {
    const q = `%${sp.q.trim()}%`;
    base.push(or(like(reports.caseId, q), like(reports.violationType, q), like(reports.incidentCountry, q), like(reports.incidentCity, q), like(reports.reporterEmail, q), like(reports.description, q))!);
  }
  if (sp.priority) base.push(eq(reports.priority, sp.priority));
  if (isAdmin && sp.reviewer) base.push(sp.reviewer === "none" ? isNull(reports.reviewerId) : eq(reports.reviewerId, sp.reviewer));
  const filters = [...base];
  if (sp.status) filters.push(eq(reports.status, sp.status));

  const [rows, [{ total }], statusCounts, team] = await Promise.all([
    db.query.reports.findMany({ where: and(...filters), orderBy: desc(reports.createdAt), limit: PAGE, offset: (page - 1) * PAGE, with: { reviewer: true, evidence: { columns: { id: true } } } }),
    db.select({ total: count() }).from(reports).where(and(...filters)),
    db.select({ status: reports.status, n: count() }).from(reports).where(and(...base)).groupBy(reports.status),
    isAdmin ? reviewersWithLoad() : Promise.resolve([]),
  ]);
  const sc = Object.fromEntries(statusCounts.map((s) => [s.status, s.n])) as Record<string, number>;
  const all = statusCounts.reduce((a, b) => a + b.n, 0);
  const qs = (patch: Record<string, string | undefined>) => {
    const merged: Record<string, string | undefined> = { ...sp, page: undefined, ...patch };
    const p = new URLSearchParams(Object.entries(merged).filter((e): e is [string, string] => !!e[1]));
    return `/dashboard/reports${p.size ? `?${p}` : ""}`;
  };
  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={isAdmin ? "Reports" : "My cases"} description={isAdmin ? "Every submission from the secure reporting form." : "Reports assigned to you for review."} />

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200">
        {[["", "All", all], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label, sc[k] ?? 0])].map(([k, label, n]) => (
          <Link key={k as string} href={qs({ status: (k as string) || undefined })}
            className={cn("-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition",
              (sp.status ?? "") === k ? "border-ink-900 font-medium text-ink-900" : "border-transparent text-slate-500 hover:text-slate-900")}>
            {label as string}<span className="rounded-full bg-slate-100 px-1.5 text-[11px] tabular-nums text-slate-600">{n as number}</span>
          </Link>
        ))}
      </div>

      <form className="mb-4 flex flex-wrap gap-2">
        {sp.status && <input type="hidden" name="status" value={sp.status} />}
        <input name="q" defaultValue={sp.q} placeholder="Search case ID, type, country, email, description…" className="dash-input max-w-sm flex-1" />
        <select name="priority" defaultValue={sp.priority ?? ""} className="dash-input w-auto">
          <option value="">Any priority</option>
          {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {isAdmin && (
          <select name="reviewer" defaultValue={sp.reviewer ?? ""} className="dash-input w-auto">
            <option value="">Any reviewer</option><option value="none">Unassigned</option>
            {team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
        <button className="btn bg-ink-900 py-2 text-white hover:bg-ink-800">Filter</button>
        {(sp.q || sp.priority || sp.reviewer) && <Link href={qs({ q: undefined, priority: undefined, reviewer: undefined })} className="btn border border-slate-200 bg-white py-2">Clear</Link>}
      </form>

      <div className="card overflow-hidden">
        {rows.length === 0 ? <Empty title="No reports match" text="Try a different filter or search term." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Case</th><th className="px-5 py-3 font-medium">Violation</th>
                  <th className="px-5 py-3 font-medium">Priority</th><th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Reviewer</th><th className="px-5 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="group transition hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <Link href={`/dashboard/reports/${r.id}`} className="font-mono text-xs font-medium text-ink-700 hover:underline">{r.caseId}</Link>
                      <div className="mt-0.5 text-xs text-slate-500">{r.anonymous ? "Anonymous" : r.reporterName || "—"}{r.evidence.length ? ` · ${r.evidence.length} file${r.evidence.length > 1 ? "s" : ""}` : ""}</div>
                    </td>
                    <td className="max-w-[280px] px-5 py-3.5">
                      <Link href={`/dashboard/reports/${r.id}`} className="block truncate font-medium hover:underline">{r.violationType}</Link>
                      <div className="truncate text-xs text-slate-500">{[r.incidentCity, r.incidentCountry].filter(Boolean).join(", ") || "—"}</div>
                    </td>
                    <td className="px-5 py-3.5"><PriorityLabel priority={r.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="w-56 px-5 py-3.5">
                      {isAdmin ? <AssignSelect compact reportId={r.id} value={r.reviewerId} reviewers={team} />
                        : r.reviewer ? <span className="flex items-center gap-2"><Avatar name={r.reviewer.name} />{r.reviewer.name}</span> : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500" title={formatDate(r.createdAt, true)}>{timeAgo(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm">
            <span className="text-slate-500">Page {page} of {pages} · {total} reports</span>
            <div className="flex gap-2">
              {page > 1 && <Link href={qs({ page: String(page - 1) })} className="btn border border-slate-200 bg-white py-1.5">Previous</Link>}
              {page < pages && <Link href={qs({ page: String(page + 1) })} className="btn border border-slate-200 bg-white py-1.5">Next</Link>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
