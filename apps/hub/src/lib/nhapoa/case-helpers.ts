/** Shared helpers for the admin case screens (DO/SHO, State, Finance). */

import type { Case, CaseStatus } from "./store/types";

/** Fixed 30-day SLA window from filing (demo). Returns whole days remaining. */
export function slaDaysLeft(c: Case): number {
  const filed = new Date(c.createdAt).getTime();
  const ageDays = Math.floor((Date.now() - filed) / 86_400_000);
  return 30 - ageDays;
}

export function slaTone(daysLeft: number): "approve" | "await" | "reject" {
  if (daysLeft < 0) return "reject";
  if (daysLeft <= 5) return "await";
  return "approve";
}

export function slaLabel(daysLeft: number): string {
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
  return `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
}

export type Priority = "Urgent" | "Escalated" | null;

export function priorityOf(c: Case): Priority {
  const left = slaDaysLeft(c);
  if (left < 0) return "Escalated";
  if (left <= 1) return "Urgent";
  return null;
}

/** DO/SHO workflow actions available for a case, given its status. */
export function doActionsFor(status: CaseStatus): { to: CaseStatus; label: string }[] {
  switch (status) {
    case "SUBMITTED":
      return [{ to: "ASSIGNED", label: "Assign for review" }];
    case "ASSIGNED":
      return [{ to: "UNDER_INVESTIGATION", label: "Move to investigation" }];
    case "UNDER_INVESTIGATION":
      return [{ to: "PENDING_APPROVAL", label: "Send for approval" }];
    default:
      return [];
  }
}

/** Cases a District Officer / SHO works on (pre-approval half of the pipeline). */
export function doQueue(cases: Case[]): Case[] {
  const order: CaseStatus[] = ["SUBMITTED", "ASSIGNED", "UNDER_INVESTIGATION", "PENDING_APPROVAL", "SENT_BACK"];
  return cases.filter((c) => order.includes(c.status));
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtINR(n: number | undefined): string {
  return n == null ? "—" : `₹${n.toLocaleString("en-IN")}`;
}
