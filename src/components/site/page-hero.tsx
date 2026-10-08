import Image from "next/image";
import { Reveal } from "./reveal";

// `eyebrow` is only used as the section's aria-label; hrsat.org's design has no kicker labels.
export function PageHero({ eyebrow, title, accent, intro, image, children }: {
  eyebrow: string; title: string; accent?: string; intro?: string; image?: string; children?: React.ReactNode;
}) {
  return (
    <section aria-label={eyebrow} className="relative overflow-hidden bg-ink-900 pt-44 pb-24 text-white sm:pt-52 sm:pb-28">
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-ink-900/85" />
      <div className="container-x relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <h1 className="display text-[40px] leading-[1.1] sm:text-5xl">
            {title}{accent && <> {accent}</>}
          </h1>
          {intro && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHeading({ title, accent, intro, align = "left", dark = false }: {
  eyebrow?: string; title: string; accent?: string; intro?: string; align?: "left" | "center"; dark?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className={`display text-[34px] leading-[1.12] sm:text-[44px] ${dark ? "text-white" : "text-ink-900"}`}>
        {title}{accent && <> {accent}</>}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/75" : "text-body"}`}>{intro}</p>}
    </Reveal>
  );
}
