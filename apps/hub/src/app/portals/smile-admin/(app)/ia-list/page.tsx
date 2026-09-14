"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { IMPLEMENTING_AGENCIES, type ImplementingAgency } from "@/lib/smile-admin/mis-reports";
import { Badge, DataTable, type DataTableColumn } from "@mosje/design-system";

const STATES = ["All States / UTs", ...Array.from(new Set(IMPLEMENTING_AGENCIES.map((a) => a.state)))];
const TYPES = ["All types", "NGO", "Trust", "Society", "Institute"];

export default function IaListPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [type, setType] = useState(TYPES[0]!);

  const rows = useMemo(
    () =>
      IMPLEMENTING_AGENCIES.filter(
        (a) =>
          (!search || `${a.name} ${a.district} ${a.registration} ${a.contact}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || a.state === state) &&
          (type === TYPES[0] || a.agencyType === type),
      ),
    [search, state, type],
  );

  const columns: DataTableColumn<ImplementingAgency & Record<string, unknown>>[] = [
    {
      key: "sno",
      header: "#",
      className: "w-10 tabular-nums text-ink-hint",
      render: (a) => rows.indexOf(a) + 1,
      exportValue: (a) => String(rows.indexOf(a) + 1),
    },
    { key: "name", header: "IA / Agency / Institute Name", sortable: true, className: "font-semibold text-ink" },
    { key: "agencyType", header: "Agency Type", sortable: true },
    { key: "registration", header: "Registration Number", className: "font-mono text-body-2 text-ink-muted" },
    { key: "darpan", header: "Darpan ID", className: "font-mono text-body-2 text-ink-muted" },
    { key: "state", header: "State", sortable: true },
    { key: "district", header: "District / City", sortable: true },
    { key: "onboardedOn", header: "Date of Onboarding", sortable: true, className: "text-ink-muted" },
    { key: "surveyors", header: "Surveyors Mapped", sortable: true, className: "text-right tabular-nums", sortValue: (a) => a.surveyors },
    { key: "identified", header: "Beneficiaries Identified", sortable: true, className: "text-right tabular-nums", sortValue: (a) => a.identified },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (a) => (
        <Badge status={a.status === "Active" ? "success" : "danger"} dot>
          {a.status}
        </Badge>
      ),
      exportValue: (a) => a.status,
    },
    { key: "contact", header: "Contact Person" },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "IA List" }]}
        eyebrow="Field Operations"
        title="Implementing Agency List"
        subtitle="Agencies, trusts, societies and institutes onboarded to deliver the SMILE programme."
        actions={
          <ExportMenu
            filename="smile-implementing-agencies"
            title="Implementing Agency List"
            subtitle="Agencies onboarded to deliver the SMILE programme"
            columns={[
              { header: "IA / Agency / Institute Name", accessor: "name" },
              { header: "Agency Type", accessor: "agencyType" },
              { header: "Registration Number", accessor: "registration" },
              { header: "Darpan ID", accessor: "darpan" },
              { header: "State", accessor: "state" },
              { header: "District / City", accessor: "district" },
              { header: "Date of Onboarding", accessor: "onboardedOn" },
              { header: "Surveyors Mapped", accessor: "surveyors" },
              { header: "Beneficiaries Identified", accessor: "identified" },
              { header: "Status", accessor: "status" },
              { header: "Contact Person", accessor: "contact" },
            ]}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Agencies" value={rows.length} icon="corporate_fare" tone="primary" />
        <StatPill label="Active" value={rows.filter((a) => a.status === "Active").length} icon="check_circle" tone="success" />
        <StatPill label="Surveyors mapped" value={rows.reduce((s, a) => s + a.surveyors, 0)} icon="groups" tone="info" />
        <StatPill label="Beneficiaries identified" value={rows.reduce((s, a) => s + a.identified, 0)} icon="account_box" tone="warning" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search agency, district, registration…"
          label="Search implementing agencies"
          value={search}
          onChange={setSearch}
        />
        <select
          aria-label="State or Union Territory"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Agency type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows as Array<ImplementingAgency & Record<string, unknown>>}
          total={rows.length}
          pageSizes={[20, 50, 100]}
          caption="Implementing agencies by type, state and onboarding date"
          emptyLabel="No implementing agency matches these filters."
        />
      </div>
    </div>
  );
}
