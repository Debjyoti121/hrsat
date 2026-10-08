// Creates the database tables and the first admin account.
//   npm run setup          -> tables + admin
//   npm run setup:demo     -> also adds two demo reviewers and sample reports
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Minimal .env loader (no extra dependency)
for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./data/hrsat.db";
if (url.startsWith("file:")) fs.mkdirSync(path.dirname(url.replace("file:", "")), { recursive: true });
fs.mkdirSync("storage/evidence", { recursive: true });

const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined });
const now = () => Date.now();

const ddl = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'REVIEWER', title TEXT, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY, case_id TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'NEW', priority TEXT NOT NULL DEFAULT 'MEDIUM',
  anonymous INTEGER NOT NULL DEFAULT 0, reporter_name TEXT, reporter_email TEXT NOT NULL, reporter_phone TEXT,
  reporter_city TEXT, reporter_country TEXT, organization TEXT, about_whom TEXT,
  victim_name TEXT, victim_age TEXT, victim_gender TEXT, victim_nationality TEXT, victim_religion_ethnicity TEXT,
  victim_contact TEXT, relationship TEXT, violation_type TEXT NOT NULL, incident_date TEXT, incident_time TEXT,
  incident_city TEXT, incident_state TEXT, incident_postal TEXT, incident_country TEXT, description TEXT NOT NULL,
  involved TEXT, authorities_involved TEXT, authorities_detail TEXT, reported_before TEXT, reported_before_detail TEXT,
  links TEXT, has_witnesses TEXT, witness_name TEXT, witness_contact TEXT, witness_statement TEXT,
  witness_confidential INTEGER NOT NULL DEFAULT 1, comments TEXT,
  reviewer_id TEXT REFERENCES users(id) ON DELETE SET NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE, file_name TEXT NOT NULL,
  stored_as TEXT NOT NULL, mime_type TEXT NOT NULL, size INTEGER NOT NULL, sha256 TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY, report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL, action TEXT NOT NULL, detail TEXT, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
  handled INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE CASCADE, type TEXT NOT NULL, title TEXT NOT NULL,
  body TEXT NOT NULL, href TEXT, read INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reviewer ON reports(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
`;
await db.executeMultiple(ddl);
console.log("✓ Tables ready");

async function upsertUser(name, email, password, role, title) {
  const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email.toLowerCase()] });
  if (existing.rows.length) return existing.rows[0].id;
  const id = randomUUID();
  await db.execute({
    sql: "INSERT INTO users (id,name,email,password_hash,role,title,active,created_at) VALUES (?,?,?,?,?,?,1,?)",
    args: [id, name, email.toLowerCase(), await bcrypt.hash(password, 10), role, title, now()],
  });
  console.log(`✓ Created ${role.toLowerCase()} ${email}`);
  return id;
}

await upsertUser(
  process.env.ADMIN_NAME || "HRSAT Admin",
  process.env.ADMIN_EMAIL || "admin@hrsat.org",
  process.env.ADMIN_PASSWORD || "ChangeMe!2026",
  "ADMIN",
  "Platform Administrator",
);

if (process.argv.includes("--demo")) {
  const r1 = await upsertUser("Amara Okafor", "amara@hrsat.org", "Reviewer!2026", "REVIEWER", "Legal Documentation Officer");
  await upsertUser("Pieter de Vries", "pieter@hrsat.org", "Reviewer!2026", "REVIEWER", "Case Analyst");
  const count = (await db.execute("SELECT COUNT(*) AS c FROM reports")).rows[0].c;
  if (Number(count) === 0) {
    const samples = [
      ["Arbitrary Arrest or Detention", "Bangladesh", "Dhaka", "IN_REVIEW", "HIGH", r1],
      ["Religious Persecution", "Pakistan", "Lahore", "NEW", "URGENT", null],
      ["Restrictions on Freedom of Expression or Media", "India", "Kolkata", "NEEDS_INFO", "MEDIUM", r1],
      ["Human Trafficking", "Nepal", "Kathmandu", "NEW", "HIGH", null],
      ["Property Seizure, Destruction, or Forced Eviction", "Sri Lanka", "Jaffna", "VERIFIED", "MEDIUM", r1],
    ];
    let i = 0;
    for (const [type, country, city, status, priority, reviewer] of samples) {
      i++;
      const id = randomUUID();
      const t = now() - i * 86400000 * 1.7;
      await db.execute({
        sql: `INSERT INTO reports (id,case_id,status,priority,anonymous,reporter_name,reporter_email,violation_type,incident_country,incident_city,description,reviewer_id,created_at,updated_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [id, `HRS-DEMO-${String(i).padStart(4, "0")}`, status, priority, i % 2, i % 2 ? null : "Demo Reporter",
          `demo${i}@example.org`, type, country, city,
          "DEMO DATA — sample submission used to preview the dashboard. Delete before going live.",
          reviewer, t, t],
      });
      await db.execute({ sql: "INSERT INTO activities (id,report_id,action,detail,created_at) VALUES (?,?,?,?,?)",
        args: [randomUUID(), id, "SUBMITTED", "Report received via secure form", t] });
    }
    console.log("✓ Added 5 demo reports");
  }
}
console.log("Done.");
