"use client";
import { useEffect } from "react";

const SAFE_URL = "https://www.google.com/search?q=weather";

function exit() {
  try { sessionStorage.clear(); } catch {}
  window.open(SAFE_URL, "_blank", "noopener");
  window.location.replace(SAFE_URL);
}

/** Safety shortcut: pressing Esc twice instantly leaves the site. Renders nothing. */
export function QuickExitShortcut() {
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
  return null;
}
