"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
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

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cn("border-b transition-colors duration-300",
        solid ? "border-transparent bg-ink-900 shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)]" : "border-white/10 bg-transparent")}>
        <nav className="container-x flex h-20 items-center gap-8 lg:h-[92px]">
          <Logo className="h-14 lg:h-[68px]" />
          <ul className="ml-auto hidden h-full items-stretch gap-1 lg:flex">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href} className="relative flex">
                  <Link href={l.href} className={cn("flex items-center px-3.5 text-[15px] font-medium transition-colors",
                    active ? "text-white" : "text-white/75 hover:text-white")}>
                    {l.label}
                  </Link>
                  {active && <span className="absolute inset-x-3.5 bottom-0 h-[3px] rounded-t bg-gold-500" />}
                </li>
              );
            })}
          </ul>
          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <QuickExit />
            <Link href="/report" className="btn-gold hidden px-5 py-3 sm:inline-flex">
              Report a violation <ArrowRight className="size-4" />
            </Link>
            <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}
              className="grid size-11 place-items-center rounded-full border border-white/20 text-white lg:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 lg:hidden">
              <div className="container-x flex flex-col py-3">
                {[...links, { href: "/report", label: "Report a violation" }].map((l) => (
                  <Link key={l.href} href={l.href} className="border-b border-white/10 py-3.5 text-lg font-medium text-white/90 last:border-0">{l.label}</Link>
                ))}
                <p className="mt-4 pb-3 text-xs text-white/50">Tip: press Esc twice to leave this site instantly.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
