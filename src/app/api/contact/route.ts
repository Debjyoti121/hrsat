import { NextResponse } from "next/server";
import { z } from "zod";
import { db, messages } from "@/lib/db";
import { mail } from "@/lib/mail";
import { notify } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(120),
  body: z.string().trim().min(5).max(5000),
  company: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  if (!rateLimit("contact:" + clientIp(req.headers), 5, 10 * 60_000))
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  const d = parsed.data;
  if (d.company) return NextResponse.json({ ok: true }); // bot

  await db.insert(messages).values({ name: d.name, email: d.email.toLowerCase(), subject: d.subject, body: d.body });
  await notify({ type: "NEW_MESSAGE", title: "New contact message", body: `${d.name} · ${d.subject}`, href: "/dashboard/messages" });
  await Promise.all([mail.contactReceived(d.email, d.name), mail.teamNewMessage(d.name, d.subject)]);
  return NextResponse.json({ ok: true });
}
