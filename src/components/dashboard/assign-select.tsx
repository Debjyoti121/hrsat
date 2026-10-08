"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { assignReviewer } from "@/app/actions/dashboard";

export function AssignSelect({ reportId, value, reviewers, compact }: { reportId: string; value: string | null; reviewers: { id: string; name: string; load?: number }[]; compact?: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <div className="relative inline-flex w-full items-center">
      <select
        value={value ?? ""}
        disabled={pending}
        onChange={(e) => {
          if (e.target.value === "__add") return router.push("/dashboard/team");
          const v = e.target.value || null;
          start(async () => {
            const r = await assignReviewer(reportId, v);
            if (r?.error) toast.error(r.error);
            else toast.success(v ? "Reviewer assigned — they've been notified by email" : "Reviewer removed");
          });
        }}
        className={compact ? "dash-input py-1.5 pr-8 text-xs" : "dash-input pr-8"}
      >
        <option value="">Unassigned</option>
        {reviewers.map((r) => <option key={r.id} value={r.id}>{r.name}{r.load !== undefined ? ` · ${r.load} open` : ""}</option>)}
        <option value="__add">＋ Add a reviewer…</option>
      </select>
      {pending && <Loader2 className="pointer-events-none absolute right-8 size-3.5 animate-spin text-slate-400" />}
    </div>
  );
}
