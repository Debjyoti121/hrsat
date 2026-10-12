import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { I18nProvider } from "@/i18n/client";
import { isRtl } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: { absolute: t.meta.title, template: "%s · HRSAT" }, description: t.meta.description };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getDictionary();
  return (
    <I18nProvider locale={locale}>
      <div lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"} className={`font-sans ${locale === "ar" ? "lang-ar" : ""}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
