import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — Shelter Homes"
      subtitle="Shelter home occupancy, audits and operating metrics."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — Shelter Homes" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
