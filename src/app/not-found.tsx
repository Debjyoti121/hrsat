import Link from "next/link";
import { isRtl } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";

export default async function NotFound() {
  const { locale, t } = await getDictionary();
  return (
    <div lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"} className={`grid min-h-dvh place-items-center bg-ink-900 px-6 text-center font-sans text-white ${locale === "ar" ? "lang-ar" : ""}`}>
      <div>
        <p className="font-mono text-sm text-gold-400">404</p>
        <h1 className="display mt-4 text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 text-white/60">{t.notFound.text}</p>
        <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn-gold">{t.notFound.home}</Link><Link href="/report" className="btn-ghost-light">{t.notFound.report}</Link></div>
      </div>
    </div>
  );
}
