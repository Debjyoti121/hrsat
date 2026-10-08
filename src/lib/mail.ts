import "server-only";
import nodemailer from "nodemailer";
import { PUBLIC_STATUS } from "@/lib/constants";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

let transporter: nodemailer.Transporter | null = null;
function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

/** Sends an email; never throws, so a mail outage can't lose a submission. */
export async function sendMail(to: string, subject: string, html: string) {
  const t = getTransport();
  if (!t) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n[mail:dev] (SMTP not configured — email not sent)\n`);
    return { ok: true, dev: true };
  }
  try {
    await t.sendMail({ from: process.env.MAIL_FROM || "HRSAT <no-reply@hrsat.org>", to, subject, html });
    return { ok: true };
  } catch (e) {
    console.error("[mail] failed:", e);
    return { ok: false };
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(title: string, body: string, cta?: { label: string; href: string }) {
  return `<!doctype html><html><body style="margin:0;background:#f4f2ec;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1630">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e3d8">
    <tr><td style="background:#0b1630;padding:24px 32px">
      <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.08em">HRSAT</span>
      <span style="color:#e7a33e;font-size:12px;margin-left:8px;letter-spacing:.06em">SECURE REPORTING</span>
    </td></tr>
    <tr><td style="padding:32px">
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0b1630">${title}</h1>
      <div style="font-size:15px;line-height:1.65;color:#3a4458">${body}</div>
      ${cta ? `<p style="margin:28px 0 0"><a href="${cta.href}" style="display:inline-block;background:#e7a33e;color:#0b1630;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${cta.label}</a></p>` : ""}
    </td></tr>
    <tr><td style="padding:20px 32px;background:#faf9f5;border-top:1px solid #eeeae0;font-size:12px;line-height:1.6;color:#7a8295">
      For your safety, this email never contains details of your report. If this email reached you by mistake, you can ignore it.<br/>
      HRSAT · Powered by Global Human Rights Defence · The Hague
    </td></tr>
  </table></td></tr></table></body></html>`;
}

const caseBox = (id: string) =>
  `<div style="margin:20px 0;padding:16px 20px;background:#f7f5ef;border:1px dashed #d9cfb5;border-radius:12px">
    <div style="font-size:12px;letter-spacing:.08em;color:#7a8295">YOUR CASE REFERENCE</div>
    <div style="font-size:22px;font-weight:700;letter-spacing:.04em;color:#0b1630;font-family:ui-monospace,Menlo,Consolas,monospace">${id}</div>
  </div>`;

export const mail = {
  reportReceived: (to: string, caseId: string, name?: string | null) =>
    sendMail(to, `We received your report — ${caseId}`, layout(
      `Thank you${name ? `, ${esc(name)}` : ""}. Your report is safe with us.`,
      `<p>Your submission has been received through our secure intake and is now waiting for confidential review by an authorised documentation team.</p>
       ${caseBox(caseId)}
       <p>Keep this reference private. You can use it together with this email address to check the status of your report at any time.</p>
       <p><strong>What happens next</strong><br/>1. A reviewer is assigned to your case.<br/>2. The report is reviewed with restricted access.<br/>3. If you shared contact details, we may reach out — only with your consent.</p>`,
      { label: "Track your report", href: `${SITE}/track?case=${caseId}` },
    )),

  statusUpdate: (to: string, caseId: string, status: string) =>
    sendMail(to, `Update on your report ${caseId}`, layout(
      "There is an update on your report",
      `<p>The status of your report has changed.</p>${caseBox(caseId)}
       <p>Current status: <strong>${esc(PUBLIC_STATUS[status] || status)}</strong></p>`,
      { label: "View status", href: `${SITE}/track?case=${caseId}` },
    )),

  contactReceived: (to: string, name: string) =>
    sendMail(to, "We received your message — HRSAT", layout(
      `Thanks for reaching out, ${esc(name)}.`,
      `<p>Your message has reached the HRSAT team. We usually respond within two working days.</p>
       <p>If you need to report a human rights violation, please use our secure reporting form rather than email.</p>`,
      { label: "Submit a secure report", href: `${SITE}/report` },
    )),

  teamNewReport: (caseId: string, type: string, country: string | null, id: string) =>
    process.env.TEAM_INBOX
      ? sendMail(process.env.TEAM_INBOX, `New report ${caseId}`, layout(
          "A new report needs triage",
          `${caseBox(caseId)}<p><strong>Type:</strong> ${esc(type)}<br/><strong>Country:</strong> ${esc(country || "—")}</p>`,
          { label: "Open in dashboard", href: `${SITE}/dashboard/reports/${id}` },
        ))
      : Promise.resolve(),

  reviewerAssigned: (to: string, reviewerName: string, caseId: string, id: string, by: string) =>
    sendMail(to, `You've been assigned ${caseId}`, layout(
      `${esc(reviewerName)}, a case has been assigned to you`,
      `<p>${esc(by)} assigned you as reviewer for the following case.</p>${caseBox(caseId)}
       <p>Please sign in to the HRSAT dashboard to review the submission and evidence.</p>`,
      { label: "Open case", href: `${SITE}/dashboard/reports/${id}` },
    )),

  teamNewMessage: (name: string, subject: string) =>
    process.env.TEAM_INBOX
      ? sendMail(process.env.TEAM_INBOX, `New contact message: ${subject}`, layout(
          "New message from the website",
          `<p><strong>From:</strong> ${esc(name)}<br/><strong>Subject:</strong> ${esc(subject)}</p>`,
          { label: "Open inbox", href: `${SITE}/dashboard/messages` },
        ))
      : Promise.resolve(),

  welcome: (to: string, name: string, password: string) =>
    sendMail(to, "Your HRSAT dashboard access", layout(
      `Welcome to the HRSAT review team, ${esc(name)}`,
      `<p>An account has been created for you on the HRSAT case dashboard.</p>
       <p><strong>Email:</strong> ${esc(to)}<br/><strong>Temporary password:</strong> <code>${esc(password)}</code></p>
       <p>Please sign in and change your password straight away.</p>`,
      { label: "Sign in", href: `${SITE}/login` },
    )),
};
