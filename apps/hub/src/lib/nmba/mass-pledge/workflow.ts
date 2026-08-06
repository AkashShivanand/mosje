// Mass Pledge approval engine — pure functions, no React, no storage.
//
// The chain (assumption A6 — identical regardless of coordinating ministry):
//   BLOCK    submits → PENDING_DISTRICT → PENDING_STATE → APPROVED
//   DISTRICT submits → PENDING_STATE                    → APPROVED
//   STATE    submits → APPROVED
//   ENTITY   submits → APPROVED, tagged SELF_DECLARED    (assumption A8)

import type { PortalSession } from "../committee/types";
import type {
  ApprovalEvent,
  MassPledgeSubmission,
  ReporterKind,
  SubmissionStatus,
  VerificationTag,
} from "./types";

/** Status a new submission takes, based on who filed it. */
export function initialStatus(session: PortalSession): SubmissionStatus {
  switch (session.role) {
    case "BLOCK":
      return "PENDING_DISTRICT";
    case "DISTRICT":
      return "PENDING_STATE";
    // A State officer is the top of the chain, and the four non-geographic
    // reporters have no chain at all.
    case "STATE":
    case "ENTITY":
    case "ADMIN":
      return "APPROVED";
  }
}

/** Assumption A8: only chain-approved figures are VERIFIED. */
export function initialVerification(reporterKind: ReporterKind): VerificationTag {
  return reporterKind === "ADMIN_TIER" ? "VERIFIED" : "SELF_DECLARED";
}

/** Can this session act (approve / return) on this submission right now? */
export function canApprove(submission: MassPledgeSubmission, session: PortalSession): boolean {
  // Admin is oversight-only, mirroring how Admin never registers a committee.
  if (session.role === "ADMIN" || session.role === "ENTITY" || session.role === "BLOCK") {
    return false;
  }
  if (submission.status === "PENDING_DISTRICT") {
    return (
      session.role === "DISTRICT" &&
      submission.state === session.state &&
      submission.district === session.district
    );
  }
  if (submission.status === "PENDING_STATE") {
    return session.role === "STATE" && submission.state === session.state;
  }
  return false;
}

/** Where an approved submission moves next. */
export function nextStatusOnApprove(submission: MassPledgeSubmission): SubmissionStatus {
  return submission.status === "PENDING_DISTRICT" ? "PENDING_STATE" : "APPROVED";
}

function event(
  session: PortalSession,
  action: ApprovalEvent["action"],
  remarks?: string,
): ApprovalEvent {
  return {
    at: new Date().toISOString(),
    actorAccountId: session.accountId,
    actorDisplayName: session.displayName,
    actorRole: session.role,
    action,
    ...(remarks ? { remarks } : {}),
  };
}

/** Move a submission one step up the chain. */
export function approve(
  submission: MassPledgeSubmission,
  session: PortalSession,
): MassPledgeSubmission {
  return {
    ...submission,
    status: nextStatusOnApprove(submission),
    history: [...submission.history, event(session, "APPROVED")],
  };
}

/**
 * Send a submission back for correction. Remarks are required — an approver may
 * not bounce a record without saying why (assumption A7).
 */
export function returnForCorrection(
  submission: MassPledgeSubmission,
  session: PortalSession,
  remarks: string,
): MassPledgeSubmission {
  const trimmed = remarks.trim();
  if (!trimmed) {
    throw new Error("Remarks are required when returning a submission.");
  }
  return {
    ...submission,
    status: "RETURNED",
    history: [...submission.history, event(session, "RETURNED", trimmed)],
  };
}

/** Re-enter the chain at the tier the submission started from. */
export function resubmit(
  submission: MassPledgeSubmission,
  session: PortalSession,
): MassPledgeSubmission {
  return {
    ...submission,
    status: initialStatus(session),
    history: [...submission.history, event(session, "RESUBMITTED")],
  };
}

/** Only the original submitter may edit, and only while it is RETURNED. */
export function canEdit(submission: MassPledgeSubmission, session: PortalSession): boolean {
  return submission.status === "RETURNED" && submission.createdBy === session.accountId;
}

/** Scope rules — who can see which submission. */
export function isVisibleTo(submission: MassPledgeSubmission, session: PortalSession): boolean {
  switch (session.role) {
    case "ADMIN":
      return true;
    case "STATE":
      // A State officer sees their own state's tiers, not other states and not
      // the nationally-scoped organisation reports.
      return submission.reporterKind === "ADMIN_TIER" && submission.state === session.state;
    case "DISTRICT":
      return (
        submission.reporterKind === "ADMIN_TIER" &&
        submission.state === session.state &&
        submission.district === session.district
      );
    case "BLOCK":
      return (
        submission.reporterKind === "ADMIN_TIER" &&
        submission.state === session.state &&
        submission.district === session.district &&
        submission.block === session.block
      );
    case "ENTITY":
      return submission.createdBy === session.accountId;
  }
}

export function visibleSubmissions(
  submissions: MassPledgeSubmission[],
  session: PortalSession,
): MassPledgeSubmission[] {
  return submissions.filter((s) => isVisibleTo(s, session));
}

/** Submissions this session must act on. */
export function approvalQueue(
  submissions: MassPledgeSubmission[],
  session: PortalSession,
): MassPledgeSubmission[] {
  return submissions.filter((s) => canApprove(s, session));
}

/** The step still being waited on, for ApprovalTimeline's `pendingLabel`. */
export function pendingLabel(submission: MassPledgeSubmission): string | undefined {
  switch (submission.status) {
    case "PENDING_DISTRICT":
      return "Awaiting District approval";
    case "PENDING_STATE":
      return "Awaiting State/UT approval";
    case "RETURNED":
      return "Awaiting correction by the submitting officer";
    case "APPROVED":
      return undefined;
  }
}

/**
 * The identity a submission occupies (acceptance criterion 14).
 *
 * Keyed on the ACCOUNT that filed it, not on the entity name written into the
 * record. Keying on the name was exploitable: a reporter who could choose a
 * different organisation from a dropdown produced a different key each time and
 * so never collided with their own earlier report, letting one login publish
 * unlimited self-declared figures. The account is the thing we actually
 * authenticated, so it is the thing we deduplicate on.
 */
export function submissionKey(submission: MassPledgeSubmission): string {
  return submission.createdBy;
}

/** The key a session files under, so duplicates can be detected up-front. */
export function sessionKey(session: PortalSession): string {
  // Admin never files, so it has no key and can never collide.
  return session.role === "ADMIN" ? "" : session.accountId;
}

/** An existing report by this session for this event date, if any. */
export function findExistingSubmission(
  submissions: MassPledgeSubmission[],
  session: PortalSession,
  eventDate: string,
): MassPledgeSubmission | null {
  const key = sessionKey(session);
  if (!key) return null;
  return (
    submissions.find((s) => s.eventDate === eventDate && submissionKey(s) === key) ?? null
  );
}

/** Approved figures only — what the dashboard and public counter may publish. */
export function approvedOnly(submissions: MassPledgeSubmission[]): MassPledgeSubmission[] {
  return submissions.filter((s) => s.status === "APPROVED");
}

/** Newest first. */
export function byNewest(submissions: MassPledgeSubmission[]): MassPledgeSubmission[] {
  return [...submissions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}
