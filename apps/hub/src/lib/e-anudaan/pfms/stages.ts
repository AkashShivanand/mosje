/**
 * The ONE place a PFMS status becomes words a Ministry officer or an NGO can read.
 *
 * Annexure C lists thirty statuses — `PendingDSCBatchFileGenerationSign1`, `PassedByDHForDSC` —
 * and §2.4 of the BRD asks that none of them reach a user raw. Every surface that shows where a
 * payment has reached (the Maker's queue, the Checker's queue, the case timeline, the pipeline
 * dashboard, the NGO's own application) reads `stageOf()` from here, so no two of them can give a
 * different answer for the same advice (.claude/rules/data-state-completeness.md §2).
 *
 * The grouping below is the design's proposal and is recorded as a decision for NeGD to confirm
 * (docs/plans/2026-09-29-e-anudaan-pfms.md §4, question 6).
 */

import type { AdviceState, PaymentAdvice, PfmsRequest, PfmsStatus } from "./types.ts";

/** The happy path, in order. */
export const STAGES = [
  "awaiting-advice",
  "in-preparation",
  "awaiting-authorisation",
  "received",
  "bill-with-ddo",
  "at-pao",
  "payment-in-process",
  "paid",
  "closed",
] as const;

/** Off the happy path. Each asks something different of somebody. */
export const EXCEPTIONS = ["returned-by-checker", "not-accepted", "waiting-to-resend", "returned-by-pfms", "cancelled", "fy-expired"] as const;

export type Stage = (typeof STAGES)[number];
export type ExceptionStage = (typeof EXCEPTIONS)[number];
export type AnyStage = Stage | ExceptionStage;

export type StageTone = "neutral" | "info" | "warning" | "success" | "danger";

export interface StageInfo {
  /** Title Case, the officer's register. */
  label: string;
  /** What the NGO is told, where decision 7 lets it be told anything before the credit. */
  ngoLabel: string;
  /** Who holds it now, in one phrase. */
  holder: string;
  tone: StageTone;
  /** Terminal: nothing more will happen to this advice. */
  terminal: boolean;
}

export const STAGE_INFO: Record<AnyStage, StageInfo> = {
  "awaiting-advice": { label: "Awaiting Payment Advice", ngoLabel: "Sanctioned", holder: "Maker, Programme Division", tone: "neutral", terminal: false },
  "in-preparation": { label: "Advice in Preparation", ngoLabel: "Sanctioned", holder: "Maker, Programme Division", tone: "info", terminal: false },
  "awaiting-authorisation": { label: "Awaiting Authorisation", ngoLabel: "Sanctioned", holder: "Checker, Programme Division", tone: "info", terminal: false },
  received: { label: "Received by PFMS", ngoLabel: "Payment in Process", holder: "PFMS", tone: "info", terminal: false },
  "bill-with-ddo": { label: "Bill with DDO", ngoLabel: "Payment in Process", holder: "Drawing & Disbursing Officer", tone: "info", terminal: false },
  "at-pao": { label: "Being Passed at PAO", ngoLabel: "Payment in Process", holder: "Pay & Accounts Office", tone: "info", terminal: false },
  "payment-in-process": { label: "Payment in Process", ngoLabel: "Payment in Process", holder: "Bank", tone: "info", terminal: false },
  paid: { label: "Paid", ngoLabel: "Grant Credited", holder: "—", tone: "success", terminal: false },
  closed: { label: "Closed", ngoLabel: "Grant Credited", holder: "—", tone: "success", terminal: true },

  "returned-by-checker": { label: "Returned by Checker", ngoLabel: "Sanctioned", holder: "Maker, Programme Division", tone: "warning", terminal: false },
  "not-accepted": { label: "Not Accepted by PFMS", ngoLabel: "Sanctioned", holder: "Maker, Programme Division", tone: "danger", terminal: false },
  "waiting-to-resend": { label: "Waiting to Resend", ngoLabel: "Sanctioned", holder: "e-Anudaan (automatic)", tone: "warning", terminal: false },
  "returned-by-pfms": { label: "Returned by PFMS", ngoLabel: "Payment in Process", holder: "PFMS", tone: "warning", terminal: false },
  cancelled: { label: "Returned and Cancelled", ngoLabel: "Payment Returned", holder: "Programme Division", tone: "danger", terminal: true },
  "fy-expired": { label: "Financial Year Expired", ngoLabel: "Payment Returned", holder: "Programme Division", tone: "danger", terminal: true },
};

/**
 * Annexure C → stage. Exhaustive by construction: a status PFMS adds tomorrow fails the type
 * check here rather than rendering as a blank badge.
 *
 * `Submitted`, `PassByPDMaker`, `PendingDSCPDChecker` and `Approved` are PFMS's own maker–checker
 * steps. For an eSanction the e-Anudaan Maker and Checker have already done that work, so they read
 * as "Received by PFMS" (open question 6 asks NeGD whether PFMS skips them).
 */
export const PFMS_STATUS_STAGE: Record<PfmsStatus, AnyStage> = {
  Created: "received",
  Submitted: "received",
  PassByPDMaker: "received",
  PendingDSCPDChecker: "received",
  Approved: "received",
  BillGenerated: "bill-with-ddo",
  PendingDDODSC: "bill-with-ddo",
  DigitallySignedByDDO: "bill-with-ddo",
  PassedByDHForDSC: "at-pao",
  PendingDHDSCPassOrder: "at-pao",
  ForwardedToAAO: "at-pao",
  PassedByAAOForDSC: "at-pao",
  PendingAAODSCPassOrder: "at-pao",
  ForwardedToPAO: "at-pao",
  PassedByPAOForDSC: "at-pao",
  PendingPAODSCPassOrder: "at-pao",
  PassedByPAO: "at-pao",
  XMLGenerated: "payment-in-process",
  DSCBatchGenerated: "payment-in-process",
  PendingDSCBatchFileGenerationSign1: "payment-in-process",
  PendingDSCBatchFileGenerationSign2: "payment-in-process",
  DigitalSignatoryLast: "payment-in-process",
  Closed: "closed",
  ReturnedByDealingHand: "returned-by-pfms",
  ReturnedByAAO: "returned-by-pfms",
  ReturnedByPAO: "returned-by-pfms",
  ReturnedByDDO: "returned-by-pfms",
  PendingDSCReturnOrder: "returned-by-pfms",
  FinYrExpired: "fy-expired",
  Cancelled: "cancelled",
};

/**
 * What a case's history says when PFMS reports a status, in words. Keyed by the status, so a new
 * one without a sentence falls back to its stage's label — never to the raw code (FR-STS-006).
 */
export const PFMS_STATUS_TEXT: Partial<Record<PfmsStatus, string>> = {
  Created: "Received by PFMS.",
  BillGenerated: "Bill generated at the DDO.",
  PendingDDODSC: "Bill awaiting the DDO's digital signature.",
  DigitallySignedByDDO: "Bill digitally signed by the DDO.",
  PassedByDHForDSC: "Passed by the dealing hand at the Pay & Accounts Office.",
  ForwardedToAAO: "Forwarded to the Assistant Accounts Officer.",
  ForwardedToPAO: "Forwarded to the Pay & Accounts Officer.",
  PassedByPAO: "Passed by the Pay & Accounts Office.",
  DSCBatchGenerated: "Payment file sent to the bank.",
  DigitalSignatoryLast: "Voucher generated; credit confirmed by the bank.",
  Closed: "Sanction closed at PFMS.",
  Cancelled: "Returned and cancelled at PFMS.",
  FinYrExpired: "The financial year expired before payment.",
};

export function statusText(status: PfmsStatus): string {
  return PFMS_STATUS_TEXT[status] ?? `${STAGE_INFO[PFMS_STATUS_STAGE[status]].label}.`;
}

/** The happy path through PFMS, one status per stage-worth of progress. The simulator walks it. */
export const PFMS_HAPPY_PATH: readonly PfmsStatus[] = [
  "Created",
  "BillGenerated",
  "DigitallySignedByDDO",
  "PassedByDHForDSC",
  "PassedByPAO",
  "DSCBatchGenerated",
  "DigitalSignatoryLast",
  "Closed",
];

export function latestRequest(advice: Pick<PaymentAdvice, "requests">): PfmsRequest | undefined {
  return advice.requests[advice.requests.length - 1];
}

/** Every beneficiary on the request carries a UTR — the only thing that makes a payment "Paid". */
export function allCredited(req: PfmsRequest | undefined): boolean {
  return !!req && req.payments.length > 0 && req.payments.every((p) => !!p.utr && p.scrollStatus === "Success");
}

const LOCAL_STAGE: Record<Exclude<AdviceState, "transmitted">, AnyStage> = {
  draft: "in-preparation",
  submitted: "awaiting-authorisation",
  returned: "returned-by-checker",
  "not-accepted": "not-accepted",
  queued: "waiting-to-resend",
  cancelled: "cancelled",
};

/**
 * Where a payment has reached. `undefined` advice means the sanction is final and nobody has
 * opened a payment advice against it yet.
 *
 * A UTR on every beneficiary reads "Paid" even before PFMS reports `Closed`: the credit is the
 * thing the NGO and the Ministry are waiting for, and PFMS closes the sanction some days later.
 */
export function stageOf(advice: Pick<PaymentAdvice, "state" | "requests"> | undefined): AnyStage {
  if (!advice) return "awaiting-advice";
  if (advice.state !== "transmitted") return LOCAL_STAGE[advice.state];
  const req = latestRequest(advice);
  if (!req?.status) return "received";
  const stage = PFMS_STATUS_STAGE[req.status];
  if (stage === "closed") return "closed";
  if (allCredited(req) && (STAGES as readonly string[]).includes(stage)) return "paid";
  return stage;
}

export function stageInfo(stage: AnyStage): StageInfo {
  return STAGE_INFO[stage];
}

export function isException(stage: AnyStage): stage is ExceptionStage {
  return (EXCEPTIONS as readonly string[]).includes(stage);
}

/** The happy-path index a stage sits at, for a stepper; an exception sits where it interrupted. */
export function stageIndex(stage: AnyStage): number {
  const i = (STAGES as readonly string[]).indexOf(stage);
  if (i >= 0) return i;
  switch (stage) {
    case "returned-by-checker":
    case "not-accepted":
      return STAGES.indexOf("in-preparation");
    case "waiting-to-resend":
      return STAGES.indexOf("awaiting-authorisation");
    default:
      return STAGES.indexOf("received");
  }
}

/** The stages drawn on a case's timeline: the happy path, with "Closed" folded into "Paid". */
export const TIMELINE_STAGES: readonly Stage[] = STAGES.filter((s) => s !== "closed");
