/** Role-aware dashboard selectors — KPIs and review-queue filtering. */
import type { AdminRoleId, Application, Stage } from "./store/types";
import { ROLE_ACTS_ON } from "./store/types";

/** Applications in the role's review queue. Central Admin sees everything. */
export function queueForRole(apps: Application[], role: AdminRoleId): Application[] {
  if (role === "central-admin") return apps;
  const stages = ROLE_ACTS_ON[role];
  return apps.filter((a) => stages.includes(a.stage));
}

const isActive = (a: Application) =>
  !["APPROVED_SIGNED", "REJECTED", "WITHDRAWN"].includes(a.stage);

export interface Kpi {
  label: string;
  value: string;
  changeLabel?: string;
  changeValue?: string;
  changeDirection?: "up" | "down" | "flat";
}

const countStage = (apps: Application[], stage: Stage) => apps.filter((a) => a.stage === stage).length;

/** KPI set per role — mirrors the live dashboards. */
export function kpisForRole(apps: Application[], role: AdminRoleId): Kpi[] {
  const queue = queueForRole(apps, role);
  const pendingReview = queue.filter(isActive);
  const dueSoon = queue.filter((a) => isActive(a) && a.slaDaysLeft > 0 && a.slaDaysLeft <= 7).length;
  const overdue = queue.filter((a) => isActive(a) && a.slaDaysLeft <= 0).length;

  if (role === "central-admin") {
    const approved = countStage(apps, "APPROVED_SIGNED");
    const rejected = countStage(apps, "REJECTED");
    const withdrawn = countStage(apps, "WITHDRAWN");
    const pending = apps.filter(isActive).length;
    return [
      { label: "Total Received", value: String(apps.length), changeLabel: "vs last month", changeValue: "+14.5%", changeDirection: "up" },
      { label: "Approved", value: String(approved), changeLabel: "vs last month", changeValue: "+8.1%", changeDirection: "up" },
      { label: "Pending / Under Review", value: String(pending), changeLabel: "in the pipeline", changeValue: "", changeDirection: "flat" },
      { label: "Rejected", value: String(rejected), changeLabel: "vs last month", changeValue: "-2.0%", changeDirection: "down" },
      { label: "Overdue (SLA breach)", value: String(overdue), changeLabel: "needs attention", changeValue: "", changeDirection: "flat" },
      { label: "Withdrawals", value: String(withdrawn), changeLabel: "vs last month", changeValue: "+1.0%", changeDirection: "up" },
    ];
  }

  if (role === "district-magistrate") {
    return [
      { label: "Pending Reviews", value: String(pendingReview.length), changeLabel: "awaiting your decision" },
      { label: "Due Soon", value: String(dueSoon), changeLabel: "≤ 7 days left" },
      { label: "Rejected Applications", value: String(countStage(apps, "REJECTED")), changeLabel: "all-time" },
      { label: "Approved", value: String(countStage(apps, "APPROVED_SIGNED")), changeLabel: "all-time" },
    ];
  }

  // Examining Officer (Maker) + Checker
  return [
    { label: "Total Applications", value: String(queue.length), changeLabel: "in your queue" },
    { label: "Pending Reviews", value: String(pendingReview.length), changeLabel: "awaiting action" },
    { label: "Due Soon", value: String(dueSoon), changeLabel: "≤ 7 days left" },
    { label: "Over Due Applications", value: String(overdue), changeLabel: "SLA breached" },
  ];
}

/** Applications grouped by state — for the "Applications by State" chart. */
export function byState(apps: Application[], topN = 8): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const a of apps) counts.set(a.applicant.state, (counts.get(a.applicant.state) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}

/** Approval rate by state (%) — for the "Approval rate by State" chart. */
export function approvalRateByState(apps: Application[], topN = 6): { label: string; value: number }[] {
  const total = new Map<string, number>();
  const approved = new Map<string, number>();
  for (const a of apps) {
    total.set(a.applicant.state, (total.get(a.applicant.state) ?? 0) + 1);
    if (a.stage === "APPROVED_SIGNED") approved.set(a.applicant.state, (approved.get(a.applicant.state) ?? 0) + 1);
  }
  return [...total.entries()]
    .map(([label, t]) => ({ label, value: Math.round(((approved.get(label) ?? 0) / t) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN);
}
