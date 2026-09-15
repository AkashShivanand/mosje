"use client";

import { WorklistScreen, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { auditActionLabel } from "@/lib/e-anudaan/workflow";
import { RefText } from "@/components/e-anudaan/worklist-table";

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
 * workflow's action vocabulary (INVENTORY §12). The action is shown in words through
 * `auditActionLabel`; the stored key ("communicateDeficiency") never reaches the screen.
 */
const COLUMNS: WorklistColumn<AuditRow>[] = [
  // Date AND time: an audit log read by date alone cannot order two actions taken the same day.
  { key: "at", header: "Timestamp", priority: 2, render: (r) => <span className="whitespace-nowrap">{formatDateTime(r.at)}</span> },
  /* The application is the row's name: an auditor scans this log looking for
     what happened to a given application, not for who was on duty. */
  { key: "application", header: "Application", priority: 1, render: (r) => <RefText value={r.application} className="font-mono text-body-3" /> },
  { key: "user", header: "User", priority: 2 },
  { key: "role", header: "Role", priority: 3 },
  { key: "action", header: "Action", priority: 2 },
  { key: "remarks", header: "Remarks", priority: 3 },
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
      action: auditActionLabel(e.action),
      remarks: e.remarks ?? "—",
    }))
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <WorklistScreen
      title="Audit Trail"
      columns={COLUMNS}
      rows={rows}
      getRowId={(r) => r.id}
      noun="entry"
      pluralNoun="entries"
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading the audit trail",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try Again",
        /* An audit log with no entries is a real answer, not a broken panel —
           nothing has been done to any application yet. */
        emptyTitle: "No Activity Recorded",
        emptyDescription: "No action has been taken on any application under this scheme.",
        filteredTitle: "No Entries Match Your Filters",
        clearFiltersLabel: "Clear Filters",
      }}
    />
  );
}
