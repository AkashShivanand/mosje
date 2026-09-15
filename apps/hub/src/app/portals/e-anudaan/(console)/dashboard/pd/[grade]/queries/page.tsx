"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { queriesFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/** PD Queries. Reads `queriesFor`, the same selector as the dashboard's "Returned for Rework" figure. */
export default function PdQueriesPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;

  return (
    <ApplicationList
      variant="queue"
      title="PD Queries"
      description="Applications returned for rework, to you or by you, and not yet resolved."
      rows={role ? queriesFor(state, role.id) : []}
      reviewBase={role && reviewKeyOf(role) ? `/portals/e-anudaan/dashboard/sm2/${reviewKeyOf(role)}/review` : undefined}
    />
  );
}
