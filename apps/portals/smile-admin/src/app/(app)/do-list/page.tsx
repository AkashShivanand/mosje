import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="District Officers"
      subtitle="District Nodal Officers managing operations across districts."
      breadcrumbs={[{ label: "Access Control" }, { label: "District Officers" }]}
      backHref="/dashboard"
    />
  );
}
