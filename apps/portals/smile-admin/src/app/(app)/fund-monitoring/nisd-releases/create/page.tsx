import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Create NISD Release"
      subtitle="NISD-level release order against a sanctioned amount."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Create NISD Release" }]}
      backHref="/fund-monitoring"
    />
  );
}
