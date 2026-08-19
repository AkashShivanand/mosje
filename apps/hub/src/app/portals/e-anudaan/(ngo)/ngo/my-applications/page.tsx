"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, Button, DataTable, type DataTableColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, ngoApplications, statusTone } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import type { GrantApplication } from "@/lib/e-anudaan/types";

const FILTERS = ["All", "Submitted", "In Review", "Approved", "Query / Returned"] as const;

/** Columns and filter chips transcribed from the live My Applications screen (user INVENTORY §2). */
export default function MyApplicationsPage() {
  const { state, act } = useEAnudaan();
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const ngo = state.ngos[0];
  const all = ngo ? ngoApplications(state, ngo.id) : [];

  const rows = all.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Submitted") return a.status === "Submitted";
    if (filter === "Approved") return !!a.sanction;
    if (filter === "Query / Returned") return a.status === "QueryRaised" || a.status === "Returned" || a.status === "DeficiencyRaised";
    return a.holder.kind === "chain" || a.holder.kind === "pd";
  });

  const COLUMNS: DataTableColumn<GrantApplication>[] = [
    { key: "id", header: "Reference" },
    { key: "schemeCode", header: "Scheme" },
    { key: "projectLabel", header: "Project" },
    { key: "financialYear", header: "FY" },
    { key: "total", header: "Requested", render: (a) => formatGrant(a.total) },
    { key: "sanctioned", header: "Sanctioned", render: (a) => (a.sanction ? formatGrant(a.sanction.total) : "—") },
    { key: "submittedAt", header: "Submitted", render: (a) => (a.submittedAt ? formatDate(a.submittedAt) : "—") },
    { key: "status", header: "Status", render: (a) => <Badge status={statusTone(a.status)}>{statusLabel(a)}</Badge> },
    {
      key: "action",
      header: "Action",
      render: (a) =>
        a.status === "Draft" ? (
          <Button
            size="sm"
            onClick={() => act(a.id, "submit", { remarks: "Submitted by the applicant." })}
          >
            Submit
          </Button>
        ) : (
          <Link
            href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(a.id)}`}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View <span aria-hidden="true">→</span>
          </Link>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">My Applications</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3 py-1 text-sm ${
              filter === f ? "border-navy bg-navy text-white" : "border-line bg-surface text-ink hover:bg-surface-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
        <DataTable columns={COLUMNS as unknown as DataTableColumn<Record<string, unknown>>[]} data={rows as unknown as Record<string, unknown>[]} total={rows.length} caption="My applications" />
      </section>
    </div>
  );
}
