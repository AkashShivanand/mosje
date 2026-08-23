import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "SCW Directory | Scheduled Caste Welfare",
  description:
    "Telephone directory of the Scheduled Caste Welfare (SCW) division — Director, Deputy Secretaries, and officers handling SC welfare programmes with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="SCW Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "SCW Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Scheduled Caste Welfare (SCW) division — Director, Deputy Secretaries, and officers handling SC welfare programmes with contact details."
      columns={directoryColumns}
      rows={directoryRows("scheduled-caste-welfare")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
