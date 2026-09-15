"use client";

/**
 * PMU Inspections — the field officer's worklist.
 *
 * DS Audit: PageHeader ✅ existing · SegmentedControl ✅ · InspectionTable / AwaitingInspectionTable
 * (portal components over Card · DataTable · Search · FilterSelect) — nothing new.
 *
 * Live PMU: "Awaiting inspection" (sanctioned files with Inspect), "My open visits" and every
 * inspection, with a Finding column and search. Ours repeated the dashboard's twelve-row table
 * (inventory §37, §38).
 */

import * as React from "react";
import { PageHeader, SegmentedControl } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { awaitingInspection, openVisits } from "@/lib/e-anudaan/registers";
import { AwaitingInspectionTable, InspectionTable } from "@/components/e-anudaan/worklist-table";

type View = "awaiting" | "open" | "all";

export default function PmuInspectionWorklistPage() {
  const { state } = useEAnudaan();
  const [view, setView] = React.useState<View>("awaiting");

  return (
    <div className="space-y-5">
      <PageHeader title="PMU Inspections" meta="Sanctioned files to inspect, your open visits, and every inspection report filed." />
      <SegmentedControl<View>
        ariaLabel="Show"
        value={view}
        onChange={setView}
        options={[
          { value: "awaiting", label: `Awaiting Inspection (${awaitingInspection(state).length})` },
          { value: "open", label: `My Open Visits (${openVisits(state).length})` },
          { value: "all", label: `All Inspections (${state.inspections.length})` },
        ]}
      />
      {view === "awaiting" && <AwaitingInspectionTable caption="Sanctioned files awaiting inspection" />}
      {view === "open" && <InspectionTable key="open" scope="open" searchable showFinding={false} caption="Open inspection visits" />}
      {view === "all" && <InspectionTable key="all" searchable showFinding caption="All inspections" />}
    </div>
  );
}
