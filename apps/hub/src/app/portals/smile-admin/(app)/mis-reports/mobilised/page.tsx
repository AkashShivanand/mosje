import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — Mobilised"
      subtitle="Drill-down report on mobilisation across schemes and geographies."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — Mobilised" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
