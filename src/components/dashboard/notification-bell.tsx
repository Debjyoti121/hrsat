"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Bell, CheckCheck, FileWarning, Inbox, MessageSquareText, UserPlus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";

type N = { id: string; type: string; title: string; body: string; href: string | null; read: boolean; createdAt: string };
const ICONS: Record<string, typeof Bell> = { NEW_REPORT: FileWarning, ASSIGNED: UserPlus, NEW_MESSAGE: Inbox, NOTE: MessageSquareText, STATUS: RefreshCcw };

export function NotificationBell() {
  const [items, setItems] = useState<N[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const seen = useRef<Set<string> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications", { cache: "no-store" }).catch(() => null);
    if (!res?.ok) return;
    const data = (await res.json()) as { items: N[]; unread: number };
    // Toast genuinely new notifications (not on first load)
    if (seen.current) {
      const fresh = data.items.filter((n) => !seen.current!.has(n.id) && !n.read);
      fresh.slice(0, 3).forEach((n) => toast(n.title, { description: n.body, action: n.href ? { label: "Open", onClick: () => router.push(n.href!) } : undefined }));
      if (fresh.length) router.refresh();
    }
    seen.current = new Set(data.items.map((n) => n.id));
    setItems(data.items);
    setUnread(data.unread);
  }, [router]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [load]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function markRead(ids?: string[]) {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
    load();
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50">
        <Bell className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">{unread > 99 ? "99+" : unread}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              <button onClick={() => markRead()} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900"><CheckCheck className="size-3.5" /> Mark all read</button>
            </div>
            <ul className="max-h-[420px] overflow-y-auto">
              {items.length === 0 && <li className="px-4 py-10 text-center text-sm text-slate-500">You&apos;re all caught up.</li>}
              {items.map((n) => {
                const Icon = ICONS[n.type] ?? Bell;
                const inner = (
                  <div className={cn("flex gap-3 px-4 py-3 transition hover:bg-slate-50", !n.read && "bg-gold-500/[.05]")}>
                    <div className={cn("grid size-8 shrink-0 place-items-center rounded-full", n.read ? "bg-slate-100 text-slate-500" : "bg-ink-900 text-gold-400")}><Icon className="size-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2"><p className="flex-1 text-sm font-medium leading-snug">{n.title}</p>{!n.read && <span className="mt-1.5 size-2 rounded-full bg-gold-500" />}</div>
                      <p className="truncate text-xs text-slate-500">{n.body}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id} className="border-b border-slate-50 last:border-0">
                    {n.href ? <Link href={n.href} onClick={() => { setOpen(false); if (!n.read) markRead([n.id]); }}>{inner}</Link> : inner}
                  </li>
                );
              })}
            </ul>
            <Link href="/dashboard/notifications" onClick={() => setOpen(false)} className="block border-t border-slate-100 px-4 py-2.5 text-center text-xs font-medium text-slate-600 hover:bg-slate-50">View all</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
