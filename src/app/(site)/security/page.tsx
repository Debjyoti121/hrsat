import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowUpRight, Fingerprint, KeyRound, Link2, Lock, ShieldAlert, UserCheck, Users, FileLock2 } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getDictionary } from "@/i18n/server";
import { img } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).t.meta.pages.security };
}

const integrityIcons = [Fingerprint, Link2, FileLock2];
const pointIcons = [KeyRound, UserCheck, Activity];
const protectionIcons = [Lock, Users, Activity, ShieldAlert];

export default async function SecurityPage() {
  const { t: d } = await getDictionary();
  const t = d.security;
  return (
    <>
      <PageHero eyebrow={t.hero.label} title={t.hero.title} intro={t.hero.intro} image={img("conference")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading title={t.ownership.title} />
            <div className="mt-10 space-y-4">
              {t.ownership.items.map((it, i) => (
                <Reveal key={it.title} delay={i * 0.05}>
                  <div className="flex gap-5 rounded-xl border border-line bg-white p-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-900 font-mono text-sm text-gold-400">{i + 1}</span>
                    <div><h3 className="font-semibold">{it.title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{it.text}</p></div>
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
          <SectionHeading dark align="center" title={t.integrity.title} intro={t.integrity.intro} />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {t.integrity.items.map((it, i) => {
              const Icon = integrityIcons[i]!;
              return (
                <Reveal key={it.title} delay={i * 0.06}>
                  <div className="h-full rounded-xl border border-white/10 bg-white/[.04] p-7">
                    <Icon className="size-7 text-gold-400" />
                    <h3 className="mt-8 text-lg font-semibold">{it.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{it.text}</p>
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
            <SectionHeading title={t.access.title} intro={t.access.intro} />
            <ul className="mt-8 space-y-3">
              {t.access.points.map((p, i) => {
                const Icon = pointIcons[i]!;
                return <li key={p} className="flex items-center gap-3 font-medium"><span className="grid size-9 place-items-center rounded-xl bg-gold-500/15 text-gold-600"><Icon className="size-4" /></span>{p}</li>;
              })}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {t.access.protections.map((p, i) => {
              const Icon = protectionIcons[i]!;
              return (
                <Reveal key={p.title} delay={i * 0.05}>
                  <div className="h-full rounded-xl border border-line bg-white p-7">
                    <Icon className="size-6 text-ink-700" />
                    <h3 className="mt-8 font-semibold">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div className="rounded-xl border border-gold-500/30 bg-gold-500/[.07] p-8 sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight">{t.safety.title}</h2>
            <ul className="mt-6 grid gap-3 text-[15px] text-slate-700 sm:grid-cols-2">
              {t.safety.tips.map((tip) => <li key={tip}>• {tip}</li>)}
            </ul>
            <Link href="/report" className="btn-ink mt-8">{t.safety.cta} <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
