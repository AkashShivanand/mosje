import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns, directoryRows } from "@/data/website";

export const metadata: Metadata = {
  title:
    "DWBDNC Directory | Development & Welfare Board for De-notified, Nomadic & Semi-Nomadic Communities",
  description:
    "Telephone directory of the Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — Chairman, Members, and officers with contact details.",
};

export default function Page() {
  return (
    <ListingPage
      title="DWBDNC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DWBDNC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={directoryRows("development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic-communities")}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
