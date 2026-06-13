import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Annual Reports | DoSJE",
  description:
    "Annual reports of the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("Annual Reports").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Annual Reports"
      breadcrumb={[{ label: "Documents" }, { label: "Annual Reports" }]}
      lastUpdated={getContentSyncedDate()}
      description="Annual reports published by the Department of Social Justice & Empowerment and the National Commission for Safai Karamcharis."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search annual reports…"
    />
  );
}
