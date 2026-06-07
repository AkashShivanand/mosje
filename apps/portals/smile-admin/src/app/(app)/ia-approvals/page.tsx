import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="IA Approvals"
      subtitle="Pending implementing-agency onboarding requests awaiting central review."
      breadcrumbs={[{ label: "Access Control" }, { label: "IA Approvals" }]}
      backHref="/dashboard"
    />
  );
}
