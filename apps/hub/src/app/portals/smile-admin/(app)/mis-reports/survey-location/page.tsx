import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — Survey Locations"
      subtitle="Identification density and outcome rate by location."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — Survey Locations" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
