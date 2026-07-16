import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Surveyor List"
      subtitle="Field surveyors logging beneficiary identifications."
      breadcrumbs={[{ label: "Access Control" }, { label: "Surveyor List" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
