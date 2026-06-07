import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Onward Release"
      subtitle="Nodal Officer onward release to implementing agencies."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Onward Release" }]}
      backHref="/fund-monitoring"
    />
  );
}
