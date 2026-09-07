"use client";

/**
 * My Applications — the applicant's register of every grant application.
 *
 * DS Audit: WorklistScreen ✅ existing · Badge ✅ · Button ✅ · Icon ✅ · Input ✅ ·
 * Select ✅ — nothing new. The table, its pager, the count line, the empty and
 * filtered-to-nothing states and the phone's card list are all the template's.
 *
 * Header, search placeholder, scheme filter, the six status chips, the nine columns and the
 * "Showing 1–10 of N" pager are all transcribed from the live screen (walkthrough 2026-08-22).
 */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Icon,
  Input,
  Select,
  WorklistScreen,
  type WorklistColumn,
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

  const COLUMNS: WorklistColumn<GrantApplication>[] = [
    { key: "id", header: "Reference", priority: 2 },
    { key: "schemeCode", header: "Scheme", priority: 2 },
    /* The project is what an applicant recognises their own application by. */
    { key: "projectLabel", header: "Project", priority: 1 },
    { key: "financialYear", header: "FY", priority: 3 },
    { key: "total", header: "Requested", priority: 2, render: (a) => formatGrant(a.total) },
    { key: "sanctioned", header: "Sanctioned", priority: 3, render: (a) => (a.sanction ? formatGrant(a.sanction.total) : "—") },
    { key: "submittedAt", header: "Submitted", priority: 3, render: (a) => (a.submittedAt ? formatDate(a.submittedAt) : "—") },
    {
      key: "status",
      header: "Status",
      priority: 2,
      render: (a) => <Badge status={statusTone(a.status)}>{ngoStatusLabel(a)}</Badge>,
    },
  ];

  const rowAction = (a: GrantApplication) =>
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
    );

  /* The REAL predicate, not the presence of a control. A default "All schemes"
     and the "All" status chip are not filters, and counting them would tell an
     applicant with no applications to try clearing filters they never set. */
  const activeFilterCount =
    (filter !== "All" ? 1 : 0) + (scheme ? 1 : 0) + (query.trim() ? 1 : 0);

  const clearFilters = () => {
    setFilter("All");
    setScheme("");
    setQuery("");
  };

  return (
    <WorklistScreen
      title="My Applications"
      meta="All grant applications submitted by your organisation."
      columns={COLUMNS}
      rows={rows}
      registerTotal={all.length}
      getRowId={(a) => a.id}
      noun="application"
      rowActions={rowAction}
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      actions={
        <Link href="/portals/e-anudaan/apply-grant">
          <Button appearance="filled">
            <Icon name="add" size={16} aria-hidden /> New Application
          </Button>
        </Link>
      }
      filters={
        <>
          <div>
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
          <div>
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
        </>
      }
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading your applications",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try again",
        /* Two different sentences, because they need two different actions:
           nothing applied for yet, versus applied for but excluded by a filter
           the applicant themselves set. */
        emptyTitle: "You Have Not Applied for a Grant Yet",
        emptyDescription: "Start an application and it will appear here.",
        filteredTitle: "No Applications Match Your Filters",
        filteredDescription: "Clear the filters to see every application from your organisation.",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
