import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Shelter Occupants"
      subtitle="Beneficiaries currently housed across shelter homes."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Occupants" }]}
      backHref="/portals/smile-admin/persons"
    />
  );
}
