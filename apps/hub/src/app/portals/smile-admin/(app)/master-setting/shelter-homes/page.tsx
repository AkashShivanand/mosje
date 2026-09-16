"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SHELTER_HOMES, type ShelterHome } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Button, Icon, WorklistScreen, buttonClasses, type WorklistColumn } from "@mosje/design-system";

type Row = ShelterHome & { shelterType: string; contact: string } & Record<string, unknown>;

const ROWS: Row[] = SHELTER_HOMES.map((s, i) => ({
  ...s,
  shelterType: i % 3 === 0 ? "Government" : "NGO-run",
  contact: s.manager,
}));

const STATES = ["All States / UTs", ...Array.from(new Set(ROWS.map((s) => s.state)))];
const TYPES = ["Type", "Government", "NGO-run"];
const STATUSES = ["Operational status", "Active", "Audit", "Closed"];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const COLUMNS: WorklistColumn<Row>[] = [
  {
    key: "sno",
    header: "#",
    priority: 3,
    className: "w-10 tabular-nums text-ink-hint",
    render: (s) => ROWS.indexOf(s) + 1,
    exportValue: (s) => String(ROWS.indexOf(s) + 1),
  },
  { key: "name", header: "Name", priority: 1, sortable: true, className: "font-semibold text-ink" },
  { key: "shelterType", header: "Type", priority: 2, sortable: true },
  { key: "state", header: "State", priority: 2, sortable: true },
  { key: "district", header: "District / City", priority: 2, sortable: true },
  { key: "ia", header: "Linked IA", priority: 3, className: "text-ink-muted" },
  {
    key: "capacity",
    header: "Capacity",
    priority: 2,
    sortable: true,
    className: "text-right tabular-nums",
    sortValue: (s) => s.capacity,
    render: (s) => formatNumber(s.capacity),
  },
  {
    key: "occupancy",
    header: "Occupancy",
    priority: 2,
    sortable: true,
    className: "text-right tabular-nums",
    // Sorted on how FULL the shelter is, not on the headcount: a full 60-bed
    // shelter needs attention before a half-empty 150-bed one.
    sortValue: (s) => s.occupancy / s.capacity,
    render: (s) => formatNumber(s.occupancy),
  },
  {
    key: "status",
    header: "Status",
    priority: 1,
    sortable: true,
    render: (s) => (
      <Badge status={statusTone(s.status)} dot>
        {s.status}
      </Badge>
    ),
    exportValue: (s) => s.status,
  },
  { key: "contact", header: "Contact", priority: 3, className: "text-ink-muted" },
];

/**
 * The shelter master — the live portal's `/master-setting/shelter-homes`.
 *
 * This route previously redirected to the Master Settings tab rail, on the
 * assumption that shelter data was not a separate master. It is: the live
 * portal serves a full register here, with Add, Edit and Delete, which the tab
 * rail does not offer for anything.
 *
 * `WorklistScreen` and not the read-only masters screen for the same reason —
 * every row here has an action, where every row on the tab rail is read-only.
 */
export default function ShelterMasterPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [type, setType] = useState(TYPES[0]!);
  const [status, setStatus] = useState(STATUSES[0]!);

  const rows = useMemo(
    () =>
      ROWS.filter(
        (s) =>
          (!search || `${s.name} ${s.contact} ${s.district}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || s.state === state) &&
          (type === TYPES[0] || s.shelterType === type) &&
          (status === STATUSES[0] || s.status === status),
      ),
    [search, state, type, status],
  );

  const activeFilterCount =
    (search ? 1 : 0) + (state === STATES[0] ? 0 : 1) + (type === TYPES[0] ? 0 : 1) + (status === STATUSES[0] ? 0 : 1);

  function clearFilters() {
    setSearch("");
    setState(STATES[0]!);
    setType(TYPES[0]!);
    setStatus(STATUSES[0]!);
  }

  return (
    <WorklistScreen
      eyebrow="System · Master Settings"
      title="Swashraya (Shelter Homes)"
      meta="Create and manage Swashraya (Shelter Homes); configure the Skills & Training programmes each shelter offers."
      actions={
        <div className="flex flex-wrap items-center gap-sm">
          <Button size="sm">
            <Icon name="add" size={16} /> Add Swashraya (Shelter Home)
          </Button>
          <ExportMenu
            filename="smile-shelter-master"
            title="Swashraya (Shelter Homes)"
            subtitle="The shelter master register"
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Type", accessor: "shelterType" },
              { header: "State", accessor: "state" },
              { header: "District / City", accessor: "district" },
              { header: "Linked IA", accessor: "ia" },
              { header: "Capacity", accessor: "capacity" },
              { header: "Occupancy", accessor: "occupancy" },
              { header: "Status", accessor: "status" },
              { header: "Contact", accessor: "contact" },
            ]}
            rows={rows}
          />
        </div>
      }
      filters={
        <>
          <SearchField
            placeholder="Search name / contact / address"
            label="Search the shelter master"
            value={search}
            onChange={setSearch}
          />
          <select aria-label="State or Union Territory" value={state} onChange={(e) => setState(e.target.value)} className={SELECT}>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)} className={SELECT}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select aria-label="Operational status" value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={COLUMNS}
      rows={rows}
      registerTotal={ROWS.length}
      getRowId={(s) => s.id}
      rowActions={(s) => (
        <div className="flex gap-xs">
          <Link href={`/portals/smile-admin/shelter-homes?edit=${s.id}`} className={buttonClasses("primary", "outlined", "sm")}>
            Edit
          </Link>
          <Button size="sm" variant="danger" appearance="text">
            Delete
          </Button>
        </div>
      )}
      count={rows.length}
      filtered={activeFilterCount > 0}
      noun="shelter home"
      copy={{
        idleTitle: "Search the Shelter Master",
        loadingLabel: "Loading the shelter master",
        errorTitle: "The Shelter Master Could Not Be Loaded",
        errorDescription: "The register did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Shelter Home Recorded",
        emptyDescription: "No Swashraya (Shelter Home) has been added yet.",
        filteredTitle: "No Shelter Home Matches These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
