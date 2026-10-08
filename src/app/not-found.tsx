import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ink-900 px-6 text-center text-white">
      <div>
        <p className="font-mono text-sm text-gold-400">404</p>
        <h1 className="display mt-4 text-5xl">This page <span className="serif-accent text-gold-400">doesn&apos;t exist.</span></h1>
        <p className="mt-4 text-white/60">The link may be broken, or the page may have moved during our website update.</p>
        <div className="mt-8 flex justify-center gap-3"><Link href="/" className="btn-gold">Go home</Link><Link href="/report" className="btn-ghost-light">Report a violation</Link></div>
      </div>
    </div>
  );
}
