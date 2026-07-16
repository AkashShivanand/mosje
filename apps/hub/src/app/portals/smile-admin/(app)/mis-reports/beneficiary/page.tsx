import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — Beneficiary"
      subtitle="Beneficiary master report with stage transitions."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — Beneficiary" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
