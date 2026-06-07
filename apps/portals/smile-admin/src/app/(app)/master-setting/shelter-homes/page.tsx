import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Master · Shelter Homes"
      subtitle="Master record settings for shelter homes."
      breadcrumbs={[{ label: "System" }, { label: "Master · Shelter Homes" }]}
      backHref="/master-setting"
    />
  );
}
