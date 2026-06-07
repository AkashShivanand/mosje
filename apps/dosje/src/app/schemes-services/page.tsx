import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";

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

const rows = [
  { scheme: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)", target: "Scheduled Castes", href: "#" },
  { scheme: "PM Young Achievers Scholarship (PM-YASASVI)", target: "OBC, EBC & DNT students", href: "#" },
  { scheme: "Centrally Sponsored Scheme for implementation of the Protection of Civil Rights Act", target: "Scheduled Castes", href: "#" },
  { scheme: "Top Class Education in College for OBC, EBC and DNT Students", target: "OBC, EBC & DNT students", href: "#" },
  { scheme: "Pre-Matric Scholarships Scheme for Scheduled Castes & Others", target: "Scheduled Castes & Others", href: "#" },
  { scheme: "Post-Matric Scholarship for SC students", target: "Scheduled Castes", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Schemes & Services"
      breadcrumb={[{ label: "Offerings" }, { label: "Schemes & Services" }]}
      lastUpdated="06 Jun 2026"
      description="Flagship welfare schemes and scholarships delivered by the Department for SC, OBC, EBC and DNT communities."
      columns={columns}
      rows={rows}
      searchKeys={["scheme", "target"]}
      searchPlaceholder="Search schemes…"
    />
  );
}
