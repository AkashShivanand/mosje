"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { DISTRICT_OFFICERS, type DistrictOfficer } from "@/lib/smile-admin/approvals";
import { Badge, Icon, WorklistScreen, buttonClasses, type WorklistColumn } from "@mosje/design-system";

type Row = DistrictOfficer & Record<string, unknown>;

const STATES = ["All States / UTs", ...Array.from(new Set(DISTRICT_OFFICERS.map((o) => o.state)))];
const STATUSES = ["All statuses", "Active", "Invited", "Suspended"];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const TONE = { Active: "success", Invited: "info", Suspended: "danger" } as const;

/* Columns transcribed from the live screen: Name, Location, Surveys, Mobile,
   Email, Status. The designation sits under the name rather than in a column of
   its own — the live register has no column for it, and dropping it entirely
   would lose the one thing that distinguishes two officers with the same name. */
const COLUMNS: WorklistColumn<Row>[] = [
  {
    key: "name",
    header: "Name",
    priority: 1,
    sortable: true,
    render: (o) => (
      <>
        <div className="font-semibold text-ink">{o.name}</div>
        <div className="text-label-2 text-ink-muted">{o.designation}</div>
      </>
    ),
    exportValue: (o) => `${o.name} — ${o.designation}`,
  },
  {
    key: "district",
    header: "Location",
    priority: 1,
    sortable: true,
    render: (o) => (
      <>
        {o.district} <span className="text-ink-muted">/ {o.state}</span>
      </>
    ),
    exportValue: (o) => `${o.district} / ${o.state}`,
  },
  {
    key: "locations",
    header: "Surveys",
    priority: 2,
    sortable: true,
    className: "text-right tabular-nums",
    sortValue: (o) => o.locations,
  },
  { key: "mobile", header: "Mobile", priority: 2, className: "font-mono text-body-2 text-ink-muted" },
  { key: "email", header: "Email", priority: 3, className: "text-ink-muted" },
  {
    key: "status",
    header: "Status",
    priority: 1,
    sortable: true,
    render: (o) => (
      <Badge status={TONE[o.status]} dot>
        {o.status}
      </Badge>
    ),
    exportValue: (o) => o.status,
  },
];

/**
 * `WorklistScreen`, per docs/design-system/screen-templates.md §2: this sits
 * under Access Control, and the reader acts on the rows — an officer is
 * suspended, re-invited, or has their district reassigned.
 *
 * Rebuilt from the live screen. An earlier version titled this "District
 * Officers" and gave it columns of its own, because a crawl that follows links
 * could not reach `/do-list` and it was wrongly recorded as a route the portal
 * does not serve. The portal serves it; the title and the six columns are its.
 */
export default function DistrictOfficersPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [status, setStatus] = useState(STATUSES[0]!);

  const rows = useMemo(
    () =>
      DISTRICT_OFFICERS.filter(
        (o) =>
          (!search || `${o.name} ${o.district} ${o.email}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || o.state === state) &&
          (status === STATUSES[0] || o.status === status),
      ),
    [search, state, status],
  );

  const activeFilterCount =
    (search ? 1 : 0) + (state === STATES[0] ? 0 : 1) + (status === STATUSES[0] ? 0 : 1);

  function clearFilters() {
    setSearch("");
    setState(STATES[0]!);
    setStatus(STATUSES[0]!);
  }

  return (
    <WorklistScreen
      eyebrow="Access Control"
      title="Implementing Authority / Nodal Officers"
      meta="All registered district officers."
      actions={
        <ExportMenu
          filename="smile-district-officers"
          title="District Officers"
          subtitle="All registered district officers"
          columns={[
            { header: "Officer", accessor: "name" },
            { header: "Designation", accessor: "designation" },
            { header: "Email", accessor: "email" },
            { header: "Mobile", accessor: "mobile" },
            { header: "State", accessor: "state" },
            { header: "District", accessor: "district" },
            { header: "Surveys", accessor: "locations" },
            { header: "Status", accessor: "status" },
          ]}
          rows={rows}
        />
      }
      filters={
        <>
          <SearchField
            placeholder="Search officer, district or email…"
            label="Search district officers"
            value={search}
            onChange={setSearch}
          />
          <select aria-label="State or Union Territory" value={state} onChange={(e) => setState(e.target.value)} className={SELECT}>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={COLUMNS}
      rows={rows as Row[]}
      registerTotal={DISTRICT_OFFICERS.length}
      getRowId={(o) => o.id}
      rowActions={(o) => (
        <Link href={`/portals/smile-admin/users?officer=${o.id}`} className={buttonClasses("primary", "outlined", "sm")}>
          <Icon name="visibility" size={16} /> View
        </Link>
      )}
      count={rows.length}
      filtered={activeFilterCount > 0}
      noun="district officer"
      copy={{
        idleTitle: "Choose a State to List Its Officers",
        loadingLabel: "Loading district officers",
        errorTitle: "District Officers Could Not Be Loaded",
        errorDescription: "The register did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No District Officer Onboarded",
        emptyDescription: "No District Nodal Officer has been onboarded yet.",
        filteredTitle: "No District Officer Matches These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
