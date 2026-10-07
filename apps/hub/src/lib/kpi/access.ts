import type { AreaScope, PortalId } from "./types.ts";

/**
 * WHO SEES WHAT — the two audiences of the website's Dashboard, as the KPI sheet defines
 * them: PUBLIC (the Pre-Login KPIs, no sign-in) and OFFICER (the Post-Login KPIs as well).
 *
 * Being signed in decides the audience; the officer's ACCOUNT decides the scope
 * (instruction, 7 Oct 2026). Scope is two independent questions:
 *
 *  1. WHICH PORTALS — the Ministry sees every portal, a Division the portals of the
 *     schemes it administers, a portal's own officers that portal alone.
 *  2. WHICH AREA — All India, or locked to a state, or to a district. A locked area
 *     is a ceiling: a State Nodal Officer can narrow to a district but never widen
 *     past the state.
 *
 * Every officer sees every KPI of a portal they may see — the public KPIs and the
 * office KPIs. The citizen sees public KPIs only, at All India or one State/UT, and
 * never below: district figures are an office view.
 *
 * A PROTOTYPE'S ACCOUNTS. The Dashboard's Officer Login (`OfficerLogin`) looks the User ID
 * up here; the password is not checked, and nothing leaves the browser. The demo rail lists
 * these IDs for a reviewer. When the Dashboard is connected to an identity provider, the
 * account's scope comes from its claims instead, and the area filtering moves to the SERVER
 * so a state officer's browser never receives another state's figures.
 */

export type OfficerLevel = "ministry" | "division" | "portal" | "state" | "district";

export interface OfficerRole {
  id: string;
  /** The demo account's User ID, typed at the Officer Login. */
  userId: string;
  level: OfficerLevel;
  /** The account's name in the header and the demo account list. */
  label: string;
  /** The office, as the account menu shows it. */
  office: string;
  portals: PortalId[] | "all";
  /** The ceiling on area. Absent fields mean no ceiling at that level. */
  area: AreaScope;
}

export const OFFICER_ROLES: OfficerRole[] = [
  {
    id: "ministry", userId: "secretary.dosje", level: "ministry", label: "Ministry", office: "Office of the Secretary, DoSJE",
    portals: "all", area: {},
  },
  {
    id: "division-social-defence", userId: "sd.bureau", level: "division", label: "Social Defence Division", office: "Social Defence Bureau, DoSJE",
    portals: ["smile-beggary", "nmba"], area: {},
  },
  {
    id: "division-scheduled-castes", userId: "scd.bureau", level: "division", label: "Scheduled Castes Division", office: "Scheduled Castes Development Bureau, DoSJE",
    portals: ["shreshta", "e-utthaan"], area: {},
  },
  {
    id: "portal-smile", userId: "nisd.smile", level: "portal", label: "SMILE – Beggary Portal Administrator", office: "National Institute of Social Defence",
    portals: ["smile-beggary"], area: {},
  },
  {
    id: "state-maharashtra", userId: "smile.maharashtra", level: "state", label: "State Nodal Officer · Maharashtra", office: "SMILE – Beggary, Government of Maharashtra",
    portals: ["smile-beggary"], area: { state: "Maharashtra" },
  },
  {
    id: "district-mumbai", userId: "smile.mumbai", level: "district", label: "District Nodal Officer · Mumbai", office: "SMILE – Beggary, Mumbai",
    portals: ["smile-beggary"], area: { state: "Maharashtra", district: "Mumbai" },
  },
];

export function roleById(id: string | null | undefined): OfficerRole | undefined {
  return OFFICER_ROLES.find((r) => r.id === id);
}

/** The account a User ID signs in to, ignoring case and surrounding spaces. */
export function accountByUserId(userId: string): OfficerRole | undefined {
  const wanted = userId.trim().toLowerCase();
  return OFFICER_ROLES.find((r) => r.userId === wanted);
}

export function canSeePortal(role: OfficerRole, portal: PortalId): boolean {
  return role.portals === "all" || role.portals.includes(portal);
}

/**
 * The area a role actually reads, given what it asked for: the request, held under the
 * role's ceiling. Asking for another state returns the role's own; asking for All India
 * as a district officer returns the district.
 */
export function clampArea(role: OfficerRole, wanted: AreaScope): AreaScope {
  const { state, district } = role.area;
  if (district) return { state, district };
  if (state) return { state, district: wanted.state === state ? wanted.district : undefined };
  return wanted;
}

/** Whether a role may widen past the given area — drives whether the filter is offered. */
export function areaLocked(role: OfficerRole): { state: boolean; district: boolean } {
  return { state: Boolean(role.area.state), district: Boolean(role.area.district) };
}

/**
 * KPI COLLECTION STATUS — the tracker tab of the proforma ("KPI Status"), read
 * 5 Oct 2026. Real: this is the Department's own record of which portals have sent
 * KPIs. SCW appears in both phases of the sheet and is listed once, under Phase 1.
 */
export interface CollectionRow {
  phase: 1 | 2;
  name: string;
  received: boolean;
  /** DD.MM.YYYY where the tracker records one. */
  date?: string;
  remarks?: string;
}

export const KPI_COLLECTION_AS_ON = "05.10.2026";

export const KPI_COLLECTION: CollectionRow[] = [
  ...["DoSJE", "DAF", "BJRNF", "SCW", "NISD", "NCSK", "NCBC", "NBCFDC", "NSFDC", "NSKFDC", "DAIC", "NCSC", "DWBDNC"].map(
    (name): CollectionRow => ({ phase: 1, name, received: false }),
  ),
  { phase: 2, name: "NOS", received: false },
  { phase: 2, name: "Transgender", received: false },
  { phase: 2, name: "SMILE – Beggary", received: true, date: "24.09.2026" },
  { phase: 2, name: "NHAPOA", received: false },
  { phase: 2, name: "NMBA", received: true, date: "24.09.2026" },
  { phase: 2, name: "PM-AJAY", received: false, remarks: "GIA, Hostel, Adarsh Gram" },
  { phase: 2, name: "E-Anudaan", received: true, remarks: "SHRESHTA received; Mode 1, Mode 2, NAPDDR, SMILE and AVYAY listed" },
  { phase: 2, name: "E-Utthaan", received: true, date: "18.09.2026", remarks: "Statistics Division received; DAPSC" },
];
