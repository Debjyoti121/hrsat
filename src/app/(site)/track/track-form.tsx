"use client";
import { useActionState } from "react";
import { Loader2, Search } from "lucide-react";
import { trackReport, type TrackState } from "@/app/actions/public";
import { cn } from "@/lib/utils";

const ORDER = ["NEW", "IN_REVIEW", "NEEDS_INFO", "VERIFIED"];

export function TrackForm({ initialCase }: { initialCase: string }) {
  const [state, action, pending] = useActionState<TrackState, FormData>(trackReport, null);
  return (
    <div className="rounded-xl border border-line bg-white p-7 sm:p-10">
      <form action={action} className="grid gap-5 sm:grid-cols-2">
        <div><label className="field-label" htmlFor="caseId">Case reference</label>
          <input id="caseId" name="caseId" defaultValue={initialCase} required placeholder="HRS-2026-XXXXXX" className="input font-mono uppercase" /></div>
        <div><label className="field-label" htmlFor="email">Email used</label>
          <input id="email" name="email" type="email" required className="input" /></div>
        <button disabled={pending} className="btn-ink py-3 sm:col-span-2">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />} Check status
        </button>
      </form>
      {state?.error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{state.error}</p>}
      {state?.ok && (
        <div className="mt-8 border-t border-line pt-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-slate-500">{state.caseId}</span>
            <span className="text-xs text-slate-500">Submitted {state.submitted}</span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{state.label}</h3>
          {state.status === "CLOSED" ? (
            <p className="mt-2 text-slate-600">This case has been closed. Thank you for speaking up.</p>
          ) : (
            <ol className="mt-8 grid grid-cols-4 gap-2">
              {["Received", "In review", "Info requested", "Verified"].map((l, i) => {
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
            <p className="mt-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-800">Our team needs more information. If you shared contact details, a reviewer will contact you. Otherwise, please reach us via the contact page quoting your case reference.</p>
          )}
        </div>
      )}
    </div>
  );
}
