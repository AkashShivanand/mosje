/**
 * The officer dashboard's figures, as the review call of 11 Sep 2026 asked for them (T698–737).
 *
 * Every figure is derived from the same filtered set, so a card and the table beneath it can
 * never disagree about how many files are pending.
 */

import type { EAnudaanState, GrantApplication, Inspection, InspectionStatus, RoleId } from "./types.ts";
import { holderIsRole } from "./types.ts";
import { queriesFor } from "./selectors.ts";

export interface OfficerDashboard {
  /** Files with this officer now, in the selected year. */
  queue: GrantApplication[];
  byCase: { key: "New" | "1" | "2" | "3"; label: string; count: number }[];
  movement: { key: string; label: string; count: number; hint: string }[];
  ageing: { band: string; count: number }[];
  overdue: number;
  years: string[];
}

export function officerDashboard(state: EAnudaanState, roleId: RoleId, fy: string): OfficerDashboard {
  const inYear = (a: GrantApplication) => !fy || a.financialYear === fy;
  const all = state.applications.filter(inYear);
  const queue = all.filter((a) => holderIsRole(a.holder, roleId)).sort((a, b) => b.ageingDays - a.ageingDays);

  const byCase = [
    { key: "New" as const, label: "New Applications", count: queue.filter((a) => a.caseType === "New").length },
    { key: "1" as const, label: "1st Instalment", count: queue.filter((a) => a.caseType === "Ongoing" && a.instalment === 1).length },
    { key: "2" as const, label: "2nd Instalment", count: queue.filter((a) => a.caseType === "Ongoing" && a.instalment === 2).length },
    { key: "3" as const, label: "3rd Instalment", count: queue.filter((a) => a.caseType === "Ongoing" && a.instalment === 3).length },
  ];

  const inspected = new Set(
    state.inspections.filter((i) => i.status === "Submitted" || i.status === "Reviewed").map((i) => i.applicationId),
  );

  const movement = [
    {
      key: "to-send",
      label: "Deficiencies to Send",
      count: queue.filter((a) => a.status === "DeficiencyProposed").length,
      hint: "In your queue · noted by the ASO, not yet sent to the NGO",
    },
    {
      key: "resubmitted",
      label: "Resubmitted after Deficiency",
      count: queue.filter((a) => a.status === "DeficiencyResponded").length,
      hint: "In your queue · corrected by the NGO",
    },
    {
      key: "rework",
      label: "Returned for Rework",
      // The Queries screen reads the same selector, so this figure is that list's length.
      count: queriesFor(state, roleId).filter(inYear).length,
      hint: "Returned to you, or by you · not yet resolved",
    },
    {
      key: "inspection",
      label: "Inspection Report Available",
      count: queue.filter((a) => inspected.has(a.id)).length,
      hint: "In your queue · read before deciding",
    },
    {
      key: "deficiency",
      label: "Deficiencies Raised",
      count: all.filter((a) => a.status === "DeficiencyRaised").length,
      hint: "All applications · with NGOs for correction",
    },
    {
      key: "resolved",
      label: "Deficiencies Resolved",
      count: all.filter((a) => a.deficiencies.some((d) => d.respondedAt)).length,
      hint: "All applications · corrected by NGOs",
    },
    {
      key: "forwarded",
      label: "Forwarded by You",
      count: all.filter((a) => a.audit.some((e) => e.byRole === roleId && e.action === "forward")).length,
      hint: "Your own actions · moved to the next level",
    },
  ];

  const ageing = [
    { band: "0–3 days", count: queue.filter((a) => a.ageingDays <= 3).length },
    { band: "4–7 days", count: queue.filter((a) => a.ageingDays > 3 && a.ageingDays <= 7).length },
    { band: "Over 7 days", count: queue.filter((a) => a.ageingDays > 7).length },
  ];

  const years = [...new Set(state.applications.map((a) => a.financialYear))].sort().reverse();

  return { queue, byCase, movement, ageing, overdue: ageing[2]!.count, years };
}

/* ── PMU inspections ──────────────────────────────────────────────────────── */

/** Plain wording for an inspection's state, shared by the PMU dashboard and its worklist. */
export const INSPECTION_STATUS_LABEL: Record<InspectionStatus, string> = {
  Pending: "Awaiting Schedule",
  Scheduled: "Scheduled",
  Submitted: "Report Submitted",
  Reviewed: "Report Reviewed",
};

export const INSPECTION_STATUS_TONE: Record<InspectionStatus, "warning" | "info" | "success" | "neutral"> = {
  Pending: "warning",
  Scheduled: "info",
  Submitted: "success",
  Reviewed: "neutral",
};

/**
 * The one thing a PMU field officer does next with an inspection. Pending is scheduled, a
 * scheduled visit is inspected (its report recorded), and anything with a report is read.
 */
export type InspectionAction = "schedule" | "inspect" | "view";

export function inspectionActionFor(i: Pick<Inspection, "status">): InspectionAction {
  if (i.status === "Pending") return "schedule";
  if (i.status === "Scheduled") return "inspect";
  return "view";
}

export const INSPECTION_ACTION_LABEL: Record<InspectionAction, string> = {
  schedule: "Schedule",
  inspect: "Record Inspection",
  view: "View Report",
};

/** Filter values for the PMU lists. "" is every inspection. */
export const INSPECTION_FILTERS: { value: "" | InspectionStatus; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "Pending", label: INSPECTION_STATUS_LABEL.Pending },
  { value: "Scheduled", label: INSPECTION_STATUS_LABEL.Scheduled },
  { value: "Submitted", label: INSPECTION_STATUS_LABEL.Submitted },
  { value: "Reviewed", label: INSPECTION_STATUS_LABEL.Reviewed },
];

/** Inspections in a status (or all), soonest action first: to schedule, to inspect, to read. */
export function inspectionsFor(state: EAnudaanState, status: "" | InspectionStatus = ""): Inspection[] {
  const order: Record<InspectionStatus, number> = { Pending: 0, Scheduled: 1, Submitted: 2, Reviewed: 3 };
  return state.inspections
    .filter((i) => !status || i.status === status)
    .sort((a, b) => order[a.status] - order[b.status] || (a.scheduledFor ?? "").localeCompare(b.scheduledFor ?? ""));
}

/** Schedule a pending inspection. Returns a new object; never mutates. */
export function scheduleInspection(i: Inspection, date: string, visitType: Inspection["visitType"]): Inspection {
  if (i.status !== "Pending" && i.status !== "Scheduled") throw new Error("Only a pending or scheduled inspection can be scheduled.");
  return { ...i, status: "Scheduled", scheduledFor: date, visitType };
}

/** Record the inspection report for a scheduled visit. */
export function recordInspection(
  i: Inspection,
  report: { findings: string; recommendation: NonNullable<Inspection["recommendation"]> },
  now: string,
): Inspection {
  if (i.status !== "Scheduled") throw new Error("Only a scheduled inspection can be recorded.");
  return { ...i, status: "Submitted", submittedAt: now, findings: report.findings.trim(), recommendation: report.recommendation };
}
