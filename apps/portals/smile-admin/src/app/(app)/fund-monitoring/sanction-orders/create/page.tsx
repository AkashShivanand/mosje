import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Create Sanction Order"
      subtitle="Generate a new sanction order for an approved scheme allocation."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Create Sanction Order" }]}
      backHref="/fund-monitoring"
    />
  );
}
