import "server-only";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const g = globalThis as unknown as { __hrsatDb?: ReturnType<typeof drizzle<typeof schema>> };

function resolveUrl() {
  const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || "file:./data/hrsat.db";
  // Preview on Vercel without a hosted DB: copy the bundled starter database to writable /tmp.
  // Data is lost when the instance recycles — set DATABASE_URL to Turso for real use.
  if (process.env.VERCEL && url.startsWith("file:")) {
    const tmp = "/tmp/hrsat.db";
    if (!fs.existsSync(tmp)) fs.copyFileSync(path.join(process.cwd(), "seed", "hrsat.db"), tmp);
    return `file:${tmp}`;
  }
  return url;
}

function make() {
  const client = createClient({
    url: resolveUrl(),
    authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined,
  });
  return drizzle(client, { schema });
}

export const db = g.__hrsatDb ?? make();
if (process.env.NODE_ENV !== "production") g.__hrsatDb = db;
export * from "./schema";
