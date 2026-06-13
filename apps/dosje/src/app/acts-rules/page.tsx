import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Acts & Rules | DoSJE",
  description:
    "Acts, rules and statutory regulations administered by the Department of Social Justice & Empowerment.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("Acts & Rules").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Acts & Rules"
      breadcrumb={[{ label: "Documents" }, { label: "Acts & Rules" }]}
      lastUpdated={getContentSyncedDate()}
      description="Acts, rules and statutory regulations administered by the Department."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search acts & rules…"
    />
  );
}
