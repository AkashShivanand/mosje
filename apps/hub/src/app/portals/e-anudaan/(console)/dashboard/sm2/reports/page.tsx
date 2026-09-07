"use client";

import { WorklistScreen, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant } from "@/lib/e-anudaan/selectors";
import { statusLabel } from "@/lib/e-anudaan/workflow";
import type { GrantApplication } from "@/lib/e-anudaan/types";

/** Columns transcribed from the live Reports & Analytics screen (INVENTORY §11). */
const COLUMNS: WorklistColumn<GrantApplication>[] = [
  { key: "ngo", header: "NGO / VO", priority: 1, render: (a) => a.projectLabel },
  { key: "id", header: "Application", priority: 2 },
  { key: "financialYear", header: "FY", priority: 3 },
  { key: "requested", header: "Requested (₹)", priority: 2, render: (a) => formatGrant(a.total) },
  {
    key: "sanctioned",
    header: "Sanctioned (₹)",
    priority: 2,
    render: (a) => (a.sanction ? formatGrant(a.sanction.total) : "—"),
  },
  { key: "status", header: "Status", priority: 2, render: (a) => statusLabel(a) },
];

export default function ReportsPage() {
  const { state } = useEAnudaan();

  return (
    <WorklistScreen
      title="Reports &amp; Analytics"
      columns={COLUMNS}
      rows={state.applications}
      getRowId={(a) => a.id}
      noun="application"
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading applications",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Applications Recorded",
        emptyDescription: "No grant application has been submitted under this scheme yet.",
        filteredTitle: "No Applications Match Your Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
