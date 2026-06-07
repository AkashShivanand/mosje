import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Master Settings"
      subtitle="Tenancy-wide reference data — schemes, statuses, types and labels."
      breadcrumbs={[{ label: "System" }, { label: "Master Settings" }]}
      backHref="/dashboard"
    />
  );
}
