import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Advices | DoSJE",
  description:
    "Advisories and advices issued by the Department of Social Justice & Empowerment to States and implementing agencies.",
};

const rows = [
  { title: "Advisory to States on Timely Disbursement of Pre-Matric Scholarships", date: "26 May 2026", href: "#" },
  { title: "Advisory on Prevention of Atrocities against Scheduled Castes during Festivals", date: "14 May 2026", href: "#" },
  { title: "Advisory to Implementing Agencies on Geo-tagging of Adarsh Gram Works", date: "30 Apr 2026", href: "#" },
  { title: "Advisory on Mandatory Aadhaar Authentication for DBT Beneficiaries", date: "16 Apr 2026", href: "#" },
  { title: "Advisory regarding Safe Working Conditions for Sanitation Workers", date: "02 Apr 2026", href: "#" },
  { title: "Advisory to States on Strengthening Old Age Homes under AVYAY", date: "18 Mar 2026", href: "#" },
  { title: "Advisory on Awareness Campaigns under the Nasha Mukt Bharat Abhiyaan", date: "04 Mar 2026", href: "#" },
  { title: "Advisory on Grievance Redressal Timelines for Scheme Beneficiaries", date: "20 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Advices"
      breadcrumb={[{ label: "Documents" }, { label: "Advices" }]}
      lastUpdated="06 Jun 2026"
      description="Advisories issued by the Department to States, UTs and implementing agencies."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search advices…"
    />
  );
}
