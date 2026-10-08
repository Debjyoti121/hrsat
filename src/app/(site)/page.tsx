import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Baby, Building2, Check, Cpu, Eye, EyeOff, FileCheck2, Fingerprint, HeartHandshake, Landmark,
  Languages, Leaf, Link2, Lock, LogOut, Megaphone, Newspaper, ScanEye, Scale, Send, ShieldCheck, Smartphone, Upload,
  UserRound, Venus,
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
  { icon: Send, title: "Submit an incident", text: "Share what happened through a guided form designed for clarity and safety." },
  { icon: Upload, title: "Upload evidence", text: "Attach photos, videos, documents, audio or witness statements securely." },
  { icon: ScanEye, title: "Confidential review", text: "An assigned reviewer examines your submission with care and discretion." },
  { icon: FileCheck2, title: "Documentation & action", text: "Verified reports support advocacy, response coordination and accountability." },
];

const areas = [
  { icon: Scale, title: "Minority Rights", text: "The rights of ethnic, racial, linguistic, religious and other minorities to live with dignity and full participation in society." },
  { icon: Landmark, title: "Freedom of Religion or Belief (FoRB)", text: "The right to freedom of thought, conscience and religion — and to practise it, alone or in community." },
  { icon: Venus, title: "Women's Rights", text: "Women and girls living free from discrimination and violence, with equal opportunity in every part of life." },
  { icon: Baby, title: "Children's Rights", text: "Every child's right to survival, protection, education, health and development — and to be heard." },
  { icon: Link2, title: "Trafficking & Modern Slavery", text: "Preventing trafficking in persons, eradicating modern slavery and supporting survivors." },
  { icon: Megaphone, title: "Democracy, Rule of Law & Expression", text: "Democratic governance, conflict prevention and the protection of civilians in crises." },
  { icon: Leaf, title: "Climate, Environment & Rights", text: "A clean, healthy and sustainable environment recognised as a human right." },
  { icon: Cpu, title: "Digital Rights, AI & Privacy", text: "Privacy, data protection and rights-respecting use of AI and digital technologies." },
];

const audiences = [
  { icon: UserRound, title: "Victims", text: "Individuals directly affected by human rights violations or abuse." },
  { icon: HeartHandshake, title: "Family members", text: "Relatives reporting abuse, disappearance, detention or threats to loved ones." },
  { icon: Eye, title: "Witnesses", text: "People who have seen, heard or documented incidents and violations." },
  { icon: Building2, title: "NGOs & civil society", text: "Organisations monitoring, documenting and responding to human rights concerns." },
  { icon: ShieldCheck, title: "Human rights defenders", text: "Activists and advocates protecting vulnerable communities." },
  { icon: Newspaper, title: "Journalists & researchers", text: "Media and investigators documenting conflict, violations or abuse." },
];

const security = [
  ["Absolute ownership", "We never claim ownership of the data you upload. You stay in control."],
  ["Restricted access", "Only the reviewer assigned to a case — and administrators — can open it."],
  ["Strict policy compliance", "GDPR-aligned data minimisation and consent, following international human rights frameworks."],
];

export default function Home() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate flex min-h-[760px] flex-col overflow-hidden bg-ink-900 text-white lg:min-h-[min(100svh,880px)]">
        <Image src={img("heroBuilding")} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[70%_center]" />
        {/* navy behind the copy, photo left visible on the right */}
        <div className="absolute inset-0 -z-10 bg-ink-900/85 lg:bg-transparent lg:bg-[linear-gradient(90deg,#161d3d_0%,rgba(33,43,84,.94)_38%,rgba(33,43,84,.55)_68%,rgba(33,43,84,.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink-950/90 to-transparent" />

        <div className="container-x flex flex-1 items-center pt-40 pb-16 sm:pt-44">
          <div className="max-w-2xl">
            <Reveal>
              <p className="flex items-center gap-3 text-sm font-semibold text-gold-500">
                <span className="h-px w-8 bg-gold-500" /> Human Rights Satellite
              </p>
              <h1 className="display mt-5 text-[40px] leading-[1.06] sm:text-[56px] lg:text-[64px]">
                Report human rights violations safely and with dignity.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
                A secure way for victims, witnesses and defenders to document abuse — anonymously if you choose.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/report" className="btn-gold px-7 py-4 text-base">Submit a secure report <ArrowRight className="size-4" /></Link>
                <Link href="/track" className="btn bg-white px-7 py-4 text-base text-ink-900 hover:bg-paper-2">Track a report</Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* trust strip */}
        <div className="relative border-t border-white/15">
          <div className="container-x grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15">
            {([
              [EyeOff, "Anonymous reporting", "No name or account needed"],
              [Lock, "Encrypted evidence", "Files fingerprinted on arrival"],
              [ScanEye, "Confidential review", "Only assigned reviewers"],
            ] as const).map(([I, t, d]) => (
              <div key={t} className="flex items-start gap-3.5 lg:px-8 lg:first:pl-0">
                <I className="mt-0.5 size-5 shrink-0 text-gold-500" />
                <div><div className="font-heading font-semibold">{t}</div><div className="text-sm text-white/65">{d}</div></div>
              </div>
            ))}
            <div className="flex items-center gap-3.5 lg:px-8">
              <Image src={img("ghrdLogo")} alt="" width={48} height={84} className="h-14 w-auto" />
              <div><div className="text-xs text-white/60">Powered by</div><div className="font-heading font-semibold">Global Human Rights Defence</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <SectionHeading title="Built for safe and confidential reporting"
                intro="Reporting a violation can put people at risk. Every part of HRSAT is designed to protect the person speaking up." />
              <Reveal delay={0.1}>
                <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[5/6]">
                  <Image src={img("aboutIntro")} alt="A woman holding up a protest sign at a demonstration" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-top" />
                </div>
              </Reveal>
            </div>
          </div>
          <div className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:pt-2">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.06}>
                <div className="h-full border-t border-line py-9">
                  <div className="grid size-12 place-items-center rounded-xl bg-paper-2 text-ink-900"><f.icon className="size-[22px]" strokeWidth={1.75} /></div>
                  <h3 className="mt-6 text-xl font-bold text-ink-900">{f.title}</h3>
                  <p className="mt-2.5 text-base leading-relaxed text-body">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── GHRD ───────────── */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(33,43,84,.25)] lg:grid-cols-2">
              <div className="relative min-h-[320px] lg:min-h-full">
                <Image src={img("team")} alt="GHRD representative speaking at the European Parliament" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-8 sm:p-12 lg:p-14">
                <div className="flex items-center gap-4">
                  <Image src={img("ghrdLogo")} alt="Global Human Rights Defence" width={48} height={86} className="h-[72px] w-auto" />
                  <div className="text-sm font-semibold text-gold-600">Powered by<br /><span className="text-ink-900">Global Human Rights Defence</span></div>
                </div>
                <h2 className="display mt-8 text-[32px] leading-[1.12] text-ink-900 sm:text-[40px]">Two decades of human rights advocacy behind every report</h2>
                <p className="mt-5 text-lg leading-relaxed text-body">
                  HRSAT builds on GHRD&apos;s international advocacy, research and legal interventions, and its engagement with the
                  United Nations, European institutions and civil society worldwide.
                </p>
                <blockquote className="mt-8 border-l-[3px] border-gold-500 pl-5 font-heading text-lg leading-snug font-semibold text-ink-900">
                  “Together we work to ensure every voice is heard, every violation documented, and every victim has a pathway toward justice.”
                </blockquote>
                <dl className="mt-10 grid grid-cols-3 divide-x divide-line border-y border-line">
                  {[["20+", "years of advocacy"], ["UN", "ECOSOC accredited"], ["The Hague", "headquarters"]].map(([a, b]) => (
                    <div key={a} className="px-4 py-5 first:pl-0">
                      <dt className="font-heading text-xl font-bold whitespace-nowrap text-ink-900 sm:text-2xl">{a}</dt>
                      <dd className="mt-1 text-sm text-body">{b}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/about" className="btn-ink mt-10 px-6 py-3.5">About HRSAT &amp; GHRD <ArrowRight className="size-4" /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="split" title="How reporting works"
            intro="Four steps from your first submission to documentation that can support advocacy and accountability." />
          <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8">
            <span aria-hidden className="absolute top-7 right-0 left-7 hidden h-px bg-gradient-to-r from-ink-900/25 via-ink-900/15 to-transparent md:block" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <Reveal delay={i * 0.07}>
                  <div className="flex items-center gap-3">
                    <div className="grid size-14 place-items-center rounded-full bg-ink-900 text-gold-500 ring-8 ring-white"><s.icon className="size-6" strokeWidth={1.75} /></div>
                    <span className="font-heading text-sm font-bold text-gold-600">Step {i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-body">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <div className="mt-16 grid gap-8 rounded-2xl bg-ink-900 p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="font-heading text-xl font-bold">What happens after you submit</h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 text-[15px] text-white/80 sm:grid-cols-3">
                  {["You receive a private case reference", "Track the status any time online", "We contact you only with your consent"].map((t) => (
                    <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-gold-500" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/report" className="btn-gold px-6 py-3.5">Start your report <ArrowRight className="size-4" /></Link>
                <Link href="/track" className="btn-ghost-light px-6 py-3.5">Track a report</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── AREAS ───────────── */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <div className="container-x">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-2xl text-white">
              <Image src={img("globalReach")} alt="Flags outside the United Nations headquarters" fill sizes="100vw" className="-z-10 object-cover object-[center_60%]" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,29,61,.95)_0%,rgba(33,43,84,.8)_50%,rgba(33,43,84,.3)_100%)]" />
              <div className="max-w-2xl px-8 py-14 sm:px-12 sm:py-20">
                <h2 className="display text-[34px] leading-[1.1] sm:text-[44px]">Human rights violations we help document</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">Accessible technology that documents evidence, tracks incidents and connects affected people with advocacy and legal support networks.</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.05} className="h-full">
                <Link href="/report" className="group flex h-full flex-col rounded-2xl border border-transparent bg-white p-7 transition-colors hover:border-ink-900/15">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-gold-500/15 text-gold-600"><a.icon className="size-[22px]" strokeWidth={1.75} /></div>
                    <ArrowUpRight className="size-5 text-ink-900/25 transition-colors group-hover:text-gold-600" />
                  </div>
                  <h3 className="mt-6 text-lg leading-snug font-bold text-ink-900">{a.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-body">{a.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SECURITY ───────────── */}
      <section className="bg-ink-900 py-24 text-white sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading dark title="Your security. Your privacy. Your voice."
              intro="Reporting often involves sensitive information that can place victims, witnesses and defenders at risk. We protect it accordingly." />
            <ol className="mt-10">
              {security.map(([t, d], i) => (
                <li key={t} className="border-t border-white/15 py-6 last:border-b">
                  <Reveal delay={i * 0.06} className="grid grid-cols-[3rem_1fr]">
                    <span className="font-heading text-lg font-bold text-gold-500">0{i + 1}</span>
                    <div><h3 className="text-lg font-bold">{t}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{d}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Link href="/security" className="btn-gold mt-10 px-6 py-3.5">Read our security approach <ArrowRight className="size-4" /></Link>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image src={img("office")} alt="An empty council chamber" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/70 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
                <div className="grid gap-6 sm:grid-cols-2">
                  {([
                    [Fingerprint, "Data integrity", "Every file is fingerprinted (SHA-256) on arrival, so any change is detectable."],
                    [Lock, "Encrypted transport", "TLS in transit and protected storage at rest."],
                  ] as const).map(([I, t, d]) => (
                    <div key={t}>
                      <I className="size-6 text-gold-500" strokeWidth={1.75} />
                      <h3 className="mt-3 font-bold">{t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── AUDIENCES ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="split" title="Who can use HRSAT?"
            intro="Anyone with knowledge of a human rights violation can submit a report — whether you were directly affected or not." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.05} className="h-full">
                <div className="flex h-full gap-5 rounded-2xl border border-line p-7">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-gold-500"><a.icon className="size-[22px]" strokeWidth={1.75} /></div>
                  <div><h3 className="text-lg font-bold text-ink-900">{a.title}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-body">{a.text}</p></div>
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
            <div className="relative isolate overflow-hidden rounded-2xl bg-ink-900 text-white">
              <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 lg:block">
                <Image src={img("aboutHero")} alt="" fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/40 to-transparent" />
              </div>
              <div className="max-w-xl px-8 py-14 sm:px-12 sm:py-20">
                <h2 className="display text-[34px] leading-[1.1] sm:text-[44px]">Document what happened. Preserve what matters.</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">Violations are often hidden by fear, silence and lack of safe reporting access. Your report can change that — and you can stay anonymous.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/report" className="btn-gold px-7 py-4 text-base">Submit a secure report <ArrowRight className="size-4" /></Link>
                  <Link href="/contact" className="btn-ghost-light px-7 py-4 text-base">Contact us</Link>
                </div>
                <p className="mt-8 flex items-center gap-2 text-sm text-white/60"><LogOut className="size-4" /> Need to leave quickly? Use Quick exit or press Esc twice.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
