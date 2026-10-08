import "server-only";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const g = globalThis as unknown as { __hrsatDb?: ReturnType<typeof drizzle<typeof schema>> };

function make() {
  const client = createClient({
    url: process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./data/hrsat.db",
    authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined,
  });
  return drizzle(client, { schema });
}

export const db = g.__hrsatDb ?? make();
if (process.env.NODE_ENV !== "production") g.__hrsatDb = db;
export * from "./schema";
