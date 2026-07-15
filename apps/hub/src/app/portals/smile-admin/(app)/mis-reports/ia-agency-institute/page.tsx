import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — IA / Agencies"
      subtitle="Performance and conversion across implementing agencies."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — IA / Agencies" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
