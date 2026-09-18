import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { DETAILED_DEMAND_FOR_GRANT } from "@/data/website";
import type { ListingTableColumn } from "@/components/website/ui/data-table";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Detailed Demand for Grant";
const DESCRIPTION =
  "The Detailed Demands for Grants of the Department of Social Justice & Empowerment, laid before Parliament, by financial year.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/detailed-demand-for-grant" }),
};

const columns: ListingTableColumn[] = [
  { key: "sno", label: "S.No.", align: "center" },
  { key: "label", label: "Financial Year", sortable: true, align: "left", className: "min-w-[320px] font-medium text-ink" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

export default function Page() {
  const rows = DETAILED_DEMAND_FOR_GRANT.map((d, i) => ({ ...d, sno: i + 1 }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
      columns={columns}
      rows={rows}
      searchKeys={["label"]}
      searchPlaceholder="Search by financial year…"
      pageSize={15}
    />
  );
}
