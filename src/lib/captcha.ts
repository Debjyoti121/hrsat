import "server-only";
import { CappedMap, create } from "altcha-lib/frameworks/nextjs";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

// ALTCHA: a self-hosted, privacy-friendly proof-of-work captcha. No third-party service,
// cookies or tracking — the visitor's browser solves a small puzzle, the server checks it.
const secret = process.env.ALTCHA_HMAC_SECRET || process.env.AUTH_SECRET || "dev-only-altcha-secret";

// Remembers solved challenges so a payload can't be replayed (per server instance).
const store = new CappedMap<string, boolean>({ maxSize: 10_000 });

const altcha = create({
  deriveKey,
  hmacSignatureSecret: secret,
  store,
  createChallengeParameters: () => ({
    algorithm: "PBKDF2/SHA-256",
    cost: 2_000,
    expiresAt: new Date(Date.now() + 30 * 60_000),
  }),
});

export const captchaChallenge = altcha.challengeHandler;

/** True when the `altcha` form field carries a valid, unexpired, unused solution. */
export async function verifyCaptcha(payload: FormDataEntryValue | null) {
  if (typeof payload !== "string" || !payload) return false;
  const { error } = await altcha.verify(payload, deriveKey, secret, undefined, store);
  return !error;
}
