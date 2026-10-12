import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { PoweredBy } from "./powered-by";
import { CONTACT } from "@/lib/constants";
import { getDictionary } from "@/i18n/server";

export async function Footer() {
  const { t } = await getDictionary();
  const l = t.footer.links;
  const cols = [
    { title: t.footer.platform, links: [[l.report, "/report"], [l.track, "/track"], [l.security, "/security"], [l.terms, "/terms"]] },
    { title: t.footer.organisation, links: [[l.about, "/about"], [l.contact, "/contact"], [l.signIn, "/login"]] },
  ];
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="container-x relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-20" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">{t.footer.about}</p>
            <PoweredBy className="mt-6" />
          </div>
          {cols.map((c) => (
            <div key={c.title} className="lg:col-span-2">
              <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">{c.title}</h4>
              <ul className="mt-5 space-y-3 text-sm">
                {c.links.map(([label, href]) => (
                  <li key={href}><Link href={href!} className="text-white/75 transition hover:text-gold-400">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">{t.footer.contact}</h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li className="flex gap-2"><Mail className="mt-0.5 size-4 text-gold-500" /><a href={`mailto:${CONTACT.email}`} className="hover:text-gold-400" dir="ltr">{CONTACT.email}</a></li>
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />{t.contact.address}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(CONTACT.socials).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer" dir="ltr"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs capitalize text-white/70 transition hover:border-gold-500/50 hover:text-white">
                  {k === "x" ? "X" : k} <ArrowUpRight className="size-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} {t.footer.rights}</span>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
