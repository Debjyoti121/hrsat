"use client";
import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { login } from "@/app/actions/dashboard";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <div><label className="field-label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="input" /></div>
      <div><label className="field-label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn-ink w-full py-3">{pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Sign in</button>
    </form>
  );
}
