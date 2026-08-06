/**
 * Admin credential rules — the half of the admin auth that has no request
 * context, split out of auth.ts so it is testable under the bare Node test
 * runner. auth.ts imports `next/headers`, which only resolves inside Next.
 *
 * Nothing here reads or writes a cookie.
 */

import { hmacToken, safeEqual } from "../hmac.ts";

export const ADMIN_COOKIE = "mosje-admin";

/** Distinct from the gate's label, so the two cookies can never be swapped. */
const ADMIN_LABEL = "mosje-hub-admin.v1";

/** 7 days — shorter than the gate's 30, because this one can change settings. */
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** False when ADMIN_PASSWORD is unset or blank; /admin 404s in that case. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
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
