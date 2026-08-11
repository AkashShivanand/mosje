/**
 * Admin credential rules — the half of the admin auth that has no request
 * context, split out of auth.ts so it is testable under the bare Node test
 * runner. auth.ts imports `next/headers`, which only resolves inside Next.
 *
 * Nothing here reads or writes a cookie.
 */

import { hmacToken, safeEqual } from "../hmac.ts";

export const ADMIN_COOKIE = "mosje-admin";

/**
 * Estate-wide, not "/admin".
 *
 * The proxy has to recognise an admin on `/portals/*` so a hidden portal stays
 * reachable to the person who hid it. A cookie scoped to /admin is simply not
 * sent on those requests, so the proxy could never see it.
 *
 * The obvious move — widen this cookie to "/" — is the wrong one. httpOnly
 * stops script READING a cookie, not the browser SENDING it: an XSS anywhere
 * in the estate would then be able to drive authenticated requests against
 * /admin, turning any portal-level bug into full settings access. The /admin
 * path scope is a real privilege boundary and it stays.
 *
 * The estate-wide cookie is `ADMIN_PREVIEW_COOKIE` below, which grants exactly
 * one thing: see past the hidden-entry block. Leaking it reveals no settings
 * access, so the blast radius matches what the feature actually needs.
 */
export const ADMIN_COOKIE_PATH = "/admin";

/**
 * Estate-wide companion cookie: "this visitor is an admin".
 *
 * Carried on every request so the proxy can wave an admin past a hidden
 * portal. It authorises nothing else — `requireAdmin` never looks at it.
 *
 * A distinct HMAC label from ADMIN_LABEL, so a preview cookie can never be
 * replayed as an admin cookie even though both derive from ADMIN_PASSWORD.
 */
export const ADMIN_PREVIEW_COOKIE = "mosje-admin-preview";
export const ADMIN_PREVIEW_COOKIE_PATH = "/";

/**
 * Paths a sign-out must clear the admin cookie from.
 *
 * "/" is here for migration, not because anything sets it: an earlier build of
 * this feature scoped ADMIN_COOKIE to "/", and a delete whose path does not
 * match the path a cookie was set with silently leaves that cookie in place.
 * Without this, anyone who signed in during that window would press "Sign out",
 * be told they were signed out, and still be signed in.
 */
export const ADMIN_COOKIE_CLEAR_PATHS = ["/admin", "/"] as const;

/** Distinct from the gate's label, so the two cookies can never be swapped. */
const ADMIN_LABEL = "mosje-hub-admin.v1";
const ADMIN_PREVIEW_LABEL = "mosje-hub-admin-preview.v1";

/** 7 days — shorter than the gate's 30, because this one can change settings. */
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** False when ADMIN_PASSWORD is unset or blank; /admin 404s in that case. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

/** The token a valid preview cookie must carry, or null when unconfigured. */
export async function expectedPreviewToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return hmacToken(password, ADMIN_PREVIEW_LABEL);
}

/** The token a valid admin cookie must carry, or null when unconfigured. */
export async function expectedAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return hmacToken(password, ADMIN_LABEL);
}

/**
 * True when `entered` is the configured admin password. Compares digests, so
 * the comparison is over two equal-width values.
 */
export async function verifyAdminPassword(entered: string): Promise<boolean> {
  const expected = await expectedAdminToken();
  if (!expected) return false;
  return safeEqual(await hmacToken(entered, ADMIN_LABEL), expected);
}
