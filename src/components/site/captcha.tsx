"use client";
import { useEffect, useState } from "react";
import type {} from "altcha/types/react";

/** "I'm not a robot" check (ALTCHA). Adds a hidden `altcha` field to the surrounding form. */
export function Captcha({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    import("altcha").then(() => setReady(true));
  }, []);
  return (
    <div className={className}>
      {ready ? (
        <altcha-widget challenge="/api/captcha" name="altcha" style={{ "--altcha-max-width": "100%" } as React.CSSProperties} />
      ) : (
        <div className="h-[66px] rounded-xl border border-line bg-paper-2/40" />
      )}
    </div>
  );
}
