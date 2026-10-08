import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { ArrowLeft, Download, Eye, EyeOff, FileText, Fingerprint, ExternalLink, ImageIcon, Film, Music } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db, reports, notes, activities, evidence } from "@/lib/db";
import { reviewersWithLoad } from "@/lib/queries";
import { Avatar, PriorityLabel, StatusBadge } from "@/components/dashboard/ui";
import { AssignSelect } from "@/components/dashboard/assign-select";
import { DeleteReport, NoteForm, PriorityControl, StatusControl } from "./case-controls";
import { formatBytes, formatDate, timeAgo } from "@/lib/utils";

function Row({ label, value, compact }: { label: string; value?: string | null; compact?: boolean }) {
  return (
    <div className={compact ? "grid grid-cols-[120px_1fr] gap-3 py-2.5" : "grid gap-1 py-2.5 sm:grid-cols-3 sm:gap-4"}>
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className={compact ? "min-w-0 text-sm break-words whitespace-pre-wrap" : "text-sm whitespace-pre-wrap sm:col-span-2"}>{value || <span className="text-slate-300">—</span>}</dd>
    </div>
  );
}

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="card">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><h2 className="font-semibold">{title}</h2>{aside}</div>
      <div className="px-6 py-3">{children}</div>
    </section>
  );
}

const fileIcon = (m: string) => (m.startsWith("image/") ? ImageIcon : m.startsWith("video/") ? Film : m.startsWith("audio/") ? Music : FileText);

export default async function ReportDetail({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser();
  const { id } = await params;
  const r = await db.query.reports.findFirst({ where: eq(reports.id, id), with: { reviewer: true } });
  if (!r) notFound();
  const isAdmin = me.role === "ADMIN";
  if (!isAdmin && r.reviewerId !== me.id) notFound();

  const [files, noteList, log, team] = await Promise.all([
    db.query.evidence.findMany({ where: eq(evidence.reportId, id), orderBy: asc(evidence.createdAt) }),
    db.query.notes.findMany({ where: eq(notes.reportId, id), orderBy: desc(notes.createdAt), with: { author: true } }),
    db.query.activities.findMany({ where: eq(activities.reportId, id), orderBy: desc(activities.createdAt), with: { actor: true } }),
    isAdmin ? reviewersWithLoad() : Promise.resolve([]),
  ]);
  const links: string[] = r.links ? JSON.parse(r.links) : [];

  return (
    <div className="mx-auto max-w-7xl">
      <Link href="/dashboard/reports" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" /> Back to reports</Link>
      <div className="mt-4 mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-sm text-slate-500">{r.caseId}</span><StatusBadge status={r.status} /><PriorityLabel priority={r.priority} /></div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{r.violationType}</h1>
          <p className="mt-1 text-sm text-slate-500">Received {formatDate(r.createdAt, true)} · last updated {timeAgo(r.updatedAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Section title="Incident">
            <dl className="divide-y divide-slate-100">
              <Row label="Date" value={r.incidentDate} />
              <Row label="Time" value={r.incidentTime} />
              <Row label="Location" value={[r.incidentCity, r.incidentState, r.incidentPostal, r.incidentCountry].filter(Boolean).join(", ")} />
              <Row label="What happened" value={r.description} />
              <Row label="Who was involved" value={r.involved} />
              <Row label="Authorities involved" value={[r.authoritiesInvolved, r.authoritiesDetail].filter(Boolean).join(" — ")} />
              <Row label="Reported before" value={[r.reportedBefore, r.reportedBeforeDetail].filter(Boolean).join(" — ")} />
              <Row label="Additional comments" value={r.comments} />
            </dl>
          </Section>

          <Section title={`Evidence (${files.length})`} aside={<span className="inline-flex items-center gap-1 text-xs text-slate-500"><Fingerprint className="size-3.5" /> SHA-256 fingerprinted</span>}>
            {files.length === 0 && links.length === 0 ? <p className="py-6 text-center text-sm text-slate-500">No evidence attached.</p> : (
              <div className="space-y-3 py-2">
                {files.some((f) => f.mimeType.startsWith("image/")) && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {files.filter((f) => f.mimeType.startsWith("image/")).map((f) => (
                      <a key={f.id} href={`/api/evidence/${f.id}`} target="_blank" className="block aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/evidence/${f.id}`} alt={f.fileName} className="size-full object-cover transition hover:scale-105" />
                      </a>
                    ))}
                  </div>
                )}
                {files.map((f) => {
                  const Icon = fileIcon(f.mimeType);
                  return (
                    <div key={f.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon className="size-5" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{f.fileName}</div>
                        <div className="truncate font-mono text-[11px] text-slate-400" title={f.sha256}>{formatBytes(f.size)} · sha256 {f.sha256.slice(0, 16)}…{f.sha256.slice(-8)}</div>
                      </div>
                      <a href={`/api/evidence/${f.id}`} target="_blank" className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" title="View"><Eye className="size-4" /></a>
                      <a href={`/api/evidence/${f.id}?download`} className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" title="Download"><Download className="size-4" /></a>
                    </div>
                  );
                })}
                {links.map((l) => (
                  <a key={l} href={l} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm text-ink-700 hover:bg-slate-50">
                    <ExternalLink className="size-4 shrink-0" /><span className="truncate">{l}</span>
                  </a>
                ))}
              </div>
            )}
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Affected person">
              <dl className="divide-y divide-slate-100">
                <Row compact label="Name" value={r.victimName} /><Row compact label="Age" value={r.victimAge} /><Row compact label="Gender" value={r.victimGender} />
                <Row compact label="Nationality" value={r.victimNationality} /><Row compact label="Religion / ethnicity" value={r.victimReligionEthnicity} />
                <Row compact label="Contact" value={r.victimContact} /><Row compact label="Reporter's relationship" value={r.relationship} />
              </dl>
            </Section>
            <Section title="Reporter" aside={r.anonymous ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"><EyeOff className="size-3" /> Anonymous</span> : null}>
              <dl className="divide-y divide-slate-100">
                {!r.anonymous && <Row compact label="Name" value={r.reporterName} />}
                <Row compact label="Email" value={r.reporterEmail} />
                {!r.anonymous && <Row compact label="Phone" value={r.reporterPhone} />}
                {!r.anonymous && <Row compact label="Organisation" value={r.organization} />}
                <Row compact label="Location" value={[r.reporterCity, r.reporterCountry].filter(Boolean).join(", ")} />
                <Row compact label="Report is about" value={r.aboutWhom} />
              </dl>
            </Section>
          </div>

          {r.hasWitnesses && (
            <Section title="Witnesses" aside={r.witnessConfidential ? <span className="text-xs font-medium text-amber-700">Identity confidential</span> : null}>
              <dl className="divide-y divide-slate-100">
                <Row label="Witnesses present" value={r.hasWitnesses} /><Row label="Name" value={r.witnessName} />
                <Row label="Contact" value={r.witnessContact} /><Row label="Statement" value={r.witnessStatement} />
              </dl>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card space-y-5 p-6">
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Reviewer</h3>
              {isAdmin ? <AssignSelect reportId={r.id} value={r.reviewerId} reviewers={team} />
                : <div className="flex items-center gap-2 text-sm"><Avatar name={me.name} /> You</div>}
              {isAdmin && <p className="mt-1.5 text-xs text-slate-500">The reviewer gets an email and a dashboard notification.</p>}
            </div>
            <div><h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Status</h3><StatusControl key={r.status} reportId={r.id} status={r.status} anonymousEmail={r.anonymous} /></div>
            <div><h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Priority</h3><PriorityControl key={r.priority} reportId={r.id} priority={r.priority} /></div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Internal notes</h3>
            <div className="mt-4"><NoteForm reportId={r.id} /></div>
            <ul className="mt-4 space-y-4">
              {noteList.map((n) => (
                <li key={n.id} className="flex gap-3">
                  <Avatar name={n.author.name} />
                  <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-3 py-2">
                    <div className="flex justify-between text-xs"><span className="font-medium">{n.author.name}</span><span className="text-slate-400">{timeAgo(n.createdAt)}</span></div>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold">Activity</h3>
            <ol className="relative mt-4 space-y-4 border-l border-slate-200 pl-5">
              {log.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-white bg-ink-700 ring-1 ring-slate-200" />
                  <p className="text-sm"><span className="font-medium">{a.actor?.name ?? "System"}</span> <span className="text-slate-600">{a.detail ?? a.action.toLowerCase()}</span></p>
                  <p className="text-xs text-slate-400">{formatDate(a.createdAt, true)}</p>
                </li>
              ))}
            </ol>
          </div>

          {isAdmin && <div className="card p-6"><h3 className="mb-3 font-semibold text-red-700">Danger zone</h3><DeleteReport reportId={r.id} caseId={r.caseId} /></div>}
        </aside>
      </div>
    </div>
  );
}
