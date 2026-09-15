"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { forwardedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdForwardedPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;

  return (
    <ApplicationList
      variant="forwarded"
      title="Forwarded Applications"
      description="Applications you have forwarded to the next level."
      rows={role ? forwardedFor(state, role.id) : []}
      forwardedBy={role?.id}
    />
  );
}
