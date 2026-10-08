# HRSAT — Secure Human Rights Reporting Platform

Redesigned **hrsat.org** built with **Next.js 15 (App Router)**, TypeScript, Tailwind CSS 4 and Motion,
plus a full **case-management dashboard**.

## What's inside

**Public website**
- `/` Home · `/about` · `/security` · `/contact` (contact form) · `/track` (status lookup)
- `/report` — 6-step secure report wizard (all original hrsat.org fields), anonymous mode,
  drag-and-drop evidence upload (4 files × 25 MB), related links, witness section, declarations
- **Quick exit**: pressing `Esc` twice leaves the site instantly — a standard safety feature for reporting sites
- Old WordPress URLs (`/report-violation`, `/about-me`, `/contact-us`, `/security-and-privacy`) redirect automatically

**When someone submits the report form**
1. The report is saved with a private case reference (e.g. `HRS-2026-K7Q2MX`)
2. Evidence files are stored outside the public folder and fingerprinted with SHA-256
3. The reporter gets a confirmation email with the case reference (no sensitive details in the email)
4. The team inbox gets an alert email, and every admin gets a **live dashboard notification**

**Dashboard** (`/dashboard`, sign in at `/login`)
- Overview: KPIs, 14-day submissions chart, status pipeline, "needs a reviewer" queue, reviewer workload
- Reports: tabs by status, search, priority/reviewer filters, pagination, **assign a reviewer inline**
- Case page: full submission, evidence viewer/download with hashes, **assign reviewer**, status workflow
  (New → In review → Needs info → Verified → Closed) with optional email to the reporter, priority,
  internal notes, activity timeline, delete
- Notification bell (polls every 15 s, toast pop-ups for new items) + notifications page
- Messages inbox for the contact form, Team management (add admins/reviewers, invite email, deactivate), Settings
- Roles: **Admin** sees everything and assigns; **Reviewer** only sees cases assigned to them.
  Assigned reviewers receive an email + notification.

## Run it on your computer (Windows)

Requires **Node.js 18.18+** (LTS 20 or 22 recommended) — https://nodejs.org

Open a terminal (PowerShell) in this folder and run:

```powershell
npm install
copy .env.example .env      # skip if .env already exists
npm run setup               # creates the database + first admin account
npm run dev
```

Open http://localhost:3000 for the website and http://localhost:3000/login for the dashboard.

Default admin (change it in `.env` **before** running setup, or change the password in Settings):
- Email: `admin@hrsat.org`
- Password: `ChangeMe!2026`

Want sample data to explore the dashboard? Run `npm run setup:demo` instead — it adds 2 demo reviewers
(`amara@hrsat.org` / `pieter@hrsat.org`, password `Reviewer!2026`) and 5 demo reports.
Delete `data/hrsat.db` and run `npm run setup` again to start clean.

## Images

Images are loaded from the existing hrsat.org server. To keep local copies (recommended before the old
WordPress site is switched off):

```powershell
npm run images:download
```

then set `NEXT_PUBLIC_LOCAL_IMAGES="true"` in `.env` and restart.

## Email (SMTP)

Without SMTP settings, emails are printed in the terminal (handy for testing). To send real emails fill in
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` and `TEAM_INBOX` in `.env`.
Examples: Gmail (`smtp.gmail.com`, port 465, `SMTP_SECURE="true"`, an App Password), Brevo, SendGrid, Zoho, Outlook.

## Deploying

- **VPS / Windows server / Hostinger VPS:** `npm run build` then `npm start` (behind Nginx/IIS with HTTPS).
  The `data/` (database) and `storage/` (evidence) folders must be kept and backed up.
- **Vercel / serverless:** use a hosted libSQL database (Turso) via `DATABASE_URL` + `DATABASE_AUTH_TOKEN`,
  and move evidence storage to S3/R2 (serverless file systems are not persistent).
- Always set a long random `AUTH_SECRET` and serve over HTTPS.

## Project structure

```
src/app/(site)/        public pages (home, about, security, contact, report, track)
src/app/dashboard/     dashboard pages
src/app/login/         team sign-in
src/app/api/           report submission, contact, notifications, evidence download
src/app/actions/       server actions (login, assign, status, notes, team…)
src/components/        site + dashboard UI components
src/lib/               db schema (Drizzle), auth, email templates, constants
scripts/               setup-db.mjs, download-images.mjs
```
