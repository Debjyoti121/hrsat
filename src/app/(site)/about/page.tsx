import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, BookOpenCheck, Globe2, HandHeart, Megaphone, ShieldCheck, Shield, Users2, Search } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getDictionary } from "@/i18n/server";
import { img } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).t.meta.pages.about };
}

const pillarIcons = [ShieldCheck, BookOpenCheck, Megaphone, HandHeart];
const areaIcons = [Megaphone, Search, Globe2, Users2];

export default async function AboutPage() {
  const { t: d } = await getDictionary();
  const t = d.about;
  return (
    <>
      <PageHero eyebrow={t.hero.label} title={t.hero.title} intro={t.hero.intro} image={img("aboutHero")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading title={t.approach.title} intro={t.approach.intro} />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {t.approach.pillars.map((p, i) => {
                const I = pillarIcons[i]!;
                return (
                  <Reveal key={p.title} delay={i * 0.05}>
                    <div className="h-full rounded-xl border border-line bg-white p-6">
                      <I className="size-6 text-gold-600" />
                      <h3 className="mt-6 font-semibold">{p.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
              <Image src={img("aboutIntro")} alt={t.approach.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl">
              <Image src={img("ghrdEvent")} alt={t.ghrd.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <div className="mb-8 inline-flex rounded-2xl bg-white p-3"><Image src={img("ghrdLogo")} alt="GHRD" width={60} height={100} className="h-16 w-auto" /></div>
            <SectionHeading dark title={t.ghrd.title} intro={t.ghrd.intro} />
            <Reveal delay={0.1}>
              <a href="https://www.ghrd.org" target="_blank" rel="noreferrer" className="btn-ghost-light mt-8">{t.ghrd.cta} <ArrowUpRight className="size-4" /></a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" title={t.areas.title} />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.areas.items.map((a, i) => {
              const I = areaIcons[i]!;
              return (
                <Reveal key={a.title} delay={i * 0.05}>
                  <div className="h-full rounded-xl border border-line bg-white p-7">
                    <div className="grid size-12 place-items-center rounded-2xl bg-ink-900 text-gold-400"><I className="size-5" /></div>
                    <h3 className="mt-8 font-semibold">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{a.text}</p>
                  </div>
                </Reveal>
              );
            })}
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
              <h2 className="display mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">{t.reach.title}</h2>
              <p className="mt-4 max-w-2xl text-white/70">{t.reach.text}</p>
              <Link href="/report" className="btn-gold mt-8">{t.reach.cta} <ArrowUpRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
