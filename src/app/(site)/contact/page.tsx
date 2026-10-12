import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "./contact-form";
import { CONTACT } from "@/lib/constants";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).t.meta.pages.contact };
}

export default async function ContactPage() {
  const { t: d } = await getDictionary();
  const t = d.contact;
  return (
    <>
      <PageHero eyebrow={t.hero.label} title={t.hero.title} intro={t.hero.intro} />
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Reveal>
              <div className="rounded-xl border border-line bg-white p-7">
                <Mail className="size-6 text-gold-600" />
                <h3 className="mt-6 font-semibold">{t.email}</h3>
                <a href={`mailto:${CONTACT.email}`} className="mt-1 block text-slate-600 hover:text-ink-900" dir="ltr">{CONTACT.email}</a>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-xl border border-line bg-white p-7">
                <MapPin className="size-6 text-gold-600" />
                <h3 className="mt-6 font-semibold">{t.office}</h3>
                <p className="mt-1 text-slate-600">{t.address}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-xl bg-ink-900 p-7 text-white">
                <ShieldAlert className="size-6 text-gold-400" />
                <h3 className="mt-6 font-semibold">{t.violation.title}</h3>
                <p className="mt-1 text-sm text-white/65">{t.violation.text}</p>
                <Link href="/report" className="btn-gold mt-6">{t.violation.cta} <ArrowUpRight className="size-4" /></Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="rounded-xl border border-line bg-white p-7 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">{t.form.title}</h2>
              <p className="mt-1 text-slate-600">{t.form.reply}</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
