"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { rejectedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/** Finance Rejected — the Integrated Finance Division's final rejections, never the Programme Division's. */
export default function FinanceRejectedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;
  return (
    <ApplicationList
      variant="rejected"
      title="Finance Rejected"
      description="Applications closed as rejected by the Integrated Finance Division. Files sent back to the previous level are under Finance Returned."
      rows={rejectedFor(state, "finance")}
      reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
    />
  );
}
