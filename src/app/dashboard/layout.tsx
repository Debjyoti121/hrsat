import { and, count, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth";
import { db, messages, reports } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/shell";
import { img } from "@/lib/images";

export const metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser();
  const [[r], [m]] = await Promise.all([
    db.select({ c: count() }).from(reports).where(eq(reports.status, "NEW")),
    db.select({ c: count() }).from(messages).where(and(eq(messages.handled, false))),
  ]);
  return (
    <DashboardShell me={{ name: me.name, email: me.email, role: me.role, title: me.title }}
      counts={{ newReports: r?.c ?? 0, openMessages: m?.c ?? 0 }} logo={img("logo")}>
      {children}
    </DashboardShell>
  );
}
