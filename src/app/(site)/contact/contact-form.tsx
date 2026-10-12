"use client";
import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Captcha, resetCaptcha } from "@/components/site/captcha";
import { useI18n } from "@/i18n/client";

export function ContactForm() {
  const { t: d } = useI18n();
  const t = d.contact.form;
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data["cf-turnstile-response"]) { toast.error(d.captcha.required); return; }
    setState("loading");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { resetCaptcha(); toast.error(json.error || t.error); setState("idle"); return; }
    setState("done");
  }

  if (state === "done")
    return (
      <div className="mt-8 rounded-2xl bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold">{t.sentTitle}</h3>
        <p className="mt-1 text-slate-600">{t.sentText}</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div><label className="field-label" htmlFor="name">{t.name}</label><input id="name" name="name" required className="input" /></div>
      <div><label className="field-label" htmlFor="email">{t.email}</label><input id="email" name="email" type="email" required className="input" dir="ltr" /></div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="subject">{t.subject}</label>
        <select id="subject" name="subject" className="input" defaultValue="General enquiry">
          {Object.entries(t.subjects).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2"><label className="field-label" htmlFor="body">{t.message}</label><textarea id="body" name="body" required rows={6} className="input resize-y" /></div>
      <Captcha className="sm:col-span-2" />
      <div className="sm:col-span-2 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">{t.consent}</p>
        <button disabled={state === "loading"} className="btn-ink shrink-0 px-6 py-3">
          {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 rtl:-scale-x-100" />} {t.send}
        </button>
      </div>
    </form>
  );
}
