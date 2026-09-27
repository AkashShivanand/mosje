/**
 * Format – IV: Action Plan and Progress Report of Infrastructure Works —
 * supporting data.
 *
 * `registers.ts` carries `WORKS` (the register itself), `INDICATOR_DOMAINS`
 * and `AGENCIES`, but not the two lists the live Format IV form keys its own
 * pickers on: the funding schemes a work can draw on ("Central Govt. Scheme
 * (other than PMAGY)", "State Govt. Scheme"), and the monitorable indicator
 * under each domain. The indicator list already exists — `format-3b.ts` built
 * it for the beneficiary-level form — and is reused here rather than invented
 * twice, so a domain does not carry two different indicator sets across the
 * portal. The funding-scheme names are new, invented in the same illustrative
 * spirit as `registers.ts`, and kept out of it per the district build brief
 * ("create your own file… never edit registers.ts").
 */

import type { WorkRecord } from "./registers";

/** Central schemes an infrastructure work can draw funds from, other than PMAGY itself. */
export const CENTRAL_FUNDING_SCHEMES = [
  "MGNREGS",
  "Finance Commission Grant",
  "Jal Jeevan Mission",
  "PMGSY",
] as const;

/** State-government schemes an infrastructure work can draw funds from. */
export const STATE_FUNDING_SCHEMES = [
  "State Plan Scheme",
  "State Finance Commission Grant",
  "Chief Minister's Gramin Sadak Yojana",
] as const;

export const WORK_STATUSES: readonly WorkRecord["status"][] = [
  "Identified",
  "In Progress",
  "Completed",
  "Withheld",
] as const;

/** Badge tone for each work status — paired with the word, never colour alone. */
export const WORK_STATUS_TONE: Record<WorkRecord["status"], "neutral" | "warning" | "success" | "danger"> = {
  Identified: "neutral",
  "In Progress": "warning",
  Completed: "success",
  Withheld: "danger",
};

/** The draft a Format IV entry is built from, across the wizard's four steps. */
export interface WorkDraft {
  /* Step 1 — Estimation: location, identification and the funding plan. */
  block: string;
  gramPanchayat: string;
  village: string;
  domain: string;
  indicator: string;
  work: string;
  estimatedCost: string;
  centralScheme: string;
  centralSchemeAmount: string;
  stateScheme: string;
  stateSchemeAmount: string;
  stateShareUnderPmagy: string;
  gapFillingFunds: string;
  agency: string;

  /* Step 2 — Release. */
  releaseOrderNumber: string;
  releaseDate: string;
  amountReleased: string;

  /* Step 3 — Utilization. */
  utilisationCertificateNumber: string;
  amountUtilised: string;
  utilisationDate: string;

  /* Step 4 — Work Progress. */
  status: WorkRecord["status"] | "";
  targetDate: string;
  progressRemarks: string;
}

export const EMPTY_WORK_DRAFT: WorkDraft = {
  block: "",
  gramPanchayat: "",
  village: "",
  domain: "",
  indicator: "",
  work: "",
  estimatedCost: "",
  centralScheme: "",
  centralSchemeAmount: "",
  stateScheme: "",
  stateSchemeAmount: "",
  stateShareUnderPmagy: "",
  gapFillingFunds: "",
  agency: "",
  releaseOrderNumber: "",
  releaseDate: "",
  amountReleased: "",
  utilisationCertificateNumber: "",
  amountUtilised: "",
  utilisationDate: "",
  status: "",
  targetDate: "",
  progressRemarks: "",
};

/** Total funds allocated — the live form computes this rather than asking for it. */
export function totalFundsAllocated(draft: WorkDraft): number {
  const nums = [
    draft.estimatedCost,
    draft.centralSchemeAmount,
    draft.stateSchemeAmount,
    draft.stateShareUnderPmagy,
    draft.gapFillingFunds,
  ].map((v) => Number(v) || 0);
  /* Estimated Cost is the work's own cost, not a funding line — the total is the
     sources of funds against it, so it is excluded from the sum. */
  /* Destructuring an array is `T | undefined` per element under
     noUncheckedIndexedAccess, so the four funding lines are summed by index
     rather than named into possibly-undefined locals. */
  return nums.slice(1).reduce((total, amount) => total + (amount ?? 0), 0);
}
