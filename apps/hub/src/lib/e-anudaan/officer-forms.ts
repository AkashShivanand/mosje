/**
 * The rules the officer forms enforce, as pure functions — so the screen that shows a message, the
 * workflow that refuses the write and the demo dock's presets (demo-forms/) read one definition.
 *
 * Each returns the message the form shows, or nothing when the input passes. Who may act, and
 * whether the file is open, stay with the workflow: these judge only what the officer typed.
 */

import { rupees } from "./format.ts";

/* ── The review screen's decision ─────────────────────────────────────────── */

export interface DecisionInput {
  remarks: string;
  /** Digits as typed; "" when the field is empty. Read only for a sanction. */
  recurring: string;
  nonRecurring: string;
  /** The grant the NGO sought — a sanction may not exceed it. */
  sought: number;
  /** The deficiency items the decision would send. Read only for a deficiency. */
  items: readonly { remark: string }[];
}

export interface DecisionProblems {
  remarks?: string;
  sanction?: string;
  deficiency?: string;
}

/** Both amounts entered, more than ₹0 together, and no more than the amount sought. */
export function sanctionAmountsInvalid(f: Pick<DecisionInput, "recurring" | "nonRecurring" | "sought">): boolean {
  const total = Number(f.recurring) + Number(f.nonRecurring);
  return f.recurring === "" || f.nonRecurring === "" || total <= 0 || total > f.sought;
}

/** What stops this decision, as the messages beside the fields concerned. Empty when it can go. */
export function decisionProblems(rule: { action: string; requiresRemarks: boolean }, f: DecisionInput): DecisionProblems {
  const out: DecisionProblems = {};
  if (rule.requiresRemarks && !f.remarks.trim()) out.remarks = "Enter your remarks.";
  if (rule.action === "sanction" && sanctionAmountsInvalid(f)) {
    out.sanction = `Enter both amounts. Together they must be more than ₹0 and no more than the ${rupees(f.sought)} sought.`;
  }
  if (rule.action === "raiseDeficiency" && f.items.some((it) => !it.remark.trim())) {
    out.deficiency = "Give a reason for every document marked for correction.";
  }
  return out;
}

/* ── Show Cause Notice ────────────────────────────────────────────────────── */

/** `respondBy` is an ISO date, optional; `now` an ISO date-time. */
export function showCauseError(input: { grounds: string; respondBy?: string }, now: string): string | null {
  if (!input.grounds.trim()) return "State the grounds for the notice.";
  if (input.respondBy) {
    const days = Math.ceil((Date.parse(input.respondBy) - Date.parse(now)) / 86_400_000);
    if (!(days > 0)) return "The response deadline must be a date after today.";
  }
  return null;
}

/* ── Online inspection (BharatVC) ─────────────────────────────────────────── */

/** `startsAt` and `endsAt` are ISO date-times, "" when the date or the time is not entered. */
export function onlineInspectionError(input: { title: string; startsAt: string; endsAt: string }, now: string): string | null {
  if (!input.title.trim()) return "Give the inspection a title.";
  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  if (!Number.isFinite(start)) return "Enter the start date and time.";
  if (start <= Date.parse(now)) return "The start must be later than now.";
  if (!Number.isFinite(end) || end <= start) return "The end must be later than the start.";
  return null;
}

/* ── PMU inspections ──────────────────────────────────────────────────────── */

export function inspectionScheduleError(date: string): string | undefined {
  return date ? undefined : "Choose the date of the visit.";
}

export function inspectionReportErrors(f: { findings: string; recommendation: string }): { findings?: string; recommendation?: string } {
  return {
    ...(f.findings.trim() ? {} : { findings: "Record what was found at the visit." }),
    ...(f.recommendation ? {} : { recommendation: "Select a recommendation." }),
  };
}

/* ── Remarks-only decisions ───────────────────────────────────────────────── */

/** A bank account or location change: the NGO is shown the remarks with the decision. */
export function changeDecisionError(remarks: string): string | undefined {
  return remarks.trim() ? undefined : "Enter your remarks before deciding.";
}

/** The answer to a Return to Previous, sent back up with the file. */
export function queryResponseError(response: string): string | undefined {
  return response.trim() ? undefined : "Write your response to the query.";
}
