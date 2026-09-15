"use client";

import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { allApplications } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdAllApplicationsPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;

  return (
    <ApplicationList
      variant="explorer"
      title="All Applications"
      description="Every application in the scheme, at whatever stage it has reached."
      rows={allApplications(state)}
      reviewBase={role && reviewKeyOf(role) ? `/portals/e-anudaan/dashboard/sm2/${reviewKeyOf(role)}/review` : undefined}
      exportable
    />
  );
}
