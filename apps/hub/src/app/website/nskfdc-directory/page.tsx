import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NSKFDC Directory | National Safai Karamcharis Finance & Development Corporation",
  description:
    "Telephone directory of the National Safai Karamcharis Finance and Development Corporation (NSKFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NSKFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NSKFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Safai Karamcharis Finance and Development Corporation (NSKFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-safai-karamcharis-finance-and-development-corporation")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
