"use client";

import { useMemo, useState } from "react";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { SURVEYORS, type Surveyor } from "@/lib/smile-admin/approvals";
import { DATA_VERSIONS } from "@/lib/smile-admin/mis-reports";
import { Badge, Icon, WorklistScreen, buttonClasses, type WorklistColumn } from "@mosje/design-system";
import Link from "next/link";

type Row = Surveyor & Record<string, unknown>;

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

const COLUMNS: WorklistColumn<Row>[] = [
  { key: "name", header: "Name", priority: 1, sortable: true, className: "font-semibold text-ink" },
  { key: "agency", header: "Implementing Agency", priority: 1, sortable: true },
  { key: "mobile", header: "Mobile", priority: 2, className: "font-mono text-body-2 text-ink-muted" },
  { key: "email", header: "Email", priority: 3, className: "text-ink-muted" },
  {
    key: "status",
    header: "Status",
    priority: 2,
    sortable: true,
    render: (s) => (
      <Badge status={s.status === "Active" ? "success" : "neutral"} dot>
        {s.status}
      </Badge>
    ),
    exportValue: (s) => s.status,
  },
];

/**
 * The field surveyors register — the live portal's `/surveyors`, which
 * `/surveyor-list` also serves.
 *
 * Both routes previously redirected to Surveyor Mappings on the assumption that
 * they duplicated it. They do not: a mapping is a surveyor ATTACHED to a survey
 * location, and this is the register of the people themselves, with the agency
 * each one works for.
 */
export default function SurveyorsPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(DATA_VERSIONS[0]!);

  const rows = useMemo(
    () =>
      SURVEYORS.filter(
        (s) => !search || `${s.name} ${s.agency} ${s.mobile} ${s.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <WorklistScreen
      eyebrow="Field Operations"
      title="Surveyors"
      meta="All registered field surveyors."
      actions={
        <div className="flex flex-wrap items-center gap-sm">
          <label className="flex items-center gap-xs text-label-2 text-ink-muted">
            Data
            <select aria-label="Data version" value={version} onChange={(e) => setVersion(e.target.value)} className={SELECT}>
              {DATA_VERSIONS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <ExportMenu
            filename="smile-surveyors"
            title="Surveyors"
            subtitle="All registered field surveyors"
            formats={["csv"]}
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Implementing Agency", accessor: "agency" },
              { header: "Mobile", accessor: "mobile" },
              { header: "Email", accessor: "email" },
              { header: "Status", accessor: "status" },
            ]}
            rows={rows}
          />
        </div>
      }
      filters={
        <SearchField
          placeholder="Search by name, mobile, email…"
          label="Search surveyors"
          value={search}
          onChange={setSearch}
        />
      }
      activeFilterCount={search ? 1 : 0}
      onClearFilters={() => setSearch("")}
      columns={COLUMNS}
      rows={rows as Row[]}
      registerTotal={SURVEYORS.length}
      getRowId={(s) => s.id}
      rowActions={(s) => (
        <Link href={`/portals/smile-admin/surveyor-mapped?surveyor=${s.id}`} className={buttonClasses("primary", "outlined", "sm")}>
          <Icon name="map" size={16} /> Mappings
        </Link>
      )}
      count={rows.length}
      filtered={Boolean(search)}
      noun="surveyor"
      copy={{
        idleTitle: "Search the Surveyor Register",
        loadingLabel: "Loading surveyors",
        errorTitle: "Surveyors Could Not Be Loaded",
        errorDescription: "The register did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Surveyor Registered",
        emptyDescription: "No field surveyor has been registered yet.",
        filteredTitle: "No Surveyor Matches This Search",
        clearFiltersLabel: "Clear search",
      }}
    />
  );
}
