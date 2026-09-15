"use client";

import { Icon, MetricCard, PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant, sanctionedApps } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * Programme Director — Sanction Desk.
 *
 * Maintainer note (kept out of the UI, per the screen QA of 13 Sep 2026): this surface does not
 * exist on the live dev deployment. Signing in as the Programme Director there yields a
 * three-item sidebar, no sanction desk, and an empty main with zero API calls (see
 * docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md §17, and defect D1 in
 * docs/research/eanudaan-dev-defects.md).
 *
 * It is built from docs/specs/shreshta-mode2-portal-spec.md §5.2 because the PD is the final
 * sanctioning authority — without it no application can reach Sanctioned, and the workflow is
 * untestable end to end. The page itself used to carry an "Inferred screen" banner saying so;
 * that is a note for the build team, not for the Programme Director.
 */
export default function ProgrammeDirectorDeskPage() {
  const { state } = useEAnudaan();
  const awaiting = state.applications.filter((a) => a.holder.kind === "pd");
  const sanctioned = sanctionedApps(state);
  const sanctionedValue = sanctioned.reduce((s, a) => s + (a.sanction?.total ?? 0), 0);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="E-ANUDAAN"
        title="Sanction Desk"
        meta="Applications that have cleared the Programme Division and the Integrated Finance Division and await your decision."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Awaiting My Decision"
          value={String(awaiting.length)}
          changeLabel="Concurred by Finance"
          icon={<Icon name="gavel" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned"
          value={String(sanctioned.length)}
          changeLabel="All financial years"
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
        <MetricCard
          label="Value Sanctioned"
          value={formatGrant(sanctionedValue)}
          changeLabel="All financial years"
          icon={<Icon name="currency_rupee" size={20} aria-hidden />}
        />
      </div>

      <WorklistTable
        rows={awaiting}
        variant="queue"
        reviewBase="/portals/e-anudaan/dashboard/sm2/pd/review"
        caption="Applications awaiting the Programme Director's decision"
      />
    </div>
  );
}
