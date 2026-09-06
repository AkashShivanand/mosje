"use client";

import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { allApplications } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdAllApplicationsPage() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const reviewKey =
    role?.division === "finance" ? `ifd${role.grade}` : role?.grade === "js" ? "jspd" : role?.grade;

  return (
    <ApplicationList
      variant="explorer"
      title="All Applications"
      description="Application Explorer — every application in the scheme, whatever stage it has reached."
      rows={allApplications(state)}
      reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
      exportable
    />
  );
}
