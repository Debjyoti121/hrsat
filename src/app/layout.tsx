import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Noto_Sans_Arabic } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { isRtl } from "@/i18n/config";
import { getLocale } from "@/i18n/server";
import "./globals.css";

// Same typefaces as hrsat.org: Manrope for headings, Inter for body copy
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
// Arabic script (Manrope/Inter have no Arabic glyphs)
const arabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "HRSAT — Report Human Rights Violations Safely", template: "%s · HRSAT" },
  description:
    "HRSAT (Human Rights Satellite) is a secure platform to document, monitor and report human rights violations worldwide — anonymously, with encrypted evidence upload and confidential review. Powered by Global Human Rights Defence.",
  openGraph: { siteName: "HRSAT", type: "website" },
};

export const viewport: Viewport = { themeColor: "#212b54" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rtl = isRtl(await getLocale());
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${arabic.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <Toaster position={rtl ? "top-left" : "top-right"} dir={rtl ? "rtl" : "ltr"} richColors closeButton />
      </body>
    </html>
  );
}
