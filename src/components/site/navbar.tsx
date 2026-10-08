"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "./logo";
import { QuickExit } from "./quick-exit";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/security", label: "Security & Privacy" },
  { href: "/track", label: "Track a report" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden bg-ink-950 text-white/70 sm:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-gold-500" /> Encrypted submissions · Anonymous reporting available
          </span>
          <QuickExit />
        </div>
      </div>
      <div className={cn("transition-all duration-300",
        scrolled || open ? "bg-ink-900 shadow-md" : "bg-transparent")}>
        <nav className="container-x flex h-[88px] items-center justify-between gap-6 lg:h-[112px]">
          <Logo className="h-16 lg:h-24" />
          <ul className="hidden items-center bg-ink-900 px-2 lg:flex">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link href={l.href} className={cn("block px-4 py-3 text-[15px] font-medium transition-colors",
                    active ? "text-gold-500" : "text-white hover:text-gold-500")}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2">
            <Link href="/report" className="btn-gold hidden sm:inline-flex">Start secure report</Link>
            <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-white/15 text-white lg:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden">
              <div className="container-x flex flex-col gap-1 pb-6">
                {[...links, { href: "/report", label: "Report a violation" }].map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-xl px-3 py-3 text-lg text-white/90 hover:bg-white/5">{l.label}</Link>
                ))}
                <div className="mt-3 flex items-center gap-3"><QuickExit /><span className="text-xs text-white/50">or press Esc twice</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
