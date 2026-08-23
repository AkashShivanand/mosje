import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NCSK Directory | National Commission for Safai Karamcharis",
  description:
    "Telephone directory of the National Commission for Safai Karamcharis (NCSK) — Chairman, Members, and supporting officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NCSK Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NCSK Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Commission for Safai Karamcharis (NCSK) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-commission-for-safai-karamcharis")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
