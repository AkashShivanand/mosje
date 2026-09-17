import {
  DIVISIONS,
  GRADES,
  type Capability,
  type ChainRoleId,
  type Division,
  type Grade,
  type RoleId,
} from "./types.ts";

export interface NavItem {
  label: string;
  href: string;
  /** Material Symbols glyph name — kept as a string so nav config stays serialisable. */
  icon: string;
}

export interface RoleDef {
  id: RoleId;
  /** Full label for the identity chip, e.g. "ASO - Programme Division". */
  label: string;
  /** Compact label for tables and badges, e.g. "ASO". */
  shortLabel: string;
  /** Mock login id. The live portal signs in by mobile number; mock auth accepts Demo@123. */
  loginId: string;
  /** Display name shown in the masthead. Fictional — the live portal shows real officers. */
  personName: string;
  home: string;
  nav: NavItem[];
  division: Division | null;
  grade: Grade | null;
  caps: readonly Capability[];
}

const BASE = "/portals/e-anudaan";

const GRADE_LABEL: Record<Grade, string> = {
  aso: "ASO",
  so: "SO",
  us: "US",
  ds: "DS",
  js: "JS",
};

/** Spelled-out grade titles, for page headings and the review screen's identity line. */
export const GRADE_FULL: Record<Grade, string> = {
  aso: "Assistant Section Officer",
  so: "Section Officer",
  us: "Under Secretary",
  ds: "Deputy Secretary",
  js: "Joint Secretary",
};

/**
 * Capability matrix. The only place the ten officer grades differ in behaviour — which is what
 * lets a single review screen serve all of them.
 *
 * ASO certifies and may raise a deficiency; SO is the only grade that communicates a deficiency
 * to the NGO; JS concurs. Sanction belongs to the Programme Director alone. [BRD §5.2–5.3 via
 * docs/specs/shreshta-mode2-portal-spec.md]
 *
 * Revised from the live DECISION captures of 16 Sep 2026 (parity inventory §21, §26, §30):
 *   - "Return to Previous" (`raiseQuery`) is on every grade above the ASO in both divisions, not
 *     only US and DS. It sends the file one level down with the officer's remark as the query.
 *   - Online inspection (BharatVC) is scheduled from the review screen by every grade above the PD
 *     ASO, every IFD grade and the Programme Director. Physical inspections stay with the PMU.
 *   - The PD Under Secretary releases funds; the PD SO and JS issue Show Cause Notices.
 */
const CAPS: Record<Division, Record<Grade, readonly Capability[]>> = {
  pd: {
    aso: ["review", "certify", "raiseDeficiency", "sanctionRegister", "forwardedRegister"],
    so: ["review", "communicateDeficiency", "raiseQuery", "scheduleInspection", "issueShowCause", "sanctionRegister", "forwardedRegister"],
    us: ["review", "raiseQuery", "scheduleInspection", "releaseFunds", "sanctionRegister", "forwardedRegister"],
    ds: ["review", "raiseQuery", "scheduleInspection", "sanctionRegister", "forwardedRegister"],
    // The bank-account change desk sits with the Joint Secretary, as on the live SM2 console.
    js: ["review", "concur", "raiseQuery", "scheduleInspection", "issueShowCause", "sanctionRegister", "forwardedRegister", "auditTrail", "approveBankChange"],
  },
  finance: {
    aso: ["review", "scheduleInspection"],
    so: ["review", "raiseQuery", "scheduleInspection"],
    us: ["review", "raiseQuery", "scheduleInspection"],
    ds: ["review", "raiseQuery", "scheduleInspection"],
    js: ["review", "concur", "raiseQuery", "scheduleInspection", "auditTrail"],
  },
};

/**
 * Programme Division nav — transcribed from the live sidebar.
 *
 * Note two things that look like bugs but are not:
 *   • The Application Explorer is the SAME shared page for every grade. The live sidebar labels
 *     it "SHRESHTA M2 — <GRADE>"; here it carries its page's own title, "All Applications", so
 *     the menu item and the heading it opens agree (screen QA, 13 Sep 2026).
 *   • "Sanctioned" also lives under the /pd/us/ path for every grade.
 * Both paths are verbatim from the live portal; see the INVENTORY's "Asymmetry" note.
 *
 * Labels are kept to what the 300px rail shows without an ellipsis — `roles.test.ts` guards it.
 */
function pdNav(grade: Grade): NavItem[] {
  const nav: NavItem[] = [
    // One queue per seat, one name for it: the item, the page heading and the review screen's "Back
    // to My Queue" agree. It read "Dashboard" over a page titled "My Action Queue" (audit O-04).
    { label: "My Queue", href: `${BASE}/dashboard/pd/${grade}`, icon: "grid_view" },
    { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
    // Each grade's own path. The live sidebar sends every grade to the Under Secretary's path, and
    // `/pd/aso/all-applications` answered 404 (verify bug 9, 16 Sep 2026).
    { label: "All Applications", href: `${BASE}/dashboard/pd/${grade}/all-applications`, icon: "folder_open" },
    { label: "Sanctioned Applications", href: `${BASE}/dashboard/pd/us/sanctioned`, icon: "verified" },
    // Live "Returned Applications": files this officer sent back. Final rejections keep their own
    // register below — the two were conflated under one "Rejected" heading (inventory §18).
    { label: "Returned Applications", href: `${BASE}/dashboard/pd/${grade}/returned`, icon: "undo" },
    { label: "Rejected Applications", href: `${BASE}/dashboard/pd/${grade}/rejected`, icon: "cancel" },
    { label: "Forwarded Applications", href: `${BASE}/dashboard/pd/forwarded`, icon: "forward" },
    // Never "PD": it also names the Programme Director, so "PD Queries" read as the Director's (O-08).
    { label: "Queries", href: `${BASE}/dashboard/pd/${grade}/queries`, icon: "help" },
    { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
  ];
  if (grade === "js") {
    nav.push({ label: "Bank Account Changes", href: `${BASE}/dashboard/sm2/bank-changes`, icon: "account_balance" });
    nav.push({ label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" });
  }
  return nav;
}

/**
 * Integrated Finance Division nav — transcribed from the live sidebar.
 *
 * The IFD is NOT a mirror of the Programme Division: it has no Sanctioned or Forwarded register.
 *
 * The live sidebar also carries "SHRESHTA M2 — IFD-<GRADE>" (/dashboard/sm2/ifd<grade>) beside the
 * dashboard. Ours rendered the same queue on both — "My Worklist" and "Finance Dashboard" — so
 * the IFD had two destinations for one list while the Programme Division had one (audit O-04). It
 * is one item, "My Queue", as in the Programme Division; `sm2/ifd<grade>` redirects to it, so a
 * link to the live-shaped address still lands. A deliberate divergence from the live sidebar.
 */
function ifdNav(grade: Grade): NavItem[] {
  const nav: NavItem[] = [
    { label: "My Queue", href: `${BASE}/dashboard/finance/${grade}`, icon: "grid_view" },
    { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
    { label: "Finance Returned", href: `${BASE}/dashboard/finance/${grade}/returned`, icon: "undo" },
    { label: "Finance Rejected", href: `${BASE}/dashboard/finance/${grade}/rejected`, icon: "cancel" },
    { label: "Finance Queries", href: `${BASE}/dashboard/finance/${grade}/queries`, icon: "help" },
    { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
  ];
  if (grade === "js") {
    nav.push({ label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" });
  }
  return nav;
}

/** Fictional officer names. The live portal shows real civil servants; none are reproduced. */
const PERSON: Record<ChainRoleId, string> = {
  "pd-aso": "Ananya Rao",
  "pd-so": "Vikram Nair",
  "pd-us": "Meera Krishnan",
  "pd-ds": "Rajat Sinha",
  "pd-js": "Sunita Deshpande",
  "finance-aso": "Imran Qureshi",
  "finance-so": "Kavita Bhatt",
  "finance-us": "Arjun Menon",
  "finance-ds": "Neha Chaturvedi",
  "finance-js": "Prakash Iyer",
};

/** Mobile numbers mirror the live dev accounts' shape; passwords are the estate's Demo@123. */
const LOGIN_ID: Record<ChainRoleId, string> = {
  "pd-aso": "9200000801",
  "pd-so": "9200000802",
  "pd-us": "9200000803",
  "pd-ds": "9200000804",
  "pd-js": "9200000810",
  "finance-aso": "9200000805",
  "finance-so": "9200000806",
  "finance-us": "9200000807",
  "finance-ds": "9200000808",
  "finance-js": "9200000809",
};

function chainRole(division: Division, grade: Grade): RoleDef {
  const id = `${division}-${grade}` as ChainRoleId;
  const divisionLabel = division === "pd" ? "Programme Division" : "Integrated Finance Division";
  return {
    id,
    // The live chip reads "ASO - Program Division"; the estate spells it "Programme".
    label: `${GRADE_LABEL[grade]} - ${divisionLabel}`,
    shortLabel: division === "pd" ? GRADE_LABEL[grade] : `${GRADE_LABEL[grade]} (IFD)`,
    loginId: LOGIN_ID[id],
    personName: PERSON[id],
    home: division === "pd" ? `${BASE}/dashboard/pd/${grade}` : `${BASE}/dashboard/finance/${grade}`,
    nav: division === "pd" ? pdNav(grade) : ifdNav(grade),
    division,
    grade,
    caps: CAPS[division][grade],
  };
}

const CHAIN_ROLES = DIVISIONS.flatMap((d) => GRADES.map((g) => chainRole(d, g)));

export const ROLES: Record<RoleId, RoleDef> = {
  ...(Object.fromEntries(CHAIN_ROLES.map((r) => [r.id, r])) as Record<ChainRoleId, RoleDef>),

  /**
   * The live Programme Director console was captured on 16 Sep 2026 (parity inventory §27–29): PD /
   * Selection, Sent, IR Repository, Audit Trail, Notifications, NGO Directory. The desk, Sent and
   * the IR Repository follow it; Sanctioned and Reports stay, being registers the Director signs.
   * "Forwarded" is gone — the Director sanctions, returns or rejects, and forwards nothing.
   */
  "programme-director": {
    id: "programme-director",
    label: "Programme Director",
    shortLabel: "PD",
    loginId: "9200000811",
    personName: "Lakshmi Venkatesan",
    home: `${BASE}/dashboard/sm2/pd`,
    division: null,
    grade: null,
    caps: ["review", "sanction", "scheduleInspection", "sanctionRegister", "auditTrail"],
    nav: [
      { label: "Sanction Desk", href: `${BASE}/dashboard/sm2/pd`, icon: "gavel" },
      { label: "Sent", href: `${BASE}/dashboard/sent`, icon: "outbox" },
      { label: "IR Repository", href: `${BASE}/dashboard/ir-repository`, icon: "inventory_2" },
      { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
      { label: "Sanctioned Applications", href: `${BASE}/dashboard/pd/us/sanctioned`, icon: "verified" },
      { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
      { label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" },
    ],
  },

  "pmu-field": {
    id: "pmu-field",
    label: "PMU Field Officer",
    shortLabel: "PMU",
    loginId: "9200000812",
    personName: "Devendra Patil",
    home: `${BASE}/dashboard/pmu/field`,
    division: null,
    grade: null,
    caps: ["inspect", "verifyLocationChange"],
    nav: [
      // The live sidebar lists only the three below; the field dashboard is the landing route
      // but carries no nav entry. Added here because a landing page you cannot navigate back
      // to is a defect, not a feature.
      { label: "Inspection Dashboard", href: `${BASE}/dashboard/pmu/field`, icon: "grid_view" },
      { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
      // Live: "SHRESHTA M2 — PMU Inspection", truncated by the rail to "PMU Inspe…".
      { label: "PMU Inspections", href: `${BASE}/dashboard/sm2/pmu`, icon: "travel_explore" },
      // Live PMU: "Institutions" (every project, never visited first) and "Project Location Change".
      { label: "Institutions", href: `${BASE}/dashboard/pmu/institutions`, icon: "domain" },
      { label: "Location Changes", href: `${BASE}/dashboard/pmu/location-changes`, icon: "edit_location" },
      { label: "IR Repository", href: `${BASE}/dashboard/ir-repository`, icon: "inventory_2" },
    ],
  },

  ngo: {
    id: "ngo",
    label: "NGO",
    shortLabel: "NGO",
    loginId: "LGN3712",
    personName: "Sankalp Seva Sansthan",
    home: `${BASE}/ngo/dashboard`,
    division: null,
    grade: null,
    caps: [],
    nav: [
      { label: "Dashboard", href: `${BASE}/ngo/dashboard`, icon: "grid_view" },
      { label: "My Applications", href: `${BASE}/ngo/my-applications`, icon: "description" },
      { label: "Deficiencies", href: `${BASE}/ngo/my-applications/deficiencies`, icon: "report" },
      // "Select Scheme" named the mechanism, not the task (review call 11 Sep 2026, T40–41).
      { label: "Apply for Grant", href: `${BASE}/apply-grant`, icon: "add_circle" },
      { label: "Project Location Change", href: `${BASE}/ngo/project-location-change`, icon: "edit_location" },
      // Accounts belong to projects, not to the NGO (T124–159).
      { label: "Project Bank Accounts", href: `${BASE}/ngo/bank-accounts`, icon: "account_balance" },
      // The roster was a tab inside Weekly Attendance, where nobody would look for it (T233–239).
      { label: "Beneficiaries & Staff", href: `${BASE}/ngo/beneficiaries`, icon: "groups" },
      // One page: the Overview (formerly "Attendance Master", which is a dashboard) and the week.
      { label: "Attendance", href: `${BASE}/ngo/attendance`, icon: "checklist" },
      { label: "CCTV Setup", href: `${BASE}/ngo/cctv`, icon: "videocam" },
    ],
  },
};

export const ALL_ROLES = Object.values(ROLES);
export const ADMIN_ROLES = ALL_ROLES.filter((r) => r.id !== "ngo");
export const OFFICER_ROLES = CHAIN_ROLES;

/** Resolve a role by its mock login id (mobile number, or LGN… for the NGO). */
export function roleByLoginId(loginId: string): RoleDef | undefined {
  const v = loginId.trim().toLowerCase();
  return ALL_ROLES.find((r) => r.loginId.toLowerCase() === v);
}

export function hasCap(role: RoleId, cap: Capability): boolean {
  return ROLES[role].caps.includes(cap);
}

/* ── Who may open which screen ─────────────────────────────────────────────── */

export type RouteAccess = "allowed" | "forbidden" | "not-found";

/**
 * The key a role's own review screens live under — `/dashboard/sm2/<key>/review/:id`. The grade
 * for the Programme Division, `jspd` for its Joint Secretary, `ifd<grade>` for Finance and `pd`
 * for the Programme Director. `null` for a role that reviews nothing.
 *
 * The one function for this key: the access table checks it and every link to a review screen
 * builds it (a second copy in `worklist-table.tsx` was merged into this one, 14 Sep 2026).
 * `route-access.test.ts` pins the shapes.
 */
export function reviewKeyOf(role: RoleDef): string | null {
  if (role.id === "programme-director") return "pd";
  if (!role.division || !role.grade) return null;
  if (role.division === "finance") return `ifd${role.grade}`;
  return role.grade === "js" ? "jspd" : role.grade;
}

const REVIEW_KEYS = new Set(ALL_ROLES.map(reviewKeyOf).filter((k): k is string => k !== null));

function isGrade(v: string | undefined): v is Grade {
  return !!v && (GRADES as readonly string[]).includes(v);
}

/**
 * May this officer open this console screen? The sidebar already showed each role only its own
 * links, but no route checked the role: the ASO could open the IFD Joint Secretary's worklist,
 * the Sanction Desk, the Audit Trail and PMU Inspections, the PMU saw All Applications, and
 * `/dashboard/pd/zzz` rendered a queue (security audit S06, 14 Sep 2026).
 *
 * Every console route is listed here with the capability or seat that may see it, derived from
 * the same `caps` and `nav` the sidebar is built from. `roles.test.ts` proves the two agree:
 * a sidebar link is allowed exactly for the roles whose sidebar carries it.
 *
 * `forbidden` is a screen that exists and belongs to another role; `not-found` is an address
 * that names no screen (an unknown grade or key). Both render a status screen in `ConsoleShell`.
 */
export function consoleRouteAccess(pathname: string, role: RoleDef): RouteAccess {
  if (role.id === "ngo") return "forbidden";
  const rel = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const seg = rel.split("/").filter(Boolean);
  const can = (cap: Capability): RouteAccess => (role.caps.includes(cap) ? "allowed" : "forbidden");
  const [area, section, a, b, ...rest] = seg;

  if (area === "finance") {
    // /finance/payment-status/:appId — a file-level screen for officers who examine files.
    return section === "payment-status" && a && !b ? can("review") : "not-found";
  }
  if (area !== "dashboard") return "not-found";

  if (section === undefined) return "allowed"; // the bare dashboard sends each role home
  if (section === "notifications" || section === "ngo-directory") return a ? "not-found" : "allowed";
  // The inspection-report repository: the PMU files the reports, the Programme Director reads them.
  if (section === "ir-repository") return a ? "not-found" : role.caps.includes("inspect") || role.caps.includes("sanction") ? "allowed" : "forbidden";
  if (section === "sent") return a ? "not-found" : can("sanction");
  // NGO 360, and beside it one project's records (CCTV compliance, staff roster, weekly attendance).
  if (section === "ngo") return a && ((b === "360" && rest.length === 0) || (b === "project" && rest.length === 1)) ? "allowed" : "not-found";

  if (section === "pmu") {
    if (b) return "not-found";
    if (a === "field" || a === "institutions") return can("inspect");
    if (a === "location-changes") return can("verifyLocationChange");
    return "not-found";
  }

  if (section === "pd") {
    if (a === "forwarded") return b ? "not-found" : can("forwardedRegister");
    if (!isGrade(a) || rest.length > 0) return "not-found";
    // The Sanction Register is shared by every grade and lives under the Under Secretary's path, as
    // on the live portal; any other grade in that position names no screen.
    if (b === "sanctioned") return a !== "us" ? "not-found" : can("sanctionRegister");
    if (b !== undefined && b !== "rejected" && b !== "returned" && b !== "queries" && b !== "all-applications") return "not-found";
    return role.division === "pd" && role.grade === a ? "allowed" : "forbidden";
  }

  if (section === "finance") {
    if (!isGrade(a) || rest.length > 0) return "not-found";
    if (b !== undefined && b !== "rejected" && b !== "returned" && b !== "queries") return "not-found";
    return role.division === "finance" && role.grade === a ? "allowed" : "forbidden";
  }

  if (section === "sm2") {
    if (a === "reports") return b ? "not-found" : can("review");
    if (a === "audit") return b ? "not-found" : can("auditTrail");
    if (a === "pmu") return b ? "not-found" : can("inspect");
    if (a === "bank-changes") return b ? "not-found" : can("approveBankChange");
    if (!a || !REVIEW_KEYS.has(a)) return "not-found";
    // `sm2/<key>` is one seat's list and `sm2/<key>/review/:id` that seat's review screen; the
    // Programme Director's desk is `sm2/pd`. An officer opens a file only under their own key.
    const own = reviewKeyOf(role) === a;
    if (b === undefined) return own ? "allowed" : "forbidden";
    if (b === "review" && rest.length === 1) return own ? "allowed" : "forbidden";
    return "not-found";
  }

  return "not-found";
}

/**
 * The organisation signed in on the applicant side. The mock register holds the signed-in NGO
 * first, as the store's notification routing already assumes.
 */
export function signedInNgoId(state: { session: RoleId | null; ngos: readonly { id: string }[] }): string | undefined {
  return state.session === "ngo" ? state.ngos[0]?.id : undefined;
}

/**
 * The application, only if it belongs to this NGO. Any other organisation's file is treated as
 * not found — the same screen as a reference that does not exist, so a guessed reference reveals
 * nothing (security audit S05: NGO-001 could open NGO-002's file and another NGO's certificate).
 */
export function ownApplication<T extends { ngoId: string }>(app: T | undefined, ngoId: string | undefined): T | undefined {
  return app && ngoId && app.ngoId === ngoId ? app : undefined;
}

export { BASE as EANUDAAN_BASE };
