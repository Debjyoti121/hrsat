import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Baby, Building2, Check, Cpu, Eye, EyeOff, FileCheck2, Fingerprint, HeartHandshake, Landmark,
  Languages, Leaf, Link2, Lock, LogOut, Megaphone, Newspaper, ScanEye, Scale, Send, ShieldCheck, Smartphone, Upload,
  UserRound, Venus,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/page-hero";
import { getDictionary } from "@/i18n/server";
import { img } from "@/lib/images";

// Icons line up by index with the translated lists in the dictionary (t.home.*)
const trustIcons = [EyeOff, Lock, ScanEye];
const featureIcons = [EyeOff, Upload, ScanEye, Lock, Smartphone, Languages];
const stepIcons = [Send, Upload, ScanEye, FileCheck2];
const areaIcons = [Scale, Landmark, Venus, Baby, Link2, Megaphone, Leaf, Cpu];
const factIcons = [Fingerprint, Lock];
const audienceIcons = [UserRound, HeartHandshake, Eye, Building2, ShieldCheck, Newspaper];

export default async function Home() {
  const { t: d } = await getDictionary();
  const t = d.home;
  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate flex min-h-[760px] flex-col overflow-hidden bg-ink-900 text-white lg:min-h-[min(100svh,880px)]">
        <Image src={img("heroBuilding")} alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[70%_center] rtl:object-[30%_center]" />
        {/* navy behind the copy, photo left visible on the far side */}
        <div className="absolute inset-0 -z-10 bg-ink-900/85 lg:bg-transparent lg:bg-[linear-gradient(90deg,#161d3d_0%,rgba(33,43,84,.94)_38%,rgba(33,43,84,.55)_68%,rgba(33,43,84,.25)_100%)] rtl:lg:bg-[linear-gradient(270deg,#161d3d_0%,rgba(33,43,84,.94)_38%,rgba(33,43,84,.55)_68%,rgba(33,43,84,.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink-950/90 to-transparent" />

        <div className="container-x flex flex-1 items-center pt-32 pb-16 sm:pt-36">
          <div className="max-w-2xl">
            <Reveal>
              <p className="flex items-center gap-3 text-sm font-semibold text-gold-500">
                <span className="h-px w-8 bg-gold-500" /> {t.hero.kicker}
              </p>
              <h1 className="display mt-5 text-[40px] leading-[1.06] sm:text-[56px] lg:text-[64px]">{t.hero.title}</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">{t.hero.intro}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link href="/report" className="btn-gold px-7 py-4 text-base">{t.hero.primary} <ArrowRight className="size-4" /></Link>
                <Link href="/track" className="btn bg-white px-7 py-4 text-base text-ink-900 hover:bg-paper-2">{t.hero.secondary}</Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* trust strip */}
        <div className="relative border-t border-white/15">
          <div className="container-x grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/15 rtl:lg:divide-x-reverse">
            {t.hero.trust.map((item, i) => {
              const I = trustIcons[i]!;
              return (
                <div key={item.title} className="flex items-start gap-3.5 lg:px-8 lg:first:ps-0">
                  <I className="mt-0.5 size-5 shrink-0 text-gold-500" />
                  <div><div className="font-heading font-semibold">{item.title}</div><div className="text-sm text-white/65">{item.text}</div></div>
                </div>
              );
            })}
            <div className="flex items-center gap-3.5 lg:px-8">
              <Image src={img("ghrdLogo")} alt="" width={48} height={84} className="h-14 w-auto" />
              <div><div className="text-xs text-white/60">{d.poweredBy.prefix}</div><div className="font-heading font-semibold" dir="ltr">{d.poweredBy.name}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-40">
              <SectionHeading title={t.features.title} intro={t.features.intro} />
              <Reveal delay={0.1}>
                <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[5/6]">
                  <Image src={img("aboutIntro")} alt={t.features.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-top" />
                </div>
              </Reveal>
            </div>
          </div>
          <div className="grid content-start gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:pt-2">
            {t.features.items.map((f, i) => {
              const I = featureIcons[i]!;
              return (
                <Reveal key={f.title} delay={(i % 2) * 0.06}>
                  <div className="h-full border-t border-line py-9">
                    <div className="grid size-12 place-items-center rounded-xl bg-paper-2 text-ink-900"><I className="size-[22px]" strokeWidth={1.75} /></div>
                    <h3 className="mt-6 text-xl font-bold text-ink-900">{f.title}</h3>
                    <p className="mt-2.5 text-base leading-relaxed text-body">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── GHRD ───────────── */}
      <section className="bg-paper-2 py-24 sm:py-32">
        <div className="container-x">
          <Reveal>
            <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgba(33,43,84,.25)] lg:grid-cols-2">
              <div className="relative min-h-[320px] lg:min-h-full">
                <Image src={img("team")} alt={t.ghrd.imageAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-8 sm:p-12 lg:p-14">
                <div className="flex items-center gap-4">
                  <Image src={img("ghrdLogo")} alt="Global Human Rights Defence" width={48} height={86} className="h-[72px] w-auto" />
                  <div className="text-sm font-semibold text-gold-600">{d.poweredBy.prefix}<br /><span className="text-ink-900" dir="ltr">{d.poweredBy.name}</span></div>
                </div>
                <h2 className="display mt-8 text-[32px] leading-[1.12] text-ink-900 sm:text-[40px]">{t.ghrd.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-body">{t.ghrd.text}</p>
                <blockquote className="mt-8 border-s-[3px] border-gold-500 ps-5 font-heading text-lg leading-snug font-semibold text-ink-900">“{t.ghrd.quote}”</blockquote>
                <dl className="mt-10 grid grid-cols-3 divide-x divide-line border-y border-line rtl:divide-x-reverse">
                  {t.ghrd.figures.map((f) => (
                    <div key={f.value} className="px-4 py-5 first:ps-0">
                      <dt className="font-heading text-xl font-bold whitespace-nowrap text-ink-900 sm:text-2xl">{f.value}</dt>
                      <dd className="mt-1 text-sm text-body">{f.label}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/about" className="btn-ink mt-10 px-6 py-3.5">{t.ghrd.cta} <ArrowRight className="size-4" /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="how-it-works" className="scroll-mt-32 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="split" title={t.how.title} intro={t.how.intro} />
          <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8">
            <span aria-hidden className="absolute start-7 end-0 top-7 hidden h-px bg-gradient-to-r from-ink-900/25 via-ink-900/15 to-transparent md:block rtl:bg-gradient-to-l" />
            {t.how.steps.map((s, i) => {
              const I = stepIcons[i]!;
              return (
                <li key={s.title} className="relative">
                  <Reveal delay={i * 0.07}>
                    <div className="grid size-14 place-items-center rounded-full bg-ink-900 text-gold-500 ring-8 ring-white"><I className="size-6" strokeWidth={1.75} /></div>
                    <p className="mt-6 font-heading text-sm font-bold text-gold-600">{t.how.step} {i + 1}</p>
                    <h3 className="mt-1 text-xl font-bold text-ink-900">{s.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-body">{s.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <Reveal>
            <div className="mt-16 grid gap-8 rounded-2xl bg-ink-900 p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h3 className="font-heading text-xl font-bold">{t.how.afterTitle}</h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 text-[15px] text-white/80 sm:grid-cols-3">
                  {t.how.after.map((x) => (
                    <li key={x} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-gold-500" />{x}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/report" className="btn-gold px-6 py-3.5">{t.how.start} <ArrowRight className="size-4" /></Link>
                <Link href="/track" className="btn-ghost-light px-6 py-3.5">{t.how.track}</Link>
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
              <Image src={img("globalReach")} alt={t.areas.imageAlt} fill sizes="100vw" className="-z-10 object-cover object-[center_60%]" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(22,29,61,.95)_0%,rgba(33,43,84,.8)_50%,rgba(33,43,84,.3)_100%)] rtl:bg-[linear-gradient(270deg,rgba(22,29,61,.95)_0%,rgba(33,43,84,.8)_50%,rgba(33,43,84,.3)_100%)]" />
              <div className="max-w-2xl px-8 py-14 sm:px-12 sm:py-20">
                <h2 className="display text-[34px] leading-[1.1] sm:text-[44px]">{t.areas.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">{t.areas.intro}</p>
              </div>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.areas.items.map((a, i) => {
              const I = areaIcons[i]!;
              return (
                <Reveal key={a.title} delay={(i % 4) * 0.05} className="h-full">
                  <Link href="/report" className="group flex h-full flex-col rounded-2xl border border-transparent bg-white p-7 transition-colors hover:border-ink-900/15">
                    <div className="flex items-start justify-between">
                      <div className="grid size-12 place-items-center rounded-xl bg-gold-500/15 text-gold-600"><I className="size-[22px]" strokeWidth={1.75} /></div>
                      <ArrowUpRight className="size-5 text-ink-900/25 transition-colors group-hover:text-gold-600" />
                    </div>
                    <h3 className="mt-6 text-lg leading-snug font-bold text-ink-900">{a.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-body">{a.text}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── SECURITY ───────────── */}
      <section className="bg-ink-900 py-24 text-white sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading dark title={t.security.title} intro={t.security.intro} />
            <ol className="mt-10">
              {t.security.items.map((s, i) => (
                <li key={s.title} className="border-t border-white/15 py-6 last:border-b">
                  <Reveal delay={i * 0.06} className="grid grid-cols-[3rem_1fr]">
                    <span className="font-heading text-lg font-bold text-gold-500">0{i + 1}</span>
                    <div><h3 className="text-lg font-bold">{s.title}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{s.text}</p></div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Link href="/security" className="btn-gold mt-10 px-6 py-3.5">{t.security.cta} <ArrowRight className="size-4" /></Link>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image src={img("office")} alt={t.security.imageAlt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/95 via-ink-950/70 to-transparent p-6 pt-24 sm:p-8 sm:pt-28">
                <div className="grid gap-6 sm:grid-cols-2">
                  {t.security.facts.map((f, i) => {
                    const I = factIcons[i]!;
                    return (
                      <div key={f.title}>
                        <I className="size-6 text-gold-500" strokeWidth={1.75} />
                        <h3 className="mt-3 font-bold">{f.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/75">{f.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── AUDIENCES ───────────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="split" title={t.audiences.title} intro={t.audiences.intro} />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.audiences.items.map((a, i) => {
              const I = audienceIcons[i]!;
              return (
                <Reveal key={a.title} delay={(i % 3) * 0.05} className="h-full">
                  <div className="flex h-full gap-5 rounded-2xl border border-line p-7">
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-900 text-gold-500"><I className="size-[22px]" strokeWidth={1.75} /></div>
                    <div><h3 className="text-lg font-bold text-ink-900">{a.title}</h3><p className="mt-1.5 text-[15px] leading-relaxed text-body">{a.text}</p></div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-2xl bg-ink-900 text-white">
              <div className="absolute inset-y-0 end-0 -z-10 hidden w-1/2 lg:block">
                <Image src={img("aboutHero")} alt="" fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/40 to-transparent rtl:bg-gradient-to-l" />
              </div>
              <div className="max-w-xl px-8 py-14 sm:px-12 sm:py-20">
                <h2 className="display text-[34px] leading-[1.1] sm:text-[44px]">{t.cta.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">{t.cta.text}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/report" className="btn-gold px-7 py-4 text-base">{t.cta.primary} <ArrowRight className="size-4" /></Link>
                  <Link href="/contact" className="btn-ghost-light px-7 py-4 text-base">{t.cta.secondary}</Link>
                </div>
                <p className="mt-8 flex items-center gap-2 text-sm text-white/60"><LogOut className="size-4 shrink-0" /> {t.cta.escape}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
