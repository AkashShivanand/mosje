import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getTenders } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tenders | DoSJE",
  description:
    "Active tenders, e-procurement notices and requests for proposals issued by the Department of Social Justice & Empowerment.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[340px] font-medium text-ink" },
  { key: "category", label: "Category", sortable: true, align: "left", className: "min-w-[160px]" },
  { key: "date", label: "Published", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getTenders().map((t) => ({
  title: t.title,
  category: t.category ?? "—",
  date: t.date ?? "—",
  href: t.fileUrl ?? t.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Tenders"
      breadcrumb={[{ label: "Offerings" }, { label: "Tenders" }]}
      lastUpdated="Synced from dosje.gov.in"
      description="Active tenders, procurement notices and requests for proposals issued by the Department."
      columns={columns}
      rows={rows}
      searchKeys={["title", "category"]}
      searchPlaceholder="Search tenders…"
    />
  );
}
