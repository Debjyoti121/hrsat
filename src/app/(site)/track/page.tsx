import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/reveal";
import { getDictionary } from "@/i18n/server";
import { rich } from "@/i18n/rich";
import { TrackForm } from "./track-form";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).t.meta.pages.track };
}

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ case?: string }> }) {
  const { case: c } = await searchParams;
  const { t: d } = await getDictionary();
  const t = d.track;
  return (
    <section aria-label={t.hero.label} className="relative overflow-hidden bg-ink-900 pt-36 pb-20 text-white sm:pt-44 sm:pb-28">
      {/* Split layout: explanation on one side, the lookup form on the other */}
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h1 className="display text-[40px] leading-[1.1] sm:text-5xl">{t.hero.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{t.hero.intro}</p>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            {rich(t.note, { terms: <Link href="/terms" className="font-medium text-white underline underline-offset-4">{t.termsLink}</Link> })}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <TrackForm initialCase={c ?? ""} />
        </Reveal>
      </div>
    </section>
  );
}
