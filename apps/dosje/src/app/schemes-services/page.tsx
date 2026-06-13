import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";
import { getSchemes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Schemes & Services | DoSJE",
  description:
    "Flagship welfare schemes and scholarships offered by the Department of Social Justice & Empowerment for SC, OBC, EBC and DNT communities.",
};

const columns: DataTableColumn[] = [
  { key: "scheme", label: "Scheme", sortable: true, align: "left", className: "min-w-[340px] font-medium text-ink" },
  { key: "target", label: "Target Group", sortable: true, align: "left", className: "min-w-[200px]" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = getSchemes().map((s) => ({
  scheme: s.title,
  target: s.targetGroup && s.targetGroup.length ? s.targetGroup.join(", ") : "—",
  href: `/schemes-services/${s.slug}`,
}));

export default function Page() {
  return (
    <ListingPage
      title="Schemes & Services"
      breadcrumb={[{ label: "Offerings" }, { label: "Schemes & Services" }]}
      lastUpdated="Synced from dosje.gov.in"
      description="Flagship welfare schemes and scholarships delivered by the Department for SC, OBC, EBC and DNT communities."
      columns={columns}
      rows={rows}
      searchKeys={["scheme", "target"]}
      searchPlaceholder="Search schemes…"
    />
  );
}
