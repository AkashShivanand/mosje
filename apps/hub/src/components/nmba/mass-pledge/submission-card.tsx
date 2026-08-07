"use client";

// DS Audit: Card ✅ · Badge ✅ · Button ✅ — all @mosje/design-system.

import Link from "next/link";
import { Card, Icon } from "@mosje/design-system";
import { StatusBadge, VerificationBadge } from "./status-badge";
import {
  computeTotal,
  REPORTER_LABEL,
  submissionScopeLabel,
  type MassPledgeSubmission,
} from "@/lib/nmba/mass-pledge/types";

const BASE = "/portals/nmba/admin/mass-pledge";

export function SubmissionCard({ submission }: { submission: MassPledgeSubmission }) {
  const total = computeTotal(submission.counts);
  const scope = submissionScopeLabel(submission);

  return (
    <Card>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`${BASE}/${submission.id}`}
              className="text-base font-semibold text-navy hover:underline"
            >
              {scope || REPORTER_LABEL[submission.reporterKind]}
            </Link>
            <p className="mt-0.5 text-xs text-ink-muted">
              {REPORTER_LABEL[submission.reporterKind]}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            <StatusBadge status={submission.status} />
            <VerificationBadge verification={submission.verification} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="group" size={16} aria-hidden="true" />
            <strong className="font-semibold tabular-nums text-ink">
              {total.toLocaleString("en-IN")}
            </strong>{" "}
            participants
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="location_on" size={16} aria-hidden="true" />
            {submission.photos.length} photo{submission.photos.length === 1 ? "" : "s"}
            {submission.locationUnavailable && (
              <span className="text-await-fg"> · no location</span>
            )}
          </span>
        </div>

        <p className="text-xs text-ink-hint">
          Reported by {submission.reportingOfficerName}, {submission.reportingOfficerDesignation}
        </p>
      </div>
    </Card>
  );
}
