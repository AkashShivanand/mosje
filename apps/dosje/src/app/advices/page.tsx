import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getDocumentsByType, getContentSyncedDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Advices | DoSJE",
  description:
    "Advisories and advices issued by the Department of Social Justice & Empowerment to States and implementing agencies.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "date", label: "Published", sortable: true, align: "center", className: "min-w-[120px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getDocumentsByType("Advices").map((d) => ({
  title: d.title,
  date: d.date ?? "—",
  href: d.fileUrl ?? d.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Advices"
      breadcrumb={[{ label: "Documents" }, { label: "Advices" }]}
      lastUpdated={getContentSyncedDate()}
      description="Advisories issued by the Department to States, UTs and implementing agencies."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search advices…"
    />
  );
}
