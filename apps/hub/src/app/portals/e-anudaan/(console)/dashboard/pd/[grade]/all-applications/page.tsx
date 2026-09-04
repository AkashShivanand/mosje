"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { allApplications } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

export default function PdAllApplicationsPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;
  const rows = allApplications(state);
  const reviewKey =
    role?.division === "finance" ? `ifd${role.grade}` : role?.grade === "js" ? "jspd" : role?.grade;
  const reviewBase = `/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-1 text-ink">All Applications</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Application Explorer — every application in the scheme, whatever stage it has reached.</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="explorer"
        reviewBase={reviewBase}
        caption="All Applications"
      />
    </div>
  );
}
