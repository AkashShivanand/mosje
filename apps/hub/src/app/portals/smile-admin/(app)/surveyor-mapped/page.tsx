"use client";

import { useMemo, useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SURVEYOR_MAPPINGS, type SurveyorMapping } from "@/lib/smile-admin/mock-data";
import { Badge, Button, DataTable, Icon, type DataTableColumn } from "@mosje/design-system";

type Row = SurveyorMapping & { sno: number };

const COLUMNS: DataTableColumn<Row & Record<string, unknown>>[] = [
  { key: "sno", header: "S.No.", className: "w-12 tabular-nums text-ink-hint" },
  { key: "name", header: "Name", sortable: true, className: "font-medium text-ink" },
  { key: "state", header: "State", sortable: true },
  { key: "city", header: "City", sortable: true },
  { key: "surveyLocation", header: "Survey Location", sortable: true, className: "text-ink-muted" },
  { key: "createdOn", header: "Created On", sortable: true, className: "font-mono text-body-2 text-ink-muted" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (m) => (
      <Badge status={statusTone(m.status)} dot>
        {m.status}
      </Badge>
    ),
    exportValue: (m) => m.status,
  },
  {
    key: "actions",
    header: "Action",
    className: "text-right",
    noExport: true,
    render: () => (
      <Button appearance="outlined" size="sm">
        <Icon name="edit" size={14} /> Edit
      </Button>
    ),
  },
];

export default function SurveyorMappedPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase();
    return SURVEYOR_MAPPINGS.filter((m) =>
      q
        ? `${m.name} ${m.state} ${m.city} ${m.surveyLocation}`
            .toLowerCase()
            .includes(q)
        : true,
    ).map((m, i) => ({ ...m, sno: i + 1 }));
  }, [search]);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Surveyor Mappings" }]}
        eyebrow="Field operations"
        title="Surveyor Mappings"
        subtitle="Surveyor-to-survey-location assignment records."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-surveyor-mappings"
              title="Surveyor Mappings"
              subtitle="Surveyor-to-survey-location assignment records."
              columns={[
                { header: "S.No.", accessor: "sno" },
                { header: "Name", accessor: "name" },
                { header: "State", accessor: "state" },
                { header: "City", accessor: "city" },
                { header: "Survey Location", accessor: "surveyLocation" },
                { header: "Created On", accessor: "createdOn" },
                { header: "Status", accessor: "status" },
              ]}
              rows={rows}
            />
            <Button size="sm">
              <Icon name="add" size={14} /> New mapping
            </Button>
          </div>
        }
      />

      <DataToolbar>
        <SearchField
          placeholder="Search surveyor, state, city, or location…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <div className="ml-auto whitespace-nowrap text-label-2 text-ink-muted">
          Showing <span className="font-semibold text-ink">{rows.length}</span> of{" "}
          <span className="font-semibold text-ink">{SURVEYOR_MAPPINGS.length}</span>
        </div>
      </DataToolbar>

      {/* Mobile card list */}
      <ul className="space-y-sm md:hidden">
        {rows.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0">
                <div className="text-label-3 uppercase text-ink-hint">
                  #{m.sno.toString().padStart(2, "0")}
                </div>
                <div className="truncate text-body-1 font-semibold text-ink">
                  {m.name}
                </div>
                <div className="truncate text-label-2 text-ink-muted">
                  {m.state} · {m.city}
                </div>
              </div>
              <Badge status={statusTone(m.status)} dot>
                {m.status}
              </Badge>
            </div>
            <div className="mt-sm border-t border-stroke-100 pt-sm text-body-3">
              <div className="text-ink-hint">Survey location</div>
              <div className="font-medium text-ink">{m.surveyLocation}</div>
            </div>
            <div className="mt-sm flex items-center justify-between text-body-3">
              <span className="text-ink-hint">
                Created <span className="font-mono">{m.createdOn}</span>
              </span>
              <Button appearance="outlined" size="sm">
                <Icon name="edit" size={14} /> Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={COLUMNS}
          data={rows as Array<Row & Record<string, unknown>>}
          total={rows.length}
          caption="Surveyors mapped to survey locations, by state and city"
          emptyLabel="No surveyor mapping matches these filters."
        />
      </div>
    </div>
  );
}
