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
 *
 * Design-director audit P-01 (16 Sep 2026): "Awaiting Inspection (61)" here sat beside "Awaiting
 * Schedule (3)" on the Inspection Dashboard — near-identical words for different sets, so the field
 * officer could not tell which list was theirs. The 61 are sanctioned files no inspection has been
 * raised on; the 3 are the officer's own assignments not yet given a date. The view now reads "Not Yet
 * Inspected", and the line under the title says they are sanctioned files. Which of the three
 * screens should start an inspection is for discussion (P-01), and nothing is removed here.
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
      <PageHeader title="PMU Inspections" meta="Sanctioned files with no inspection raised, your open visits, and every inspection report filed." />
      <SegmentedControl<View>
        ariaLabel="Show"
        value={view}
        onChange={setView}
        options={[
          { value: "awaiting", label: `Not Yet Inspected (${awaitingInspection(state).length})` },
          { value: "open", label: `My Open Visits (${openVisits(state).length})` },
          { value: "all", label: `All Inspections (${state.inspections.length})` },
        ]}
      />
      {view === "awaiting" && <AwaitingInspectionTable caption="Sanctioned files with no inspection raised" />}
      {view === "open" && <InspectionTable key="open" scope="open" searchable showFinding={false} caption="Open inspection visits" />}
      {view === "all" && <InspectionTable key="all" searchable showFinding caption="All inspections" />}
    </div>
  );
}
