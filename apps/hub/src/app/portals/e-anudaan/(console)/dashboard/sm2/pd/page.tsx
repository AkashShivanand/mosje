"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterSelect, Icon, MetricCard, PageHeader } from "@mosje/design-system";
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
  return (
    <React.Suspense fallback={null}>
      <SanctionDesk />
    </React.Suspense>
  );
}

/**
 * The Financial Year filter every officer dashboard carries (review call of 11 Sep 2026, T698–737),
 * in the URL as the Action Queue keeps it. The tiles said "All financial years" with no way to ask
 * for one.
 */
function SanctionDesk() {
  const { state } = useEAnudaan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fy = params.get("fy") ?? "";
  const inYear = (a: { financialYear: string }) => !fy || a.financialYear === fy;
  const years = [...new Set(state.applications.map((a) => a.financialYear))].sort().reverse();
  const yearLabel = fy ? `FY ${fy}` : "All financial years";

  const awaiting = state.applications.filter((a) => a.holder.kind === "pd" && inYear(a));
  const sanctioned = sanctionedApps(state).filter(inYear);
  const sanctionedValue = sanctioned.reduce((s, a) => s + (a.sanction?.total ?? 0), 0);

  const setFy = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("fy", value);
    else next.delete("fy");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sanction Desk"
        meta="Applications that have cleared the Programme Division and the Integrated Finance Division and await your decision."
        /* The year is a page control, so it sits in the header's action slot, as on the Action Queue. */
        actions={
          <div className="w-full sm:w-56">
            <FilterSelect
              label="Financial Year"
              value={fy}
              onChange={setFy}
              options={[{ value: "", label: "All years" }, ...years.map((y) => ({ value: y, label: `FY ${y}` }))]}
            />
          </div>
        }
      />

      {/* Captions are `detail`, not `changeLabel`: none of these is a change over time, and a change
          label drew a dash announced as "No change". */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Awaiting My Decision"
          value={String(awaiting.length)}
          detail="Concurred by Finance"
          icon={<Icon name="gavel" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned"
          value={String(sanctioned.length)}
          detail={yearLabel}
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
        <MetricCard
          label="Value Sanctioned"
          value={formatGrant(sanctionedValue)}
          detail={yearLabel}
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
