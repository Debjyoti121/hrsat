"use client";
import { useActionState } from "react";
import { Loader2, Search } from "lucide-react";
import { trackReport, type TrackState } from "@/app/actions/public";
import { useI18n } from "@/i18n/client";
import { fill } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ORDER = ["NEW", "IN_REVIEW", "NEEDS_INFO", "VERIFIED"];

export function TrackForm({ initialCase }: { initialCase: string }) {
  const { locale, t: d } = useI18n();
  const t = d.track;
  const [state, action, pending] = useActionState<TrackState, FormData>(trackReport, null);
  const date = state?.submittedAt
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : locale, { day: "numeric", month: "long", year: "numeric" }).format(state.submittedAt)
    : "";
  return (
    <div className="rounded-2xl bg-white p-7 text-ink-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,.45)] sm:p-9">
      <form action={action} className="grid gap-5">
        <div><label className="field-label" htmlFor="caseId">{t.caseRef}</label>
          <input id="caseId" name="caseId" defaultValue={initialCase} required placeholder="HRS-2026-XXXXXX" dir="ltr" className="input font-mono uppercase" /></div>
        <div><label className="field-label" htmlFor="email">{t.email}</label>
          <input id="email" name="email" type="email" required dir="ltr" className="input" /></div>
        <button disabled={pending} className="btn-gold mt-1 py-3.5 text-base">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} {t.check}
        </button>
      </form>
      {state?.error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{t.errors[state.error]}</p>}
      {state?.ok && state.status && (
        <div className="mt-8 border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-slate-500" dir="ltr">{state.caseId}</span>
            <span className="text-xs text-slate-500">{fill(t.submitted, { date })}</span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{d.status[state.status as keyof typeof d.status] ?? state.status}</h3>
          {state.status === "CLOSED" ? (
            <p className="mt-2 text-slate-600">{t.closed}</p>
          ) : (
            <ol className="mt-8 grid grid-cols-4 gap-2">
              {t.steps.map((l, i) => {
                const reached = ORDER.indexOf(state.status!) >= i;
                return (
                  <li key={l}>
                    <div className={cn("h-1.5 rounded-full", reached ? "bg-gold-500" : "bg-paper-2")} />
                    <span className={cn("mt-2 block text-xs", reached ? "text-ink-900 font-medium" : "text-slate-400")}>{l}</span>
                  </li>
                );
              })}
            </ol>
          )}
          {state.status === "NEEDS_INFO" && (
            <p className="mt-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-800">{t.needsInfo}</p>
          )}
        </div>
      )}
    </div>
  );
}
