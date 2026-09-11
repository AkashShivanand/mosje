"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { CITY_PROFILES, type CityProfile } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { ReportScreen, type ReportColumn } from "@mosje/design-system";

/*
 * The date the FIGURES were drawn, not the date the page was opened.
 *
 * `new Date()` during render is also a hydration hazard — the server stamps one
 * time and the browser another — but the substantive reason is that these
 * figures are a fixed extract. Stamping a report "drawn today" every time it is
 * opened would let two copies of the same statement, printed a month apart,
 * claim to be different draws of the register.
 */
const DRAWN_ON = "31 August 2026";

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

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

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

  const activeFilterCount =
    (search ? 1 : 0) + (state === "All States" ? 0 : 1) + (view === CONSOLIDATION[0] ? 0 : 1);

  function clearFilters() {
    setSearch("");
    setState("All States");
    setDistrict("All Districts");
    setView(CONSOLIDATION[0]!);
  }

  const onboarded = rows.filter((r) => r.cities > 0);
  const totals = {
    states: onboarded.length,
    cities: rows.reduce((s, r) => s + r.cities, 0),
    identified: rows.reduce((s, r) => s + r.identified, 0),
    released: rows.reduce((s, r) => s + r.released, 0),
  };

  const columns: ReportColumn<CityProfile & Record<string, unknown>>[] = [
    {
      key: "sno",
      header: "#",
      // The row's place in the register as it is currently ordered, which is why
      // it is computed from the filtered list rather than stored on the row.
      render: (r) => rows.findIndex((x) => x.stateId === r.stateId) + 1,
    },
    {
      key: "state",
      header: "State / UT",
      render: (r) => (
        <Link
          href={`/portals/smile-admin/city-profiling?state=${encodeURIComponent(r.state)}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {r.state}
        </Link>
      ),
    },
    { key: "cities", header: "Cities", numeric: true },
    { key: "nodalOfficer", header: "Nodal Officer", render: (r) => r.nodalOfficer ?? "—" },
    { key: "email", header: "Email Id", render: (r) => r.email ?? "—" },
    { key: "mobile", header: "Mobile", render: (r) => r.mobile ?? "—" },
    {
      key: "identified",
      header: "Identified",
      numeric: true,
      render: (r) => <ValueChip value={r.identified} tone="info" />,
    },
    {
      key: "rehabilitated",
      header: "Rehabilitated",
      numeric: true,
      render: (r) => <ValueChip value={r.rehabilitated} tone="success" />,
    },
    {
      key: "released",
      header: "Released (₹)",
      numeric: true,
      render: (r) => (
        <span className="inline-flex rounded-sm bg-warning-50 px-sm py-0.5 text-label-2 tabular-nums text-warning-600 ring-1 ring-inset ring-warning-100">
          {crore(r.released)}
        </span>
      ),
    },
    {
      key: "utilised",
      header: "Utilized (₹)",
      numeric: true,
      render: (r) => (
        <span className="inline-flex rounded-sm bg-danger-50 px-sm py-0.5 text-label-2 tabular-nums text-danger-600 ring-1 ring-inset ring-danger-100">
          {crore(r.utilised)}
        </span>
      ),
    },
  ];

  return (
    <ReportScreen
      breadcrumb={[{ label: "City Profiling" }]}
      title="City Profiling"
      meta="State and Union Territory level overview — onboarding status, nodal officers, fund flow, and beneficiary progress across India."
      issuer="Ministry of Social Justice & Empowerment, Government of India"
      generatedAt={DRAWN_ON}
      criteria={[
        { label: "States / UTs onboarded", value: String(totals.states) },
        { label: "Cities selected", value: String(totals.cities) },
        { label: "Beneficiaries identified", value: totals.identified.toLocaleString("en-IN") },
        { label: "Funds released", value: crore(totals.released) },
        { label: "State / UT", value: state },
        { label: "Consolidation", value: view ?? CONSOLIDATION[0]! },
      ]}
      exportActions={
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
      filters={
        <>
          <SearchField
            placeholder="Search beneficiary, location, district…"
            label="Search states, nodal officers and contact details"
            value={search}
            onChange={setSearch}
          />
          <select aria-label="State" value={state} onChange={(e) => setState(e.target.value)} className={SELECT}>
            {["All States", ...CITY_PROFILES.map((r) => r.state)].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select aria-label="District" value={district} onChange={(e) => setDistrict(e.target.value)} className={SELECT}>
            <option>All Districts</option>
          </select>
          <select aria-label="Consolidation" value={view} onChange={(e) => setView(e.target.value)} className={SELECT}>
            {CONSOLIDATION.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={columns}
      rows={rows as Array<CityProfile & Record<string, unknown>>}
      count={rows.length}
      filtered={activeFilterCount > 0}
      getRowId={(r) => String(r.stateId)}
      totals={(key) =>
        key === "state"
          ? "Total"
          : key === "cities"
            ? totals.cities
            : key === "identified"
              ? totals.identified.toLocaleString("en-IN")
              : key === "released"
                ? crore(totals.released)
                : null
      }
      copy={{
        idleTitle: "Choose a State to See Its Profile",
        loadingLabel: "Loading the state and Union Territory register",
        errorTitle: "This Register Could Not Be Loaded",
        errorDescription: "The figures did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No State Has Been Onboarded",
        emptyDescription: "No State or Union Territory has reported a city profile yet.",
        filteredTitle: "No State Matches These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
