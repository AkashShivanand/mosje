import { ComingSoon } from "@/components/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="MIS Report — Rehabilitated"
      subtitle="Outcome trail for rehabilitated beneficiaries."
      breadcrumbs={[{ label: "Reports & Analytics" }, { label: "MIS Report — Rehabilitated" }]}
      backHref="/dashboard"
    />
  );
}
