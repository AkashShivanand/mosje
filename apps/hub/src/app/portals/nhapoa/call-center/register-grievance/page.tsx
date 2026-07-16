import { GrievanceWizard } from "@/components/nhapoa/grievance-wizard";

export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Register Grievance</h1>
        <p className="mt-1 text-sm text-ink-muted">File a grievance on behalf of the caller. It enters the same workflow as a citizen-filed case.</p>
      </div>
      <GrievanceWizard source="call-center" homeHref="/portals/nhapoa/call-center/dashboard" trackHref="/portals/nhapoa/call-center/track" />
    </div>
  );
}
