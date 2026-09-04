"use client";

/**
 * My Applications — the applicant's register of every grant application.
 *
 * DS Audit: DataTable ✅ existing (extended with `showPageSizes` for the government range
 * label) · Badge ✅ · Button ✅ · Icon ✅ · Input ✅ · Select ✅ · FormField ✅ — nothing new.
 *
 * Header, search placeholder, scheme filter, the six status chips, the nine columns and the
 * "Showing 1–10 of N" pager are all transcribed from the live screen (walkthrough 2026-08-22).
 */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  DataTable,
  Icon,
  Input,
  Select,
  type DataTableColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import {
  NGO_STATUS_FILTERS,
  formatDate,
  formatGrant,
  matchesNgoFilter,
  ngoApplications,
  ngoStatusLabel,
  statusTone,
  type NgoStatusFilter,
} from "@/lib/e-anudaan/selectors";
import type { GrantApplication } from "@/lib/e-anudaan/types";

const SCHEME_LABELS: Record<string, string> = {
  AVYAY: "AVYAY (Atal Vayo Abhyuday Yojana)",
  SHRESHTA_M2: "SHRESHTA Mode 2",
  SMILE: "SMILE (Garima Greh)",
  NAPDDR: "NAPDDR",
};

export default function MyApplicationsPage() {
  const { state, act } = useEAnudaan();
  const [filter, setFilter] = React.useState<NgoStatusFilter>("All");
  const [scheme, setScheme] = React.useState("");
  const [query, setQuery] = React.useState("");

  const ngo = state.ngos[0];
  const all = React.useMemo(() => (ngo ? ngoApplications(state, ngo.id) : []), [state, ngo]);

  const schemes = React.useMemo(
    () => Array.from(new Set(all.map((a) => a.schemeCode))).sort(),
    [all],
  );

  const rows = all.filter((a) => {
    if (!matchesNgoFilter(a, filter)) return false;
    if (scheme && a.schemeCode !== scheme) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${a.id} ${a.schemeCode} ${a.projectLabel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const COLUMNS: DataTableColumn<GrantApplication>[] = [
    { key: "id", header: "Reference" },
    { key: "schemeCode", header: "Scheme" },
    { key: "projectLabel", header: "Project" },
    { key: "financialYear", header: "FY" },
    { key: "total", header: "Requested", render: (a) => formatGrant(a.total) },
    { key: "sanctioned", header: "Sanctioned", render: (a) => (a.sanction ? formatGrant(a.sanction.total) : "—") },
    { key: "submittedAt", header: "Submitted", render: (a) => (a.submittedAt ? formatDate(a.submittedAt) : "—") },
    {
      key: "status",
      header: "Status",
      render: (a) => <Badge status={statusTone(a.status)}>{ngoStatusLabel(a)}</Badge>,
    },
    {
      key: "action",
      header: "Action",
      noExport: true,
      render: (a) =>
        a.status === "Draft" ? (
          <Button size="sm" onClick={() => act(a.id, "submit", { remarks: "Submitted by the applicant." })}>
            Submit
          </Button>
        ) : (
          <Link
            href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(a.id)}`}
            className="flex items-center gap-1 text-label-2 font-semibold text-primary hover:underline"
            aria-label={`View application ${a.id}`}
          >
            View <span aria-hidden="true">→</span>
          </Link>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-1 text-ink">My Applications</h1>
          <p className="mt-1 text-body-2 text-ink-muted">
            All grant applications submitted by your organisation.
          </p>
        </div>
        <Link href="/portals/e-anudaan/apply-grant">
          <Button appearance="filled">
            <Icon name="add" size={16} aria-hidden /> New Application
          </Button>
        </Link>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[16rem] flex-1">
          <label htmlFor="app-search" className="sr-only">
            Search applications
          </label>
          <Input
            id="app-search"
            type="search"
            value={query}
            placeholder="Search by reference, scheme, project..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="min-w-[14rem]">
          <label htmlFor="scheme-filter" className="sr-only">
            Filter by scheme
          </label>
          <Select
            id="scheme-filter"
            aria-label="Filter by scheme"
            value={scheme}
            onChange={(e) => setScheme(e.target.value)}
          >
            <option value="">All schemes</option>
            {schemes.map((code) => (
              <option key={code} value={code}>
                {SCHEME_LABELS[code] ?? code}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {NGO_STATUS_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full border px-3 py-1 text-label-1 transition-colors ${
              filter === f
                ? "border-navy bg-navy text-white"
                : "border-line bg-surface text-ink hover:bg-surface-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
        <DataTable
          columns={COLUMNS as unknown as DataTableColumn<Record<string, unknown>>[]}
          data={rows as unknown as Record<string, unknown>[]}
          total={rows.length}
          showPageSizes={false}
          caption="My applications"
          emptyLabel="No applications match these filters."
        />
      </section>
    </div>
  );
}
