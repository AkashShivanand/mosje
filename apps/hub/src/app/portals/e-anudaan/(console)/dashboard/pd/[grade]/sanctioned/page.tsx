"use client";

import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { sanctionedApps } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

export default function PdSanctionedPage() {
  const { state } = useEAnudaan();
  return (
    <ApplicationList
      variant="sanctioned"
      title="Sanctioned Applications"
      description="Every application with a sanction order."
      rows={sanctionedApps(state)}
      exportable
    />
  );
}
