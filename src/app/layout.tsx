import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";

// Same typefaces as hrsat.org: Manrope for headings, Inter for body copy
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "HRSAT — Report Human Rights Violations Safely", template: "%s · HRSAT" },
  description:
    "HRSAT (Human Rights Satellite) is a secure platform to document, monitor and report human rights violations worldwide — anonymously, with encrypted evidence upload and confidential review. Powered by Global Human Rights Defence.",
  openGraph: { siteName: "HRSAT", type: "website" },
};

export const viewport: Viewport = { themeColor: "#212b54" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
