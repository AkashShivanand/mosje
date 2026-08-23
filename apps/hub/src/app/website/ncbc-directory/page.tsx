import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NCBC Directory | National Commission for Backward Classes",
  description:
    "Telephone directory of the National Commission for Backward Classes (NCBC) — Chairman, Members, and supporting officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NCBC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NCBC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Commission for Backward Classes (NCBC) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-commission-for-backward-classes-ncbc")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
