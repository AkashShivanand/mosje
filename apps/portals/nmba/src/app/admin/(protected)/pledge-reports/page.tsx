"use client";

import * as React from "react";
import { AdminShell } from "@/components/admin-shell";
import { StatsCard } from "@/components/stats-card";
import { DataTable } from "@/components/data-table";
import { PLEDGE_REPORTS, PLEDGE_REPORTS_TOTAL } from "@/lib/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import type { PledgeReport } from "@/lib/types";
import { HeartHandshake } from "lucide-react";

const columns = [
  {
    key: "pledgeType" as const,
    header: "Type",
    render: (row: PledgeReport) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          row.pledgeType === "e-pledge"
            ? "bg-approve/10 text-approve"
            : "bg-await/10 text-await"
        }`}
      >
        {row.pledgeType}
      </span>
    ),
  },
  { key: "name" as const, header: "Name" },
  { key: "age" as const, header: "Age" },
  { key: "mobile" as const, header: "Mobile" },
  { key: "email" as const, header: "Email" },
  { key: "state" as const, header: "State" },
  { key: "district" as const, header: "District" },
  { key: "pledgeDate" as const, header: "Date" },
];

const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";

export default function PledgeReportsPage() {
  const [filterState, setFilterState] = React.useState("");
  const [filterDistrict, setFilterDistrict] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const districts = filterState ? (STATE_DISTRICTS[filterState] ?? []) : [];

  const filtered = PLEDGE_REPORTS.filter((r) => {
    if (filterState && r.state !== filterState) return false;
    if (filterDistrict && r.district !== filterDistrict) return false;
    return true;
  });

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">All Pledge Reports</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {PLEDGE_REPORTS_TOTAL} total pledges registered
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 max-w-md">
        <StatsCard label="Total Pledges" value="71" icon={<HeartHandshake className="h-5 w-5" />} />
        <StatsCard label="Pledges Today" value="0" icon={<HeartHandshake className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          aria-label="Filter by state"
          value={filterState}
          onChange={(e) => { setFilterState(e.target.value); setFilterDistrict(""); }}
          className={selectCls}
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          aria-label="Filter by district"
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          disabled={!filterState}
          className={selectCls + (!filterState ? " opacity-50" : "")}
        >
          <option value="">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input
          type="date"
          aria-label="From date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={selectCls}
        />
        <input
          type="date"
          aria-label="To date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={selectCls}
        />
      </div>

      <DataTable<PledgeReport>
        data={filtered}
        columns={columns}
        caption="NMBA Pledge Reports"
        total={PLEDGE_REPORTS_TOTAL}
      />
    </AdminShell>
  );
}
