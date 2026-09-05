"use client";

// DS Audit: DataTable ✅ · Button ✅ · Badge ✅ (via StatusBadge/VerificationBadge)
// — all @mosje/design-system. No hand-rolled table markup.

import Link from "next/link";
import { DataTable } from "@mosje/design-system";
import { StatusBadge, VerificationBadge } from "./status-badge";
import {
  computeTotal,
  REPORTER_LABEL,
  submissionScopeLabel,
  type MassPledgeSubmission,
  type SubmissionStatus,
  type VerificationTag,
} from "@/lib/nmba/mass-pledge/types";

const BASE = "/portals/nmba/admin/mass-pledge";

// Type alias, not interface: DataTable constrains its row to
// `Record<string, unknown>`, and only type aliases get an implicit index signature.
type ReportRow = {
  id: string;
  reporter: string;
  kind: string;
  participants: number;
  status: SubmissionStatus;
  verification: VerificationTag;
  photos: number;
  unlocated: boolean;
};

function toRow(s: MassPledgeSubmission): ReportRow {
  return {
    id: s.id,
    reporter: submissionScopeLabel(s) || REPORTER_LABEL[s.reporterKind],
    kind: REPORTER_LABEL[s.reporterKind],
    participants: computeTotal(s.counts),
    status: s.status,
    verification: s.verification,
    photos: s.photos.length,
    unlocated: s.locationUnavailable,
  };
}

const fmt = (n: number) => n.toLocaleString("en-IN");

export function SubmissionsTable({
  submissions,
  caption,
  emptyLabel,
}: {
  submissions: MassPledgeSubmission[];
  caption: string;
  emptyLabel: string;
}) {
  const rows = submissions.map(toRow);

  return (
    <DataTable<ReportRow>
      data={rows}
      total={rows.length}
      caption={caption}
      emptyLabel={emptyLabel}
      columns={[
        {
          key: "reporter",
          header: "Reporter",
          exportValue: (r) => r.reporter,
          render: (r) => (
            <Link
              href={`${BASE}/${r.id}`}
              className="block max-w-[28ch] font-medium text-navy hover:underline"
            >
              {r.reporter}
              {/* The kind is context, not the headline — it sits under the name
                  at a lower weight rather than competing as its own column. */}
              <span className="mt-0.5 block truncate text-body-3 text-ink-muted">
                {r.kind}
              </span>
            </Link>
          ),
        },
        {
          key: "participants",
          header: "Participants",
          className: "text-right",
          exportValue: (r) => String(r.participants),
          render: (r) => (
            <span className="block text-right font-semibold tabular-nums text-ink">
              {fmt(r.participants)}
            </span>
          ),
        },
        {
          key: "photos",
          header: "Photos",
          className: "text-right",
          exportValue: (r) => String(r.photos),
          render: (r) => (
            <span className="block text-right tabular-nums text-ink-muted">
              {r.photos}
              {r.unlocated && (
                <span className="ml-1 text-await-fg" title="No location recorded">
                  ·
                </span>
              )}
            </span>
          ),
        },
        {
          key: "verification",
          header: "Source",
          exportValue: (r) => (r.verification === "VERIFIED" ? "Verified" : "Self-declared"),
          render: (r) => <VerificationBadge verification={r.verification} />,
        },
        {
          key: "status",
          header: "Status",
          exportValue: (r) => r.status,
          render: (r) => <StatusBadge status={r.status} />,
        },
      ]}
    />
  );
}
