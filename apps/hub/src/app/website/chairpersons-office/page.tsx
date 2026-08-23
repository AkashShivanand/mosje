import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "Chairperson's Office | Ministry of Social Justice & Empowerment",
  description:
    "Directory of the Chairperson's Office under the Ministry of Social Justice & Empowerment — the Chairperson and supporting secretariat officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="Chairperson's Office"
      breadcrumb={[{ label: "Connect" }, { label: "Chairperson's Office" }]}
      lastUpdated="06 Jun 2026"
      description="Directory of the Chairperson's Office — the Chairperson and supporting secretariat officers with intercom and contact details."
      columns={directoryColumns}
      rows={directoryRows("chairpersons-office")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
