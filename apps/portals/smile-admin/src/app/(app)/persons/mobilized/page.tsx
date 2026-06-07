import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Mobilised"
      subtitle="Beneficiaries who have accepted shelter or rehab pathway."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Mobilised" }]}
      backHref="/persons"
    />
  );
}
