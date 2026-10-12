"use client";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

// Cloudflare's always-pass test key is used until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loader: Promise<void> | null = null;
function loadTurnstile() {
  loader ??= new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT; s.async = true; s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => { loader = null; reject(new Error("Turnstile failed to load")); };
    document.head.appendChild(s);
  });
  return loader;
}

/** Resets every Turnstile widget on the page (tokens are single-use, e.g. after a failed submit). */
export function resetCaptcha() {
  window.turnstile?.reset();
}

/** Cloudflare Turnstile "verify you are human" check. Adds a hidden `cf-turnstile-response` field to the form. */
export function Captcha({ className }: { className?: string }) {
  const { locale } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let id: string | undefined;
    let cancelled = false;
    loadTurnstile().then(() => {
      if (cancelled || !ref.current || !window.turnstile) return;
      id = window.turnstile.render(ref.current, { sitekey: SITE_KEY, theme: "light", size: "flexible", "refresh-expired": "auto", language: locale });
    }).catch(() => {});
    return () => { cancelled = true; if (id) window.turnstile?.remove(id); };
  }, [locale]);
  return <div ref={ref} className={className} style={{ minHeight: 65 }} />;
}
