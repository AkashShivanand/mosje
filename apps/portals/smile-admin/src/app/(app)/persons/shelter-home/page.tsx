import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Shelter Occupants"
      subtitle="Beneficiaries currently housed across shelter homes."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Occupants" }]}
      backHref="/persons"
    />
  );
}
