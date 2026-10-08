"use client";
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { toast.error(json.error || "Something went wrong. Please try again."); setState("idle"); return; }
    setState("done");
  }

  if (state === "done")
    return (
      <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold">Message sent</h3>
        <p className="mt-1 text-slate-600">Thank you — we&apos;ve emailed you a confirmation and will be in touch soon.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div><label className="field-label" htmlFor="name">Full name</label><input id="name" name="name" required className="input" /></div>
      <div><label className="field-label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" /></div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="subject">Subject</label>
        <select id="subject" name="subject" className="input" defaultValue="General enquiry">
          {["General enquiry", "Partnership / NGO", "Media & press", "Volunteering", "Technical support", "Other"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2"><label className="field-label" htmlFor="body">Message</label><textarea id="body" name="body" required rows={6} className="input resize-y" /></div>
      <div className="sm:col-span-2 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">By sending, you agree we may store your message to reply to you.</p>
        <button disabled={state === "loading"} className="btn-ink px-6 py-3">
          {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send message
        </button>
      </div>
    </form>
  );
}
