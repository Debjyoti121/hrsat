"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/client";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function useSetLocale() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const set = (l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.refresh());
  };
  return { set, pending };
}

/** Header dropdown: English / Nederlands / العربية. */
export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const { set, pending } = useSetLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={t.language.choose}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-sm font-medium text-white transition hover:border-white/40">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
        <span className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
        <span className="uppercase sm:hidden">{locale}</span>
        <ChevronDown className="size-3.5 opacity-70" />
      </button>
      {open && (
        <ul role="listbox" aria-label={t.language.label}
          className="absolute end-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-line bg-white py-1 text-ink-900 shadow-[0_16px_40px_-12px_rgba(22,29,61,.35)]">
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button type="button" lang={l} dir={l === "ar" ? "rtl" : "ltr"} onClick={() => { setOpen(false); if (l !== locale) set(l); }}
                className={cn("flex w-full items-center justify-between gap-6 px-4 py-2.5 text-start text-sm hover:bg-paper-2", l === locale && "font-semibold")}>
                {LOCALE_NAMES[l]}{l === locale && <Check className="size-4 text-gold-600" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
