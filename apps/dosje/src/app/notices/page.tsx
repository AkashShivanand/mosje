import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Notices | DoSJE",
  description:
    "Public notices and announcements issued by the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Public Notice inviting Comments on Draft Guidelines for PM-AJAY", date: "30 May 2026", href: "#" },
  { title: "Notice for Postponement of National Overseas Scholarship Interviews", date: "22 May 2026", href: "#" },
  { title: "Public Notice regarding Updation of Beneficiary Data on the DBT Portal", date: "14 May 2026", href: "#" },
  { title: "Notice for Stakeholder Consultation on the Senior Citizens Welfare Policy", date: "05 May 2026", href: "#" },
  { title: "Notice regarding Holiday on account of Dr. B.R. Ambedkar Jayanti", date: "10 Apr 2026", href: "#" },
  { title: "Public Notice on Verification of Pending Scholarship Applications", date: "28 Mar 2026", href: "#" },
  { title: "Notice inviting Empanelment of Training Partners under PM-DAKSH", date: "16 Mar 2026", href: "#" },
  { title: "Public Notice on Closure of the Old Grievance Redressal Portal", date: "04 Mar 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Notices"
      breadcrumb={[{ label: "Documents" }, { label: "Notices" }]}
      lastUpdated="06 Jun 2026"
      description="Public notices and announcements issued by the Department."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search notices…"
    />
  );
}
