/**
 * Site gate — a single shared password in front of the whole deployed estate.
 *
 * Why this exists: the prototype is deployed on a Vercel Hobby plan, where
 * platform-level password protection (Advanced Deployment Protection) is a Pro
 * feature. This is the application-level equivalent, so the ministry-facing
 * prototype is not simply open to anyone who has the link.
 *
 * What it is NOT: this is a shared access wall for a prototype, not user
 * authentication. It carries no identity, no roles, no audit trail. The portal
 * logins inside (SMILE, PM-AJAY, NMBA, …) are unaffected and still apply.
 *
 * Design notes:
 *  - The cookie value is HMAC-SHA256(SITE_PASSWORD, LABEL), never the password
 *    itself, so a stolen cookie does not reveal the password.
 *  - Deriving the cookie from the password means rotating SITE_PASSWORD
 *    invalidates every outstanding cookie for free — no session store, no
 *    second signing secret to manage.
 *  - `SITE_PASSWORD` unset ⇒ the gate is disabled entirely. That keeps local
 *    dev and `npm run dev` untouched; only deployed environments set it.
 */

export const GATE_COOKIE = "mosje-gate";

/** Domain-separation label, so the HMAC can't be reused for another purpose. */
const GATE_LABEL = "mosje-site-gate.v1";

/** 30 days — long enough that reviewers aren't re-prompted mid-review. */
export const GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** The configured gate password, or null when the gate is switched off. */
export function gatePassword(): string | null {
  const password = process.env.SITE_PASSWORD?.trim();
  return password ? password : null;
}

function base64url(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Derive the cookie token for a password. Not memoised — safe to call with
 * untrusted input, since a wrong guess cannot evict the hot-path cache below.
 */
export async function deriveToken(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(GATE_LABEL),
  );
  return base64url(signature);
}

let memo: { password: string; token: string } | null = null;

/**
 * Memoised `deriveToken` for the hot path — the proxy verifies this on every
 * request, and the password does not change within a running instance.
 */
export async function gateToken(password: string): Promise<string> {
  if (memo?.password === password) return memo.token;
  const token = await deriveToken(password);
  memo = { password, token };
  return token;
}

/**
 * Length-independent comparison. Both arguments are always HMAC digests of the
 * same width, so an early length exit leaks nothing about the password.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Clamp a post-unlock redirect to a same-origin path, so `?next=` cannot be
 * used as an open redirect. Rejects `//host`, `/\host` and absolute URLs.
 */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!/^\/(?![/\\])/.test(raw)) return "/";
  return raw;
}
