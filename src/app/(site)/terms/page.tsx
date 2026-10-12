import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { TERMS_OF_USE } from "@/lib/constants";

export const metadata: Metadata = { title: "Terms of Use & Disclaimer" };

// Wording taken from the Security and Privacy page of the original hrsat.org site.
const sections = [
  {
    id: "disclaimer", title: "Disclaimer", body: [
      "HRSAT is a secure reporting platform developed by Global Human Rights Defence (GHRD) to help document alleged human rights violations and preserve evidence for further assessment.",
      "Information submitted through HRSAT is reviewed by authorised members of our team and may contribute to human rights documentation, advocacy initiatives, or, where appropriate, legal analysis. However, submitting a report does not automatically result in an investigation, legal action, or referral to national or international authorities.",
      "By submitting information through the platform, you confirm that the information is accurate to the best of your knowledge and that you have the right to share any documents, photographs, videos, or other materials you upload.",
      "While we work hard to protect the information entrusted to us, no online platform can guarantee absolute security. We encourage users to consider their own safety before submitting sensitive information.",
    ],
  },
  { id: "terms", title: "Terms of use", intro: "By using HRSAT you agree that:", list: TERMS_OF_USE },
  {
    id: "commitment", title: "Our commitment", body: [
      "Protecting the identity and safety of victims, witnesses and human rights defenders is central to HRSAT.",
      "We understand that many people who use this platform may be sharing highly sensitive information. For that reason, we aim to handle every report with care, confidentiality and respect.",
    ],
  },
  {
    id: "confidential", title: "Confidential reporting", body: [
      "Where possible, users may submit reports without revealing their identity. Providing contact details is optional unless they are needed for follow-up communication.",
      "Only authorised members of the HRSAT team have access to submitted reports, and access is limited to those involved in reviewing and documenting cases.",
    ],
  },
  {
    id: "use", title: "How we use your information", list: [
      "Document alleged human rights violations",
      "Review and verify reported information",
      "Support advocacy and research",
      "Prepare reports for partner organisations where appropriate",
      "Contribute to accountability efforts where permitted by law",
    ],
  },
  {
    id: "safety", title: "Reporter safety", body: [
      "Your safety comes first. Before submitting a report, consider whether doing so could put you or someone else at risk. If possible, use a secure, trusted internet connection and avoid sharing unnecessary personal information.",
      "If you choose to upload photographs, videos, or documents, preserve the original files securely whenever possible. They may contain metadata or other information that can help verify their authenticity.",
    ],
  },
] as { id: string; title: string; intro?: string; body?: string[]; list?: readonly string[] }[];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Terms of use" title="Terms of use & disclaimer"
        intro="Please read these terms before submitting a report or checking the status of a case." />
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <ul className="sticky top-36 space-y-1 border-l border-line text-sm">
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-body hover:border-gold-500 hover:text-ink-900">{s.title}</a></li>
              ))}
            </ul>
          </nav>
          <div className="max-w-3xl lg:col-span-9">
            <div className="flex gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" />
              <p className="text-[15px] leading-relaxed"><strong>HRSAT is not an emergency service.</strong> If you or someone else is in immediate danger, please contact local emergency services or a trusted organisation that can provide urgent assistance.</p>
            </div>
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-36 border-b border-line py-10 last:border-0">
                <h2 className="text-2xl font-bold text-ink-900">{s.title}</h2>
                {s.intro && <p className="mt-4 text-body">{s.intro}</p>}
                {s.body?.map((p) => <p key={p} className="mt-4 leading-relaxed text-body">{p}</p>)}
                {s.list && (
                  <ul className="mt-4 space-y-2.5">
                    {s.list.map((li) => <li key={li} className="flex gap-3 leading-relaxed text-body"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold-500" />{li}</li>)}
                  </ul>
                )}
              </article>
            ))}
            <p className="mt-10 text-sm text-body">Questions about these terms? <Link href="/contact" className="font-medium text-ink-900 underline underline-offset-4">Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
