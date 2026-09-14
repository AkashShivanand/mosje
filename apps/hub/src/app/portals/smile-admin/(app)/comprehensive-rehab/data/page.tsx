"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { REHAB_DATA, type FollowUp, type RehabRow } from "@/lib/smile-admin/rehab";
import { DATA_VERSIONS } from "@/lib/smile-admin/mis-reports";
import { Badge, DataTable, type DataTableColumn } from "@mosje/design-system";

const TYPES = ["All Types", "Wage Employment", "Self Employment", "Skill Training"];
const FOLLOWS = ["All Follow-ups", "Active", "3-month due", "Lost to Follow-up", "Relapsed"];
const STATES = ["All States", ...Array.from(new Set(REHAB_DATA.map((r) => r.state)))];
const YEARS = ["All Years", ...Array.from(new Set(REHAB_DATA.map((r) => r.year))).sort().reverse()];

const TONE: Record<FollowUp, "success" | "warning" | "danger" | "neutral"> = {
  Active: "success",
  "3-month due": "warning",
  "Lost to Follow-up": "neutral",
  Relapsed: "danger",
};

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

export default function RehabDataPage() {
  const [version, setVersion] = useState(DATA_VERSIONS[0]!);
  const [type, setType] = useState(TYPES[0]!);
  const [follow, setFollow] = useState(FOLLOWS[0]!);
  const [state, setState] = useState(STATES[0]!);
  const [district, setDistrict] = useState("All Districts");
  const [year, setYear] = useState(YEARS[0]!);

  const districts = useMemo(() => {
    const inState = REHAB_DATA.filter((r) => state === STATES[0] || r.state === state);
    return ["All Districts", ...Array.from(new Set(inState.map((r) => r.district)))];
  }, [state]);

  const rows = useMemo(
    () =>
      REHAB_DATA.filter(
        (r) =>
          (type === TYPES[0] || r.type === type) &&
          (follow === FOLLOWS[0] || r.followUp === follow) &&
          (state === STATES[0] || r.state === state) &&
          (district === "All Districts" || r.district === district) &&
          (year === YEARS[0] || r.year === year),
      ),
    [type, follow, state, district, year],
  );

  const columns: DataTableColumn<RehabRow & Record<string, unknown>>[] = [
    {
      key: "sno",
      header: "#",
      className: "w-10 tabular-nums text-ink-hint",
      render: (r) => rows.indexOf(r) + 1,
      exportValue: (r) => String(rows.indexOf(r) + 1),
    },
    { key: "beneficiary", header: "Beneficiary", sortable: true, className: "font-medium text-ink" },
    { key: "type", header: "Type", sortable: true },
    { key: "category", header: "Category / Specify", className: "text-ink-muted" },
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
    {
      key: "followUp",
      header: "Follow-up Status",
      sortable: true,
      render: (r) => <Badge status={TONE[r.followUp]} dot>{r.followUp}</Badge>,
      exportValue: (r) => r.followUp,
    },
    { key: "capturedOn", header: "Captured On", sortable: true, className: "font-mono text-body-2 text-ink-muted" },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Rehab Data" }]}
        eyebrow="Beneficiaries"
        title="Comprehensive Rehabilitation Data"
        subtitle="Six rehabilitation data groups, with conditional rendering per Rehabilitation Type. Captured by the Implementing Agency in the field app; the web view is read-only."
        actions={
          <div className="flex flex-wrap items-center gap-sm">
            <label className="flex items-center gap-xs text-label-2 text-ink-muted">
              Data
              <select aria-label="Data version" value={version} onChange={(e) => setVersion(e.target.value)} className="h-9 rounded-md border border-stroke-300 bg-white px-sm text-body-2 text-ink shadow-xs">
                {DATA_VERSIONS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <ExportMenu
              filename="smile-rehab-data"
              title="Comprehensive Rehabilitation Data"
              subtitle="Rehabilitation records captured in the field"
              columns={[
                { header: "Beneficiary", accessor: "beneficiary" },
                { header: "Type", accessor: "type" },
                { header: "Category", accessor: "category" },
                { header: "State", accessor: "state" },
                { header: "District", accessor: "district" },
                { header: "Follow-up Status", accessor: "followUp" },
                { header: "Captured On", accessor: "capturedOn" },
              ]}
              rows={rows}
            />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Records" value={rows.length} icon="volunteer_activism" tone="primary" />
        <StatPill label="Wage employment" value={rows.filter((r) => r.type === "Wage Employment").length} icon="work" tone="info" />
        <StatPill label="Self employment" value={rows.filter((r) => r.type === "Self Employment").length} icon="storefront" tone="success" />
        <StatPill label="Follow-up due" value={rows.filter((r) => r.followUp === "3-month due").length} icon="event" tone="warning" />
      </div>

      <DataToolbar>
        <select aria-label="Rehabilitation type" value={type} onChange={(e) => setType(e.target.value)} className={SELECT}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="Follow-up status" value={follow} onChange={(e) => setFollow(e.target.value)} className={SELECT}>
          {FOLLOWS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select
          aria-label="State"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setDistrict("All Districts");
          }}
          className={SELECT}
        >
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select aria-label="District" value={district} onChange={(e) => setDistrict(e.target.value)} className={SELECT}>
          {districts.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} className={SELECT}>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows as Array<RehabRow & Record<string, unknown>>}
          total={rows.length}
          pageSizes={[20, 50, 100]}
          caption="Rehabilitation records by beneficiary, type and follow-up state"
          emptyLabel="No rehabilitation record matches these filters."
        />
      </div>
    </div>
  );
}
