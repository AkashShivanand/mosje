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

import { hmacToken, safeEqual } from "./hmac.ts";
import { SETTING_GATE_TOKEN, readSetting } from "./settings/store.ts";

export { safeEqual };

export const GATE_COOKIE = "mosje-gate";

/**
 * The emblem the gate page renders.
 *
 * Exported so the page and the proxy's asset allowlist read the SAME constant.
 * They were two hand-written strings once, and the gate shipped with a broken
 * emblem: the page was changed to the white variant, the allowlist was not, and
 * every local check passed because the developer's browser already held a gate
 * cookie. Only a first-time visitor saw it. Import this on both sides.
 */
export const GATE_EMBLEM_SRC = "/images/National_Emblem_logo_white.svg";

/** Domain-separation label, so the HMAC can't be reused for another purpose. */
const GATE_LABEL = "mosje-site-gate.v1";

/** 30 days — long enough that reviewers aren't re-prompted mid-review. */
export const GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * The token an incoming cookie must match, resolved in priority order:
 *
 *   1. `gate_token` from the settings store, changed from /admin
 *   2. HMAC of `SITE_PASSWORD`, the environment-variable floor
 *   3. null — the gate is off, which is the local-dev path
 *
 * Step 2 is what makes a database outage survivable: production always has
 * SITE_PASSWORD set, so an unreachable, paused or empty store degrades to a
 * working gate rather than an open or unreachable site.
 */
export async function resolveGateToken(): Promise<string | null> {
  const stored = await readSetting(SETTING_GATE_TOKEN);
  if (stored) return stored;

  const envPassword = process.env.SITE_PASSWORD?.trim();
  if (envPassword) return gateToken(envPassword);

  return null;
}

/**
 * Derive the cookie token for a password. Not memoised — safe to call with
 * untrusted input, since a wrong guess cannot evict the hot-path cache below.
 */
export async function deriveToken(password: string): Promise<string> {
  return hmacToken(password, GATE_LABEL);
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
 * Clamp a post-unlock redirect to a same-origin path, so `?next=` cannot be
 * used as an open redirect. Rejects `//host`, `/\host` and absolute URLs.
 */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!/^\/(?![/\\])/.test(raw)) return "/";
  return raw;
}
