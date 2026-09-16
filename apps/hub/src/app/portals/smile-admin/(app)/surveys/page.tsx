"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SURVEY_LOCATIONS, type SurveyLocation } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

type Row = SurveyLocation & { sno: number };

const COLUMNS = [
  { header: "S.No", accessor: "sno" as const },
  { header: "Survey Location", accessor: "name" as const },
  {
    header: "Implementing Agency",
    accessor: (r: Row) => r.ia ?? "Unassigned",
  },
  { header: "State", accessor: "state" as const },
  { header: "District / City", accessor: "district" as const },
  { header: "Address", accessor: (r: Row) => r.address ?? "—" },
  { header: "Pincode", accessor: (r: Row) => r.pincode ?? "—" },
];

const TABLE_COLUMNS: DataTableColumn<Row & Record<string, unknown>>[] = [
  { key: "sno", header: "S.No", className: "w-12 tabular-nums text-ink-hint" },
  { key: "name", header: "Survey Location", sortable: true, className: "font-medium text-ink" },
  {
    key: "ia",
    header: "Implementing Agency",
    sortable: true,
    render: (s) =>
      s.ia ? (
        <span className="font-medium text-ink">{s.ia}</span>
      ) : (
        <Badge status="warning" dot>
          Unassigned
        </Badge>
      ),
    exportValue: (s) => s.ia ?? "Unassigned",
    sortValue: (s) => s.ia ?? "",
  },
  { key: "state", header: "State", sortable: true },
  { key: "district", header: "District / City", sortable: true },
  {
    key: "address",
    header: "Address",
    className: "max-w-[280px] truncate text-ink-muted",
    render: (s) => <span title={s.address ?? "—"}>{s.address ?? "—"}</span>,
    exportValue: (s) => s.address ?? "—",
  },
  {
    key: "pincode",
    header: "Pincode",
    className: "font-mono text-ink-muted",
    render: (s) => s.pincode ?? "—",
  },
  {
    key: "actions",
    header: "Action",
    className: "text-right",
    noExport: true,
    render: (s) => (
      <Link href={`/portals/smile-admin/surveys/${s.id}`} className={buttonClasses("primary", "outlined", "sm")}>
        <Icon name="visibility" size={14} /> View Details
      </Link>
    ),
  },
];

export default function SurveysPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase();
    const list = SURVEY_LOCATIONS.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        (s.ia ?? "").toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        (s.address ?? "").toLowerCase().includes(q)
      );
    });
    return list.map((s, i) => ({ ...s, sno: i + 1 }));
  }, [search]);

  const stats = useMemo(() => {
    const total = SURVEY_LOCATIONS.length;
    const assigned = SURVEY_LOCATIONS.filter((s) => !!s.ia).length;
    const unassigned = total - assigned;
    const types = new Set(SURVEY_LOCATIONS.map((s) => s.type)).size;
    return { total, assigned, unassigned, types };
  }, []);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Survey Operations" }, { label: "Survey Locations" }]}
        eyebrow="Survey operations"
        title="Survey Locations"
        subtitle="Field locations where Implementing Agencies conduct beneficiary surveys."
        actions={
          <ExportMenu
            filename="smile-survey-locations"
            title="Survey Locations"
            subtitle="Field locations where Implementing Agencies conduct beneficiary surveys."
            columns={COLUMNS}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Total Locations" value={stats.total} icon="location_on" tone="info" />
        <StatPill label="Assigned to IA" value={stats.assigned} icon="verified_user" tone="success" />
        <StatPill
          label="Unassigned"
          value={stats.unassigned}
          icon="gpp_maybe"
          tone="warning"
        />
        <StatPill label="Location Types" value={stats.types} icon="layers" tone="primary" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search by location type, address, IA name, district…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <div className="ml-auto whitespace-nowrap text-label-2 text-ink-muted">
          Showing <span className="font-semibold text-ink">{rows.length}</span> of{" "}
          <span className="font-semibold text-ink">{SURVEY_LOCATIONS.length}</span>
        </div>
      </DataToolbar>

      {/* Mobile card list */}
      <ul className="space-y-sm md:hidden">
        {rows.map((s) => (
          <li
            key={s.id}
            className="space-y-sm rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0 space-y-0.5">
                <div className="text-label-3 uppercase text-ink-hint">
                  #{s.sno.toString().padStart(2, "0")}
                </div>
                <div className="truncate text-body-1 font-semibold text-ink">
                  {s.name}
                </div>
                <div className="truncate text-label-2 text-ink-muted">
                  {s.state} · {s.district}
                </div>
              </div>
              {s.ia ? (
                <Badge status="success" dot>
                  Assigned
                </Badge>
              ) : (
                <Badge status="warning" dot>
                  Unassigned
                </Badge>
              )}
            </div>
            <div className="space-y-0.5 border-t border-stroke-100 pt-sm text-body-3">
              <div>
                <span className="text-ink-hint">IA: </span>
                <span className="font-medium text-ink">{s.ia ?? "Unassigned"}</span>
              </div>
              {s.address ? (
                <div>
                  <span className="text-ink-hint">Address: </span>
                  <span className="text-ink">{s.address}</span>
                  {s.pincode ? (
                    <span className="ml-1 font-mono text-ink-hint">· {s.pincode}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <Link href={`/portals/smile-admin/surveys/${s.id}`} className={buttonClasses("primary", "outlined", "sm", "w-full")}>
                <Icon name="visibility" size={14} /> View Details
              </Link>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={TABLE_COLUMNS}
          data={rows as Array<Row & Record<string, unknown>>}
          total={rows.length}
          caption="Survey locations, their implementing agency and address"
          emptyLabel="No survey locations match the current search."
        />
      </div>
    </div>
  );
}
