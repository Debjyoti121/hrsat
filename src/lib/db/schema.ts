import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date());

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["ADMIN", "REVIEWER"] }).notNull().default("REVIEWER"),
  title: text("title"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
});

export const reports = sqliteTable("reports", {
  id: id(),
  caseId: text("case_id").notNull().unique(),
  status: text("status").notNull().default("NEW"),
  priority: text("priority").notNull().default("MEDIUM"),
  anonymous: integer("anonymous", { mode: "boolean" }).notNull().default(false),
  reporterName: text("reporter_name"),
  reporterEmail: text("reporter_email").notNull(),
  reporterPhone: text("reporter_phone"),
  reporterCity: text("reporter_city"),
  reporterCountry: text("reporter_country"),
  organization: text("organization"),
  aboutWhom: text("about_whom"),
  victimName: text("victim_name"),
  victimAge: text("victim_age"),
  victimGender: text("victim_gender"),
  victimNationality: text("victim_nationality"),
  victimReligionEthnicity: text("victim_religion_ethnicity"),
  victimContact: text("victim_contact"),
  relationship: text("relationship"),
  violationType: text("violation_type").notNull(),
  incidentDate: text("incident_date"),
  incidentTime: text("incident_time"),
  incidentCity: text("incident_city"),
  incidentState: text("incident_state"),
  incidentPostal: text("incident_postal"),
  incidentCountry: text("incident_country"),
  description: text("description").notNull(),
  involved: text("involved"),
  authoritiesInvolved: text("authorities_involved"),
  authoritiesDetail: text("authorities_detail"),
  reportedBefore: text("reported_before"),
  reportedBeforeDetail: text("reported_before_detail"),
  links: text("links"),
  hasWitnesses: text("has_witnesses"),
  witnessName: text("witness_name"),
  witnessContact: text("witness_contact"),
  witnessStatement: text("witness_statement"),
  witnessConfidential: integer("witness_confidential", { mode: "boolean" }).notNull().default(true),
  comments: text("comments"),
  reviewerId: text("reviewer_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const evidence = sqliteTable("evidence", {
  id: id(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  storedAs: text("stored_as").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  sha256: text("sha256").notNull(),
  createdAt: createdAt(),
});

export const notes = sqliteTable("notes", {
  id: id(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => users.id),
  body: text("body").notNull(),
  createdAt: createdAt(),
});

export const activities = sqliteTable("activities", {
  id: id(),
  reportId: text("report_id").notNull().references(() => reports.id, { onDelete: "cascade" }),
  actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  detail: text("detail"),
  createdAt: createdAt(),
});

export const messages = sqliteTable("messages", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  handled: integer("handled", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

/** userId null = broadcast to every admin */
export const notifications = sqliteTable("notifications", {
  id: id(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  href: text("href"),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reviewer: one(users, { fields: [reports.reviewerId], references: [users.id] }),
  evidence: many(evidence),
  notes: many(notes),
  activities: many(activities),
}));
export const usersRelations = relations(users, ({ many }) => ({ assigned: many(reports) }));
export const evidenceRelations = relations(evidence, ({ one }) => ({
  report: one(reports, { fields: [evidence.reportId], references: [reports.id] }),
}));
export const notesRelations = relations(notes, ({ one }) => ({
  report: one(reports, { fields: [notes.reportId], references: [reports.id] }),
  author: one(users, { fields: [notes.authorId], references: [users.id] }),
}));
export const activitiesRelations = relations(activities, ({ one }) => ({
  report: one(reports, { fields: [activities.reportId], references: [reports.id] }),
  actor: one(users, { fields: [activities.actorId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Report = typeof reports.$inferSelect;
