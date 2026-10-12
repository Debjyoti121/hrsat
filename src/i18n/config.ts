import { COUNTRY_CODES } from "./countries";
import type { Dictionary } from "./dictionaries/en";

export const LOCALES = ["en", "nl", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";

export const LOCALE_NAMES: Record<Locale, string> = { en: "English", nl: "Nederlands", ar: "العربية" };
export const isRtl = (l: Locale) => l === "ar";
export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** Replaces `{name}` placeholders with plain values. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Country <option>s: the stored value stays the English name, the label is localized. */
export function countryOptions(locale: Locale, dict: Dictionary) {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  return Object.entries(COUNTRY_CODES)
    .map(([value, code]) => ({ value, label: dict.countries[code] ?? names.of(code) ?? value }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
