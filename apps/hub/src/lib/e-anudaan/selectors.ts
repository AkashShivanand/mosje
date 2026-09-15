/**
 * Derived views over the store. Pure functions, so the screens stay declarative and the
 * numbers on the dashboard cannot drift from the rows in the table beneath them.
 */

import { ROLES, type RoleDef } from "./roles.ts";
import type { AppStatus, AuditEntry, Division, EAnudaanState, GrantApplication, RoleId } from "./types.ts";
import { holderIsRole } from "./types.ts";
import { rupeesShort } from "./format.ts";

/** Everything currently sitting in this role's in-tray. */
export function worklistFor(state: EAnudaanState, roleId: RoleId): GrantApplication[] {
  return state.applications
    .filter((a) => holderIsRole(a.holder, roleId))
    .sort((a, b) => b.ageingDays - a.ageingDays);
}

/**
 * The rework list behind BOTH the dashboard's "Returned for Rework" figure and the PD / Finance
 * Queries screen — one expression, so the tile and the list cannot disagree.
 *
 * A file belongs here while it is unresolved and this officer is on either end of it:
 *   • it sits with them, returned for rework (a query pushed down to them, or a Programme
 *     Director return to PD:ASO); or
 *   • they raised the query that sent it down, and it has not come back yet.
 *
 * It used to be two expressions: the dashboard counted only the first case and the list only a
 * `QueryRaised` status, so PD:ASO saw "2" over an empty list and PD:US "0" over a list of two.
 */
export function queriesFor(state: EAnudaanState, roleId: RoleId): GrantApplication[] {
  return state.applications
    .filter((a) => {
      const rework = a.status === "QueryRaised" || a.status === "Returned";
      if (!rework) return false;
      if (holderIsRole(a.holder, roleId)) return true;
      return a.status === "QueryRaised" && a.queries.some((q) => q.raisedBy === roleId && !q.resolvedAt);
    })
    .sort((a, b) => b.ageingDays - a.ageingDays);
}

/** The division an officer's decision is recorded against. The Programme Director sits with the PD. */
export function divisionOfRole(roleId: RoleId): Division | null {
  if (roleId.startsWith("pd-") || roleId === "programme-director") return "pd";
  if (roleId.startsWith("finance-")) return "finance";
  return null;
}

/** The audit entry that closed a rejected file, if it was rejected. */
export function rejectionOf(app: GrantApplication): AuditEntry | undefined {
  if (app.status !== "Rejected") return undefined;
  return [...app.audit].reverse().find((e) => e.action === "reject");
}

/**
 * Files a division rejected. Scoped to the division that took the decision, so the Programme
 * Division's register and the Finance Division's register never credit each other's decisions.
 *
 * A Programme Director RETURN is not a rejection: the file goes back to PD:ASO and climbs again,
 * so it is on that officer's rework list (`queriesFor`), not here.
 */
export function rejectedFor(state: EAnudaanState, division: Division): GrantApplication[] {
  return state.applications
    .filter((a) => {
      const entry = rejectionOf(a);
      return !!entry && divisionOfRole(entry.byRole) === division;
    })
    .sort((a, b) => (rejectionOf(b)?.at ?? "").localeCompare(rejectionOf(a)?.at ?? ""));
}

export function forwardedFor(state: EAnudaanState, roleId: RoleId): GrantApplication[] {
  return state.applications.filter((a) => a.audit.some((e) => e.byRole === roleId && e.action === "forward"));
}

/** Every application in the scheme, whatever stage it has reached — the Application Explorer. */
export function allApplications(state: EAnudaanState): GrantApplication[] {
  return [...state.applications].sort((a, b) => b.ageingDays - a.ageingDays);
}

export function sanctionedApps(state: EAnudaanState): GrantApplication[] {
  return state.applications.filter((a) => a.sanction);
}

export function ngoApplications(state: EAnudaanState, ngoId: string): GrantApplication[] {
  return state.applications.filter((a) => a.ngoId === ngoId);
}

export interface Kpis {
  awaiting: number;
  /** Total requested across the queue, in rupees. */
  grantSought: number;
  schemes: number;
  overdue: number;
  ageing: { band: string; count: number }[];
  byScheme: { scheme: string; count: number }[];
}

/**
 * The four KPI cards + two panels on "My Action Queue".
 * Labels and the >7-day threshold are transcribed from the live dashboard.
 */
export function kpisFor(state: EAnudaanState, roleId: RoleId): Kpis {
  const queue = worklistFor(state, roleId);
  const bands = [
    { band: "0–3 days", count: queue.filter((a) => a.ageingDays <= 3).length },
    { band: "4–7 days", count: queue.filter((a) => a.ageingDays > 3 && a.ageingDays <= 7).length },
    { band: "Over 7 days", count: queue.filter((a) => a.ageingDays > 7).length },
  ];
  const schemeCounts = new Map<string, number>();
  for (const a of queue) schemeCounts.set(a.schemeCode, (schemeCounts.get(a.schemeCode) ?? 0) + 1);
  return {
    awaiting: queue.length,
    grantSought: queue.reduce((s, a) => s + a.total, 0),
    schemes: schemeCounts.size,
    overdue: bands[2]!.count,
    ageing: bands,
    byScheme: [...schemeCounts.entries()].map(([scheme, count]) => ({ scheme, count })),
  };
}

/** Indian-format currency, abbreviated the way the live portal does it (₹888.31 Cr, ₹10.00 L). */
export function formatGrant(amount: number): string {
  return rupeesShort(amount);
}

// Re-exported so the many callers that import it from here keep working, while there remains
// exactly one implementation (design audit M8).
export { formatDate } from "./format.ts";

/** Badge tone per status — amber for in-flight, green for sanctioned, red for closed. */
export function statusTone(status: AppStatus): "warning" | "success" | "danger" | "info" | "neutral" {
  if (status === "Sanctioned" || status === "Released") return "success";
  if (status === "Rejected") return "danger";
  if (status === "Returned" || status === "DeficiencyRaised" || status === "DeficiencyProposed" || status === "QueryRaised") return "warning";
  if (status === "Draft") return "neutral";
  return "info";
}

/**
 * Resolve the role a `/dashboard/sm2/<key>/…` segment belongs to.
 *
 * Three special cases, all from the live path shapes: `jspd` is PD:JS, `pd` is the Programme
 * Director (NOT a grade), and `ifd<grade>` is the Integrated Finance Division.
 */
/**
 * A scheme's short name as it is written on screen. The stored code (`SHRESHTA_M2`) is a key;
 * it was reaching officers verbatim in every Scheme column.
 */
const SCHEME_LABEL: Record<string, string> = {
  SHRESHTA_M2: "SHRESHTA Mode 2",
  SMILE_GG: "SMILE",
};

export function schemeLabel(code: string): string {
  return SCHEME_LABEL[code] ?? code.replace(/_/g, " ");
}

export function roleForSchemeKey(key: string): RoleDef | undefined {
  if (key === "jspd") return ROLES["pd-js"];
  if (key === "pd") return ROLES["programme-director"];
  if (key.startsWith("ifd")) {
    const g = key.slice(3);
    return ROLES[`finance-${g}` as RoleId];
  }
  return ROLES[`pd-${key}` as RoleId];
}

/**
 * The status wording the NGO sees. The officer-facing `statusLabel` in workflow.ts appends the
 * holder ("Submitted / ASO"); the live applicant screens never show the chain — they show one of
 * six plain states, matching the filter chips above the table.
 */
export function ngoStatusLabel(app: GrantApplication): string {
  if (app.status === "Draft") return "Draft";
  // "Sanctioned", as the dashboard's "Sanctioned Grants" tile says: two words for one state read as two
  // states (parity inventory §2).
  if (app.sanction || app.status === "Sanctioned" || app.status === "Released") return "Sanctioned";
  if (app.status === "Rejected") return "Closed / Rejected";
  // A deficiency is the one state that asks the applicant to act, so it is named for what it
  // asks rather than folded into "Query / Returned" (review call 11 Sep 2026, T43–54).
  if (app.status === "DeficiencyRaised") return "Action Required";
  if (app.status === "QueryRaised" || app.status === "Returned") {
    return "Query / Returned";
  }
  if (app.status === "Submitted") return "Submitted";
  return "In Review";
}

/** The live filter chips over My Applications, in order. */
export const NGO_STATUS_FILTERS = [
  "All",
  "Draft",
  "Action Required",
  "Submitted",
  "In Review",
  "Sanctioned",
  "Query / Returned",
  "Closed / Rejected",
] as const;

export type NgoStatusFilter = (typeof NGO_STATUS_FILTERS)[number];

export function matchesNgoFilter(app: GrantApplication, filter: NgoStatusFilter): boolean {
  return filter === "All" || ngoStatusLabel(app) === filter;
}
