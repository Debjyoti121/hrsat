import { captchaChallenge } from "@/lib/captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Issues a new ALTCHA proof-of-work challenge for the report and contact forms. */
export const GET = captchaChallenge;
