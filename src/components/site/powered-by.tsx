"use client";
import Image from "next/image";
import { useI18n } from "@/i18n/client";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";

/** "Powered by Global Human Rights Defence" badge, for dark or light backgrounds. */
export function PoweredBy({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { t } = useI18n();
  const dark = tone === "dark";
  return (
    <a href="https://www.ghrd.org" target="_blank" rel="noreferrer"
      className={cn("inline-flex w-fit items-center gap-3 rounded-2xl border p-2.5 pe-5 transition-colors",
        dark ? "border-white/10 bg-white/[.04] hover:border-white/25" : "border-line bg-white hover:border-ink-900/20", className)}>
      <span className="rounded-xl bg-white p-1.5 ring-1 ring-black/5">
        <Image src={img("ghrdLogo")} alt="" width={40} height={70} className="h-10 w-auto" />
      </span>
      <span className={cn("text-xs leading-snug", dark ? "text-white/60" : "text-body")}>
        {t.poweredBy.prefix}<br />
        <span className={cn("font-heading text-sm font-semibold", dark ? "text-white" : "text-ink-900")} dir="ltr">{t.poweredBy.name}</span>
      </span>
    </a>
  );
}
