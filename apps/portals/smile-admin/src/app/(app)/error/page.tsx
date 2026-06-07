import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Error"
      subtitle="An unexpected error occurred."
      breadcrumbs={[{ label: "System" }, { label: "Error" }]}
      backHref="/dashboard"
    />
  );
}
