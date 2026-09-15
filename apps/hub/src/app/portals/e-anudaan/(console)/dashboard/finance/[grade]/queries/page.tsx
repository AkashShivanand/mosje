"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { queriesFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/**
 * Finance Queries. The same screen as PD Queries, on the same selector as the Finance
 * dashboard's "Returned for Rework" figure — it used to be a hand-built heading over the
 * embedded table, and so carried a different empty state from its Programme Division twin.
 */
export default function FinanceQueriesPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;

  return (
    <ApplicationList
      variant="queue"
      title="Finance Queries"
      description="Applications returned for rework, to you or by you, and not yet resolved."
      rows={role ? queriesFor(state, role.id) : []}
      reviewBase={role && reviewKeyOf(role) ? `/portals/e-anudaan/dashboard/sm2/${reviewKeyOf(role)}/review` : undefined}
    />
  );
}
