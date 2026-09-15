"use client";

import { PageHeader } from "@mosje/design-system";
import { InspectionTable } from "@/components/e-anudaan/worklist-table";

/**
 * PMU Inspections — every inspection assigned under SHRESHTA Mode 2, filterable by state.
 *
 * The live page is "PMU Inspection — SHRESHTA Mode-2" with the section "Awaiting inspection"
 * (INVENTORY §13); it lists visits in every state, so the subtitle said something the table did
 * not. The title now matches the menu item that opens it.
 */
export default function PmuInspectionWorklistPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="E-ANUDAAN" title="PMU Inspections" meta="Inspections assigned under SHRESHTA Mode 2" />
      <InspectionTable caption="Inspections assigned under SHRESHTA Mode 2" />
    </div>
  );
}
