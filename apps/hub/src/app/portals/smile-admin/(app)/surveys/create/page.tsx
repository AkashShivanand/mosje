import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Create survey"
      subtitle="Configure a new outreach survey schedule and assign surveyors."
      breadcrumbs={[{ label: "Field Operations" }, { label: "Create survey" }]}
      backHref="/portals/smile-admin/surveys"
    />
  );
}
