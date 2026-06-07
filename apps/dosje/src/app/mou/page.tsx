import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Memoranda of Understanding | DoSJE",
  description:
    "Memoranda of Understanding signed by the Department of Social Justice & Empowerment with partner institutions.",
};

const rows = [
  { title: "MoU with National Skill Development Corporation for PM-DAKSH Implementation", date: "18 May 2026", href: "#" },
  { title: "MoU with Indian Institute of Public Administration for Capacity Building", date: "02 May 2026", href: "#" },
  { title: "MoU with NSFDC for Concessional Credit to SC Entrepreneurs", date: "20 Apr 2026", href: "#" },
  { title: "MoU with AIIMS for the National Action Plan for Drug Demand Reduction", date: "06 Apr 2026", href: "#" },
  { title: "MoU with NBCFDC for Skill Development of OBC Beneficiaries", date: "22 Mar 2026", href: "#" },
  { title: "MoU with State Governments for the SMILE Scheme Rollout", date: "08 Mar 2026", href: "#" },
  { title: "MoU with HUDCO for Construction of Hostels for SC Students", date: "24 Feb 2026", href: "#" },
  { title: "MoU with NSKFDC for Mechanisation of Sanitation Work", date: "10 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Memoranda of Understanding"
      breadcrumb={[{ label: "Documents" }, { label: "MoU" }]}
      lastUpdated="06 Jun 2026"
      description="Memoranda of Understanding signed by the Department with partner institutions and agencies."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search MoUs…"
    />
  );
}
