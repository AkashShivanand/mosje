"use client";

// DS Audit: Badge ✅ existing

import { Badge } from "@mosje/design-system";
import { STATUS_LABEL, type SubmissionStatus, type VerificationTag } from "@/lib/nmba/mass-pledge/types";

const STATUS_TONE: Record<SubmissionStatus, "success" | "warning" | "info" | "neutral"> = {
  APPROVED: "success",
  RETURNED: "warning",
  PENDING_DISTRICT: "info",
  PENDING_STATE: "info",
};

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <Badge status={STATUS_TONE[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

/**
 * Assumption A8 made visible. Verified figures travelled the approval chain;
 * self-declared ones did not. The two must never read as the same thing, so
 * this badge appears anywhere a figure does.
 */
export function VerificationBadge({ verification }: { verification: VerificationTag }) {
  return verification === "VERIFIED" ? (
    <Badge status="success" emphasis="subtle">
      Verified
    </Badge>
  ) : (
    <Badge status="neutral" emphasis="subtle">
      Self-declared
    </Badge>
  );
}
