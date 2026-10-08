"use client";
import { useState, useTransition } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addNote, deleteReport, updatePriority, updateStatus } from "@/app/actions/dashboard";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusControl({ reportId, status, anonymousEmail }: { reportId: string; status: string; anonymousEmail: boolean }) {
  const [value, setValue] = useState(status);
  const [notifyReporter, setNotify] = useState(true);
  const [pending, start] = useTransition();
  const changed = value !== status;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(STATUSES).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setValue(k)}
            className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition",
              value === k ? "border-ink-900 bg-ink-900 text-white" : "border-slate-200 hover:border-slate-300")}>
            <span className={cn("size-2 rounded-full", v.dot)} />{v.label}
          </button>
        ))}
      </div>
      {changed && (
        <div className="space-y-3 rounded-xl bg-slate-50 p-3">
          <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={notifyReporter} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 accent-[#0b1630]" />
            Email the reporter a status update{anonymousEmail ? " (anonymous reporter — the email contains only the case reference)" : ""}
          </label>
          <button disabled={pending} onClick={() => start(async () => {
            const r = await updateStatus(reportId, value, notifyReporter);
            if (r?.error) toast.error(r.error); else toast.success("Status updated");
          })} className="btn w-full bg-ink-900 py-2 text-white hover:bg-ink-800">
            {pending && <Loader2 className="size-4 animate-spin" />} Save status
          </button>
        </div>
      )}
    </div>
  );
}

export function PriorityControl({ reportId, priority }: { reportId: string; priority: string }) {
  const [pending, start] = useTransition();
  return (
    <select defaultValue={priority} disabled={pending} className="dash-input"
      onChange={(e) => { const v = e.target.value; start(async () => { const r = await updatePriority(reportId, v); if (r?.error) toast.error(r.error); else toast.success("Priority updated"); }); }}>
      {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
    </select>
  );
}

export function NoteForm({ reportId }: { reportId: string }) {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  return (
    <form onSubmit={(e) => { e.preventDefault(); start(async () => { const r = await addNote(reportId, body); if (r?.error) toast.error(r.error); else { setBody(""); toast.success("Note added"); } }); }}>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Add an internal note — only visible to the team…" className="dash-input resize-none" />
      <div className="mt-2 flex justify-end">
        <button disabled={pending || body.trim().length < 2} className="btn bg-ink-900 py-1.5 text-xs text-white hover:bg-ink-800">
          {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Add note
        </button>
      </div>
    </form>
  );
}

export function DeleteReport({ reportId, caseId }: { reportId: string; caseId: string }) {
  const [confirm, setConfirm] = useState("");
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">Type <span className="font-mono font-semibold">{caseId}</span> to permanently delete this report and its evidence records.</p>
      <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="dash-input font-mono text-xs" />
      <button disabled={confirm !== caseId || pending} onClick={() => start(async () => { await deleteReport(reportId); })}
        className="btn w-full border border-red-200 bg-red-50 py-2 text-red-700 hover:bg-red-100">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete report
      </button>
    </div>
  );
}
