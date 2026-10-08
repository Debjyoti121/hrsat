import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "HRSAT — Report Human Rights Violations Safely", template: "%s · HRSAT" },
  description:
    "HRSAT (Human Rights Satellite) is a secure platform to document, monitor and report human rights violations worldwide — anonymously, with encrypted evidence upload and confidential review. Powered by Global Human Rights Defence.",
  openGraph: { siteName: "HRSAT", type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b1630" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
