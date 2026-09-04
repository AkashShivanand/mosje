"use client";

import { Alert, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatGrant, sanctionedApps } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

/**
 * Programme Director — Sanction Desk.
 *
 * ⚠️ INFERRED. This surface DOES NOT EXIST on the live dev deployment: signing in as the
 * Programme Director there yields a three-item sidebar, no sanction desk, and an empty main
 * with zero API calls (see docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md §17, and
 * defect D1 in docs/research/eanudaan-dev-defects.md).
 *
 * It is built here from docs/specs/shreshta-mode2-portal-spec.md §5.2 because the PD is the
 * final sanctioning authority — without it no application can reach Sanctioned, and the whole
 * workflow is untestable end to end. The banner says so on the page rather than only in the
 * research notes.
 */
export default function ProgrammeDirectorDeskPage() {
  const { state } = useEAnudaan();
  const awaiting = state.applications.filter((a) => a.holder.kind === "pd");
  const sanctioned = sanctionedApps(state);
  const sanctionedValue = sanctioned.reduce((s, a) => s + (a.sanction?.total ?? 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-1 text-ink">Sanction Desk</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Applications that have cleared the Programme Division and the Integrated Finance
          Division, and now await your decision.
        </p>
      </div>

      <Alert status="info" title="Inferred screen">
        The live dev portal has no Programme Director console — the route renders an empty page
        and makes no API calls. This desk is reconstructed from the approved BRD so the approval
        chain can be walked end to end. Reported to the dev team as defect D1.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Awaiting my decision"
          value={String(awaiting.length)}
          changeLabel="Concurred by IFD"
          icon={<Icon name="gavel" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned"
          value={String(sanctioned.length)}
          changeLabel="All financial years"
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
        <MetricCard
          label="Value sanctioned"
          value={formatGrant(sanctionedValue)}
          changeLabel="Total across the register"
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
