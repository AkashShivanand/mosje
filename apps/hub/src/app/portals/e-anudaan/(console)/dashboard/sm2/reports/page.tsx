"use client";

import { DataTable, type DataTableColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import type { GrantApplication } from "@/lib/e-anudaan/types";

/** Columns transcribed from the live Reports & Analytics screen (INVENTORY §11). */
const COLUMNS: DataTableColumn<GrantApplication>[] = [
  { key: "ngo", header: "NGO / VO", render: (a) => a.projectLabel },
  { key: "id", header: "Application" },
  { key: "financialYear", header: "FY" },
  { key: "requested", header: "Requested (₹)", render: (a) => formatGrant(a.total) },
  { key: "sanctioned", header: "Sanctioned (₹)", render: (a) => (a.sanction ? formatGrant(a.sanction.total) : "—") },
  { key: "status", header: "Status", render: (a) => statusLabel(a) },
];

export default function ReportsPage() {
  const { state } = useEAnudaan();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">Reports &amp; Analytics</h1>
      <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
        <DataTable
          columns={COLUMNS as unknown as DataTableColumn<Record<string, unknown>>[]}
          data={state.applications as unknown as Record<string, unknown>[]}
          total={state.applications.length}
          caption="Reports and analytics"
        />
      </section>
    </div>
  );
}
