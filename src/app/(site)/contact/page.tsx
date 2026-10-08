import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "./contact-form";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Have questions?" accent="We're here to help."
        intro="Questions about HRSAT, partnerships, media or volunteering — reach out any time. To report a violation, please use the secure report form." />
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Reveal>
              <div className="rounded-3xl border border-line bg-white p-7">
                <Mail className="size-6 text-gold-600" />
                <h3 className="mt-6 font-semibold">Email</h3>
                <a href={`mailto:${CONTACT.email}`} className="mt-1 block text-slate-600 hover:text-ink-900">{CONTACT.email}</a>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-3xl border border-line bg-white p-7">
                <MapPin className="size-6 text-gold-600" />
                <h3 className="mt-6 font-semibold">Office</h3>
                <p className="mt-1 text-slate-600">{CONTACT.address}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl bg-ink-900 p-7 text-white">
                <ShieldAlert className="size-6 text-gold-400" />
                <h3 className="mt-6 font-semibold">Reporting a violation?</h3>
                <p className="mt-1 text-sm text-white/65">Don&apos;t send sensitive details by email. Our secure form protects your identity and evidence.</p>
                <Link href="/report" className="btn-gold mt-6">Secure report <ArrowUpRight className="size-4" /></Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="rounded-[32px] border border-line bg-white p-7 sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight">Send us a message</h2>
              <p className="mt-1 text-slate-600">We usually reply within two working days.</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
