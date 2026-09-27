/**
 * SAMAVESH Design System — demo-accounts registry
 *
 * DEMO-ONLY data. Maps a URL path prefix to the demo login credentials for
 * that login surface, so a single floating widget (DemoDock) can show "how
 * do I log into this portal" without every login page owning its own copy.
 *
 * This file IS the source of truth; `.claude/rules/portal-login-demos.md`
 * keeps a human-readable copy. Each account is transcribed from the mock auth
 * store that checks it — `apps/hub/src/lib/{tg,nhapoa,smile-admin}/roles.ts`,
 * `apps/hub/src/lib/nmba/treatment-centre/roles.ts`,
 * `apps/hub/src/store/pm-ajay/auth-context.tsx`,
 * `apps/hub/src/components/eutthan/eutthan-shared.ts`. Never invent an account.
 *
 * `extra` is read by `PortalLoginTemplate`'s `demo:fill` handler: `tab` (a
 * role id), `mode` (an auth mode that role offers) and `subRole` (an id from
 * that role's `subRoles`). Unknown values are ignored.
 */

import type { DemoAccount } from "./demo-fab.tsx";

export interface DemoAccountSet {
  /** URL path prefix this set applies to, e.g. "/portals/nmba". */
  path: string;
  /** Column header for the account identifier (mobile, email, employee ID, …). */
  idLabel?: string;
  accounts: DemoAccount[];
}

// Row sets shared by two login routes. TG and NMBA each render ONE tabbed login
// on two paths (the default tab differs), and the dock resolves accounts by
// path — so each route lists every account its login accepts, the route's own
// tab first, and `extra.tab` moves the form to the right tab on "Use".
const NMBA_ADMIN: DemoAccount[] = [
  { role: "Admin", id: "9999999999", password: "Demo@123" },
  { role: "State Nodal Officer (Maharashtra)", id: "9890123456", password: "Demo@123" },
  { role: "District Nodal Officer (Maharashtra / Pune)", id: "9890001234", password: "Demo@123" },
  { role: "Block Nodal Officer (Haveli, Pune, Maharashtra)", id: "9890005678", password: "Demo@123" },
  { role: "Line Ministry (Ministry of Education)", id: "9810007001", password: "Demo@123" },
  { role: "Spiritual Organisation (Brahma Kumaris)", id: "9810007002", password: "Demo@123" },
  { role: "Higher Education Institution (Delhi University)", id: "9810007003", password: "Demo@123" },
  { role: "GIA (Muktangan Rehabilitation Centre)", id: "9810007004", password: "Demo@123" },
].map((a) => ({ ...a, extra: { tab: "admin" } }));

// Project Id + OTP. `password` is the demo OTP the login checks.
const NMBA_MONITORING: DemoAccount[] = [
  { role: "Patient Monitoring — IRCA", id: "IRCA001", password: "123456" },
  { role: "Patient Monitoring — ODIC", id: "ODIC001", password: "123456" },
  { role: "Patient Monitoring — CPLI", id: "CPLI001", password: "123456" },
  { role: "Patient Monitoring — DDAC", id: "DDAC001", password: "123456" },
  { role: "Patient Monitoring — US", id: "US001", password: "123456" },
].map((a) => ({ ...a, extra: { tab: "monitoring" } }));

// Email + OTP; the mock accepts any six digits, 123456 is shown.
const TG_ADMIN: DemoAccount[] = [
  { role: "Central Admin", id: "central.admin@mosje.in", password: "123456" },
  { role: "Examining Officer", id: "examining.officer@mosje.in", password: "123456" },
  { role: "Checker", id: "checker@mosje.in", password: "123456" },
  { role: "District Magistrate", id: "district.magistrate@mosje.in", password: "123456" },
].map((a) => ({ ...a, extra: { tab: "admin" } }));

const TG_CITIZEN: DemoAccount[] = [
  { role: "Citizen (Applicant)", id: "anshul@example.com", password: "123456", extra: { tab: "citizen" } },
];

export const DEMO_ACCOUNTS: readonly DemoAccountSet[] = [
  {
    // The admin login (mobile number + password), and everything else under
    // /portals/nmba. Its login also carries the Patient Monitoring tab.
    path: "/portals/nmba",
    idLabel: "Mobile / Project Id",
    accounts: [...NMBA_ADMIN, ...NMBA_MONITORING],
  },
  {
    // Wins the longest-prefix match on the treatment-centre login, which opens
    // on the Patient Monitoring tab (Project Id + OTP).
    path: "/portals/nmba/treatment-centre",
    idLabel: "Project Id / Mobile",
    accounts: [...NMBA_MONITORING, ...NMBA_ADMIN],
  },
  {
    path: "/portals/scw",
    idLabel: "Mobile / ID",
    // `tab` is a role id and `subRole` an id from that role's "Your role"
    // select — both read by PortalLoginTemplate's demo:fill handler.
    accounts: [
      {
        role: "Volunteer (Citizen)",
        id: "9800000001",
        password: "Demo@123",
        extra: { tab: "citizen", subRole: "volunteer" },
      },
      {
        role: "SAGE Organisation",
        id: "9800000002",
        password: "Demo@123",
        extra: { tab: "citizen", subRole: "sage" },
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
    // All six accounts in apps/hub/src/lib/smile-admin/roles.ts (ACCOUNTS).
    path: "/portals/smile-admin",
    idLabel: "Mobile / ID",
    accounts: [
      { role: "Super Admin", id: "9000000900", password: "Password@123" },
      { role: "Central Admin", id: "9000000901", password: "Password@123" },
      { role: "State Nodal Officer · Maharashtra", id: "9000000902", password: "Password@123" },
      { role: "District Nodal Officer · Mumbai", id: "9000000903", password: "Password@123" },
      { role: "District Nodal Officer · Pune", id: "9000000904", password: "Password@123" },
      { role: "District Nodal Officer · New Delhi", id: "9000000905", password: "Password@123" },
    ],
  },
  {
    // Every account in apps/hub/src/store/pm-ajay/auth-context.tsx, labelled
    // by each account's designation there.
    path: "/portals/pm-ajay",
    idLabel: "Employee ID",
    accounts: [
      { role: "Joint Secretary", id: "JS001", password: "Password@123" },
      { role: "Deputy Secretary", id: "DS002", password: "Password@123" },
      { role: "Section Officer · Maharashtra", id: "SO003", password: "Password@123" },
      { role: "Section Officer · Tamil Nadu", id: "SO004", password: "Password@123" },
      { role: "District Officer · Gujarat", id: "DO005", password: "Password@123" },
      /* The Adarsh Gram district officer — the live portal's AGDistrict role, whose
         twenty-seven screens the district workspace reproduces. */
      { role: "District Welfare Officer · Adarsh Gram", id: "AGDistrict", password: "Password@123" },
    ],
  },
  {
    // DEMO_CREDENTIALS in apps/hub/src/components/eutthan/eutthan-shared.ts.
    path: "/portals/eutthan-admin",
    idLabel: "User ID",
    accounts: [
      { role: "Admin", id: "9990000011", password: "admin@2026" },
      { role: "Ministry", id: "shivendra123", password: "shivendra123" },
    ],
  },
  {
    // TG's admin and citizen routes render the same tabbed login; the admin
    // role resolves from the email, per apps/hub/src/lib/tg/roles.ts.
    path: "/portals/tg/admin",
    idLabel: "Email",
    accounts: [...TG_ADMIN, ...TG_CITIZEN],
  },
  {
    path: "/portals/tg/citizen",
    idLabel: "Email",
    accounts: [...TG_CITIZEN, ...TG_ADMIN],
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
  // E-Anudaan has two audiences on ONE login (role tabs, since 2026-09-06). The
  // base entry lists every account the login page accepts; the two more
  // specific prefixes below win by longest-prefix match on the NGO surfaces,
  // where only the NGO's own account makes sense.
  //
  // These are the DEMO portal's own credentials on the estate's standard
  // Demo@123 — deliberately NOT the live dev passwords, which live only in the
  // gitignored tools/design-audit/projects/e-anudaan/secrets.json.
  {
    path: "/portals/e-anudaan",
    idLabel: "Mobile / Login ID",
    accounts: [
      { role: "NGO Applicant", id: "LGN3712", password: "Demo@123" },
      { role: "ASO — Programme Division", id: "9200000801", password: "Demo@123" },
      { role: "SO — Programme Division", id: "9200000802", password: "Demo@123" },
      { role: "US — Programme Division", id: "9200000803", password: "Demo@123" },
      { role: "DS — Programme Division", id: "9200000804", password: "Demo@123" },
      { role: "JS — Programme Division", id: "9200000810", password: "Demo@123" },
      { role: "ASO — Integrated Finance", id: "9200000805", password: "Demo@123" },
      { role: "SO — Integrated Finance", id: "9200000806", password: "Demo@123" },
      { role: "US — Integrated Finance", id: "9200000807", password: "Demo@123" },
      { role: "DS — Integrated Finance", id: "9200000808", password: "Demo@123" },
      { role: "JS — Integrated Finance", id: "9200000809", password: "Demo@123" },
      { role: "Programme Director", id: "9200000811", password: "Demo@123" },
      { role: "PMU Field Officer", id: "9200000812", password: "Demo@123" },
    ],
  },
  {
    path: "/portals/e-anudaan/ngo",
    idLabel: "Login ID",
    accounts: [{ role: "NGO Applicant", id: "LGN3712", password: "Demo@123" }],
  },
  {
    path: "/portals/e-anudaan/apply-grant",
    idLabel: "Login ID",
    accounts: [{ role: "NGO Applicant", id: "LGN3712", password: "Demo@123" }],
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

/**
 * True when `pathname` IS a login route — not merely somewhere under a
 * portal that happens to have one. Every login surface in this estate
 * resolves to a path ending in `/login`, `/login-otp` (OTP-based flows,
 * e.g. NMBA's treatment-centre login) or `/sign-in` (TG's citizen portal) —
 * see the login route list in `.claude/rules/portal-login-demos.md`. Derived
 * from the URL shape rather than an enumerated page list, so a new portal
 * that follows the same convention is recognised automatically with no
 * change here. Query string / hash / trailing slash are stripped first so
 * `/portals/nmba/admin/login/` and `/portals/nmba/admin/login?x=1` both
 * match, the same as the bare path.
 *
 * This is deliberately a narrower question than `findDemoAccounts` answers:
 * `/portals/nmba/admin/dashboard` has a demo account set (it's under the
 * `/portals/nmba` prefix) but is NOT a login route, so `isLoginRoute` returns
 * false for it even though `findDemoAccounts` returns a set.
 */
export function isLoginRoute(pathname: string): boolean {
  const clean = pathname.split(/[?#]/)[0]?.replace(/\/+$/, "") ?? "";
  return /\/(login|login-otp|sign-in)$/.test(clean);
}
