import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "PM-AJAY Directory | Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
  description:
    "Telephone directory of the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Project Management Unit — Mission Director, Project Directors, and officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="PM-AJAY Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "PM-AJAY Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Project Management Unit — Mission Director, Project Directors, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("pradhan-mantri-anusuchit-jaati-abhyuday-yojna")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
