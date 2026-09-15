"use client";

import { WorklistScreen, type WorklistColumn } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant } from "@/lib/e-anudaan/selectors";
import type { NgoProfile } from "@/lib/e-anudaan/types";

/**
 * Columns transcribed from the live NGO Directory (INVENTORY §10).
 *
 * The live directory's Attendance column is left off: the register holds no attendance figure
 * for any organisation, so every row printed "—" (screen QA, 13 Sep 2026).
 *
 * `priority` is what lets six columns survive a phone: 1 becomes the card's
 * title, 2 a label/value pair, 3 is dropped. The registrant's name is the row's
 * name; the two dates are reference detail nobody scans on a 390px screen.
 */
const COLUMNS: WorklistColumn<NgoProfile>[] = [
  { key: "name", header: "NGO", priority: 1 },
  { key: "location", header: "Location", priority: 2, render: (n) => `${n.district}, ${n.state}` },
  { key: "applicationCount", header: "Applications", priority: 2, render: (n) => String(n.applicationCount) },
  { key: "sanctionedCount", header: "Sanctioned", priority: 2, render: (n) => String(n.sanctionedCount) },
  { key: "totalGrant", header: "Total Grant", priority: 2, render: (n) => formatGrant(n.totalGrant) },
  {
    key: "lastInspection",
    header: "Last Inspection",
    priority: 3,
    render: (n) => (n.lastInspection ? formatDate(n.lastInspection) : "—"),
  },
];

export default function NgoDirectoryPage() {
  const { state } = useEAnudaan();

  return (
    <WorklistScreen
      title="NGO Directory"
      columns={COLUMNS}
      rows={state.ngos}
      getRowId={(n) => n.id}
      noun="organisation"
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading the NGO directory",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try Again",
        emptyTitle: "No Organisations Registered",
        emptyDescription: "No voluntary organisation has been registered on this portal yet.",
        filteredTitle: "No Organisations Match Your Filters",
        clearFiltersLabel: "Clear Filters",
      }}
    />
  );
}
