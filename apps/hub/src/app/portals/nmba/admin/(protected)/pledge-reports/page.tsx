"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";
import { DataTable } from "@/components/nmba/data-table";
import { PLEDGE_REPORTS, PLEDGE_REPORTS_TOTAL } from "@/lib/nmba/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import type { PledgeReport } from "@/lib/nmba/types";
import { HeartHandshake } from "lucide-react";
import { Select, Input, MetricCard } from "@mosje/design-system";

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
        <MetricCard label="Total Pledges" value="71" icon={<HeartHandshake className="h-5 w-5" />} />
        <MetricCard label="Pledges Today" value="0" icon={<HeartHandshake className="h-5 w-5" />} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Select
          aria-label="Filter by state"
          value={filterState}
          onChange={(e) => { setFilterState(e.target.value); setFilterDistrict(""); }}
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select
          aria-label="Filter by district"
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          disabled={!filterState}
        >
          <option value="">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Input
          type="date"
          aria-label="From date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          type="date"
          aria-label="To date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
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
