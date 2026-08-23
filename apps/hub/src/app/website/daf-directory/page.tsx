import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "DAF Directory | Dr. Ambedkar Foundation",
  description:
    "Telephone directory of the Dr. Ambedkar Foundation (DAF) — Member Secretary, Directors, and officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="DAF Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DAF Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Dr. Ambedkar Foundation (DAF) — Member Secretary, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("dr-ambedkar-foundation")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
