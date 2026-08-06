// NMBA Mass Pledge Reporting (18 August 2026) — data model.
// Pure types only, so this is safe to import from server components.
//
// Spec: docs/superpowers/specs/2026-07-21-nmba-mass-pledge-reporting.md

import type { GeoPhoto } from "@mosje/design-system";
import type { PortalEntityKind, PortalRole } from "../committee/types";

export type { GeoPhoto };

/**
 * Which of the five documented forms produced this record. The forms share one
 * body and differ only in how the reporter identifies itself.
 */
export type ReporterKind = "ADMIN_TIER" | PortalEntityKind;

/**
 * Where a submission sits in the approval chain.
 *   PENDING_DISTRICT → a Block submitted; the District must act
 *   PENDING_STATE    → a District submitted (or approved a Block's); State acts
 *   APPROVED         → counts towards published totals
 *   RETURNED         → sent back with remarks; editable by the submitter
 */
export type SubmissionStatus = "PENDING_DISTRICT" | "PENDING_STATE" | "APPROVED" | "RETURNED";

/**
 * Assumption A8: only figures that travelled the approval chain are VERIFIED.
 * Forms 2–5 have no chain, so they publish as SELF_DECLARED and must always be
 * shown distinguishably, never blended into a single headline number.
 */
export type VerificationTag = "VERIFIED" | "SELF_DECLARED";

/**
 * Assumption A1: the three buckets are defined as a true partition so that
 * `total` is arithmetically valid. Without this, a 22-year-old woman would be
 * counted in both `youth` and `women` and every total would be inflated.
 */
export interface ParticipationCounts {
  /** Participants under 30, any gender. */
  youth: number;
  /** Female participants aged 30 and above. */
  women: number;
  /** Everyone else: males 30+, and any other gender 30+. */
  others: number;
}

export type ApprovalActionKind = "SUBMITTED" | "RESUBMITTED" | "APPROVED" | "RETURNED";

/** One immutable step in a submission's audit trail (assumption A7). */
export interface ApprovalEvent {
  at: string; // ISO timestamp
  actorAccountId: string;
  actorDisplayName: string;
  actorRole: PortalRole;
  action: ApprovalActionKind;
  /** Mandatory on RETURNED — an approver may not bounce a record silently. */
  remarks?: string;
}

/** A single organisation's participation report for 18 August 2026. */
export interface MassPledgeSubmission {
  id: string;
  reporterKind: ReporterKind;
  /** Assumption A10: the event date is locked, never user-editable. */
  eventDate: string;
  submittedAt: string;

  // ── Identity: ADMIN_TIER ──────────────────────────────────────────────────
  state?: string;
  district?: string;
  block?: string;
  /**
   * Assumption A2: attribution only. Naming a coordinating ministry here never
   * creates a figure on that ministry's own total — otherwise a single event
   * would be counted twice nationally.
   */
  coordinatingMinistry?: string;

  // ── Identity: the four non-geographic reporters ───────────────────────────
  entityName?: string;
  /** True when the reporter picked "Others" and typed a name. */
  entityIsOther?: boolean;

  counts: ParticipationCounts;
  photos: GeoPhoto[];

  reportingOfficerName: string;
  reportingOfficerDesignation: string;
  contactNo: string;
  /** Assumption A9: mobile is OTP-verified before submit (mocked in prototype). */
  contactVerified: boolean;
  declarationAccepted: boolean;

  status: SubmissionStatus;
  verification: VerificationTag;
  /** Assumption A4: true when no photo yielded coordinates. Approver decides. */
  locationUnavailable: boolean;
  history: ApprovalEvent[];

  createdBy: string; // account id of the submitting officer
}

/** Sum of the three buckets. Derived, never stored, so it cannot drift. */
export function computeTotal(counts: ParticipationCounts): number {
  return counts.youth + counts.women + counts.others;
}

/** Total across many submissions. */
export function sumTotals(submissions: MassPledgeSubmission[]): number {
  return submissions.reduce((n, s) => n + computeTotal(s.counts), 0);
}

/** Human label for each of the five forms. */
export const REPORTER_LABEL: Record<ReporterKind, string> = {
  ADMIN_TIER: "State / UT / District / Block",
  LINE_MINISTRY: "Line Ministry / Department",
  SPIRITUAL_ORG: "Spiritual Organisation",
  HEI: "Higher Education Institution",
  GIA: "Grant-in-Aid Organisation",
};

/** Human label for each status. */
export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING_DISTRICT: "Pending District approval",
  PENDING_STATE: "Pending State/UT approval",
  APPROVED: "Approved",
  RETURNED: "Returned for correction",
};

/** The scope line shown on a submission card, e.g. "Haveli, Pune, Maharashtra". */
export function submissionScopeLabel(submission: MassPledgeSubmission): string {
  if (submission.reporterKind === "ADMIN_TIER") {
    return [submission.block, submission.district, submission.state].filter(Boolean).join(", ");
  }
  return submission.entityName ?? "";
}
