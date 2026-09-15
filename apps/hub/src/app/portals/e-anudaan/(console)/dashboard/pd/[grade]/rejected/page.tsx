"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/**
 * Rejected Applications — the Programme Division's final rejections only. Files an officer sent
 * back for rework are on Returned Applications, which is what the live `/pd/<grade>/rejected`
 * actually lists (inventory §18).
 */
export default function PdRejectedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  return (
    <ApplicationList
      variant="rejected"
      title="Rejected Applications"
      description="Applications closed as rejected by the Programme Division. Files sent back for rework are under Returned Applications."
      rows={rejectedFor(state, "pd")}
      reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
    />
  );
}
