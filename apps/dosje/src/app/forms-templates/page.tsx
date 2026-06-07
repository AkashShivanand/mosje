import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Forms & Templates | DoSJE",
  description:
    "Downloadable application forms and templates for schemes and services of the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Application Form for Post-Matric Scholarship for SC Students", date: "12 May 2026", href: "#" },
  { title: "Caste Certificate Application Form (Annexure-A)", date: "28 Apr 2026", href: "#" },
  { title: "Utilisation Certificate Template for Grantee Institutions (GFR 12-A)", date: "16 Apr 2026", href: "#" },
  { title: "Beneficiary Enrolment Form for the SMILE Scheme", date: "02 Apr 2026", href: "#" },
  { title: "Proforma for Submission of Quarterly Progress Report", date: "20 Mar 2026", href: "#" },
  { title: "Application Form for National Overseas Scholarship", date: "06 Mar 2026", href: "#" },
  { title: "RTI Application Format (Form-A)", date: "22 Feb 2026", href: "#" },
  { title: "Bank Mandate Form for Direct Benefit Transfer", date: "10 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Forms & Templates"
      breadcrumb={[{ label: "Documents" }, { label: "Forms & Templates" }]}
      lastUpdated="06 Jun 2026"
      description="Downloadable application forms and standard templates for the Department's schemes and services."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search forms & templates…"
    />
  );
}
