"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, FileStack, Globe, Inbox, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { logout } from "@/app/actions/dashboard";
import { NotificationBell } from "./notification-bell";

type Me = { name: string; email: string; role: string; title: string | null };

export function DashboardShell({ me, counts, logo, children }: { me: Me; counts: { newReports: number; openMessages: number }; logo: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin = me.role === "ADMIN";
  const nav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/reports", label: isAdmin ? "Reports" : "My cases", icon: FileStack, badge: isAdmin ? counts.newReports : 0 },
    ...(isAdmin ? [{ href: "/dashboard/messages", label: "Messages", icon: Inbox, badge: counts.openMessages }] : []),
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    ...(isAdmin ? [{ href: "/dashboard/team", label: "Team", icon: Users }] : []),
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-950 text-white">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <Image src={logo} alt="HRSAT" width={90} height={60} className="h-9 w-auto" />
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">Dashboard</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map((n) => {
          const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
              <n.icon className={cn("size-4", active && "text-gold-400")} />
              <span className="flex-1">{n.label}</span>
              {!!n.badge && <span className="rounded-full bg-gold-500 px-1.5 py-px text-[11px] font-semibold text-ink-900">{n.badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"><Globe className="size-4" /> View website</Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
          <div className="grid size-9 place-items-center rounded-full bg-gold-500 text-xs font-semibold text-ink-900">{initials(me.name)}</div>
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{me.name}</div><div className="truncate text-xs text-white/50">{isAdmin ? "Administrator" : me.title || "Reviewer"}</div></div>
          <form action={logout}><button title="Sign out" className="grid size-8 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"><LogOut className="size-4" /></button></form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72">{sidebar}</div>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white/10 text-white"><X className="size-5" /></button>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-8">
          <button onClick={() => setOpen(true)} className="grid size-9 place-items-center rounded-lg border border-slate-200 lg:hidden"><Menu className="size-4" /></button>
          <form action="/dashboard/reports" className="relative hidden max-w-md flex-1 sm:block">
            <input name="q" placeholder="Search by case ID, country, type…" className="dash-input pl-9" />
            <svg className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </form>
          <div className="ml-auto flex items-center gap-2"><NotificationBell /></div>
        </header>
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
