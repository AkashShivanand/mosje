import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Resources | DoSJE",
  description:
    "Useful resources, toolkits and reference material from the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Implementation Toolkit for the PM-AJAY Adarsh Gram Component", date: "18 May 2026", href: "#" },
  { title: "Beneficiary Awareness Toolkit for the SMILE Scheme", date: "04 May 2026", href: "#" },
  { title: "Reference Manual for State Scholarship Nodal Officers", date: "20 Apr 2026", href: "#" },
  { title: "Training Resource Pack for Nasha Mukt Bharat Volunteers", date: "06 Apr 2026", href: "#" },
  { title: "Standard Operating Procedures for DBT Reconciliation", date: "22 Mar 2026", href: "#" },
  { title: "Communication Guidelines and Branding Toolkit for Schemes", date: "08 Mar 2026", href: "#" },
  { title: "Resource Directory of Rehabilitation Centres across India", date: "24 Feb 2026", href: "#" },
  { title: "E-Learning Modules on Digital Accessibility (GIGW)", date: "10 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Resources"
      breadcrumb={[{ label: "Documents" }, { label: "Resources" }]}
      lastUpdated="06 Jun 2026"
      description="Toolkits, manuals and reference material to support scheme implementation and outreach."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search resources…"
    />
  );
}
