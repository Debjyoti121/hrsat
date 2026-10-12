"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, FileText, Loader2, Lock, Paperclip, Plus, ShieldCheck, Trash2, UploadCloud, X,
} from "lucide-react";
import { toast } from "sonner";
import { GENDERS, MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES, RELATIONSHIPS, VIOLATION_TYPES, YES_NO_UNKNOWN } from "@/lib/constants";
import { PoweredBy } from "@/components/site/powered-by";
import { Captcha, resetCaptcha } from "@/components/site/captcha";
import { useI18n } from "@/i18n/client";
import { countryOptions, fill } from "@/i18n/config";
import { rich } from "@/i18n/rich";
import { cn, formatBytes } from "@/lib/utils";

const MAX_FILES = MAX_EVIDENCE_FILES;
const MAX_BYTES = MAX_EVIDENCE_BYTES;

type Option = { value: string; label: string };
/** Options whose stored value stays English while the label is translated. */
const opts = (values: readonly string[], labels: Record<string, string>): Option[] => values.map((v) => ({ value: v, label: labels[v] ?? v }));

function Field({ label, name, required, hint, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}{required && <span className="text-gold-600"> *</span>}</label>
      <input id={name} name={name} required={required} className="input" {...rest} />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Select({ label, name, options, required, className, placeholder }: { label: string; name: string; options: Option[]; required?: boolean; className?: string; placeholder: string }) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}{required && <span className="text-gold-600"> *</span>}</label>
      <select id={name} name={name} required={required} defaultValue="" className="input">
        <option value="" disabled={required}>{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Area({ label, name, required, hint, rows = 4, className, placeholder }: { label: string; name: string; required?: boolean; hint?: string; rows?: number; className?: string; placeholder?: string }) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}{required && <span className="text-gold-600"> *</span>}</label>
      <textarea id={name} name={name} required={required} rows={rows} placeholder={placeholder} minLength={required ? 20 : undefined} className="input resize-y" />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Choices({ label, name, options, required, defaultValue, onChange, cols = 2 }: { label: string; name: string; options: Option[]; required?: boolean; defaultValue?: string; onChange?: (v: string) => void; cols?: number }) {
  return (
    <fieldset>
      <legend className="field-label">{label}{required && <span className="text-gold-600"> *</span>}</legend>
      <div className={cn("grid gap-2", cols === 3 ? "sm:grid-cols-3" : cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2")}>
        {options.map((o) => (
          <label key={o.value} className="choice">
            <input type="radio" name={name} value={o.value} required={required} defaultChecked={defaultValue === o.value}
              onChange={(e) => onChange?.(e.target.value)} className="size-4 accent-[#e7a33e]" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ReportForm() {
  const { locale, t: d } = useI18n();
  const t = d.report;
  const STEPS = t.steps;
  const countries = useMemo(() => countryOptions(locale, d), [locale, d]);
  const yesNoUnknown = opts(YES_NO_UNKNOWN, d.options.yesNoUnknown);

  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [anonymous, setAnonymous] = useState<"yes" | "no">("no");
  const [witnesses, setWitnesses] = useState("");
  const [authorities, setAuthorities] = useState("");
  const [reportedBefore, setReportedBefore] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([""]);
  const [drag, setDrag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const rtl = locale === "ar";

  function validateStep(i: number) {
    const fs = formRef.current?.querySelector<HTMLFieldSetElement>(`[data-step="${i}"]`);
    if (!fs) return true;
    const els = Array.from(fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input,select,textarea"));
    for (const el of els) {
      if (!el.checkValidity()) { el.reportValidity(); el.focus(); return false; }
    }
    return true;
  }

  function go(to: number) {
    if (to > step && !validateStep(step)) return;
    setDir(to > step ? 1 : -1);
    setStep(to);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (next.length >= MAX_FILES) { toast.error(fill(t.errors.maxFiles, { max: MAX_FILES })); break; }
      if (f.size > MAX_BYTES) { toast.error(fill(t.errors.tooLarge, { name: f.name })); continue; }
      next.push(f);
    }
    setFiles(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < STEPS.length - 1) return go(step + 1);
    for (let i = 0; i < STEPS.length; i++) if (!validateStep(i)) { setStep(i); return; }
    const fd = new FormData(e.currentTarget);
    if (!fd.get("cf-turnstile-response")) { toast.error(t.errors.captcha); return; }
    setSubmitting(true);
    fd.delete("evidence");
    try {
      if (files.length) await attachEvidence(fd);
      setProgress(t.progress.sending);
      const res = await fetch("/api/reports", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || t.errors.failed);
      setDone(json.caseId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      resetCaptcha();
      toast.error(err instanceof Error ? err.message : t.errors.failed);
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  }

  /** Uploads evidence straight to private storage when the server supports it; otherwise sends it with the form. */
  async function attachEvidence(fd: FormData) {
    const res = await fetch("/api/uploads", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })) }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || t.errors.prepare);
    if (!json.direct) { files.forEach((f) => fd.append("evidence", f)); return; }
    const uploaded: { path: string; name: string; type: string }[] = [];
    for (const [i, f] of files.entries()) {
      setProgress(fill(t.progress.uploading, { i: i + 1, n: files.length }));
      const target = json.targets[i] as { path: string; url: string };
      const put = await fetch(target.url, {
        method: "PUT", body: f,
        headers: { "content-type": f.type || "application/octet-stream", "x-upsert": "false", "cache-control": "max-age=3600" },
      });
      if (!put.ok) throw new Error(fill(t.errors.upload, { name: f.name }));
      uploaded.push({ path: target.path, name: f.name, type: f.type || "application/octet-stream" });
    }
    fd.set("uploaded", JSON.stringify(uploaded));
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-xl border border-line bg-white p-8 text-center sm:p-14">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50"><CheckCircle2 className="size-8 text-emerald-600" /></div>
        <h2 className="display mt-6 text-3xl sm:text-4xl">{t.done.title}</h2>
        <p className="mt-3 text-slate-600">{t.done.text}</p>
        <div className="mx-auto mt-8 flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-dashed border-gold-500/60 bg-gold-500/[.06] p-4">
          <div className="text-start"><div className="text-[11px] uppercase tracking-widest text-slate-500">{t.done.reference}</div><div className="font-mono text-xl font-semibold tracking-wider" dir="ltr">{done}</div></div>
          <button type="button" onClick={() => { navigator.clipboard.writeText(done); toast.success(t.done.copied); }} className="btn-ghost px-3" aria-label={t.done.copied}><Copy className="size-4" /></button>
        </div>
        <ol className="mx-auto mt-10 max-w-md space-y-3 text-start text-sm text-slate-600">
          {t.done.next.map((x, i) => (
            <li key={x} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-900 text-xs text-gold-400">{i + 1}</span>{x}</li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={`/track?case=${done}`} className="btn-ink">{t.done.track}</Link>
          <Link href="/" className="btn-ghost">{t.done.home}</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Stepper */}
      <aside className="lg:col-span-4">
        <div className="sticky top-32 space-y-6">
          <ol className="hidden space-y-1 rounded-xl border border-line bg-white p-3 lg:block">
            {STEPS.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => (i < step ? go(i) : i === step + 1 ? go(i) : null)}
                  className={cn("flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-start transition", i === step ? "bg-ink-900 text-white" : "hover:bg-paper")}>
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    i < step ? "bg-gold-500 text-ink-900" : i === step ? "bg-white/10 text-white ring-1 ring-white/30" : "bg-paper-2 text-slate-500")}>
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span><span className="block text-sm font-medium">{s.title}</span><span className={cn("block text-xs", i === step ? "text-white/60" : "text-slate-500")}>{s.hint}</span></span>
                </button>
              </li>
            ))}
          </ol>
          <div className="rounded-xl bg-ink-900 p-6 text-white">
            <Lock className="size-5 text-gold-400" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">{t.sidebar}</p>
          </div>
          <PoweredBy tone="light" className="w-full" />
        </div>
      </aside>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="scroll-mt-32 lg:col-span-8">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="rounded-xl border border-line bg-white p-6 sm:p-10">
          {/* mobile progress */}
          <div className="mb-8 lg:hidden">
            <div className="flex justify-between text-xs text-slate-500"><span>{fill(t.stepOf, { n: step + 1, total: STEPS.length })}</span><span>{STEPS[step]!.title}</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-paper-2"><div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} initial={{ opacity: 0, x: (rtl ? -dir : dir) * 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: (rtl ? dir : -dir) * 24 }} transition={{ duration: 0.25 }}>
              <h2 className="text-2xl font-semibold tracking-tight">{STEPS[step]!.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{rich(t.required, { star: <span className="text-gold-600">*</span> })}</p>
            </motion.div>
          </AnimatePresence>

          {/* All steps stay mounted so every field is submitted; only the active one is shown. */}
          <div className="mt-8">
            <fieldset data-step={0} className={cn("grid gap-5 sm:grid-cols-2", step !== 0 && "hidden")}>
              <div className="rounded-2xl border border-line bg-paper-2/60 p-5 text-sm sm:col-span-2">
                <p className="font-heading font-semibold text-ink-900">{t.terms.title}</p>
                <p className="mt-1.5 leading-relaxed text-body">
                  {rich(t.terms.notEmergency, { strong: <strong className="text-ink-900">{t.terms.notEmergencyStrong}</strong> })}
                </p>
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none font-medium text-ink-900 underline-offset-4 hover:underline">
                    <span className="group-open:hidden">{t.terms.show}</span><span className="hidden group-open:inline">{t.terms.hide}</span>
                  </summary>
                  <p className="mt-3 text-body">{t.terms.agreeIntro}</p>
                  <ul className="mt-2 space-y-1.5">
                    {d.terms.sections.terms.list.map((x) => <li key={x} className="flex gap-2.5 text-body"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />{x}</li>)}
                  </ul>
                </details>
                <a href="/terms" target="_blank" rel="noreferrer" className="mt-3 inline-block font-medium text-gold-600 underline underline-offset-4">{t.terms.full}</a>
              </div>
              <div className="sm:col-span-2">
                <Choices label={t.you.anonymous} name="anonymous" required defaultValue="no" onChange={(v) => setAnonymous(v as "yes" | "no")}
                  options={[{ value: "yes", label: t.you.anonYes }, { value: "no", label: t.you.anonNo }]} />
              </div>
              {anonymous === "yes" && (
                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 sm:col-span-2">
                  <ShieldCheck className="size-5 shrink-0" /> {t.you.anonNote}
                </div>
              )}
              {anonymous === "no" && <Field label={t.you.name} name="reporterName" required autoComplete="name" />}
              <Field label={t.you.email} name="reporterEmail" type="email" required autoComplete="email" dir="ltr" hint={t.you.emailHint} className={anonymous === "yes" ? "sm:col-span-2" : ""} />
              {anonymous === "no" && <Field label={t.you.phone} name="reporterPhone" type="tel" autoComplete="tel" dir="ltr" />}
              {anonymous === "no" && <Field label={t.you.organisation} name="organization" hint={t.you.optional} />}
              <Field label={t.you.city} name="reporterCity" required={anonymous === "no"} />
              <Select label={t.you.country} name="reporterCountry" options={countries} required={anonymous === "no"} placeholder={t.select} />
              <div className="sm:col-span-2">
                <Choices label={t.you.aboutWhom} name="aboutWhom" cols={3} options={opts(Object.keys(t.you.aboutOptions), t.you.aboutOptions)} />
              </div>
            </fieldset>

            <fieldset data-step={1} className={cn("grid gap-5 sm:grid-cols-2", step !== 1 && "hidden")}>
              <Field label={t.victim.name} name="victimName" hint={t.victim.nameHint} />
              <Field label={t.victim.age} name="victimAge" hint={t.victim.ageHint} />
              <Select label={t.victim.gender} name="victimGender" options={opts(GENDERS, d.options.genders)} placeholder={t.select} />
              <Field label={t.victim.nationality} name="victimNationality" />
              <Field label={t.victim.religion} name="victimReligionEthnicity" hint={t.victim.religionHint} />
              <Field label={t.victim.contact} name="victimContact" hint={t.victim.contactHint} />
              <Select label={t.victim.relationship} name="relationship" options={opts(RELATIONSHIPS, d.options.relationships)} className="sm:col-span-2" placeholder={t.select} />
            </fieldset>

            <fieldset data-step={2} className={cn("grid gap-5 sm:grid-cols-2", step !== 2 && "hidden")}>
              <Select label={t.violation.type} name="violationType" options={opts(VIOLATION_TYPES, d.options.violationTypes)} required className="sm:col-span-2" placeholder={t.select} />
              <Field label={t.violation.date} name="incidentDate" type="date" required max={new Date().toISOString().slice(0, 10)} />
              <Field label={t.violation.time} name="incidentTime" placeholder={t.violation.timePlaceholder} hint={t.violation.timeHint} />
              <Field label={t.violation.city} name="incidentCity" required />
              <Field label={t.violation.state} name="incidentState" />
              <Field label={t.violation.postal} name="incidentPostal" />
              <Select label={t.violation.country} name="incidentCountry" options={countries} required placeholder={t.select} />
            </fieldset>

            <fieldset data-step={3} className={cn("grid gap-5 sm:grid-cols-2", step !== 3 && "hidden")}>
              <Area label={t.details.what} name="description" required rows={7} className="sm:col-span-2" placeholder={t.details.whatPlaceholder} />
              <Area label={t.details.who} name="involved" rows={3} className="sm:col-span-2" placeholder={t.details.whoPlaceholder} />
              <div className="sm:col-span-2">
                <Choices label={t.details.authorities} name="authoritiesInvolved" required cols={3} onChange={setAuthorities} options={yesNoUnknown} />
              </div>
              {authorities === "Yes" && <Field label={t.details.authoritiesDetail} name="authoritiesDetail" className="sm:col-span-2" />}
              <div className="sm:col-span-2">
                <Choices label={t.details.reportedBefore} name="reportedBefore" required cols={3} onChange={setReportedBefore} options={yesNoUnknown} />
              </div>
              {reportedBefore === "Yes" && <Field label={t.details.reportedBeforeDetail} name="reportedBeforeDetail" className="sm:col-span-2" hint={t.details.reportedBeforeHint} />}
            </fieldset>

            <fieldset data-step={4} className={cn("grid gap-6", step !== 4 && "hidden")}>
              <div>
                <span className="field-label">{t.evidence.upload}</span>
                <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                  className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
                    drag ? "border-gold-500 bg-gold-500/5" : "border-line hover:border-ink-900/30 hover:bg-paper")}>
                  <UploadCloud className="size-8 text-ink-600" />
                  <span className="mt-3 text-sm font-medium">{rich(t.evidence.drop, { choose: <span className="text-gold-600 underline underline-offset-4">{t.evidence.choose}</span> })}</span>
                  <span className="mt-1 text-xs text-slate-500">{fill(t.evidence.accepted, { max: MAX_FILES })}</span>
                  <input type="file" multiple className="sr-only" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm">
                        <FileText className="size-4 text-ink-600" /><span className="min-w-0 flex-1 truncate" dir="auto">{f.name}</span>
                        <span className="text-xs text-slate-500" dir="ltr">{formatBytes(f.size)}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600" aria-label={t.evidence.remove}><X className="size-4" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="field-label">{t.evidence.links}</span>
                <div className="space-y-2">
                  {links.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input name="links" type="url" value={l} placeholder="https://…" dir="ltr" className="input"
                        onChange={(e) => setLinks(links.map((x, j) => (j === i ? e.target.value : x)))} />
                      {links.length > 1 && <button type="button" onClick={() => setLinks(links.filter((_, j) => j !== i))} className="btn-ghost px-3"><Trash2 className="size-4" /></button>}
                    </div>
                  ))}
                </div>
                {links.length < 4 && <button type="button" onClick={() => setLinks([...links, ""])} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-600"><Plus className="size-4" /> {t.evidence.addLink}</button>}
              </div>
              <Choices label={t.evidence.witnesses} name="hasWitnesses" cols={3} onChange={setWitnesses} options={opts(["Yes", "No", "Not sure"], d.options.yesNoNotSure)} />
              {witnesses === "Yes" && (
                <div className="grid gap-5 rounded-2xl bg-paper p-5 sm:grid-cols-2">
                  <Field label={t.evidence.witnessName} name="witnessName" />
                  <Field label={t.evidence.witnessContact} name="witnessContact" hint={t.evidence.witnessContactHint} />
                  <Area label={t.evidence.witnessStatement} name="witnessStatement" rows={4} className="sm:col-span-2" />
                  <div className="sm:col-span-2">
                    <Choices label={t.evidence.witnessConfidential} name="witnessConfidential" defaultValue="yes"
                      options={[{ value: "yes", label: t.evidence.confYes }, { value: "no", label: t.evidence.confNo }]} />
                  </div>
                </div>
              )}
              <Area label={t.evidence.comments} name="comments" rows={3} />
            </fieldset>

            <fieldset data-step={5} className={cn("space-y-6", step !== 5 && "hidden")}>
              <div className="rounded-2xl bg-paper p-5 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium text-ink-900"><Paperclip className="size-4" /> {t.review.summary}</div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  <li>{t.review.reporting}: <strong>{anonymous === "yes" ? t.review.anonymously : t.review.withDetails}</strong></li>
                  <li>{t.review.files}: <strong>{files.length}</strong></li>
                  <li>{t.review.links}: <strong>{links.filter(Boolean).length}</strong></li>
                  <li>{t.review.witnesses}: <strong>{witnesses ? (d.options.yesNoNotSure as Record<string, string>)[witnesses] ?? witnesses : "—"}</strong></li>
                </ul>
              </div>
              {(["consentTrue", "consentReview", "consentConfidential"] as const).map((n, i) => (
                <label key={n} className="choice items-start">
                  <input type="checkbox" name={n} required className="mt-0.5 size-4 accent-[#e7a33e]" /> <span>{t.review.consents[i]}</span>
                </label>
              ))}
              <label className="choice items-start">
                <input type="checkbox" name="consentTerms" required className="mt-0.5 size-4 accent-[#e7a33e]" />
                <span>{rich(t.review.agreeTerms, { terms: <a href="/terms" target="_blank" rel="noreferrer" className="font-medium text-ink-900 underline underline-offset-4">{t.review.termsLink}</a> })}</span>
              </label>
              <div>
                <p className="field-label">{t.review.security} <span className="text-gold-600">*</span></p>
                {step === STEPS.length - 1 && <Captcha />}
                <p className="field-hint">{t.review.securityHint}</p>
              </div>
            </fieldset>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => go(step - 1)} className={cn("btn-ghost", step === 0 && "invisible")}><ArrowLeft className="size-4" /> {t.buttons.back}</button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(step + 1)} className="btn-ink px-6">{t.buttons.continue} <ArrowRight className="size-4" /></button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-gold px-6 py-3">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> {progress ?? t.buttons.sending}</> : <><Lock className="size-4" /> {t.buttons.submit}</>}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
