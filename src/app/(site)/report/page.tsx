import type { Metadata } from "next";
import { EyeOff, FileCheck2, Lock, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getDictionary } from "@/i18n/server";
import { ReportForm } from "./report-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.meta.pages.report, description: t.report.hero.intro };
}

const badgeIcons = [EyeOff, Lock, FileCheck2, Users];

export default async function ReportPage() {
  const { t } = await getDictionary();
  return (
    <>
      <PageHero eyebrow={t.report.hero.label} title={t.report.hero.title} intro={t.report.hero.intro}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {t.report.hero.badges.map((b, i) => {
            const Icon = badgeIcons[i]!;
            return <span key={b} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"><Icon className="size-4 text-gold-400" />{b}</span>;
          })}
        </div>
      </PageHero>
      <section className="py-16 sm:py-24">
        <div className="container-x"><ReportForm /></div>
      </section>
    </>
  );
}
