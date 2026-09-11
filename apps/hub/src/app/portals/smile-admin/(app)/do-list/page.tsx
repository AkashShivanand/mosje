"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { DISTRICT_OFFICERS, type DistrictOfficer } from "@/lib/smile-admin/approvals";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Icon, WorklistScreen, buttonClasses, type WorklistColumn } from "@mosje/design-system";

type Row = DistrictOfficer & Record<string, unknown>;

const STATES = ["All States / UTs", ...Array.from(new Set(DISTRICT_OFFICERS.map((o) => o.state)))];
const STATUSES = ["All statuses", "Active", "Invited", "Suspended"];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const TONE = { Active: "success", Invited: "info", Suspended: "danger" } as const;

const COLUMNS: WorklistColumn<Row>[] = [
  {
    key: "name",
    header: "Officer",
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
  { key: "email", header: "Email", priority: 3, className: "text-ink-muted" },
  { key: "mobile", header: "Mobile", priority: 3, className: "font-mono text-body-2 text-ink-muted" },
  {
    key: "district",
    header: "District",
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
    header: "Survey locations",
    priority: 2,
    sortable: true,
    className: "text-right tabular-nums",
    sortValue: (o) => o.locations,
  },
  {
    key: "beneficiaries",
    header: "Beneficiaries",
    priority: 2,
    sortable: true,
    className: "text-right tabular-nums",
    sortValue: (o) => o.beneficiaries,
    render: (o) => formatNumber(o.beneficiaries),
  },
  { key: "lastActive", header: "Last active", priority: 3, sortable: true, className: "text-ink-muted" },
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
 * The live dev portal serves no `/do-list`, so this is built from the sentence
 * the screen's own placeholder carried — "District Nodal Officers managing
 * operations across districts" — and from the vocabulary the Users register
 * already uses, rather than from a capture.
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
      title="District Officers"
      meta="District Nodal Officers running the programme in their district — the survey locations they hold, and the beneficiaries identified under them."
      actions={
        <ExportMenu
          filename="smile-district-officers"
          title="District Officers"
          subtitle="District Nodal Officers by state and district"
          columns={[
            { header: "Officer", accessor: "name" },
            { header: "Designation", accessor: "designation" },
            { header: "Email", accessor: "email" },
            { header: "Mobile", accessor: "mobile" },
            { header: "State", accessor: "state" },
            { header: "District", accessor: "district" },
            { header: "Survey locations", accessor: "locations" },
            { header: "Beneficiaries", accessor: "beneficiaries" },
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
