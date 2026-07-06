import { CitizenShell } from "@/components/citizen-shell";
import { GrievanceWizard } from "@/components/grievance-wizard";

export default function RegisterGrievancePage() {
  return (
    <CitizenShell>
      <GrievanceWizard source="citizen" homeHref="/" trackHref="/track-status" />
    </CitizenShell>
  );
}
