import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Under Mobilization"
      subtitle="Beneficiaries currently being engaged for mobilisation."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Under Mobilization" }]}
      backHref="/persons"
    />
  );
}
