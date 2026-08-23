import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "MoSJE Directory | Ministry of Social Justice & Empowerment",
  description:
    "Official telephone directory of the Ministry of Social Justice & Empowerment, Government of India — Ministers and senior secretariat officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="MoSJE Directory"
      breadcrumb={[{ label: "Department" }, { label: "Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Ministry of Social Justice & Empowerment — Ministers and senior secretariat officers with intercom and contact details."
      columns={directoryColumns}
      rows={directoryRows("ministry-leadership")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
