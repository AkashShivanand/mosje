import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Forms & Templates | DoSJE",
  description:
    "Downloadable application forms and templates for schemes and services of the Department of Social Justice & Empowerment.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("Forms & Templates").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Forms & Templates"
      breadcrumb={[{ label: "Documents" }, { label: "Forms & Templates" }]}
      lastUpdated={getContentSyncedDate()}
      description="Downloadable application forms and standard templates for the Department's schemes and services."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search forms & templates…"
    />
  );
}
