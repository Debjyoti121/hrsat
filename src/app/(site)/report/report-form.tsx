"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, FileText, Loader2, Lock, Paperclip, Plus, ShieldCheck, Trash2, UploadCloud, X,
} from "lucide-react";
import { toast } from "sonner";
import { COUNTRIES, GENDERS, RELATIONSHIPS, VIOLATION_TYPES, YES_NO_UNKNOWN } from "@/lib/constants";
import { cn, formatBytes } from "@/lib/utils";

const STEPS = [
  { title: "About you", hint: "Who is submitting" },
  { title: "Affected person", hint: "Who was harmed" },
  { title: "The violation", hint: "What, when & where" },
  { title: "Incident details", hint: "What happened" },
  { title: "Evidence", hint: "Files & witnesses" },
  { title: "Review & submit", hint: "Declarations" },
];

const MAX_FILES = 4;
const MAX_BYTES = 25 * 1024 * 1024;

function Field({ label, name, required, hint, className, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}{required && <span className="text-gold-600"> *</span>}</label>
      <input id={name} name={name} required={required} className="input" {...rest} />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

function Select({ label, name, options, required, className, placeholder = "Select…" }: { label: string; name: string; options: readonly string[]; required?: boolean; className?: string; placeholder?: string }) {
  return (
    <div className={className}>
      <label className="field-label" htmlFor={name}>{label}{required && <span className="text-gold-600"> *</span>}</label>
      <select id={name} name={name} required={required} defaultValue="" className="input">
        <option value="" disabled={required}>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
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

function Choices({ label, name, options, required, defaultValue, onChange, cols = 2 }: { label: string; name: string; options: { value: string; label: string }[]; required?: boolean; defaultValue?: string; onChange?: (v: string) => void; cols?: number }) {
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
  const [done, setDone] = useState<string | null>(null);

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
      if (next.length >= MAX_FILES) { toast.error(`You can attach up to ${MAX_FILES} files.`); break; }
      if (f.size > MAX_BYTES) { toast.error(`${f.name} is larger than 25 MB.`); continue; }
      next.push(f);
    }
    setFiles(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < STEPS.length - 1) return go(step + 1);
    for (let i = 0; i < STEPS.length; i++) if (!validateStep(i)) { setStep(i); return; }
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.delete("evidence");
    files.forEach((f) => fd.append("evidence", f));
    try {
      const res = await fetch("/api/reports", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setDone(json.caseId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl rounded-xl border border-line bg-white p-8 text-center sm:p-14">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50"><CheckCircle2 className="size-8 text-emerald-600" /></div>
        <h2 className="display mt-6 text-3xl sm:text-4xl">Your report is safe with us.</h2>
        <p className="mt-3 text-slate-600">We&apos;ve sent a confirmation to your email. Keep your case reference private — you&apos;ll need it to track the status.</p>
        <div className="mx-auto mt-8 flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-dashed border-gold-500/60 bg-gold-500/[.06] p-4">
          <div className="text-left"><div className="text-[11px] uppercase tracking-widest text-slate-500">Case reference</div><div className="font-mono text-xl font-semibold tracking-wider">{done}</div></div>
          <button type="button" onClick={() => { navigator.clipboard.writeText(done); toast.success("Copied"); }} className="btn-ghost px-3"><Copy className="size-4" /></button>
        </div>
        <ol className="mx-auto mt-10 max-w-md space-y-3 text-left text-sm text-slate-600">
          {["Secure intake — your report is stored with restricted access.", "Confidential review — a reviewer is assigned to your case.", "Follow-up if needed — only with your consent."].map((t, i) => (
            <li key={t} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink-900 text-xs text-gold-400">{i + 1}</span>{t}</li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={`/track?case=${done}`} className="btn-ink">Track this report</Link>
          <Link href="/" className="btn-ghost">Back to home</Link>
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
              <li key={s.title}>
                <button type="button" onClick={() => (i < step ? go(i) : i === step + 1 ? go(i) : null)}
                  className={cn("flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition", i === step ? "bg-ink-900 text-white" : "hover:bg-paper")}>
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
            <p className="mt-4 text-sm leading-relaxed text-white/70">Your submission is encrypted in transit. Evidence files are fingerprinted (SHA-256) and only accessible to the reviewer assigned to your case.</p>
          </div>
        </div>
      </aside>

      <form ref={formRef} onSubmit={onSubmit} noValidate className="scroll-mt-32 lg:col-span-8">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="rounded-xl border border-line bg-white p-6 sm:p-10">
          {/* mobile progress */}
          <div className="mb-8 lg:hidden">
            <div className="flex justify-between text-xs text-slate-500"><span>Step {step + 1} of {STEPS.length}</span><span>{STEPS[step]!.title}</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-paper-2"><div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={step} custom={dir} initial={{ opacity: 0, x: dir * 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -24 }} transition={{ duration: 0.25 }}>
              <h2 className="text-2xl font-semibold tracking-tight">{STEPS[step]!.title}</h2>
              <p className="mt-1 text-sm text-slate-500">Fields marked <span className="text-gold-600">*</span> are required. Share only what you feel safe sharing.</p>
            </motion.div>
          </AnimatePresence>

          {/* All steps stay mounted so every field is submitted; only the active one is shown. */}
          <div className="mt-8">
            <fieldset data-step={0} className={cn("grid gap-5 sm:grid-cols-2", step !== 0 && "hidden")}>
              <div className="sm:col-span-2">
                <Choices label="Are you reporting anonymously?" name="anonymous" required defaultValue="no" onChange={(v) => setAnonymous(v as "yes" | "no")}
                  options={[{ value: "yes", label: "Yes, I want to remain anonymous" }, { value: "no", label: "No, I want to provide my details" }]} />
              </div>
              {anonymous === "yes" && (
                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 sm:col-span-2">
                  <ShieldCheck className="size-5 shrink-0" /> Your name, phone and organisation won&apos;t be collected. We only need an email to send your case reference — consider using one others can&apos;t access.
                </div>
              )}
              {anonymous === "no" && <Field label="Full name" name="reporterName" required autoComplete="name" />}
              <Field label="Email address" name="reporterEmail" type="email" required autoComplete="email" hint="Used only to send your case reference and updates." className={anonymous === "yes" ? "sm:col-span-2" : ""} />
              {anonymous === "no" && <Field label="Phone number" name="reporterPhone" type="tel" autoComplete="tel" />}
              {anonymous === "no" && <Field label="Organisation" name="organization" hint="Optional" />}
              <Field label="City" name="reporterCity" required={anonymous === "no"} />
              <Select label="Country" name="reporterCountry" options={COUNTRIES} required={anonymous === "no"} />
              <div className="sm:col-span-2">
                <Choices label="Is this report about yourself or someone else?" name="aboutWhom" cols={3}
                  options={[{ value: "Myself", label: "Myself" }, { value: "Another person", label: "Another person" }, { value: "A group / community", label: "A group or community" }]} />
              </div>
            </fieldset>

            <fieldset data-step={1} className={cn("grid gap-5 sm:grid-cols-2", step !== 1 && "hidden")}>
              <Field label="Name of affected person" name="victimName" hint="Leave blank if sharing it could put them at risk." />
              <Field label="Age" name="victimAge" hint="Approximate is fine." />
              <Select label="Gender" name="victimGender" options={GENDERS} />
              <Field label="Nationality" name="victimNationality" />
              <Field label="Religion / ethnicity" name="victimReligionEthnicity" hint="If relevant to the violation." />
              <Field label="Contact details" name="victimContact" hint="Email or phone, if they consent." />
              <Select label="Your relationship with the affected person" name="relationship" options={RELATIONSHIPS} className="sm:col-span-2" />
            </fieldset>

            <fieldset data-step={2} className={cn("grid gap-5 sm:grid-cols-2", step !== 2 && "hidden")}>
              <Select label="Type of human rights violation" name="violationType" options={VIOLATION_TYPES} required className="sm:col-span-2" />
              <Field label="Date of incident" name="incidentDate" type="date" required max={new Date().toISOString().slice(0, 10)} />
              <Field label="Time of incident" name="incidentTime" placeholder="e.g. 14:30 or ‘evening’" hint="Exact or approximate." />
              <Field label="City" name="incidentCity" required />
              <Field label="State / province" name="incidentState" />
              <Field label="ZIP / postal code" name="incidentPostal" />
              <Select label="Country" name="incidentCountry" options={COUNTRIES} required />
            </fieldset>

            <fieldset data-step={3} className={cn("grid gap-5 sm:grid-cols-2", step !== 3 && "hidden")}>
              <Area label="What happened?" name="description" required rows={7} className="sm:col-span-2"
                placeholder="Describe the events in as much detail as you're comfortable with: what happened, the sequence of events, and the impact." />
              <Area label="Who was involved?" name="involved" rows={3} className="sm:col-span-2" placeholder="Perpetrators, groups, institutions — if known." />
              <div className="sm:col-span-2">
                <Choices label="Were authorities involved?" name="authoritiesInvolved" required cols={3} onChange={setAuthorities} options={YES_NO_UNKNOWN.map((v) => ({ value: v, label: v }))} />
              </div>
              {authorities === "Yes" && <Field label="Government / police involvement" name="authoritiesDetail" className="sm:col-span-2" />}
              <div className="sm:col-span-2">
                <Choices label="Was it reported before?" name="reportedBefore" required cols={3} onChange={setReportedBefore} options={YES_NO_UNKNOWN.map((v) => ({ value: v, label: v }))} />
              </div>
              {reportedBefore === "Yes" && <Field label="Previous reports or complaints" name="reportedBeforeDetail" className="sm:col-span-2" hint="Where and when it was reported." />}
            </fieldset>

            <fieldset data-step={4} className={cn("grid gap-6", step !== 4 && "hidden")}>
              <div>
                <span className="field-label">Upload evidence</span>
                <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                  onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                  className={cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
                    drag ? "border-gold-500 bg-gold-500/5" : "border-line hover:border-ink-900/30 hover:bg-paper")}>
                  <UploadCloud className="size-8 text-ink-600" />
                  <span className="mt-3 text-sm font-medium">Drag & drop or <span className="text-gold-600 underline underline-offset-4">choose files</span></span>
                  <span className="mt-1 text-xs text-slate-500">Photos, videos, audio, PDF or documents · up to {MAX_FILES} files · 25 MB each</span>
                  <input type="file" multiple className="sr-only" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm">
                        <FileText className="size-4 text-ink-600" /><span className="min-w-0 flex-1 truncate">{f.name}</span>
                        <span className="text-xs text-slate-500">{formatBytes(f.size)}</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-600" aria-label="Remove file"><X className="size-4" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <span className="field-label">Related links</span>
                <div className="space-y-2">
                  {links.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <input name="links" type="url" value={l} placeholder="https://news-article…" className="input"
                        onChange={(e) => setLinks(links.map((x, j) => (j === i ? e.target.value : x)))} />
                      {links.length > 1 && <button type="button" onClick={() => setLinks(links.filter((_, j) => j !== i))} className="btn-ghost px-3"><Trash2 className="size-4" /></button>}
                    </div>
                  ))}
                </div>
                {links.length < 4 && <button type="button" onClick={() => setLinks([...links, ""])} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-gold-600"><Plus className="size-4" /> Add link</button>}
              </div>
              <Choices label="Are there any witnesses to this incident?" name="hasWitnesses" cols={3} onChange={setWitnesses}
                options={["Yes", "No", "Not sure"].map((v) => ({ value: v, label: v }))} />
              {witnesses === "Yes" && (
                <div className="grid gap-5 rounded-2xl bg-paper p-5 sm:grid-cols-2">
                  <Field label="Witness name" name="witnessName" />
                  <Field label="Witness contact details" name="witnessContact" hint="Email or phone." />
                  <Area label="Witness statement" name="witnessStatement" rows={4} className="sm:col-span-2" />
                  <div className="sm:col-span-2">
                    <Choices label="Keep witness identity confidential?" name="witnessConfidential" defaultValue="yes"
                      options={[{ value: "yes", label: "Yes, keep it confidential" }, { value: "no", label: "No, it can be shared with the review team" }]} />
                  </div>
                </div>
              )}
              <Area label="Additional comments" name="comments" rows={3} />
            </fieldset>

            <fieldset data-step={5} className={cn("space-y-6", step !== 5 && "hidden")}>
              <div className="rounded-2xl bg-paper p-5 text-sm text-slate-700">
                <div className="flex items-center gap-2 font-medium text-ink-900"><Paperclip className="size-4" /> Summary</div>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  <li>Reporting: <strong>{anonymous === "yes" ? "Anonymously" : "With my details"}</strong></li>
                  <li>Evidence files: <strong>{files.length}</strong></li>
                  <li>Links: <strong>{links.filter(Boolean).length}</strong></li>
                  <li>Witnesses: <strong>{witnesses || "—"}</strong></li>
                </ul>
              </div>
              {[
                ["consentTrue", "I confirm the information provided is true to the best of my knowledge."],
                ["consentReview", "I understand that HRSAT / GHRD will review this report."],
                ["consentConfidential", "I understand the information will be handled confidentially."],
              ].map(([n, t]) => (
                <label key={n} className="choice items-start">
                  <input type="checkbox" name={n} required className="mt-0.5 size-4 accent-[#e7a33e]" /> <span>{t}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
            <button type="button" onClick={() => go(step - 1)} className={cn("btn-ghost", step === 0 && "invisible")}><ArrowLeft className="size-4" /> Back</button>
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => go(step + 1)} className="btn-ink px-6">Continue <ArrowRight className="size-4" /></button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-gold px-6 py-3">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> Encrypting & sending…</> : <><Lock className="size-4" /> Submit report</>}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
