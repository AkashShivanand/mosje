import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Surveyors"
      subtitle="Surveyor roster and assignment overview."
      breadcrumbs={[{ label: "Access Control" }, { label: "Surveyors" }]}
      backHref="/dashboard"
    />
  );
}
