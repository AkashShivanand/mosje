import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getVacancies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vacancies | DoSJE",
  description:
    "Current recruitment notifications and vacancy circulars under the Department of Social Justice & Empowerment and its bodies.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "category", label: "Category", sortable: true, align: "left", className: "min-w-[160px]" },
  { key: "date", label: "Published", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getVacancies().map((v) => ({
  title: v.title,
  category: v.category ?? "—",
  date: v.date ?? "—",
  href: v.fileUrl ?? v.sourceUrl,
}));

export default function Page() {
  return (
    <ListingPage
      title="Vacancies"
      breadcrumb={[{ label: "Offerings" }, { label: "Vacancies" }]}
      lastUpdated="Synced from dosje.gov.in"
      description="Latest recruitment notifications, deputations and vacancy circulars across the Department and its allied bodies."
      columns={columns}
      rows={rows}
      searchKeys={["title", "category"]}
      searchPlaceholder="Search vacancies…"
    />
  );
}
