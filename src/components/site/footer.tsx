import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { CONTACT } from "@/lib/constants";
import { img } from "@/lib/images";

const cols = [
  { title: "Platform", links: [["Report a violation", "/report"], ["Track a report", "/track"], ["Security & privacy", "/security"]] },
  { title: "Organisation", links: [["About HRSAT", "/about"], ["Contact", "/contact"], ["Team sign-in", "/login"]] },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-20" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              A secure human rights reporting and documentation platform built to help victims, witnesses, defenders,
              journalists and organisations report violations safely and responsibly.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-3 pr-5 w-fit">
              <div className="rounded-xl bg-white p-1.5">
                <Image src={img("ghrdLogo")} alt="Global Human Rights Defence" width={40} height={70} className="h-10 w-auto" />
              </div>
              <div className="text-xs leading-snug text-white/60">Powered by<br /><span className="text-sm font-medium text-white">Global Human Rights Defence</span></div>
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">{c.title}</h4>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href} className="text-white/75 transition hover:text-gold-400">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li className="flex gap-2"><Mail className="mt-0.5 size-4 text-gold-500" /><a href={`mailto:${CONTACT.email}`} className="hover:text-gold-400">{CONTACT.email}</a></li>
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />{CONTACT.address}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(CONTACT.socials).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs capitalize text-white/70 transition hover:border-gold-500/50 hover:text-white">
                  {k === "x" ? "X" : k} <ArrowUpRight className="size-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} HRSAT · Human Rights Satellite. All rights reserved.</span>
          <span>Secure · Confidential · Victim-first</span>
        </div>
      </div>
    </footer>
  );
}
