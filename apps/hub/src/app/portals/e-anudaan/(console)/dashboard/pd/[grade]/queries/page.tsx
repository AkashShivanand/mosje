"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { queriesFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "@/components/e-anudaan/worklist-table";

export default function PdQueriesPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;
  const rows = queriesFor(state, role.id);
  const reviewKey =
    role?.division === "finance" ? `ifd${role.grade}` : role?.grade === "js" ? "jspd" : role?.grade;
  const reviewBase = `/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-headline-1 text-ink">PD Queries</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Files you have queried back down the chain, and files queried to you.</p>
      </div>
      <WorklistTable
        rows={rows}
        variant="queue"
        reviewBase={reviewBase}
        caption="PD Queries"
      />
    </div>
  );
}
