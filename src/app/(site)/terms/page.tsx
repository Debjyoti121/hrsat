import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getDictionary } from "@/i18n/server";
import { rich } from "@/i18n/rich";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).t.meta.pages.terms };
}

// Wording based on the Security and Privacy page of the original hrsat.org site.
const ORDER = ["disclaimer", "terms", "commitment", "confidential", "use", "safety"] as const;

export default async function TermsPage() {
  const { t: d } = await getDictionary();
  const t = d.terms;
  const sections = ORDER.map((id) => ({ id, ...(t.sections[id] as { title: string; intro?: string; body?: string[]; list?: string[] }) }));
  return (
    <>
      <PageHero eyebrow={t.hero.label} title={t.hero.title} intro={t.hero.intro} />
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label={t.onThisPage} className="hidden lg:col-span-3 lg:block">
            <ul className="sticky top-36 space-y-1 border-s border-line text-sm">
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-body hover:border-gold-500 hover:text-ink-900">{s.title}</a></li>
              ))}
            </ul>
          </nav>
          <div className="max-w-3xl lg:col-span-9">
            <div className="flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" />
              <p className="text-[15px] leading-relaxed"><strong>{t.emergency.strong}</strong> {t.emergency.text}</p>
            </div>
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-36 border-b border-line py-10 last:border-0">
                <h2 className="text-2xl font-bold text-ink-900">{s.title}</h2>
                {s.intro && <p className="mt-4 text-body">{s.intro}</p>}
                {s.body?.map((p) => <p key={p} className="mt-4 leading-relaxed text-body">{p}</p>)}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((li) => <li key={li} className="flex gap-3 leading-relaxed text-body"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500" />{li}</li>)}
                  </ul>
                )}
              </article>
            ))}
            <p className="mt-10 text-sm text-body">
              {rich(t.questions, { contact: <Link href="/contact" className="font-medium text-ink-900 underline underline-offset-4">{t.contactLink}</Link> })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
