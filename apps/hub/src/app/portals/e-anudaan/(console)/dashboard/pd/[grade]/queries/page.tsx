"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { queriesFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdQueriesPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const reviewKey =
    role?.division === "finance" ? `ifd${role.grade}` : role?.grade === "js" ? "jspd" : role?.grade;

  return (
    <ApplicationList
      variant="queue"
      title="PD Queries"
      description="Files you have queried back down the chain, and files queried to you."
      rows={role ? queriesFor(state, role.id) : []}
      reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
    />
  );
}
