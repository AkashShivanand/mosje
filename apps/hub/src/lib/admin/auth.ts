/**
 * Hub admin authentication — the seam Phase 2 replaces.
 *
 * Phase 1 is one shared ADMIN_PASSWORD, deliberately: no person other than the
 * maintainer has been identified as needing to change hub settings, and the
 * production system will run behind government SSO on government
 * infrastructure, so nothing built here survives into it.
 *
 * Every consumer goes through requireAdmin(). When named accounts arrive, the
 * internals of these functions change and no caller does.
 *
 * The password must be materially stronger than the site-gate password:
 * /admin is deliberately reachable without a gate cookie, because it is the
 * recovery path when the gate password is lost.
 *
 * The credential rules live in tokens.ts; this file is only the cookie half.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeEqual } from "../hmac.ts";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_CLEAR_PATHS,
  ADMIN_COOKIE_PATH,
  ADMIN_MAX_AGE_SECONDS,
  ADMIN_PREVIEW_COOKIE,
  ADMIN_PREVIEW_COOKIE_PATH,
  expectedAdminToken,
  expectedPreviewToken,
  verifyAdminPassword,
} from "./tokens.ts";

export {
  ADMIN_COOKIE,
  ADMIN_COOKIE_PATH,
  ADMIN_MAX_AGE_SECONDS,
  ADMIN_PREVIEW_COOKIE,
  adminConfigured,
} from "./tokens.ts";

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = await expectedAdminToken();
  if (!expected) return false;
  const presented = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(presented && safeEqual(presented, expected));
}

/** Redirects to the sign-in page unless the caller is an authenticated admin. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

/** Verifies a submitted password and sets the cookie. Returns false on reject. */
export async function signInAdmin(entered: string): Promise<boolean> {
  if (!(await verifyAdminPassword(entered))) return false;

  const expected = await expectedAdminToken();
  if (!expected) return false;

  const preview = await expectedPreviewToken();
  if (!preview) return false;

  const jar = await cookies();
  const shared = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: ADMIN_MAX_AGE_SECONDS,
  };

  // Settings access, scoped to /admin so an XSS elsewhere in the estate cannot
  // drive authenticated requests against it.
  jar.set(ADMIN_COOKIE, expected, { ...shared, path: ADMIN_COOKIE_PATH });
  // Estate-wide, and deliberately weaker: it only unlocks hidden entries.
  jar.set(ADMIN_PREVIEW_COOKIE, preview, {
    ...shared,
    path: ADMIN_PREVIEW_COOKIE_PATH,
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  const jar = await cookies();
  // Every path the admin cookie has ever been set with, not just the current
  // one — a delete that misses the original path leaves the cookie in the
  // browser and "sign out" silently does nothing.
  for (const path of ADMIN_COOKIE_CLEAR_PATHS) {
    jar.delete({ name: ADMIN_COOKIE, path });
  }
  jar.delete({ name: ADMIN_PREVIEW_COOKIE, path: ADMIN_PREVIEW_COOKIE_PATH });
}
