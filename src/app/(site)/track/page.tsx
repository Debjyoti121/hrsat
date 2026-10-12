import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import Link from "next/link";
import { TrackForm } from "./track-form";

export const metadata: Metadata = { title: "Track a Report" };

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ case?: string }> }) {
  const { case: c } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Track a report" title="Check the status" accent="of your report."
        intro="Enter the case reference from your confirmation email and the email address you used. For your safety, only the status is shown — never the contents." />
      <section className="py-20 sm:py-28">
        <div className="container-x max-w-2xl">
          <TrackForm initialCase={c ?? ""} />
          <p className="mt-6 text-center text-sm leading-relaxed text-body">
            Only the status of a report is shown here, never its contents. By using this service you agree to our{" "}
            <Link href="/terms" className="font-medium text-ink-900 underline underline-offset-4">Terms of Use &amp; Disclaimer</Link>.
            HRSAT is not an emergency service.
          </p>
        </div>
      </section>
    </>
  );
}
