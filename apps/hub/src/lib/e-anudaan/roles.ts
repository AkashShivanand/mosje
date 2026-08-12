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
  /** Full label for the identity chip, e.g. "ASO - Program Division" (live portal's wording). */
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
 * to the NGO; US and DS raise queries that push the file back down; JS concurs. Sanction belongs
 * to the Programme Director alone. [BRD §5.2–5.3 via docs/specs/shreshta-mode2-portal-spec.md]
 */
const CAPS: Record<Division, Record<Grade, readonly Capability[]>> = {
  pd: {
    aso: ["review", "raiseDeficiency", "sanctionRegister", "forwardedRegister"],
    so: ["review", "communicateDeficiency", "sanctionRegister", "forwardedRegister"],
    us: ["review", "raiseQuery", "sanctionRegister", "forwardedRegister"],
    ds: ["review", "raiseQuery", "sanctionRegister", "forwardedRegister"],
    js: ["review", "concur", "sanctionRegister", "forwardedRegister", "auditTrail"],
  },
  finance: {
    aso: ["review"],
    so: ["review"],
    us: ["review", "raiseQuery"],
    ds: ["review", "raiseQuery"],
    js: ["review", "concur", "auditTrail"],
  },
};

/**
 * Programme Division nav — transcribed from the live sidebar.
 *
 * Note two things that look like bugs but are not:
 *   • "SHRESHTA M2 — <GRADE>" points at the SAME shared Application Explorer for every grade.
 *   • "Sanctioned" also lives under the /pd/us/ path for every grade.
 * Both are verbatim from the live portal; see the INVENTORY's "Asymmetry" note.
 */
function pdNav(grade: Grade): NavItem[] {
  const nav: NavItem[] = [
    { label: "Dashboard", href: `${BASE}/dashboard/pd/${grade}`, icon: "grid_view" },
    { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
    { label: `SHRESHTA M2 — ${GRADE_LABEL[grade]}`, href: `${BASE}/dashboard/pd/us/all-applications`, icon: "folder_open" },
    { label: "Sanctioned Applications", href: `${BASE}/dashboard/pd/us/sanctioned`, icon: "verified" },
    { label: "Rejected Applications", href: `${BASE}/dashboard/pd/${grade}/rejected`, icon: "cancel" },
    { label: "Forwarded Applications", href: `${BASE}/dashboard/pd/forwarded`, icon: "forward" },
    { label: "PD Queries", href: `${BASE}/dashboard/pd/${grade}/queries`, icon: "help" },
    { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
  ];
  if (grade === "js") {
    nav.push({ label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" });
  }
  nav.push({ label: "Notifications", href: `${BASE}/dashboard/notifications`, icon: "notifications" });
  return nav;
}

/**
 * Integrated Finance Division nav — transcribed from the live sidebar.
 *
 * The IFD is NOT a mirror of the PD: it has no Sanctioned or Forwarded register, and its
 * review worklist lives on a different path shape (/dashboard/sm2/ifd<grade>) from its
 * dashboard (/dashboard/finance/<grade>, a payment-processing queue).
 */
function ifdNav(grade: Grade): NavItem[] {
  const scheme = grade === "js" ? "JS-IFD" : `IFD-${GRADE_LABEL[grade]}`;
  const nav: NavItem[] = [
    { label: "Finance Dashboard", href: `${BASE}/dashboard/finance/${grade}`, icon: "account_balance" },
    { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
    { label: "Finance Rejected", href: `${BASE}/dashboard/finance/${grade}/rejected`, icon: "cancel" },
    { label: "Finance Queries", href: `${BASE}/dashboard/finance/${grade}/queries`, icon: "help" },
    { label: `SHRESHTA M2 — ${scheme}`, href: `${BASE}/dashboard/sm2/ifd${grade}`, icon: "folder_open" },
    { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
  ];
  if (grade === "js") {
    nav.push({ label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" });
  }
  nav.push({ label: "Notifications", href: `${BASE}/dashboard/notifications`, icon: "notifications" });
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
  const divisionLabel = division === "pd" ? "Program Division" : "Integrated Finance Division";
  return {
    id,
    // "ASO - Program Division" is the live portal's own wording in the masthead chip.
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
   * INFERRED — the live Programme Director console could not be captured (its landing route
   * crashes the browser renderer). Nav and capabilities come from the BRD, not observation.
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
    caps: ["review", "sanction", "sanctionRegister", "forwardedRegister", "auditTrail"],
    nav: [
      { label: "Sanction Desk", href: `${BASE}/dashboard/sm2/pd`, icon: "gavel" },
      { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
      { label: "Sanctioned Applications", href: `${BASE}/dashboard/pd/us/sanctioned`, icon: "verified" },
      { label: "Forwarded Applications", href: `${BASE}/dashboard/pd/forwarded`, icon: "forward" },
      { label: "Reports & Analytics", href: `${BASE}/dashboard/sm2/reports`, icon: "bar_chart" },
      { label: "Audit Trail", href: `${BASE}/dashboard/sm2/audit`, icon: "history" },
      { label: "Notifications", href: `${BASE}/dashboard/notifications`, icon: "notifications" },
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
    caps: ["inspect"],
    nav: [
      // The live sidebar lists only the three below; the field dashboard is the landing route
      // but carries no nav entry. Added here because a landing page you cannot navigate back
      // to is a defect, not a feature.
      { label: "Inspection Dashboard", href: `${BASE}/dashboard/pmu/field`, icon: "grid_view" },
      { label: "NGO Directory", href: `${BASE}/dashboard/ngo-directory`, icon: "corporate_fare" },
      { label: "SHRESHTA M2 — PMU Inspection", href: `${BASE}/dashboard/sm2/pmu`, icon: "travel_explore" },
      { label: "Notifications", href: `${BASE}/dashboard/notifications`, icon: "notifications" },
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
      { label: "Select Scheme", href: `${BASE}/apply-grant`, icon: "add_circle" },
      { label: "Project Location Change", href: `${BASE}/ngo/project-location-change`, icon: "edit_location" },
      { label: "My Bank Accounts", href: `${BASE}/ngo/bank-accounts`, icon: "account_balance" },
      { label: "Notifications", href: `${BASE}/ngo/notifications`, icon: "notifications" },
      { label: "Weekly Attendance", href: `${BASE}/ngo/attendance`, icon: "checklist" },
      { label: "Attendance Master", href: `${BASE}/ngo/attendance-master`, icon: "calendar_month" },
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

export { BASE as EANUDAAN_BASE };
