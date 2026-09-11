"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { SURVEY_LOCATIONS, type SurveyLocation } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<SurveyLocation & Record<string, unknown>>[] = [
  { key: "name", header: "Location", sortable: true, className: "font-semibold text-ink" },
  {
    key: "state",
    header: "State / District",
    sortable: true,
    render: (r) => (
      <>
        {r.state} <span className="text-ink-muted">/ {r.district}</span>
      </>
    ),
    exportValue: (r) => `${r.state} / ${r.district}`,
  },
  { key: "pincode", header: "Pincode", className: "font-mono text-body-2 text-ink-muted" },
  {
    key: "type",
    header: "Type",
    sortable: true,
    render: (r) => <Badge status="info">{r.type}</Badge>,
    exportValue: (r) => r.type,
  },
  { key: "surveyors", header: "Surveyors", sortable: true, className: "text-right tabular-nums" },
  {
    key: "identified",
    header: "Identified",
    sortable: true,
    className: "text-right tabular-nums",
    render: (r) => formatNumber(r.identified),
    sortValue: (r) => r.identified,
  },
  { key: "lastSurveyed", header: "Last survey", sortable: true, className: "text-ink-muted" },
];

export default function SurveyLocationsPage() {
  const [search, setSearch] = useState("");
  const rows = useMemo(
    () => SURVEY_LOCATIONS.filter((r) => `${r.name} ${r.state} ${r.district} ${r.pincode}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const totalIdentified = rows.reduce((s, r) => s + r.identified, 0);
  const totalSurveyors = rows.reduce((s, r) => s + r.surveyors, 0);
  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Survey Locations" }]}
        title="Survey Locations"
        subtitle="Hotspots and outreach points where surveyors actively log beneficiary identifications."
        actions={<Link href="/portals/smile-admin/survey-locations/create" className={buttonClasses("primary", "filled", "sm")}><Icon name="add" size={14} /> Add location</Link>}
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Locations"            value={rows.length}       icon="location_on"  tone="primary" />
        <StatPill label="Surveyors deployed"   value={totalSurveyors}    icon="groups"  tone="info" />
        <StatPill label="Identified at locations" value={totalIdentified} icon="location_on"  tone="success" />
      </div>
      <DataToolbar><SearchField placeholder="Search location / state / pincode…" value={search} onChange={setSearch} /></DataToolbar>
      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={COLUMNS}
          data={rows as Array<SurveyLocation & Record<string, unknown>>}
          total={rows.length}
          showPageSizes={false}
          caption="Survey locations, with the surveyors deployed and beneficiaries identified at each"
          emptyLabel="No survey location matches this search."
        />
      </div>
    </div>
  );
}
