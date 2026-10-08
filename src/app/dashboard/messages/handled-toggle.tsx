"use client";
import { useTransition } from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { toggleMessageHandled } from "@/app/actions/dashboard";

export function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} onClick={() => start(async () => { await toggleMessageHandled(id); })} className="btn border border-slate-200 bg-white py-1.5 text-xs">
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : handled ? <RotateCcw className="size-3.5" /> : <Check className="size-3.5" />}
      {handled ? "Mark as open" : "Mark as handled"}
    </button>
  );
}
