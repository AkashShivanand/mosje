import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Acts & Rules | DoSJE",
  description:
    "Acts, rules and statutory regulations administered by the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "The Prohibition of Employment as Manual Scavengers and their Rehabilitation Act, 2013", date: "18 Sep 2013", href: "#" },
  { title: "The Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989", date: "11 Sep 1989", href: "#" },
  { title: "The Protection of Civil Rights Act, 1955", date: "08 May 1955", href: "#" },
  { title: "The Maintenance and Welfare of Parents and Senior Citizens Act, 2007", date: "29 Dec 2007", href: "#" },
  { title: "The Rights of Persons with Disabilities Act, 2016", date: "28 Dec 2016", href: "#" },
  { title: "The National Commission for Backward Classes Act, 1993", date: "02 Apr 1993", href: "#" },
  { title: "The National Trust for Welfare of Persons with Autism Act, 1999", date: "30 Dec 1999", href: "#" },
  { title: "Rules under the Prohibition of Employment as Manual Scavengers Act, 2013", date: "12 Dec 2013", href: "#" },
  { title: "The Transgender Persons (Protection of Rights) Act, 2019", date: "05 Dec 2019", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Acts & Rules"
      breadcrumb={[{ label: "Documents" }, { label: "Acts & Rules" }]}
      lastUpdated="06 Jun 2026"
      description="Acts, rules and statutory regulations administered by the Department."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search acts & rules…"
    />
  );
}
