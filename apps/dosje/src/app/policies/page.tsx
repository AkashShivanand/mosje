import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Policies | DoSJE",
  description:
    "Policy documents and frameworks of the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "National Policy for Senior Citizens", date: "12 May 2026", href: "#" },
  { title: "National Policy on Drug Demand Reduction", date: "28 Apr 2026", href: "#" },
  { title: "National Action Plan for Skill Development of SC/OBC Communities", date: "14 Apr 2026", href: "#" },
  { title: "Policy Framework for Rehabilitation of Manual Scavengers", date: "30 Mar 2026", href: "#" },
  { title: "Data Sharing and Accessibility Policy of the Department", date: "16 Mar 2026", href: "#" },
  { title: "National Policy for Empowerment of Transgender Persons", date: "02 Mar 2026", href: "#" },
  { title: "Grievance Redressal Policy for Scheme Beneficiaries", date: "18 Feb 2026", href: "#" },
  { title: "Website Content Management and Archival Policy (GIGW)", date: "04 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Policies"
      breadcrumb={[{ label: "Documents" }, { label: "Policies" }]}
      lastUpdated="06 Jun 2026"
      description="Policy documents and frameworks governing the Department's programmes and operations."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search policies…"
    />
  );
}
