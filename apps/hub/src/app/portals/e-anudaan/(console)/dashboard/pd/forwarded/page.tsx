"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { forwardedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/** Forwarded Applications — each row now opens the file, and its status says where it sits (inventory §19). */
export default function PdForwardedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;

  return (
    <ApplicationList
      variant="forwarded"
      title="Forwarded Applications"
      description="Applications you have forwarded to the next level, and where each is now."
      rows={role ? forwardedFor(state, role.id) : []}
      forwardedBy={role?.id}
      reviewBase={key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined}
    />
  );
}
