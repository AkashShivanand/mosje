"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { SHELTER_HOMES, type ShelterHome } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Button, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

/** Occupancy crosses into warning at 75% and into danger at 90%. */
function occupancyTone(pct: number) {
  return pct >= 90 ? "bg-danger" : pct >= 75 ? "bg-warning" : "bg-primary";
}

const COLUMNS: DataTableColumn<ShelterHome & Record<string, unknown>>[] = [
  {
    key: "name",
    header: "Shelter",
    sortable: true,
    render: (s) => (
      <>
        <div className="font-semibold text-ink">{s.name}</div>
        <div className="font-mono text-body-2 text-ink-hint">{s.id}</div>
      </>
    ),
    exportValue: (s) => s.name,
  },
  {
    key: "state",
    header: "State / District",
    sortable: true,
    render: (s) => (
      <>
        {s.state} <span className="text-ink-muted">/ {s.district}</span>
      </>
    ),
    exportValue: (s) => `${s.state} / ${s.district}`,
  },
  { key: "manager", header: "Manager", sortable: true },
  { key: "ia", header: "Implementing Agency", sortable: true, className: "text-ink-muted" },
  {
    key: "capacity",
    header: "Capacity",
    sortable: true,
    className: "text-right font-mono tabular-nums",
    render: (s) => formatNumber(s.capacity),
    sortValue: (s) => s.capacity,
  },
  {
    key: "occupancy",
    header: "Occupancy",
    sortable: true,
    // Sorted on the PROPORTION, which is what the bar draws — sorting on the
    // raw count would put a full 40-bed shelter below a half-empty 400-bed one.
    sortValue: (s) => s.occupancy / s.capacity,
    render: (s) => {
      const pct = Math.round((s.occupancy / s.capacity) * 100);
      return (
        <div className="flex items-center gap-sm">
          <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
            <div className={`h-full rounded-full ${occupancyTone(pct)}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-label-2 tabular-nums text-ink">{pct}%</span>
        </div>
      );
    },
    exportValue: (s) => `${Math.round((s.occupancy / s.capacity) * 100)}%`,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (s) => (
      <Badge status={statusTone(s.status)} dot>
        {s.status}
      </Badge>
    ),
    exportValue: (s) => s.status,
  },
  {
    key: "actions",
    header: "Actions",
    className: "text-right",
    noExport: true,
    render: () => (
      <Link href="/portals/smile-admin/shelter-homes/beneficiaries" className={buttonClasses("primary", "outlined", "sm")}>
        View occupants
      </Link>
    ),
  },
];

export default function ShelterHomesPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => SHELTER_HOMES.filter((s) => `${s.name} ${s.state} ${s.district}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const totalCapacity = data.reduce((s, h) => s + h.capacity, 0);
  const totalOccupancy = data.reduce((s, h) => s + h.occupancy, 0);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Homes" }]}
        eyebrow="Beneficiaries"
        title="Shelter homes"
        subtitle="Certified rehabilitation shelters across India — track capacity, occupancy, and audit status."
        actions={
          <Button size="sm">
            <Icon name="add" size={14} /> Add shelter
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Shelters"   value={data.length}     icon="apartment" tone="primary" />
        <StatPill label="Capacity"   value={totalCapacity}   icon="home"      tone="info" />
        <StatPill label="Occupants"  value={totalOccupancy}  icon="group"     tone="success" />
        <StatPill label="Audits due" value={data.filter((s) => s.status === "Audit").length} icon="apartment" tone="warning" />
      </div>
      <DataToolbar>
        <SearchField placeholder="Search shelter / state / district…" value={search} onChange={setSearch} />
      </DataToolbar>
      {/* Mobile card list */}
      <div className="space-y-sm md:hidden">
        {data.map((s) => {
          const occPct = Math.round((s.occupancy / s.capacity) * 100);
          const occColor =
            occPct >= 90 ? "bg-danger" : occPct >= 75 ? "bg-warning" : "bg-primary";
          return (
            <div
              key={s.id}
              className="space-y-sm rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
            >
              <div className="flex items-start justify-between gap-sm">
                <div className="min-w-0 space-y-0.5">
                  <div className="truncate text-body-1 font-semibold text-ink">
                    {s.name}
                  </div>
                  <div className="font-mono text-body-2 text-ink-hint">
                    {s.id} · {s.state} / {s.district}
                  </div>
                </div>
                <Badge status={statusTone(s.status)} dot>
                  {s.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-sm border-t border-stroke-100 pt-sm text-body-3">
                <div className="space-y-0.5">
                  <div className="text-ink-hint">Manager</div>
                  <div className="truncate font-semibold text-ink">{s.manager}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-ink-hint">Capacity</div>
                  <div className="font-mono font-semibold text-ink">
                    {formatNumber(s.capacity)}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-xs flex items-center justify-between text-body-3">
                  <span className="text-ink-hint">Occupancy</span>
                  <span className="font-mono font-semibold text-ink">{occPct}%</span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${occColor}`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
              </div>
              <Link href="/portals/smile-admin/shelter-homes/beneficiaries" className={buttonClasses("primary", "outlined", "sm", "w-full")}>View occupants</Link>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={COLUMNS}
          data={data as Array<ShelterHome & Record<string, unknown>>}
          total={data.length}
          caption="Shelter homes, their capacity, occupancy and audit status"
          emptyLabel="No shelter matches this search."
        />
      </div>
    </div>
  );
}
