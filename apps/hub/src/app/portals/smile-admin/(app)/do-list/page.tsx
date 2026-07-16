import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="District Officers"
      subtitle="District Nodal Officers managing operations across districts."
      breadcrumbs={[{ label: "Access Control" }, { label: "District Officers" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
