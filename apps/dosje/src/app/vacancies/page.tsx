import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import type { DataTableColumn } from "@/components/ui/data-table";

export const metadata: Metadata = {
  title: "Vacancies | DoSJE",
  description:
    "Current recruitment notifications and vacancy circulars under the Department of Social Justice & Empowerment and its bodies.",
};

const columns: DataTableColumn[] = [
  { key: "title", label: "Title", sortable: true, align: "left", className: "min-w-[360px] font-medium text-ink" },
  { key: "lastDate", label: "Last Date", sortable: true, align: "center" },
  { key: "action", label: "Action", align: "center", type: "link", hrefKey: "href", linkLabel: "View" },
];

const rows = [
  { title: "Date further Extended for submission of application for the post of Financial Advisor on Deputation Basis at DAIC", lastDate: "30 Jun 2026", href: "#" },
  { title: "Extension of Application Submission Date for Financial Adviser (FA) Post at DAF and BJRNF", lastDate: "25 Jun 2026", href: "#" },
  { title: "Recruitment Notification for Deputy General Manager (Finance) – E-5 Level", lastDate: "20 Jun 2026", href: "#" },
  { title: "Sales Executives And Supervisors", lastDate: "18 Jun 2026", href: "#" },
  { title: "Senior Relationship Manager", lastDate: "15 Jun 2026", href: "#" },
  { title: "Telecalling Executive", lastDate: "12 Jun 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Vacancies"
      breadcrumb={[{ label: "Offerings" }, { label: "Vacancies" }]}
      lastUpdated="06 Jun 2026"
      description="Latest recruitment notifications, deputations and vacancy circulars across the Department and its allied bodies."
      columns={columns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search vacancies…"
    />
  );
}
