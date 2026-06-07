import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Publications | DoSJE",
  description:
    "Reports, studies, brochures and other publications released by the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Handbook of Social Welfare Statistics 2025", date: "20 May 2026", href: "#" },
  { title: "Compendium of Schemes for Scheduled Castes and Backward Classes", date: "30 Apr 2026", href: "#" },
  { title: "Status Report on Eradication of Manual Scavenging in India", date: "12 Apr 2026", href: "#" },
  { title: "National Survey on Substance Use in India — Summary Findings", date: "28 Mar 2026", href: "#" },
  { title: "Citizen's Charter of the Department of Social Justice & Empowerment", date: "15 Mar 2026", href: "#" },
  { title: "Annual Compendium of Welfare Initiatives for Senior Citizens", date: "02 Mar 2026", href: "#" },
  { title: "Brochure on the SMILE Scheme for Transgender Persons and Beggars", date: "18 Feb 2026", href: "#" },
  { title: "Study Report on Educational Empowerment of Denotified Tribes", date: "05 Feb 2026", href: "#" },
  { title: "Guidelines Booklet for Implementation of PM-DAKSH Skilling Scheme", date: "22 Jan 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Publications"
      breadcrumb={[{ label: "Documents" }, { label: "Publications" }]}
      lastUpdated="06 Jun 2026"
      description="Reports, studies, compendiums and brochures released by the Department."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search publications…"
    />
  );
}
