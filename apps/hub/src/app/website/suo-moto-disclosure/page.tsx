import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { noticeColumns } from "@/data/website/columns";

export const metadata: Metadata = {
  title: "Suo Moto Disclosure | DoSJE",
  description:
    "Proactive disclosures under Section 4 of the Right to Information Act, 2005 by the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Section 4(1)(b) Disclosure — Particulars of Organisation, Functions and Duties", date: "16 May 2026", href: "#" },
  { title: "Powers and Duties of Officers and Employees", date: "02 May 2026", href: "#" },
  { title: "Procedure followed in the Decision-Making Process", date: "18 Apr 2026", href: "#" },
  { title: "Norms set for Discharge of Functions", date: "04 Apr 2026", href: "#" },
  { title: "Statement of Boards, Councils and Committees", date: "20 Mar 2026", href: "#" },
  { title: "Directory of Officers and Employees", date: "06 Mar 2026", href: "#" },
  { title: "Monthly Remuneration received by Officers and Employees", date: "22 Feb 2026", href: "#" },
  { title: "Budget Allocated to Each Agency and Plan for Expenditure", date: "08 Feb 2026", href: "#" },
  { title: "Particulars of Recipients of Concessions and Subsidies", date: "24 Jan 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Suo Moto Disclosure"
      breadcrumb={[{ label: "Documents" }, { label: "Suo Moto Disclosure" }]}
      lastUpdated="06 Jun 2026"
      description="Proactive disclosures under Section 4 of the Right to Information Act, 2005."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search disclosures…"
    />
  );
}
