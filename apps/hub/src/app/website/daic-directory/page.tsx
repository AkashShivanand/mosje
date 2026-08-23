import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "DAIC Directory | Dr. Ambedkar International Centre",
  description:
    "Telephone directory of the Dr. Ambedkar International Centre (DAIC) — Director General, Directors, and officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="DAIC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DAIC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Dr. Ambedkar International Centre (DAIC) — Director General, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("dr-ambedkar-international-centre")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
