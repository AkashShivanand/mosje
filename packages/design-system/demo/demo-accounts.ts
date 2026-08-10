/**
 * SAMAVESH Design System — demo-accounts registry
 *
 * DEMO-ONLY data. Maps a URL path prefix to the demo login credentials for
 * that login surface, so a single floating widget (DemoDock) can show "how
 * do I log into this portal" without every login page owning its own copy.
 *
 * Source of truth for every credential: `.claude/rules/portal-login-demos.md`
 * (the human-maintained table) and, for TG / NHAPOA, the `ADMIN_ROLES` /
 * `DEMO_CITIZEN` constants declared in each portal's own login page — see
 * `apps/hub/src/app/portals/tg/admin/login/page.tsx`,
 * `apps/hub/src/app/portals/tg/citizen/sign-in/page.tsx` and
 * `apps/hub/src/app/portals/nhapoa/login/page.tsx`. Never invent an account
 * here — transcribe it from one of those places.
 */

import type { DemoAccount } from "./demo-fab.tsx";

export interface DemoAccountSet {
  /** URL path prefix this set applies to, e.g. "/portals/nmba". */
  path: string;
  /** Column header for the account identifier (mobile, email, employee ID, …). */
  idLabel?: string;
  accounts: DemoAccount[];
}

export const DEMO_ACCOUNTS: readonly DemoAccountSet[] = [
  {
    path: "/portals/nmba",
    idLabel: "Mobile / ID",
    accounts: [
      { role: "Admin", id: "9999999999", password: "Demo@123" },
      { role: "State Nodal Officer (Maharashtra)", id: "9890123456", password: "Demo@123" },
      { role: "District Nodal Officer (Maharashtra / Pune)", id: "9890001234", password: "Demo@123" },
      { role: "Block Nodal Officer (Haveli, Pune, Maharashtra)", id: "9890005678", password: "Demo@123" },
      { role: "Line Ministry (Ministry of Education)", id: "9810007001", password: "Demo@123" },
      { role: "Spiritual Organisation (Brahma Kumaris)", id: "9810007002", password: "Demo@123" },
      { role: "Higher Education Institution (Delhi University)", id: "9810007003", password: "Demo@123" },
      { role: "GIA (Muktangan Rehabilitation Centre)", id: "9810007004", password: "Demo@123" },
    ],
  },
  {
    // Distinct from /portals/nmba above — the treatment-centre login is a
    // Project Id + OTP flow (see login-otp/page.tsx), not the admin
    // mobile-number + password form, so it needs its own account shape and
    // wins the longest-prefix match over the broader /portals/nmba entry.
    path: "/portals/nmba/treatment-centre",
    idLabel: "Project Id",
    accounts: [
      { role: "IRCA", id: "IRCA001", password: "123456" },
      { role: "ODIC", id: "ODIC001", password: "123456" },
      { role: "CPLI", id: "CPLI001", password: "123456" },
      { role: "DDAC", id: "DDAC001", password: "123456" },
      { role: "US", id: "US001", password: "123456" },
    ],
  },
  {
    path: "/portals/scw",
    idLabel: "Mobile / ID",
    // `extra` drives the login page's role-tab switch on fill — see the
    // `demo:fill` listener in apps/hub/src/app/portals/scw/login/page.tsx.
    accounts: [
      {
        role: "Volunteer (Citizen)",
        id: "9800000001",
        password: "Demo@123",
        extra: { tab: "citizen", type: "volunteer" },
      },
      {
        role: "SAGE Organisation",
        id: "9800000002",
        password: "Demo@123",
        extra: { tab: "citizen", type: "sage" },
      },
      {
        role: "Nodal Officer",
        id: "9810000001",
        password: "Demo@123",
        extra: { tab: "officer" },
      },
    ],
  },
  {
    path: "/portals/smile-admin",
    idLabel: "Mobile / ID",
    accounts: [
      { role: "Super Admin", id: "9000000900", password: "Password@123" },
      { role: "State Nodal Officer", id: "9000000901", password: "Password@123" },
      { role: "District Nodal Officer", id: "9000000902", password: "Password@123" },
    ],
  },
  {
    path: "/portals/pm-ajay",
    idLabel: "Employee ID",
    accounts: [
      { role: "Joint Secretary", id: "JS001", password: "Password@123" },
      { role: "District Secretary", id: "DS002", password: "Password@123" },
      { role: "State Officer", id: "SO003", password: "Password@123" },
      { role: "District Officer", id: "DO005", password: "Password@123" },
    ],
  },
  {
    // Distinct from /portals/tg/citizen below — TG's admin shell resolves the
    // role from the login email, per apps/hub/src/lib/tg/roles.ts.
    path: "/portals/tg/admin",
    idLabel: "Email",
    accounts: [
      { role: "Central Admin", id: "central.admin@mosje.in", password: "123456" },
      { role: "Examining Officer", id: "examining.officer@mosje.in", password: "123456" },
      { role: "Checker", id: "checker@mosje.in", password: "123456" },
      { role: "District Magistrate", id: "district.magistrate@mosje.in", password: "123456" },
    ],
  },
  {
    path: "/portals/tg/citizen",
    idLabel: "Email",
    accounts: [{ role: "Citizen (Applicant)", id: "anshul@example.com", password: "123456" }],
  },
  {
    path: "/portals/nhapoa",
    idLabel: "Username",
    accounts: [
      { role: "District Officer", id: "ba.districtofficer", password: "Demo@123" },
      { role: "Station House Officer", id: "so_govindnagar_kn", password: "Demo@123" },
      { role: "State Authority", id: "ba.stateauthority", password: "Demo@123" },
      { role: "Finance Officer", id: "ba.financeofficer", password: "Demo@123" },
      { role: "Central Authority", id: "ba.centralauthority", password: "Demo@123" },
      { role: "System Administrator", id: "nhapoa_sysadmin", password: "Demo@123" },
      { role: "Call Centre Operator", id: "ankitSharma", password: "Demo@123" },
    ],
  },
];

/**
 * Resolve the demo account set for a given pathname, matching by the longest
 * registered path prefix (so a nested login surface like /portals/tg/admin
 * wins over any broader /portals/tg entry). Returns null when no set applies.
 */
export function findDemoAccounts(pathname: string): DemoAccountSet | null {
  let best: DemoAccountSet | null = null;
  for (const set of DEMO_ACCOUNTS) {
    if (pathname === set.path || pathname.startsWith(`${set.path}/`)) {
      if (!best || set.path.length > best.path.length) best = set;
    }
  }
  return best;
}
