import { requireUser } from "@/lib/auth";
import { reviewersWithLoad } from "@/lib/queries";
import { db, users } from "@/lib/db";
import { asc } from "drizzle-orm";
import { Avatar, PageHeader } from "@/components/dashboard/ui";
import { AddMemberForm, ToggleMember } from "./team-forms";
import { formatDate } from "@/lib/utils";

export default async function TeamPage() {
  const me = await requireUser("ADMIN");
  const [all, loads] = await Promise.all([db.query.users.findMany({ orderBy: asc(users.name) }), reviewersWithLoad()]);
  const load = new Map(loads.map((l) => [l.id, l.load]));
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Team" description="Administrators and reviewers who can access the dashboard." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3 font-medium">Member</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Open cases</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {all.map((u) => (
                <tr key={u.id} className={u.active ? "" : "opacity-50"}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3"><Avatar name={u.name} className="size-9" />
                      <div><div className="font-medium">{u.name}{u.id === me.id && <span className="ml-1.5 text-xs text-slate-400">(you)</span>}</div>
                        <div className="text-xs text-slate-500">{u.email}{u.title ? ` · ${u.title}` : ""}</div>
                        <div className="text-[11px] text-slate-400">Joined {formatDate(u.createdAt)}</div></div></div>
                  </td>
                  <td className="px-5 py-3.5"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === "ADMIN" ? "bg-ink-900 text-gold-400" : "bg-slate-100 text-slate-700"}`}>{u.role === "ADMIN" ? "Admin" : "Reviewer"}</span></td>
                  <td className="px-5 py-3.5 tabular-nums">{load.get(u.id) ?? 0}</td>
                  <td className="px-5 py-3.5 text-right">{u.id !== me.id && <ToggleMember id={u.id} active={u.active} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-6"><h2 className="font-semibold">Add team member</h2><p className="mt-1 text-xs text-slate-500">Reviewers only see cases assigned to them.</p><AddMemberForm /></div>
      </div>
    </div>
  );
}
