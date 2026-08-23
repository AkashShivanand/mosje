import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NBCFDC Directory | National Backward Classes Finance & Development Corporation",
  description:
    "Telephone directory of the National Backward Classes Finance and Development Corporation (NBCFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NBCFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NBCFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Backward Classes Finance and Development Corporation (NBCFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-backward-classes-finance-and-development-corporation")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
