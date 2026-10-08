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

const card = "rounded-xl bg-white shadow-[0_1px_3px_rgba(33,43,84,.08)]";

export default function Home() {
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <Image src={img("heroBuilding")} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink-900/80" />
        <div className="container-x relative pt-48 pb-28 text-center sm:pt-56 sm:pb-32">
          <Reveal>
            <h1 className="display mx-auto max-w-4xl text-[38px] leading-[1.1] font-semibold sm:text-[50px]">
              Report Human Rights Violations Safely, Securely, and With Dignity
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-[1.45] text-white/90">
              HRSAT (Human Rights Satellite) is an innovative digital platform designed to document, monitor, and report
              human rights violations worldwide. Through secure reporting tools, data collection, and case management
              systems, HRSAT empowers victims, activists, journalists, legal professionals, and human rights defenders to
              bring attention to violations and support accountability.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/report" className="btn-gold px-9 py-4 text-[15px]">Submit a Secure Report</Link>
              <Link href="#how-it-works" className="btn-ghost-light px-7 py-4 text-[15px]">How it works</Link>
            </div>
            <p className="mt-6 text-[13px] text-white/75">Anonymous option available · Secure evidence upload · Confidential review</p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="bg-paper-2 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="center" title="Built for Safe and Confidential Reporting"
            intro="Reporting a violation can put people at risk. Every part of HRSAT is designed to protect the person speaking up." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.05}>
                <div className={`${card} h-full p-7`}>
                  <div className="grid size-12 place-items-center rounded-full bg-gold-500 text-white"><f.icon className="size-5" /></div>
                  <h3 className="mt-6 text-xl font-bold text-ink-900">{f.title}</h3>
                  <p className="mt-2 text-[17px] leading-snug text-slate-700">{f.text}</p>
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
          <SectionHeading align="center" title="How Reporting Works" />
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className={`${card} h-full p-7 text-center`}>
                  <div className="mx-auto grid size-14 place-items-center rounded-full bg-ink-900 font-heading text-lg font-bold text-gold-500">{i + 1}</div>
                  <h3 className="mt-5 text-lg font-bold text-ink-900">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[240px] text-[15px] leading-relaxed text-body">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center"><Link href="/report" className="btn-gold px-9 py-4 text-[15px]">Start Secure Report</Link></Reveal>
        </div>
      </section>

      {/* ───────────── AREAS ───────────── */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading align="center" title="Human Rights Violations We Help Document"
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
            <SectionHeading dark title="Your Security. Your Privacy. Your Voice."
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
          <SectionHeading align="center" title="Who Can Use HRSAT?" />
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
            <h2 className="display text-[34px] leading-[1.12] text-ink-600 sm:text-[42px]">Document What Happened. Preserve What Matters.</h2>
            <p className="mt-5 text-lg text-body">Violations are often hidden by fear, silence and lack of safe reporting access. Your report can change that — and you can stay anonymous.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/report" className="btn-gold px-9 py-4 text-[15px]">Submit a Secure Report</Link>
              <Link href="/contact" className="btn-ghost px-7 py-4 text-[15px]">Contact Us</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
