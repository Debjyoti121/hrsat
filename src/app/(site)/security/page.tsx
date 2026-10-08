import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowUpRight, Fingerprint, KeyRound, Link2, Lock, ShieldAlert, UserCheck, Users, FileLock2 } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { img } from "@/lib/images";

export const metadata: Metadata = { title: "Security & Privacy" };

const protections = [
  { icon: Lock, title: "Encrypted transmission", text: "All traffic is encrypted in transit with TLS. Evidence is stored outside the public web root." },
  { icon: Users, title: "Role-based access", text: "Only administrators and the reviewer assigned to a case can open it." },
  { icon: Activity, title: "Full audit trail", text: "Every status change, assignment and note is recorded in a case timeline." },
  { icon: ShieldAlert, title: "Threat protection", text: "Signed sessions, file-type and size checks, and safe handling of untrusted uploads." },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero eyebrow="Security & privacy" title="Your security. Your privacy." accent="Your voice. Protected."
        intro="Reporting human rights violations often involves sensitive information that may put victims, witnesses and defenders at risk. Security is the foundation of HRSAT — not a feature."
        image={img("conference")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Data ownership" title="Your data" accent="remains yours" />
            <div className="mt-10 space-y-4">
              {[
                ["Absolute ownership", "We do not claim ownership of the data you upload. You retain control over what you share."],
                ["Minimal by design", "Anonymous reporting is always available, and only an email is needed to receive your case reference."],
                ["Strict policy compliance", "We follow GDPR and international human rights frameworks on data minimisation and consent."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.05}>
                  <div className="flex gap-5 rounded-xl border border-line bg-white p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-900 font-mono text-sm text-gold-400">{i + 1}</span>
                    <div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl">
              <Image src={img("office")} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
        <div className="container-x relative">
          <SectionHeading dark align="center" eyebrow="Integrity" title="Evidence that" accent="can't be silently altered"
            intro="Every uploaded file is fingerprinted with a SHA-256 hash the moment it arrives. Any later change to the file would produce a different fingerprint — creating a verifiable trail of evidence, ready to be anchored to a blockchain ledger." />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[[Fingerprint, "Data integrity", "Cryptographic hashing ensures that once a record is submitted, it cannot be silently altered."],
              [Link2, "Secure records", "A ledger-style audit trail gives a verifiable history for human rights documentation."],
              [FileLock2, "Protected storage", "Evidence files are never publicly reachable — they're served only to authorised reviewers."]].map(([I, t, d], i) => {
              const Icon = I as typeof Lock;
              return (
                <Reveal key={t as string} delay={i * 0.06}>
                  <div className="h-full rounded-xl border border-white/10 bg-white/[.04] p-7">
                    <Icon className="size-7 text-gold-400" />
                    <h3 className="mt-8 text-lg font-semibold">{t as string}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{d as string}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Authentication" title="Only the right people" accent="see a case"
              intro="Access to the HRSAT review dashboard requires verified accounts. Sessions are cryptographically signed and expire automatically." />
            <ul className="mt-8 space-y-3">
              {[[KeyRound, "Signed, expiring sessions"], [UserCheck, "Per-case reviewer assignment"], [Activity, "Activity logging on every case"]].map(([I, t]) => {
                const Icon = I as typeof Lock;
                return <li key={t as string} className="flex items-center gap-3 font-medium"><span className="grid size-9 place-items-center rounded-xl bg-gold-500/15 text-gold-600"><Icon className="size-4" /></span>{t as string}</li>;
              })}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {protections.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-xl border border-line bg-white p-7">
                  <p.icon className="size-6 text-ink-700" />
                  <h3 className="mt-8 font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/[.07] p-8 sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight">Staying safe while you report</h2>
            <ul className="mt-6 grid gap-3 text-[15px] text-slate-700 sm:grid-cols-2">
              <li>• Use a private browsing window and a device you trust.</li>
              <li>• Press <kbd className="rounded border border-line bg-white px-1.5 text-xs">Esc</kbd> twice — or use “Quick exit” — to leave instantly.</li>
              <li>• Use an email address that others cannot access.</li>
              <li>• Remove names of at-risk people if sharing them could endanger them.</li>
            </ul>
            <Link href="/report" className="btn-ink mt-8">Start a secure report <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
