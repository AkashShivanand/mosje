import type { PortalLoginConfig } from "@mosje/design-system";

/**
 * SCW sign-in — the chrome both auth pages share, and the prototype's accounts.
 *
 * The login form had no handler at all until 2026-09-15: pressing Login reloaded
 * the page. This mock lands each demo account on the dashboard that already
 * exists for it. It writes no session, because no SCW surface reads one — the
 * dashboards are open, as they were before.
 */

const BASE = "/portals/scw";

/**
 * The login and recovery pages' shared chrome, so the two cannot load their
 * marks from different roots or name the portal differently.
 */
export const SCW_LOGIN_CHROME = {
  portalId: "scw",
  portalName: "Senior Citizens Welfare",
  changeHref: "/portals",
  brandAssets: {
    emblemSrc: `${BASE}/brand/national-emblem.svg`,
    digitalIndiaSrc: `${BASE}/brand/digital-india.svg`,
    // org-logo-exempt(portal-local): SCW serves its own copy of the chrome marks
    // under /portals/scw/brand, as the portal's pages always have.
    samaveshLogoSrc: `${BASE}/brand/samavesh-logo.svg`,
  },
} satisfies Pick<PortalLoginConfig, "portalId" | "portalName" | "changeHref" | "brandAssets">;

type ScwAccount = { roleId: "citizen" | "officer"; subRoleId?: "volunteer" | "sage"; home: string };

/**
 * Transcribed from the demo registry (`packages/design-system/demo/demo-accounts.ts`,
 * `/portals/scw`) — never invented here. All three use `Demo@123`, the password
 * the registry publishes for them.
 */
const SCW_ACCOUNTS: Record<string, ScwAccount> = {
  "9800000001": { roleId: "citizen", subRoleId: "volunteer", home: `${BASE}/volunteer/dashboard` },
  "9800000002": { roleId: "citizen", subRoleId: "sage", home: `${BASE}/sage/dashboard` },
  "9810000001": { roleId: "officer", home: `${BASE}/admin/dashboard` },
};

const SCW_DEMO_PASSWORD = "Demo@123";

/**
 * Where a sign-in goes, or `null` when it fails.
 *
 * The account must be signed in on its own tab and, for a citizen, under its own
 * "Your role" — a SAGE Organisation's number entered as a Volunteer fails, as it
 * would against a real register. The caller shows one message for every failure,
 * so the form never says which part was wrong.
 */
export function scwSignIn(input: {
  roleId: string;
  subRoleId?: string;
  mobile: string;
  password: string;
}): string | null {
  const account = SCW_ACCOUNTS[input.mobile];
  if (!account || account.roleId !== input.roleId) return null;
  if (account.subRoleId && account.subRoleId !== input.subRoleId) return null;
  if (input.password !== SCW_DEMO_PASSWORD) return null;
  return account.home;
}
