import Image from "next/image";
import { Reveal } from "./reveal";

export function PageHero({ eyebrow, title, accent, intro, image, children }: {
  eyebrow: string; title: string; accent?: string; intro?: string; image?: string; children?: React.ReactNode;
}) {
  return (
    <section className="noise relative overflow-hidden bg-ink-900 pt-44 pb-24 text-white sm:pt-52 sm:pb-28">
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/85 to-ink-900" />
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[120px]" />
      <div className="container-x relative">
        <Reveal>
          <span className="eyebrow text-gold-400">{eyebrow}</span>
          <h1 className="display mt-6 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {title} {accent && <span className="serif-accent text-gold-400">{accent}</span>}
          </h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, accent, intro, align = "left", dark = false }: {
  eyebrow: string; title: string; accent?: string; intro?: string; align?: "left" | "center"; dark?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className={`eyebrow ${dark ? "text-gold-400" : "text-gold-600"}`}>{eyebrow}</span>
      <h2 className={`display mt-5 text-4xl leading-[1.05] sm:text-5xl ${dark ? "text-white" : "text-ink-900"}`}>
        {title} {accent && <span className={`serif-accent ${dark ? "text-gold-400" : "text-gold-600"}`}>{accent}</span>}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-white/65" : "text-slate-600"}`}>{intro}</p>}
    </Reveal>
  );
}
