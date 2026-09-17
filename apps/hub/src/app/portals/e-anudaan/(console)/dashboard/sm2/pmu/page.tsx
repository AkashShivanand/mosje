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
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";
import { DEMO_FORM_FILL_EVENT, type DemoFormFillDetail, type DemoFormPreset } from "@/lib/e-anudaan/demo-forms";
import { INSPECTION_SCHEDULE } from "@/lib/e-anudaan/demo-forms/inspection-schedule";
import { INSPECTION_REPORT } from "@/lib/e-anudaan/demo-forms/inspection-report";

type View = "awaiting" | "open" | "all";

export default function PmuInspectionWorklistPage() {
  const { state } = useEAnudaan();
  const [view, setView] = React.useState<View>("awaiting");

  /*
   * The demo dock's inspection fills are handled by the inspection table, which "Not Yet Inspected"
   * does not show. From that view a fill switches to "My Open Visits" and hands the fill on once the
   * table has rendered to receive it.
   */
  const fillFromAwaiting = (formId: string) => (_: unknown, preset: DemoFormPreset) => {
    if (view !== "awaiting") return;
    setView("open");
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent<DemoFormFillDetail>(DEMO_FORM_FILL_EVENT, { detail: { formId, preset } }));
    }, 0);
  };
  useDemoFormFill(INSPECTION_SCHEDULE.id, fillFromAwaiting(INSPECTION_SCHEDULE.id));
  useDemoFormFill(INSPECTION_REPORT.id, fillFromAwaiting(INSPECTION_REPORT.id));

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
