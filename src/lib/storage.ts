import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Evidence files live in a private Supabase Storage bucket when Supabase is configured
// (production on Vercel), otherwise in the local `storage/evidence` folder.
// With Supabase, browsers upload straight to the bucket through one-time signed URLs,
// so files never pass through the Vercel function (which caps request bodies at 4.5 MB).

const BUCKET = "evidence";
const SB_URL = process.env.SB_SUPABASE_URL || process.env.SUPABASE_URL || process.env.SB_NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SB_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SB_SUPABASE_SECRET_KEY;
const DIR = path.join(process.cwd(), "storage", "evidence");
/** Object paths issued by createUploadTargets — anything else is rejected. */
export const UPLOAD_PATH = /^incoming\/[0-9a-f-]{36}(\.[a-z0-9]{1,9})?$/;

let client: SupabaseClient | null = null;
function sb() {
  if (!SB_URL || !SB_KEY) return null;
  client ??= createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  return client.storage.from(BUCKET);
}

export const directUploads = () => !!sb();

const safeExt = (name: string) => path.extname(name).slice(0, 10).toLowerCase().replace(/[^.a-z0-9]/g, "");

/** One signed upload URL per file (valid for 2 hours, single object, no overwrite). */
export async function createUploadTargets(names: string[]) {
  const bucket = sb();
  if (!bucket) return null;
  return Promise.all(names.map(async (name) => {
    const objectPath = `incoming/${randomUUID()}${safeExt(name)}`;
    const { data, error } = await bucket.createSignedUploadUrl(objectPath);
    if (error || !data) throw new Error(error?.message || "Could not prepare upload");
    return { path: objectPath, url: data.signedUrl };
  }));
}

/** Local/inline mode: store a file that arrived in the form body. Returns its storage name. */
export async function saveEvidence(originalName: string, data: Buffer, contentType: string) {
  const bucket = sb();
  if (bucket) {
    const objectPath = `incoming/${randomUUID()}${safeExt(originalName)}`;
    const { error } = await bucket.upload(objectPath, data, { contentType: contentType || "application/octet-stream" });
    if (error) throw new Error(error.message);
    return objectPath;
  }
  const name = `${randomUUID()}${safeExt(originalName)}`;
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, name), data);
  return name;
}

export async function readEvidence(storedAs: string): Promise<Buffer | null> {
  const bucket = sb();
  if (bucket) {
    if (!UPLOAD_PATH.test(storedAs)) return null;
    const { data, error } = await bucket.download(storedAs);
    if (error || !data) return null;
    return Buffer.from(await data.arrayBuffer());
  }
  return fs.readFile(path.join(DIR, path.basename(storedAs))).catch(() => null);
}

export async function deleteEvidence(names: string[]) {
  if (!names.length) return;
  const bucket = sb();
  if (bucket) {
    await bucket.remove(names.filter((n) => UPLOAD_PATH.test(n))).catch(() => {});
    return;
  }
  await Promise.all(names.map((n) => fs.rm(path.join(DIR, path.basename(n)), { force: true })));
}
