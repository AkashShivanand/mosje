import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Circulars & Notifications | DoSJE",
  description:
    "Official circulars and notifications issued by the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Notification on Revised Income Ceiling for Creamy Layer under OBC Reservation", date: "28 May 2026", href: "#" },
  { title: "Circular regarding Disbursement of Post-Matric Scholarship Funds for FY 2025-26", date: "21 May 2026", href: "#" },
  { title: "Notification of Guidelines for PM-AJAY Adarsh Gram Component", date: "14 May 2026", href: "#" },
  { title: "Office Memorandum on Implementation of e-Office across Subordinate Offices", date: "06 May 2026", href: "#" },
  { title: "Circular on Submission of Utilisation Certificates by State Implementing Agencies", date: "29 Apr 2026", href: "#" },
  { title: "Notification regarding Constitution of the National Overseas Scholarship Selection Committee", date: "18 Apr 2026", href: "#" },
  { title: "Circular on Aadhaar Seeding of Beneficiary Bank Accounts for DBT Schemes", date: "09 Apr 2026", href: "#" },
  { title: "Notification on Extension of Validity for Caste Certificates issued before 2010", date: "27 Mar 2026", href: "#" },
  { title: "Office Memorandum on Quarterly Progress Reporting Format for Grantee Institutions", date: "15 Mar 2026", href: "#" },
  { title: "Circular regarding Conduct of Social Audits under SMILE Scheme", date: "04 Mar 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Circulars & Notifications"
      breadcrumb={[{ label: "Documents" }, { label: "Circulars & Notifications" }]}
      lastUpdated="06 Jun 2026"
      description="Official circulars, office memoranda and notifications issued by the Department."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search circulars…"
    />
  );
}
