import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";
import { img } from "@/lib/images";

export const metadata: Metadata = { title: "Team sign-in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Image src={img("conference")} alt="" fill className="object-cover opacity-20" sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/70 to-ink-950" />
        <Link href="/" className="relative"><Image src={img("logo")} alt="HRSAT" width={180} height={120} className="h-14 w-auto" /></Link>
        <div className="relative max-w-md">
          <h1 className="display text-5xl leading-[1.02]">Case review, done with care.</h1>
          <p className="mt-5 text-white/65">The HRSAT dashboard is restricted to authorised documentation teams. All access is logged.</p>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-white/50"><ShieldCheck className="size-4 text-gold-500" /> Signed sessions · role-based access · audit trail</div>
      </div>
      <div className="flex flex-col justify-center bg-paper px-6 py-16 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-ink-900"><ArrowLeft className="size-4" /> Back to website</Link>
          <h2 className="mt-10 text-3xl font-semibold tracking-tight">Sign in</h2>
          <p className="mt-2 text-slate-600">Access the HRSAT case dashboard.</p>
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
