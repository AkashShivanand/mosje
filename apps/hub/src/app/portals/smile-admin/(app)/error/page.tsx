import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Error"
      subtitle="An unexpected error occurred."
      breadcrumbs={[{ label: "System" }, { label: "Error" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
