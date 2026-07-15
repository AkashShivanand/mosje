import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Shelter Audit Checklist"
      subtitle="Quarterly audit checklists for compliance and quality assurance."
      breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Audit Checklist" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
