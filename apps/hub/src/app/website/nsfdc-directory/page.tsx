import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NSFDC Directory | National Scheduled Castes Finance & Development Corporation",
  description:
    "Telephone directory of the National Scheduled Castes Finance and Development Corporation (NSFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NSFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NSFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Scheduled Castes Finance and Development Corporation (NSFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-scheduled-castes-finance-and-development-corporation")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
