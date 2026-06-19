"use client";

import * as React from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { SNO_LIST, SNO_TOTAL } from "@/lib/mock-data";
import { STATES } from "@/lib/states";
import type { NodalOfficer } from "@/lib/types";
import { useToast } from "@/components/toast";
import { Download } from "lucide-react";

const columns = [
  { key: "name" as const, header: "Nodal Officer Name" },
  { key: "designation" as const, header: "Designation" },
  { key: "email" as const, header: "Email" },
  { key: "mobile" as const, header: "Mobile No." },
  { key: "stateName" as const, header: "State Name" },
  { key: "districtName" as const, header: "District Name" },
];

const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";

export default function StateNodalOfficersPage() {
  const { toast } = useToast();
  const [filterState, setFilterState] = React.useState("");

  const filtered = filterState
    ? SNO_LIST.filter((o) => o.stateName === filterState)
    : SNO_LIST;

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">List of State Nodal Officers</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {SNO_TOTAL} State Nodal Officers registered
          </p>
        </div>
        <button
          onClick={() => toast("Export starting…", "info")}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="mb-4">
        <select
          aria-label="Filter by state"
          value={filterState}
          onChange={(e) => setFilterState(e.target.value)}
          className={selectCls}
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <DataTable<NodalOfficer>
        data={filtered}
        columns={columns}
        caption="NMBA State Nodal Officers"
        total={SNO_TOTAL}
      />
    </AdminShell>
  );
}
