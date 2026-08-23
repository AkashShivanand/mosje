import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "Staff Directory | Ministry of Social Justice & Empowerment",
  description:
    "General staff directory of the Ministry of Social Justice & Empowerment, Government of India — officers and officials across divisions with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="Staff Directory"
      breadcrumb={[{ label: "Connect" }, { label: "Directory" }]}
      lastUpdated="06 Jun 2026"
      description="General staff directory of the Ministry of Social Justice & Empowerment — officers and officials across divisions with intercom and contact details."
      columns={directoryColumns}
      rows={directoryRows("ministry-staff")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
