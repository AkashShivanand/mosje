import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Policies | DoSJE",
  description:
    "Policy documents and frameworks of the Department of Social Justice & Empowerment.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("POLICY").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Policies"
      breadcrumb={[{ label: "Documents" }, { label: "Policies" }]}
      lastUpdated={getContentSyncedDate()}
      description="Policy documents and frameworks governing the Department's programmes and operations."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search policies…"
    />
  );
}
