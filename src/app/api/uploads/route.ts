import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createUploadTargets, directUploads } from "@/lib/storage";
import { ALLOWED_EVIDENCE, MAX_EVIDENCE_BYTES, MAX_EVIDENCE_FILES } from "@/lib/constants";

export const runtime = "nodejs";

const schema = z.object({
  files: z.array(z.object({
    name: z.string().min(1).max(300),
    type: z.string().max(200),
    size: z.number().int().positive(),
  })).min(1).max(MAX_EVIDENCE_FILES),
});

/**
 * Step 1 of a report with evidence: returns one-time signed URLs so the browser can upload
 * files straight to private storage. `{ direct: false }` means "send the files with the form".
 */
export async function POST(req: Request) {
  if (!directUploads()) return NextResponse.json({ direct: false });
  if (!rateLimit("uploads:" + clientIp(req.headers), 30, 30 * 60_000))
    return NextResponse.json({ error: "Too many uploads from this connection. Please try again later." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: `You can attach up to ${MAX_EVIDENCE_FILES} files.` }, { status: 400 });
  for (const f of parsed.data.files) {
    if (f.size > MAX_EVIDENCE_BYTES) return NextResponse.json({ error: `${f.name} is larger than 25 MB.` }, { status: 400 });
    if (!ALLOWED_EVIDENCE.test(f.type)) return NextResponse.json({ error: `${f.name}: file type not accepted.` }, { status: 400 });
  }
  try {
    const targets = await createUploadTargets(parsed.data.files.map((f) => f.name));
    return NextResponse.json({ direct: true, targets });
  } catch {
    return NextResponse.json({ error: "Could not prepare the upload. Please try again." }, { status: 502 });
  }
}
