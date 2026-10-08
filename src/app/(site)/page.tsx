import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Baby, Building2, Cpu, Eye, EyeOff, Fingerprint, HeartHandshake, Landmark, Languages, Leaf, Link2, Lock,
  Megaphone, Newspaper, ScanEye, Scale, ShieldCheck, Smartphone, Upload, UserRound, Venus,
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
  { title: "Submit an incident", text: "Share what happened through a guided form designed for clarity and safety." },
  { title: "Upload evidence", text: "Attach photos, videos, documents, audio or witness statements securely." },
  { title: "Confidential review", text: "An assigned reviewer examines your submission with care and discretion." },
  { title: "Documentation & action", text: "Verified reports support advocacy, response coordination and accountability." },
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
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="split" title="Built for safe and confidential reporting"
            intro="Reporting a violation can put people at risk. Every part of HRSAT is designed to protect the person speaking up." />
          <div className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.05}>
                <div className="h-full border-t border-line py-8">
                  <f.icon className="size-6 text-gold-600" strokeWidth={1.75} />
                  <h3 className="mt-5 text-xl font-bold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-body">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── GHRD ───────────── */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2 sm:aspect-square">
              <Image src={img("team")} alt="HRSAT and GHRD team" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading title="Backed by Global Human Rights Defence"
              intro="HRSAT builds on more than two decades of international advocacy, research, legal interventions and engagement with the United Nations, European institutions and civil society worldwide." />
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg leading-relaxed text-body">Together we work to ensure every voice is heard, every violation documented, and every victim has a pathway toward justice.</p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[["20+ years", "of advocacy"], ["UN ECOSOC", "accredited"], ["The Hague", "headquartered"]].map(([a, b]) => (
                  <div key={a} className="border-l-4 border-gold-500 bg-paper-2 px-4 py-3">
                    <div className="font-heading font-bold text-ink-900">{a}</div><div className="text-sm text-body">{b}</div>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-ink mt-8">Learn more about HRSAT <ArrowRight className="size-4" /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="scroll-mt-28 bg-paper-2 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="split" title="How reporting works"
            intro="Four steps from your first submission to documentation that can support advocacy and accountability." />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
            <span aria-hidden className="absolute top-6 right-0 left-6 hidden h-px bg-ink-900/15 md:block" />
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <Reveal delay={i * 0.06}>
                  <div className="grid size-12 place-items-center rounded-full bg-ink-900 font-heading text-base font-bold text-gold-500 ring-8 ring-paper-2">{i + 1}</div>
                  <h3 className="mt-6 text-lg font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-14"><Link href="/report" className="btn-gold px-7 py-4 text-base">Start your report <ArrowRight className="size-4" /></Link></Reveal>
        </div>
      </section>

      {/* ───────────── AREAS ───────────── */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="split" title="Human rights violations we help document"
            intro="Accessible technology that documents evidence, tracks incidents and connects affected people with advocacy and legal support networks." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal key={a.title} delay={(i % 4) * 0.05} className="h-full">
                <div className="flex h-full flex-col rounded-xl bg-ink-900 p-7 text-cream">
                  <a.icon className="size-7 text-gold-500" />
                  <h3 className="mt-6 text-[22px] leading-tight font-bold">{a.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-cream/80">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── SECURITY ───────────── */}
      <section className="bg-ink-900 py-20 text-white sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading dark title="Your security. Your privacy. Your voice."
              intro="Reporting often involves sensitive information that can place victims, witnesses and defenders at risk. We protect it accordingly." />
            <div className="mt-10 space-y-3">
              {security.map(([t, d], i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="flex gap-4 rounded-xl bg-white/[.06] p-5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 font-heading text-sm font-bold text-ink-900">{i + 1}</span>
                    <div><h3 className="font-bold">{t}</h3><p className="mt-1 text-[15px] leading-relaxed text-white/75">{d}</p></div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Link href="/security" className="btn-gold mt-8">Read our security approach <ArrowRight className="size-4" /></Link>
          </div>
          <Reveal delay={0.1}>
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="relative col-span-2 min-h-[260px] overflow-hidden rounded-xl">
                <Image src={img("office")} alt="HRSAT team at work" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </div>
              {([
                [Fingerprint, "Data integrity", "Every evidence file is fingerprinted (SHA-256) on arrival, so any change is detectable."],
                [Lock, "Encrypted transport", "TLS in transit, protected storage at rest."],
              ] as const).map(([I, t, d]) => (
                <div key={t} className="rounded-xl bg-white/[.06] p-6">
                  <I className="size-6 text-gold-500" />
                  <h3 className="mt-5 font-bold">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── AUDIENCES ───────────── */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="split" title="Who can use HRSAT?" intro="Anyone with knowledge of a human rights violation can submit a report — directly affected or not." />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.05}>
                <div className="flex h-full gap-5 rounded-xl border border-line bg-white p-6">
                  <div className="grid size-12 shrink-0 place-items-center rounded-full bg-paper-2 text-ink-900"><a.icon className="size-5" /></div>
                  <div><h3 className="text-lg font-bold text-ink-900">{a.title}</h3><p className="mt-1 text-[15px] leading-relaxed text-body">{a.text}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="bg-paper-2 py-20 sm:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="display text-[34px] leading-[1.12] text-ink-600 sm:text-[42px]">Document what happened. Preserve what matters.</h2>
            <p className="mt-5 text-lg text-body">Violations are often hidden by fear, silence and lack of safe reporting access. Your report can change that — and you can stay anonymous.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/report" className="btn-gold px-7 py-4 text-base">Submit a secure report <ArrowRight className="size-4" /></Link>
              <Link href="/contact" className="btn-ghost px-7 py-4 text-base">Contact us</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
