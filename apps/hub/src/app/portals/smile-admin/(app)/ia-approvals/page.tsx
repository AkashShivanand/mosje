import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="IA Approvals"
      subtitle="Pending implementing-agency onboarding requests awaiting central review."
      breadcrumbs={[{ label: "Access Control" }, { label: "IA Approvals" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
