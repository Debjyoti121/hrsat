import { STATUSES, PRIORITIES } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const s = STATUSES[status as keyof typeof STATUSES] ?? STATUSES.NEW;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", s.tone)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />{s.label}
    </span>
  );
}

export function PriorityLabel({ priority }: { priority: string }) {
  const p = PRIORITIES[priority as keyof typeof PRIORITIES] ?? PRIORITIES.MEDIUM;
  const bars = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 }[priority] ?? 2;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", p.tone)}>
      <span className="flex items-end gap-px">{[1, 2, 3, 4].map((i) => <span key={i} className={cn("w-[3px] rounded-sm", i <= bars ? "bg-current" : "bg-slate-200")} style={{ height: 4 + i * 2 }} />)}</span>
      {p.label}
    </span>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white", className)}
      style={{ background: `oklch(0.45 0.09 ${hue})` }} title={name}>{initials(name)}</span>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Empty({ title, text }: { title: string; text?: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400">∅</div>
      <p className="mt-4 font-medium">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}
