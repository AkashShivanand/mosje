/**
 * Derived views over the store. Pure functions, so the screens stay declarative and the
 * numbers on the dashboard cannot drift from the rows in the table beneath them.
 */

import { ROLES, type RoleDef } from "./roles.ts";
import type { AppStatus, EAnudaanState, GrantApplication, RoleId } from "./types.ts";
import { holderIsRole } from "./types.ts";

/** Everything currently sitting in this role's in-tray. */
export function worklistFor(state: EAnudaanState, roleId: RoleId): GrantApplication[] {
  return state.applications
    .filter((a) => holderIsRole(a.holder, roleId))
    .sort((a, b) => b.ageingDays - a.ageingDays);
}

/** Files this role has queried back down (or that were queried to it). */
export function queriesFor(state: EAnudaanState, roleId: RoleId): GrantApplication[] {
  return state.applications.filter(
    (a) => a.status === "QueryRaised" && (holderIsRole(a.holder, roleId) || a.queries.some((q) => q.raisedBy === roleId)),
  );
}

export function rejectedFor(state: EAnudaanState): GrantApplication[] {
  return state.applications.filter((a) => a.status === "Rejected" || a.status === "Returned");
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
export function formatGrant(rupees: number): string {
  if (rupees >= 10_000_000) return `₹${(rupees / 10_000_000).toFixed(2)} Cr`;
  if (rupees >= 100_000) return `₹${(rupees / 100_000).toFixed(2)} L`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Badge tone per status — amber for in-flight, green for sanctioned, red for closed. */
export function statusTone(status: AppStatus): "warning" | "success" | "danger" | "info" | "neutral" {
  if (status === "Sanctioned" || status === "Released") return "success";
  if (status === "Rejected") return "danger";
  if (status === "Returned" || status === "DeficiencyRaised" || status === "QueryRaised") return "warning";
  if (status === "Draft") return "neutral";
  return "info";
}

/**
 * Resolve the role a `/dashboard/sm2/<key>/…` segment belongs to.
 *
 * Three special cases, all from the live path shapes: `jspd` is PD:JS, `pd` is the Programme
 * Director (NOT a grade), and `ifd<grade>` is the Integrated Finance Division.
 */
export function roleForSchemeKey(key: string): RoleDef | undefined {
  if (key === "jspd") return ROLES["pd-js"];
  if (key === "pd") return ROLES["programme-director"];
  if (key.startsWith("ifd")) {
    const g = key.slice(3);
    return ROLES[`finance-${g}` as RoleId];
  }
  return ROLES[`pd-${key}` as RoleId];
}
