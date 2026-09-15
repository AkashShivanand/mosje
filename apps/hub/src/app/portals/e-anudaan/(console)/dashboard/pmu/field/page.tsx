"use client";

import { Icon, MetricCard, PageHeader, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { INSPECTION_STATUS_LABEL, inspectionsFor } from "@/lib/e-anudaan/officer";
import { InspectionTable } from "@/components/e-anudaan/worklist-table";

/** PMU field officer landing — "Inspection Dashboard" with the assignments table (§14). */
export default function PmuFieldPage() {
  const { state } = useEAnudaan();
  // The tiles read the selector the table filters by, so a tile and the rows it names agree.
  const pending = inspectionsFor(state, "Pending").length;
  const scheduled = inspectionsFor(state, "Scheduled").length;
  const submitted = inspectionsFor(state, "Submitted").length;
  const reviewed = inspectionsFor(state, "Reviewed").length;
  const total = inspectionsFor(state).length;

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="E-ANUDAAN" title="Inspection Dashboard" />

      {/* Four tiles that add up to the total. With three, six of the twelve assignments — the
          inspections already reported — were counted in "Total" and in no tile at all. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={INSPECTION_STATUS_LABEL.Pending} value={String(pending)} icon={<Icon name="pending_actions" size={20} aria-hidden />} />
        <MetricCard label={INSPECTION_STATUS_LABEL.Scheduled} value={String(scheduled)} icon={<Icon name="event" size={20} aria-hidden />} />
        <MetricCard
          label="Reports Submitted"
          value={String(submitted + reviewed)}
          detail={`${reviewed} reviewed by the Division`}
          icon={<Icon name="assignment_turned_in" size={20} aria-hidden />}
        />
        <MetricCard label="Total Assignments" value={String(total)} icon={<Icon name="travel_explore" size={20} aria-hidden />} />
      </div>

      <div className="space-y-3">
        <SectionTitle title="Inspection Assignments" />
        <InspectionTable caption="Inspection assignments" />
      </div>
    </div>
  );
}
