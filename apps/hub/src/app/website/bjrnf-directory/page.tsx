import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "BJRNF Directory | Babu Jagjivan Ram National Foundation",
  description:
    "Telephone directory of the Babu Jagjivan Ram National Foundation (BJRNF) — Member Secretary, Directors, and officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="BJRNF Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "BJRNF Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Babu Jagjivan Ram National Foundation (BJRNF) — Member Secretary, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("babu-jagjivan-ram-national-foundation")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
