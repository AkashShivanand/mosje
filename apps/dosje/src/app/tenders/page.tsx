import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";

export const metadata: Metadata = {
  title: "Tenders | DoSJE",
  description:
    "Active tenders, e-procurement notices and requests for proposals issued by the Department of Social Justice & Empowerment.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[340px] font-medium text-ink" },
  { key: "tenderId", label: "Tender ID", align: "center" },
  { key: "lastDate", label: "Last Date", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = [
  { title: "Hindi Pakhwada 14 September to 28 September 2024", tenderId: "DoSJE/2024/HP/001", lastDate: "12 Sep 2024", href: "#" },
  { title: "Tender for Security Guards for parking arrangement in Lok Nayak Bhawan, Khan Market, New Delhi", tenderId: "DoSJE/2024/SEC/047", lastDate: "20 Sep 2024", href: "#" },
  { title: "Proposals are invited for Annual Personal Contract of IT Associates", tenderId: "DoSJE/2024/IT/112", lastDate: "30 Sep 2024", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Tenders"
      breadcrumb={[{ label: "Offerings" }, { label: "Tenders" }]}
      lastUpdated="06 Jun 2026"
      description="Active tenders, procurement notices and requests for proposals issued by the Department."
      columns={columns}
      rows={rows}
      searchKeys={["title", "tenderId"]}
      searchPlaceholder="Search tenders…"
    />
  );
}
