"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { CITY_PROFILES, type CityProfile } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { DataTable, type DataTableColumn } from "@mosje/design-system";

/** Rupees to the crore figure the design prints in every money column. */
function crore(n: number) {
  return n === 0 ? "—" : `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
}

/** The four coloured figure chips the design uses instead of plain numerals. */
function ValueChip({ value, tone }: { value: number; tone: "info" | "success" | "warning" | "danger" }) {
  const TONES = {
    info: "bg-info-50 text-info-600 ring-info-100",
    success: "bg-success-50 text-success-600 ring-success-100",
    warning: "bg-warning-50 text-warning-600 ring-warning-100",
    danger: "bg-danger-50 text-danger-600 ring-danger-100",
  } as const;
  return (
    <span className={`inline-flex rounded-sm px-sm py-0.5 text-label-2 tabular-nums ring-1 ring-inset ${TONES[tone]}`}>
      {typeof value === "number" ? formatNumber(value) : value}
    </span>
  );
}

const CONSOLIDATION = ["Consolidated (All)", "Identification only", "Rehabilitation only"];

export default function CityProfilingPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");
  const [district, setDistrict] = useState("All Districts");
  const [view, setView] = useState(CONSOLIDATION[0]);

  const rows = useMemo(
    () =>
      CITY_PROFILES.filter((r) => {
        const hay = `${r.state} ${r.nodalOfficer ?? ""} ${r.email ?? ""} ${r.mobile ?? ""}`.toLowerCase();
        return (
          (!search || hay.includes(search.toLowerCase())) &&
          (state === "All States" || r.state === state)
        );
      }),
    [search, state],
  );

  const onboarded = rows.filter((r) => r.cities > 0);
  const totals = {
    states: onboarded.length,
    cities: rows.reduce((s, r) => s + r.cities, 0),
    identified: rows.reduce((s, r) => s + r.identified, 0),
    released: rows.reduce((s, r) => s + r.released, 0),
  };

  const columns: DataTableColumn<CityProfile & Record<string, unknown>>[] = [
    {
      key: "sno",
      header: "#",
      className: "w-10 tabular-nums text-ink-hint",
      // The row's place in the register as it is currently ordered, which is why
      // it is computed from the filtered list rather than stored on the row.
      render: (r) => rows.findIndex((x) => x.stateId === r.stateId) + 1,
      exportValue: (r) => String(rows.findIndex((x) => x.stateId === r.stateId) + 1),
    },
    {
      key: "state",
      header: "State / UT",
      sortable: true,
      render: (r) => (
        <Link
          href={`/portals/smile-admin/city-profiling?state=${encodeURIComponent(r.state)}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {r.state}
        </Link>
      ),
    },
    { key: "cities", header: "Cities", sortable: true, className: "tabular-nums" },
    { key: "nodalOfficer", header: "Nodal Officer", render: (r) => r.nodalOfficer ?? "—" },
    { key: "email", header: "Email Id", render: (r) => r.email ?? "—" },
    { key: "mobile", header: "Mobile", className: "tabular-nums", render: (r) => r.mobile ?? "—" },
    {
      key: "identified",
      header: "Identified",
      sortable: true,
      render: (r) => <ValueChip value={r.identified} tone="info" />,
      sortValue: (r) => r.identified,
      exportValue: (r) => String(r.identified),
    },
    {
      key: "rehabilitated",
      header: "Rehabilitated",
      sortable: true,
      render: (r) => <ValueChip value={r.rehabilitated} tone="success" />,
      sortValue: (r) => r.rehabilitated,
      exportValue: (r) => String(r.rehabilitated),
    },
    {
      key: "released",
      header: "Released (₹)",
      sortable: true,
      // Sorted on the rupee figure, never on the printed "₹5.20 Cr" — a string
      // sort puts ₹1.20 Cr above ₹9.00 Cr.
      sortValue: (r) => r.released,
      render: (r) => (
        <span className="inline-flex rounded-sm bg-warning-50 px-sm py-0.5 text-label-2 tabular-nums text-warning-600 ring-1 ring-inset ring-warning-100">
          {crore(r.released)}
        </span>
      ),
      exportValue: (r) => crore(r.released),
    },
    {
      key: "utilised",
      header: "Utilized (₹)",
      sortable: true,
      sortValue: (r) => r.utilised,
      render: (r) => (
        <span className="inline-flex rounded-sm bg-danger-50 px-sm py-0.5 text-label-2 tabular-nums text-danger-600 ring-1 ring-inset ring-danger-100">
          {crore(r.utilised)}
        </span>
      ),
      exportValue: (r) => crore(r.utilised),
    },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "City Profiling" }]}
        title="City Profiling"
        subtitle="State and Union Territory level overview — onboarding status, nodal officers, fund flow, and beneficiary progress across India."
        actions={
          <ExportMenu
            filename="city-profiling"
            title="City Profiling"
            subtitle="State and Union Territory level overview"
            columns={[
              { header: "State / UT", accessor: "state" },
              { header: "Cities", accessor: "cities" },
              { header: "Nodal Officer", accessor: (r: CityProfile) => r.nodalOfficer ?? "—" },
              { header: "Email Id", accessor: (r: CityProfile) => r.email ?? "—" },
              { header: "Mobile", accessor: (r: CityProfile) => r.mobile ?? "—" },
              { header: "Identified", accessor: "identified" },
              { header: "Rehabilitated", accessor: "rehabilitated" },
              { header: "Released", accessor: (r: CityProfile) => crore(r.released) },
              { header: "Utilized", accessor: (r: CityProfile) => crore(r.utilised) },
            ]}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="States/UTs onboarded" value={totals.states} icon="location_on" tone="info" />
        <StatPill label="Total cities selected" value={totals.cities} icon="apartment" tone="success" />
        <StatPill label="Beneficiaries identified" value={totals.identified} icon="group" tone="warning" />
        <StatPill label="Funds released (₹ Cr)" value={Math.round(totals.released / 1_00_00_000)} icon="account_balance_wallet" tone="primary" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search beneficiary, location, district…"
          label="Search states, nodal officers and contact details"
          value={search}
          onChange={setSearch}
        />
        <select
          aria-label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {["All States", ...CITY_PROFILES.map((r) => r.state)].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          <option>All Districts</option>
        </select>
        <select
          aria-label="Consolidation"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {CONSOLIDATION.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </DataToolbar>

      {/* Mobile card list — the table scrolls sideways on a phone otherwise. */}
      <ul className="space-y-sm md:hidden">
        {rows.map((r) => (
          <li key={r.stateId} className="space-y-sm rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
            <div className="flex items-baseline justify-between gap-sm">
              <span className="text-body-1 font-semibold text-ink">{r.state}</span>
              <span className="text-label-2 text-ink-muted">{r.cities} cities</span>
            </div>
            <div className="text-label-2 text-ink-muted">{r.nodalOfficer ?? "No nodal officer recorded"}</div>
            <div className="flex flex-wrap gap-xs">
              <ValueChip value={r.identified} tone="info" />
              <ValueChip value={r.rehabilitated} tone="success" />
              <span className="inline-flex rounded-sm bg-warning-50 px-sm py-0.5 text-label-2 tabular-nums text-warning-600 ring-1 ring-inset ring-warning-100">
                {crore(r.released)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={columns}
          data={rows as Array<CityProfile & Record<string, unknown>>}
          total={rows.length}
          showPageSizes={false}
          caption="States and Union Territories, with onboarding, nodal officer and fund figures"
          emptyLabel="No state or Union Territory matches these filters."
        />
      </div>
    </div>
  );
}
