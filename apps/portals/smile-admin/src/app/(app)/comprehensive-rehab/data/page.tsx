import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Rehab Data"
      subtitle="Comprehensive rehabilitation outcome data and longitudinal trends."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Rehab Data" }]}
      backHref="/dashboard"
    />
  );
}
