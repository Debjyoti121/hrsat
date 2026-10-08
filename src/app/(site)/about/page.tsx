import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpenCheck, Globe2, HandHeart, Megaphone, ShieldCheck, Shield, Users2, Search } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { img } from "@/lib/images";

export const metadata: Metadata = { title: "About Us" };

const pillars = [
  { icon: ShieldCheck, title: "Technology-driven security", text: "Encrypted submissions, evidence fingerprinting and role-based access protect every report." },
  { icon: BookOpenCheck, title: "Responsible documentation", text: "Structured, verifiable records that can stand up in advocacy and legal processes." },
  { icon: Megaphone, title: "Advocacy & accountability", text: "Verified cases inform engagement with the UN, European institutions and civil society." },
  { icon: HandHeart, title: "Victim-protection focus", text: "Anonymity, informed consent and privacy come first — always." },
];

const areas = [
  { icon: Megaphone, title: "Human rights advocacy", text: "Raising documented cases with international bodies and decision-makers." },
  { icon: Search, title: "Documentation & research", text: "Turning testimony and evidence into rigorous, reusable research." },
  { icon: Globe2, title: "International awareness", text: "Bringing hidden violations to global attention through media and reports." },
  { icon: Users2, title: "Community protection", text: "Supporting at-risk communities with safe channels and referral networks." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About HRSAT" title="Every voice heard." accent="Every violation documented."
        intro="HRSAT — the Human Rights Secure Accountability Tracker — is a confidential platform where victims, witnesses, journalists, defenders and organisations can submit incidents and evidence while their identities stay protected."
        image={img("aboutHero")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our approach" title="Secure technology," accent="human care."
              intro="We combine secure technology, careful documentation and advocacy support with an uncompromising victim-first focus." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="h-full rounded-xl border border-line bg-white p-6">
                    <p.icon className="size-6 text-gold-600" />
                    <h3 className="mt-6 font-semibold">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
              <Image src={img("aboutIntro")} alt="HRSAT team" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl">
              <Image src={img("ghrdEvent")} alt="Global Human Rights Defence event" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <div className="mb-8 inline-flex rounded-2xl bg-white p-3"><Image src={img("ghrdLogo")} alt="GHRD" width={60} height={100} className="h-16 w-auto" /></div>
            <SectionHeading dark eyebrow="Supported by GHRD" title="Global Human Rights Defence," accent="The Hague."
              intro="HRSAT is supported by Global Human Rights Defence (GHRD), a UN ECOSOC-accredited organisation based in The Hague that works through research, advocacy and awareness to protect minorities and vulnerable communities." />
            <Reveal delay={0.1}>
              <a href="https://www.ghrd.org" target="_blank" rel="noreferrer" className="btn-ghost-light mt-8">Visit GHRD <ArrowUpRight className="size-4" /></a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Key areas" title="Where we" accent="focus our work" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.05}>
                <div className="h-full rounded-xl border border-line bg-white p-7">
                  <div className="grid size-12 place-items-center rounded-2xl bg-ink-900 text-gold-400"><a.icon className="size-5" /></div>
                  <h3 className="mt-8 font-semibold">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-xl">
            <div className="relative aspect-[16/9] min-h-[420px] sm:aspect-[21/9]">
              <Image src={img("globalReach")} alt="" fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-14">
              <Shield className="size-8 text-gold-400" />
              <h2 className="display mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">Global reach, local protection.</h2>
              <p className="mt-4 max-w-2xl text-white/70">HRSAT supports reporting in regions affected by conflict, persecution, displacement and abuse — serving civil society, defenders, journalists and displaced populations.</p>
              <Link href="/report" className="btn-gold mt-8">Submit a secure report <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
