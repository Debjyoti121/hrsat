import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, AudioLines, Baby, BadgeCheck, Building2, Camera, Check, Cpu, Eye, EyeOff, FileText,
  Fingerprint, Globe2, Hash, HeartHandshake, Landmark, Languages, Leaf, Link2, Lock, Megaphone, MessageSquareQuote,
  Newspaper, ScanEye, Scale, ShieldCheck, Smartphone, Upload, UserRound, Users, Video, Venus,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/page-hero";
import { img } from "@/lib/images";

const features = [
  { icon: EyeOff, title: "Anonymous reporting", text: "Submit reports securely without revealing your identity." },
  { icon: Upload, title: "Secure evidence upload", text: "Photos, videos, documents, audio files and witness statements — fingerprinted on arrival." },
  { icon: ScanEye, title: "Confidential review", text: "Reports are reviewed through a restricted process by authorised documentation teams." },
  { icon: Lock, title: "Privacy-conscious handling", text: "Sensitive information is handled with care, consent and controlled access." },
  { icon: Smartphone, title: "Mobile friendly", text: "Report from any device with a simple, guided submission experience." },
  { icon: Languages, title: "Multilingual support", text: "Designed for accessible reporting across regions and communities." },
];

const steps = [
  { n: "01", title: "Submit an incident", text: "Share what happened through a guided form designed for clarity and safety." },
  { n: "02", title: "Upload evidence", text: "Attach photos, videos, documents, audio or witness statements securely." },
  { n: "03", title: "Confidential review", text: "An assigned reviewer examines your submission with care and discretion." },
  { n: "04", title: "Documentation & action", text: "Verified reports support advocacy, response coordination and accountability." },
];

const areas = [
  { icon: Scale, tag: "Equality & Dignity", title: "Minority Rights", text: "The rights of ethnic, racial, linguistic, religious and other minorities to live with dignity and full participation in society." },
  { icon: Landmark, tag: "Freedom of Belief", title: "Freedom of Religion or Belief", text: "The right to freedom of thought, conscience and religion — and to practise it, alone or in community." },
  { icon: Venus, tag: "Gender Equality", title: "Women's Rights", text: "Women and girls living free from discrimination and violence, with equal opportunity in every part of life." },
  { icon: Baby, tag: "Child Protection", title: "Children's Rights", text: "Every child's right to survival, protection, education, health and development — and to be heard." },
  { icon: Link2, tag: "Exploitation & Slavery", title: "Trafficking & Modern Slavery", text: "Preventing trafficking in persons, eradicating modern slavery and supporting survivors." },
  { icon: Megaphone, tag: "Peace & Governance", title: "Democracy, Rule of Law & Expression", text: "Democratic governance, conflict prevention and the protection of civilians in crises." },
  { icon: Leaf, tag: "Planet & People", title: "Climate, Environment & Rights", text: "A clean, healthy and sustainable environment recognised as a human right." },
  { icon: Cpu, tag: "Digital Freedoms", title: "Digital Rights, AI & Privacy", text: "Privacy, data protection and rights-respecting use of AI and digital technologies." },
];

const audiences = [
  { icon: UserRound, title: "Victims", text: "Individuals directly affected by human rights violations or abuse." },
  { icon: HeartHandshake, title: "Family members", text: "Relatives reporting abuse, disappearance, detention or threats to loved ones." },
  { icon: Eye, title: "Witnesses", text: "People who have seen, heard or documented incidents and violations." },
  { icon: Building2, title: "NGOs & civil society", text: "Organisations monitoring, documenting and responding to human rights concerns." },
  { icon: ShieldCheck, title: "Human rights defenders", text: "Activists and advocates protecting vulnerable communities." },
  { icon: Newspaper, title: "Journalists & researchers", text: "Media and investigators documenting conflict, violations or abuse." },
];

const evidence = [
  { icon: Camera, label: "Photos" }, { icon: Video, label: "Videos" }, { icon: FileText, label: "Documents" },
  { icon: AudioLines, label: "Audio recordings" }, { icon: MessageSquareQuote, label: "Witness statements" },
  { icon: Link2, label: "News links" }, { icon: Fingerprint, label: "SHA-256 fingerprinting" }, { icon: Globe2, label: "Global coverage" },
];

export default function Home() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="noise relative overflow-hidden bg-ink-900 text-white">
        <Image src={img("conference")} alt="" fill priority sizes="100vw" className="object-cover opacity-[.18]" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/80 to-ink-900" />
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <div className="absolute -top-32 right-[-10%] h-[620px] w-[620px] rounded-full bg-gold-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-[-15%] h-[420px] w-[620px] rounded-full bg-ink-600/50 blur-[120px]" />

        <div className="container-x relative grid items-center gap-16 pt-44 pb-24 sm:pt-52 lg:grid-cols-12 lg:pb-32">
          <div className="lg:col-span-7">
            <Reveal>
              <Link href="/security" className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 text-xs text-white/80 backdrop-blur transition hover:border-gold-500/40">
                <span className="rounded-full bg-gold-500 px-2 py-0.5 font-semibold text-ink-900">New</span>
                Every evidence file is fingerprinted on arrival
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display mt-7 text-[44px] leading-[0.98] sm:text-7xl lg:text-[84px]">
                Report human rights violations <span className="serif-accent text-gold-400">safely, securely</span> and with dignity.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
                HRSAT — Human Rights Satellite — helps victims, witnesses, journalists and defenders document violations
                worldwide and bring them to accountability, without putting themselves at risk.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/report" className="btn-gold px-6 py-3 text-[15px]">Submit a secure report <ArrowUpRight className="size-4" /></Link>
                <Link href="#how-it-works" className="btn-ghost-light px-6 py-3 text-[15px]">How it works</Link>
              </div>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                {["Anonymous option", "Encrypted evidence upload", "Confidential review"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="size-4 text-gold-500" />{t}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Product visual */}
          <Reveal delay={0.3} className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-gold-500/30 to-transparent blur-2xl" />
              <div className="relative rounded-[28px] border border-white/15 bg-white/[.06] p-2 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[22px] bg-ink-950/80 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium"><Lock className="size-4 text-gold-400" /> Secure report</div>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-300">Encrypted</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[["About you", "Anonymous", true], ["Type of violation", "Arbitrary detention", true], ["Evidence", "3 files · fingerprinted", true], ["Review", "Assigned to reviewer", false]].map(([k, v, done], i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3.5">
                        <div className={`grid size-8 place-items-center rounded-full ${done ? "bg-gold-500 text-ink-900" : "border border-dashed border-white/30 text-white/60"}`}>
                          {done ? <Check className="size-4" /> : <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-gold-400" /><span className="relative size-2 rounded-full bg-gold-400" /></span>}
                        </div>
                        <div className="min-w-0 flex-1"><div className="text-[11px] uppercase tracking-wider text-white/40">{k as string}</div><div className="truncate text-sm text-white/90">{v as string}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/[.04] px-4 py-3 font-mono text-[11px] text-white/50">
                    <span className="flex items-center gap-1.5"><Hash className="size-3.5" /> sha256</span><span>9f2c…e41a</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/15 bg-ink-800/90 p-3 pr-4 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/15"><BadgeCheck className="size-5 text-emerald-300" /></div>
                <div className="text-xs"><div className="font-medium">Case HRS-2026-K7Q2</div><div className="text-white/50">Received · reviewer notified</div></div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Evidence marquee */}
        <div className="relative border-t border-white/10 py-6 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-10">
            {[...evidence, ...evidence].map((e, i) => (
              <span key={i} className="flex items-center gap-2.5 text-sm whitespace-nowrap text-white/50"><e.icon className="size-4 text-gold-500/80" />{e.label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FEATURES (bento) ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Built for safety" title="Built for safe and" accent="confidential reporting"
            intro="Reporting a violation can put people at risk. Every part of HRSAT is designed to protect the person speaking up." />
          <div className="mt-14 grid gap-4 md:grid-cols-6">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05} className={["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4", "md:col-span-3", "md:col-span-3"][i]}>
                <div className={`group relative h-full overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${i === 0 ? "border-ink-900 bg-ink-900 text-white" : "border-line bg-white hover:shadow-[0_20px_50px_-20px_rgba(11,22,48,.25)]"}`}>
                  {i === 0 && <div className="grid-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />}
                  <div className={`relative grid size-12 place-items-center rounded-2xl ${i === 0 ? "bg-gold-500 text-ink-900" : "bg-paper-2 text-ink-900 group-hover:bg-gold-500"} transition`}>
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="relative mt-10 text-xl font-semibold tracking-tight">{f.title}</h3>
                  <p className={`relative mt-2 max-w-md text-[15px] leading-relaxed ${i === 0 ? "text-white/65" : "text-slate-600"}`}>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── GHRD ───────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-paper-2 sm:aspect-[5/5]">
                <Image src={img("team")} alt="HRSAT and GHRD team" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="absolute -right-4 bottom-8 rounded-2xl border border-line bg-white p-5 shadow-xl sm:-right-8">
                <div className="text-4xl font-semibold tracking-tight">20<span className="text-gold-600">+</span></div>
                <div className="mt-1 text-sm text-slate-500">years of international<br />human rights advocacy</div>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Powered by GHRD" title="Backed by" accent="Global Human Rights Defence"
              intro="HRSAT builds on more than two decades of international advocacy, research, legal interventions and engagement with the United Nations, European institutions and civil society worldwide." />
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Together we work to ensure every voice is heard, every violation documented, and every victim has a pathway toward justice.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[["UN ECOSOC", "accredited"], ["The Hague", "headquartered"], ["Global", "reporting reach"]].map(([a, b]) => (
                  <div key={a} className="rounded-2xl border border-line bg-white p-4"><div className="font-semibold">{a}</div><div className="text-xs text-slate-500">{b}</div></div>
                ))}
              </div>
              <Link href="/about" className="btn-ink mt-8">Learn more about HRSAT <ArrowRight className="size-4" /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="scroll-mt-28 border-y border-line bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="How it works" title="Four steps from" accent="testimony to accountability" />
          <div className="relative mt-16 grid gap-6 md:grid-cols-4">
            <div className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent md:block" />
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative text-center">
                  <div className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-line bg-paper font-mono text-sm font-semibold shadow-sm">
                    {s.n}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[240px] text-[15px] leading-relaxed text-slate-600">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center"><Link href="/report" className="btn-gold px-6 py-3">Start your report <ArrowUpRight className="size-4" /></Link></Reveal>
        </div>
      </section>

      {/* ───────────── AREAS ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="What we document" title="Human rights violations" accent="we help document"
              intro="Accessible technology that documents evidence, tracks incidents and connects affected people with advocacy and legal support networks." />
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.05} className="h-full">
                <div className="group flex h-full flex-col bg-paper p-7 transition hover:bg-white">
                  <div className="flex items-center justify-between">
                    <a.icon className="size-6 text-ink-700 transition group-hover:text-gold-600" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">{a.tag}</span>
                  </div>
                  <h3 className="mt-10 text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SECURITY ───────────── */}
      <section className="noise relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
        <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]" />
        <div className="absolute -left-40 top-20 h-[400px] w-[500px] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="container-x relative grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading dark eyebrow="Security & privacy" title="Your data" accent="remains yours."
              intro="Reporting often involves sensitive information that can place victims, witnesses and defenders at risk. We protect it accordingly." />
            <div className="mt-10 space-y-3">
              {[
                ["Absolute ownership", "We never claim ownership of the data you upload. You stay in control."],
                ["Restricted access", "Only the reviewer assigned to a case — and administrators — can open it."],
                ["Strict policy compliance", "GDPR-aligned data minimisation and consent, following international human rights frameworks."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5">
                    <span className="font-mono text-sm text-gold-400">0{i + 1}</span>
                    <div><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-white/60">{d}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Link href="/security" className="btn-ghost-light mt-8">Read our security approach <ArrowRight className="size-4" /></Link>
          </div>
          <Reveal delay={0.1}>
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="relative col-span-2 min-h-[260px] overflow-hidden rounded-3xl">
                <Image src={img("office")} alt="HRSAT team at work" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-gold-500 text-ink-900"><Link2 className="size-5" /></div>
                  <div><div className="font-semibold">Tamper-evident records</div><div className="text-sm text-white/60">Fingerprints make any change to evidence detectable.</div></div>
                </div>
              </div>
              {[[Fingerprint, "Data integrity", "Cryptographic hashing of every file on arrival."], [Lock, "Encrypted transport", "TLS in transit, protected storage at rest."]].map(([Icon, t, d]) => {
                const I = Icon as typeof Lock;
                return (
                  <div key={t as string} className="rounded-3xl border border-white/10 bg-white/[.04] p-6">
                    <I className="size-6 text-gold-400" />
                    <h3 className="mt-6 font-semibold">{t as string}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{d as string}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── AUDIENCES ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Who it's for" title="Who can use" accent="HRSAT?" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.06}>
                <div className="group flex h-full gap-5 rounded-3xl border border-line bg-white p-6 transition hover:border-gold-500/50 hover:shadow-[0_20px_50px_-24px_rgba(11,22,48,.3)]">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink-900 text-gold-400 transition group-hover:scale-105"><a.icon className="size-5" /></div>
                  <div><h3 className="font-semibold">{a.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{a.text}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal>
            <div className="noise relative overflow-hidden rounded-[36px] bg-ink-900 px-8 py-16 text-white sm:px-16 sm:py-20">
              <Image src={img("ghrdEvent")} alt="" fill sizes="100vw" className="object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/90 to-ink-900/40" />
              <div className="relative max-w-2xl">
                <Users className="size-8 text-gold-400" />
                <h2 className="display mt-6 text-4xl leading-[1.05] sm:text-5xl">Document what happened. <span className="serif-accent text-gold-400">Preserve what matters.</span></h2>
                <p className="mt-5 text-lg text-white/70">Violations are often hidden by fear, silence and lack of safe reporting access. Your report can change that — and you can stay anonymous.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/report" className="btn-gold px-6 py-3">Submit a secure report <ArrowUpRight className="size-4" /></Link>
                  <Link href="/contact" className="btn-ghost-light px-6 py-3">Talk to our team</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
