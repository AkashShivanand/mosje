import { ComingSoon } from "@/components/smile-admin/shell/coming-soon";

export default function Page() {
  return (
    <ComingSoon
      title="Implementing Agencies"
      subtitle="Registered IAs partnering on identification, mobilisation and rehab."
      breadcrumbs={[{ label: "Access Control" }, { label: "Implementing Agencies" }]}
      backHref="/portals/smile-admin/dashboard"
    />
  );
}
