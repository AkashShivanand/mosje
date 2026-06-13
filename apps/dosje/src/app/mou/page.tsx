import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Memoranda of Understanding | DoSJE",
  description:
    "Memoranda of Understanding signed by the Department of Social Justice & Empowerment with partner institutions.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("MOU").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Memoranda of Understanding"
      breadcrumb={[{ label: "Documents" }, { label: "MoU" }]}
      lastUpdated={getContentSyncedDate()}
      description="Memoranda of Understanding signed by the Department with partner institutions and agencies."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search MoUs…"
    />
  );
}
