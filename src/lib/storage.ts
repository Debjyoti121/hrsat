import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { del, get, put } from "@vercel/blob";

// Evidence files: private Vercel Blob store when deployed on Vercel (its filesystem is not
// persistent), the local `storage/evidence` folder everywhere else.
const useBlob = !!(process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN);
const DIR = path.join(process.cwd(), "storage", "evidence");
const key = (name: string) => `evidence/${path.basename(name)}`;

export async function saveEvidence(name: string, data: Buffer, contentType: string) {
  if (useBlob) {
    await put(key(name), data, { access: "private", contentType: contentType || "application/octet-stream" });
    return;
  }
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, path.basename(name)), data);
}

export async function readEvidence(name: string): Promise<Buffer | null> {
  if (useBlob) {
    const res = await get(key(name), { access: "private" }).catch(() => null);
    if (!res?.stream) return null;
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  }
  return fs.readFile(path.join(DIR, path.basename(name))).catch(() => null);
}

export async function deleteEvidence(names: string[]) {
  if (!names.length) return;
  if (useBlob) {
    await del(names.map(key)).catch(() => {});
    return;
  }
  await Promise.all(names.map((n) => fs.rm(path.join(DIR, path.basename(n)), { force: true })));
}
