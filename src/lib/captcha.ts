import "server-only";

// Cloudflare Turnstile. Without real keys the official test secret is used, which accepts
// every token — set TURNSTILE_SECRET_KEY (and NEXT_PUBLIC_TURNSTILE_SITE_KEY) for real protection.
const TEST_SECRET = "1x0000000000000000000000000000000AA";
const secret = process.env.TURNSTILE_SECRET_KEY || TEST_SECRET;

/** Name of the hidden field Turnstile adds to the form. */
export const CAPTCHA_FIELD = "cf-turnstile-response";

/** Verifies a Turnstile token with Cloudflare (tokens are single-use and valid for 5 minutes). */
export async function verifyCaptcha(token: FormDataEntryValue | null | undefined, ip?: string) {
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "local") body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, cache: "no-store" });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
