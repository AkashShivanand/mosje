import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Onward Release"
      subtitle="Nodal Officer onward release to implementing agencies."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Onward Release" }]}
      backHref="/portals/smile-admin/fund-monitoring"
    />
  );
}
