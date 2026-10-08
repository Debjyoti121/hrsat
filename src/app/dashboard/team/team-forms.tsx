"use client";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createMember, toggleMember } from "@/app/actions/dashboard";

export function AddMemberForm() {
  const [state, action, pending] = useActionState(createMember, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) { toast.success("Team member added"); ref.current?.reset(); }
    if (state?.error) toast.error(state.error);
  }, [state]);
  const suggested = typeof window === "undefined" ? "" : Math.random().toString(36).slice(2, 8) + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return (
    <form ref={ref} action={action} className="mt-5 space-y-3">
      <input name="name" required placeholder="Full name" className="dash-input" />
      <input name="email" type="email" required placeholder="Email" className="dash-input" />
      <input name="title" placeholder="Job title (optional)" className="dash-input" />
      <select name="role" defaultValue="REVIEWER" className="dash-input"><option value="REVIEWER">Reviewer</option><option value="ADMIN">Administrator</option></select>
      <input name="password" required minLength={8} defaultValue={suggested} placeholder="Temporary password" className="dash-input font-mono" />
      <label className="flex items-center gap-2 text-xs text-slate-600"><input type="checkbox" name="sendInvite" defaultChecked className="accent-[#0b1630]" /> Email login details to the new member</label>
      <button disabled={pending} className="btn w-full bg-ink-900 py-2 text-white hover:bg-ink-800">{pending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />} Add member</button>
    </form>
  );
}

export function ToggleMember({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} onClick={() => start(async () => { const r = await toggleMember(id); if (r?.error) toast.error(r.error); })}
      className="text-xs font-medium text-slate-500 hover:text-slate-900">
      {pending ? "…" : active ? "Deactivate" : "Reactivate"}
    </button>
  );
}
