"use client";

import { DataTable, type DataTableColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate } from "@/lib/e-anudaan/selectors";

interface AuditRow {
  id: string;
  at: string;
  application: string;
  user: string;
  role: string;
  action: string;
  remarks: string;
}

/**
 * Audit Trail — JS grades only on the live portal. Its columns are the source of the
 * workflow's action vocabulary (INVENTORY §12).
 */
const COLUMNS: DataTableColumn<AuditRow>[] = [
  { key: "at", header: "Timestamp", render: (r) => formatDate(r.at) },
  { key: "application", header: "Application" },
  { key: "user", header: "User" },
  { key: "role", header: "Role" },
  { key: "action", header: "Action" },
  { key: "remarks", header: "Remarks" },
];

export default function AuditTrailPage() {
  const { state } = useEAnudaan();
  const rows: AuditRow[] = state.applications
    .flatMap((a) => a.audit.map((e) => ({ app: a.id, e })))
    .map(({ app, e }) => ({
      id: e.id,
      at: e.at,
      application: app,
      user: e.byName,
      role: ROLES[e.byRole].label,
      action: e.action,
      remarks: e.remarks ?? "—",
    }))
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-5">
      <h1 className="text-headline-1 text-ink">Audit Trail</h1>
      <section className="rounded-xl border border-line bg-surface p-4 lg:p-5">
        <DataTable columns={COLUMNS as unknown as DataTableColumn<Record<string, unknown>>[]} data={rows as unknown as Record<string, unknown>[]} total={rows.length} caption="Audit trail" />
      </section>
    </div>
  );
}
