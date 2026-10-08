import { desc } from "drizzle-orm";
import { Mail } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db, messages } from "@/lib/db";
import { Empty, PageHeader } from "@/components/dashboard/ui";
import { HandledToggle } from "./handled-toggle";
import { formatDate } from "@/lib/utils";

export default async function MessagesPage() {
  await requireUser("ADMIN");
  const list = await db.query.messages.findMany({ orderBy: desc(messages.createdAt), limit: 200 });
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Messages" description="Enquiries sent through the website contact form." />
      <div className="card divide-y divide-slate-100">
        {list.length === 0 && <Empty title="No messages yet" />}
        {list.map((m) => (
          <details key={m.id} className="group px-6 py-4" open={!m.handled}>
            <summary className="flex cursor-pointer list-none items-center gap-4">
              <span className={`size-2 shrink-0 rounded-full ${m.handled ? "bg-slate-200" : "bg-gold-500"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">{m.name}</span><span className="truncate text-xs text-slate-500">{m.email}</span></div>
                <div className="truncate text-sm text-slate-600">{m.subject}</div>
              </div>
              <span className="text-xs text-slate-400">{formatDate(m.createdAt, true)}</span>
            </summary>
            <div className="mt-4 ml-6 space-y-4">
              <p className="rounded-xl bg-slate-50 p-4 text-sm whitespace-pre-wrap">{m.body}</p>
              <div className="flex gap-2">
                <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`} className="btn bg-ink-900 py-1.5 text-xs text-white hover:bg-ink-800"><Mail className="size-3.5" /> Reply by email</a>
                <HandledToggle id={m.id} handled={m.handled} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
