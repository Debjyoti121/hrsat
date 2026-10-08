import type { Metadata } from "next";
import { EyeOff, FileCheck2, Lock, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ReportForm } from "./report-form";

export const metadata: Metadata = {
  title: "Report a Violation",
  description: "Submit a secure, confidential human rights report. Anonymous reporting available.",
};

export default function ReportPage() {
  return (
    <>
      <PageHero eyebrow="Secure report" title="Submit a secure" accent="human rights report."
        intro="Report violations, share testimony and submit evidence for confidential review. You can stay anonymous — and you can stop at any time.">
        <div className="mt-10 flex flex-wrap gap-3">
          {[[EyeOff, "Anonymous option"], [Lock, "Encrypted in transit"], [FileCheck2, "Evidence fingerprinting"], [Users, "Restricted review team"]].map(([I, t]) => {
            const Icon = I as typeof Lock;
            return <span key={t as string} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"><Icon className="size-4 text-gold-400" />{t as string}</span>;
          })}
        </div>
      </PageHero>
      <section className="py-16 sm:py-24">
        <div className="container-x"><ReportForm /></div>
      </section>
    </>
  );
}
