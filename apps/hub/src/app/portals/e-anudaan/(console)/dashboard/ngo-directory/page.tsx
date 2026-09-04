"use client";

import { DataTable, type DataTableColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import type { NgoProfile } from "@/lib/e-anudaan/types";

/** Columns transcribed from the live NGO Directory (INVENTORY §10). */
const COLUMNS: DataTableColumn<NgoProfile>[] = [
  { key: "name", header: "NGO" },
  { key: "location", header: "Location", render: (n) => `${n.district}, ${n.state}` },
  { key: "applicationCount", header: "Apps", render: (n) => String(n.applicationCount) },
  { key: "sanctionedCount", header: "Sanctioned", render: (n) => String(n.sanctionedCount) },
  { key: "totalGrant", header: "Total Grant", render: (n) => formatGrant(n.totalGrant) },
  { key: "attendance", header: "Attendance", render: () => "—" },
  { key: "lastInspection", header: "Last Inspection", render: (n) => (n.lastInspection ? formatDate(n.lastInspection) : "—") },
];

export default function NgoDirectoryPage() {
  const { state } = useEAnudaan();
  return (
    <div className="space-y-5">
      <h1 className="text-headline-1 text-ink">NGO Directory</h1>
      <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
        <DataTable columns={COLUMNS as unknown as DataTableColumn<Record<string, unknown>>[]} data={state.ngos as unknown as Record<string, unknown>[]} total={state.ngos.length} caption="NGO directory" />
      </section>
    </div>
  );
}
