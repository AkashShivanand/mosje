import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Master Settings"
      subtitle="Tenancy-wide reference data — schemes, statuses, types and labels."
      breadcrumbs={[{ label: "System" }, { label: "Master Settings" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
