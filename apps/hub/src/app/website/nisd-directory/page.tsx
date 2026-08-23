import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title: "NISD Directory | National Institute of Social Defence",
  description:
    "Telephone directory of the National Institute of Social Defence (NISD) — Director General, Registrar, faculty, and officers with intercom and contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="NISD Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NISD Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Institute of Social Defence (NISD) — Director General, Registrar, faculty, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("national-institute-of-social-defence")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
