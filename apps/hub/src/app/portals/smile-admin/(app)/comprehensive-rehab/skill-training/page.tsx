import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Skill & Training"
      subtitle="Vocational skill modules and placement linkages for rehabilitated beneficiaries."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Skill & Training" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
