import { CitizenShell } from "@/components/nhapoa/citizen-shell";
import { GrievanceWizard } from "@/components/nhapoa/grievance-wizard";

export default function RegisterGrievancePage() {
  return (
    <CitizenShell>
      <GrievanceWizard source="citizen" homeHref="/portals/nhapoa" trackHref="/portals/nhapoa/track-status" />
    </CitizenShell>
  );
}
