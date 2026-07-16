import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Survey Submissions"
      subtitle="Submitted survey records awaiting verification."
      breadcrumbs={[{ label: "Field Operations" }, { label: "Survey Submissions" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
