"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, DataTable, Icon, Search, type DataTableColumn } from "@mosje/design-system";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { formatDate, formatGrant, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";

export type WorklistVariant = "queue" | "explorer" | "sanctioned" | "rejected" | "forwarded";

/**
 * The application table behind every officer list screen.
 *
 * One component, five column sets — the live portal uses a different set per screen but the
 * same anatomy (toolbar with search, a "Showing n of m" count, and a link-style action in the
 * last cell). Column headers are transcribed verbatim from the captures.
 */
export function WorklistTable({
  rows,
  variant = "queue",
  reviewBase,
  caption,
}: {
  rows: GrantApplication[];
  variant?: WorklistVariant;
  /** e.g. "/portals/e-anudaan/dashboard/sm2/aso/review" — omit for read-only screens. */
  reviewBase?: string;
  caption: string;
}) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (r) => r.id.toLowerCase().includes(needle) || r.projectLabel.toLowerCase().includes(needle),
    );
  }, [rows, q]);

  const action = (row: GrantApplication): React.ReactNode =>
    reviewBase ? (
      <Link
        href={`${reviewBase}/${encodeURIComponent(row.id)}`}
        className="inline-flex items-center gap-1 font-semibold text-navy hover:underline"
      >
        <Icon name="open_in_new" size={16} aria-hidden />
        {variant === "queue" || variant === "explorer" ? "Review" : "View"}
      </Link>
    ) : (
      <span className="text-ink-hint">—</span>
    );

  const status = (row: GrantApplication): React.ReactNode => (
    <Badge status={statusTone(row.status)}>{statusLabel(row)}</Badge>
  );

  const COLUMNS: Record<WorklistVariant, DataTableColumn<GrantApplication>[]> = {
    // "My Action Queue" — GIA ID · NGO · Scheme · Type · FY · Requested · Status · Action
    queue: [
      { key: "id", header: "GIA ID" },
      { key: "projectLabel", header: "NGO" },
      { key: "schemeCode", header: "Scheme" },
      { key: "type", header: "Type", render: () => "—" },
      { key: "financialYear", header: "FY" },
      { key: "total", header: "Requested", render: (r) => formatGrant(r.total) },
      { key: "status", header: "Status", render: status },
      { key: "action", header: "Action", render: action },
    ],
    // "Application Explorer" — adds Instalment, drops Scheme/Type
    explorer: [
      { key: "id", header: "GIA ID" },
      { key: "projectLabel", header: "NGO" },
      { key: "financialYear", header: "FY" },
      { key: "instalment", header: "Instalment", render: () => "—" },
      { key: "total", header: "Requested", render: (r) => formatGrant(r.total) },
      { key: "status", header: "Status", render: status },
      { key: "action", header: "Action", render: action },
    ],
    // "Sanction Register"
    sanctioned: [
      { key: "id", header: "GIA ID" },
      { key: "projectLabel", header: "NGO" },
      { key: "financialYear", header: "FY" },
      { key: "sanctioned", header: "Sanctioned", render: (r) => (r.sanction ? formatGrant(r.sanction.total) : "—") },
      { key: "sanctionDate", header: "Sanction Date", render: (r) => (r.sanction ? formatDate(r.sanction.sanctionedAt) : "—") },
      { key: "orderNo", header: "Order No.", render: (r) => r.sanction?.orderNo ?? "—" },
      { key: "status", header: "Status", render: status },
      { key: "action", header: "Action", render: action },
    ],
    // "Returned to State GIA"
    rejected: [
      { key: "id", header: "GIA ID" },
      { key: "projectLabel", header: "NGO" },
      { key: "schemeCode", header: "Scheme" },
      { key: "where", header: "State / District", render: (r) => r.projectLabel.split("—")[1]?.trim() ?? "—" },
      { key: "returnedOn", header: "Returned On", render: (r) => formatDate(r.updatedAt) },
      { key: "reason", header: "Reason", render: (r) => r.audit[r.audit.length - 1]?.remarks ?? "—" },
      { key: "action", header: "Action", render: action },
    ],
    // "Forwarded Queue"
    forwarded: [
      { key: "id", header: "GIA ID" },
      { key: "projectLabel", header: "NGO Name" },
      { key: "schemeCode", header: "Scheme" },
      { key: "forwardedOn", header: "Forwarded On", render: (r) => formatDate(r.updatedAt) },
      { key: "status", header: "Current Status", render: status },
      { key: "action", header: "Action", render: action },
    ],
  };

  return (
    <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <Search
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by GIA ID or NGO…"
            aria-label="Search applications"
          />
        </div>
        <p className="text-sm text-ink-muted">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>
      {/* DataTable is generic over Record<string, unknown>. GrantApplication is a precise
          interface with no index signature, so it is widened here rather than loosening the
          domain model for every other consumer. */}
      <DataTable
        columns={COLUMNS[variant] as unknown as DataTableColumn<Record<string, unknown>>[]}
        data={filtered as unknown as Record<string, unknown>[]}
        total={filtered.length}
        caption={caption}
        emptyLabel="No applications in this list."
      />
    </section>
  );
}
