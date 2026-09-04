"use client";

// DS Audit: Badge ✅ · Alert ✅ · Button ✅ · EmptyState ✅ — all @mosje/design-system.
// SubmissionsTable and SubmissionForm compose DS primitives only.

import * as React from "react";
import Link from "next/link";
import { Alert, Badge, Icon, SegmentedControl } from "@mosje/design-system";
import { AdminShell } from "@/components/nmba/admin-shell";
import { SubmissionForm } from "@/components/nmba/mass-pledge/submission-form";
import { SubmissionsTable } from "@/components/nmba/mass-pledge/submissions-table";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { useMassPledgeStore } from "@/lib/nmba/mass-pledge/store";
import {
  EVENT_DATE,
  EVENT_DATE_LABEL,
  reporterKindForSession,
  windowState,
  type WindowState,
} from "@/lib/nmba/mass-pledge/masters";
import {
  byNewest,
  findExistingSubmission,
  visibleSubmissions,
} from "@/lib/nmba/mass-pledge/workflow";
import { sumTotals } from "@/lib/nmba/mass-pledge/types";

const BASE = "/portals/nmba/admin/mass-pledge";
const IS_DEV = process.env.NODE_ENV === "development";

const fmt = (n: number) => n.toLocaleString("en-IN");

/** Scope wording for the reports heading, so each role knows what it is seeing. */
function scopeCaption(role: string): string {
  switch (role) {
    case "ADMIN":
      return "All reports nationally";
    case "STATE":
      return "Reports from your State/UT";
    case "DISTRICT":
      return "Reports from your district";
    case "BLOCK":
      return "Reports from your block";
    default:
      return "Your reports";
  }
}

export default function MassPledgePage() {
  // Dev-only, so reviewers can see all three states without changing the clock.
  const [override, setOverride] = React.useState<WindowState | undefined>(undefined);
  const state = windowState(new Date(), override);
  const isOpen = state === "OPEN";

  const session = usePortalSession();
  const { submissions } = useMassPledgeStore();

  const visible = byNewest(visibleSubmissions(submissions, session));
  const reporterKind = reporterKindForSession(session);
  const existing = findExistingSubmission(submissions, session, EVENT_DATE);
  const showForm = isOpen && reporterKind !== null && !existing;

  const counted = visible.filter((s) => s.status === "APPROVED");
  const pending = visible.filter(
    (s) => s.status === "PENDING_DISTRICT" || s.status === "PENDING_STATE",
  );

  return (
    <AdminShell>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <header className="mb-8 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-label-3 uppercase text-ink-hint">
            Nasha Mukt Bharat Abhiyaan
          </p>
          <h1 className="mt-1 text-headline-1 text-ink">
            National Pledge Against Drug Abuse
          </h1>
          <p className="mt-1 text-body-2 text-ink-muted">{EVENT_DATE_LABEL}</p>
        </div>

        {isOpen ? (
          <Badge status="success" dot>
            Reporting open today
          </Badge>
        ) : (
          <Badge status="neutral">
            {state === "BEFORE" ? `Opens ${EVENT_DATE_LABEL}` : "Reporting closed"}
          </Badge>
        )}
      </header>

      {/* ── Reporting form: on the day of the event only ─────────────────── */}
      {showForm && (
        <section className="mb-10">
          <div className="mb-4 border-l-2 border-navy pl-4">
            <h2 className="text-headline-3 text-ink">Report your participation</h2>
            <p className="mt-0.5 text-body-2 text-ink-muted">
              The form is open today only. One report per organisation.
            </p>
          </div>
          <SubmissionForm />
        </section>
      )}

      {isOpen && existing && (
        <Alert status="success" className="mb-8">
          <span className="inline-flex items-center gap-2">
            <Icon name="check_circle" size={16} className="shrink-0" aria-hidden="true" />
            Your report for {EVENT_DATE_LABEL} has been submitted.{" "}
            <Link href={`${BASE}/${existing.id}`} className="font-semibold text-navy underline">
              View it
            </Link>
          </span>
        </Alert>
      )}

      {!isOpen && (
        <Alert status="info" className="mb-8">
          <span className="inline-flex items-center gap-2">
            <Icon name="event" size={16} className="shrink-0" aria-hidden="true" />
            {state === "BEFORE"
              ? `Reporting opens on ${EVENT_DATE_LABEL} and is available on that day only. Figures reported so far are shown below.`
              : `Reporting closed on ${EVENT_DATE_LABEL}. The figures below are read-only.`}
          </span>
        </Alert>
      )}

      {/* ── Reports ─────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="text-headline-3 text-ink">Reports</h2>
          {/* Summary reads as a sentence rather than a row of cards: the table
              below is the content, and stat cards here would compete with it. */}
          {visible.length > 0 && (
            <p className="text-body-2 text-ink-muted">
              <strong className="font-semibold tabular-nums text-ink">{visible.length}</strong>{" "}
              {visible.length === 1 ? "report" : "reports"}
              <span aria-hidden="true"> · </span>
              <strong className="font-semibold tabular-nums text-ink">
                {fmt(sumTotals(counted))}
              </strong>{" "}
              participants counted
              {pending.length > 0 && (
                <>
                  <span aria-hidden="true"> · </span>
                  <strong className="font-semibold tabular-nums text-ink">{pending.length}</strong>{" "}
                  awaiting approval
                </>
              )}
            </p>
          )}
        </div>

        <p className="mb-4 text-body-2 text-ink-muted">{scopeCaption(session.role)}</p>

        <SubmissionsTable
          submissions={visible}
          caption={`Mass Pledge reports — ${EVENT_DATE_LABEL}`}
          emptyLabel={
            isOpen
              ? "No reports yet. Figures will appear here as they are submitted."
              : "No reports have been recorded within your jurisdiction."
          }
        />
      </section>

      {IS_DEV && (
        <div className="mt-10 border-t border-dashed border-line pt-4">
          <p className="mb-2 text-label-3 uppercase text-ink-hint">
            Developer control · not present in production
          </p>
          <SegmentedControl
            ariaLabel="Reporting window state (developer control)"
            options={[
              { label: "Real date", value: "REAL" },
              { label: "Before 18 Aug", value: "BEFORE" },
              { label: "On 18 Aug", value: "OPEN" },
              { label: "After 18 Aug", value: "CLOSED" },
            ]}
            value={override ?? "REAL"}
            onChange={(v) => setOverride(v === "REAL" ? undefined : (v as WindowState))}
          />
        </div>
      )}
    </AdminShell>
  );
}
