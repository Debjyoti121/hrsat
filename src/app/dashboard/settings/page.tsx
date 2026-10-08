import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/dashboard/ui";
import { PasswordForm } from "./password-form";

export default async function SettingsPage() {
  const me = await requireUser();
  const smtp = !!process.env.SMTP_HOST;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Your account and platform configuration." />
      <div className="card p-6">
        <h2 className="font-semibold">Profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Name</dt><dd className="font-medium">{me.name}</dd></div>
          <div><dt className="text-slate-500">Email</dt><dd className="font-medium">{me.email}</dd></div>
          <div><dt className="text-slate-500">Role</dt><dd className="font-medium">{me.role === "ADMIN" ? "Administrator" : "Reviewer"}</dd></div>
          <div><dt className="text-slate-500">Title</dt><dd className="font-medium">{me.title || "—"}</dd></div>
        </dl>
      </div>
      <div className="card p-6"><h2 className="font-semibold">Change password</h2><PasswordForm /></div>
      {me.role === "ADMIN" && (
        <div className="card p-6">
          <h2 className="font-semibold">Email delivery</h2>
          <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${smtp ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
            <span className={`size-1.5 rounded-full ${smtp ? "bg-emerald-500" : "bg-amber-500"}`} />
            {smtp ? `SMTP connected (${process.env.SMTP_HOST})` : "SMTP not configured — emails are printed to the server console"}
          </p>
          <p className="mt-3 text-sm text-slate-500">Configure <code className="rounded bg-slate-100 px-1">SMTP_*</code> variables in <code className="rounded bg-slate-100 px-1">.env</code> and restart the server.</p>
        </div>
      )}
    </div>
  );
}
