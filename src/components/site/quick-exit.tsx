"use client";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

const SAFE_URL = "https://www.google.com/search?q=weather";

function exit() {
  try { sessionStorage.clear(); } catch {}
  window.open(SAFE_URL, "_blank", "noopener");
  window.location.replace(SAFE_URL);
}

/** Safety feature: instantly leaves the site (button or pressing Esc twice). */
export function QuickExit({ className = "" }: { className?: string }) {
  useEffect(() => {
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - last < 600) exit();
      last = now;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <button onClick={exit} title="Leave this site immediately (or press Esc twice)"
      className={`inline-flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 ${className}`}>
      <LogOut className="size-3.5" /> Quick exit
    </button>
  );
}
