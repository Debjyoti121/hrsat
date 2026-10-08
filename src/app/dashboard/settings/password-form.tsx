"use client";
import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/app/actions/dashboard";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) { toast.success("Password updated"); ref.current?.reset(); }
    if (state?.error) toast.error(state.error);
  }, [state]);
  return (
    <form ref={ref} action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
      <input name="current" type="password" required placeholder="Current password" className="dash-input" autoComplete="current-password" />
      <input name="next" type="password" required minLength={8} placeholder="New password (8+ characters)" className="dash-input" autoComplete="new-password" />
      <button disabled={pending} className="btn bg-ink-900 py-2 text-white hover:bg-ink-800 sm:col-span-2 sm:w-fit">{pending && <Loader2 className="size-4 animate-spin" />} Update password</button>
    </form>
  );
}
