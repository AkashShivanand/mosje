import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { noticeColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Miscellaneous | DoSJE",
  description:
    "Miscellaneous documents and downloads from the Department of Social Justice & Empowerment.",
};

const rows = [
  { title: "Citizen's Charter of the Department of Social Justice & Empowerment", date: "20 May 2026", href: "#" },
  { title: "Telephone Directory of Officers — Shastri Bhawan, New Delhi", date: "06 May 2026", href: "#" },
  { title: "Organisational Chart of the Department", date: "22 Apr 2026", href: "#" },
  { title: "List of Autonomous Bodies and PSUs under the Department", date: "08 Apr 2026", href: "#" },
  { title: "Frequently Asked Questions on Scholarship Schemes", date: "24 Mar 2026", href: "#" },
  { title: "Photo Gallery — National Conference on Social Empowerment 2025", date: "10 Mar 2026", href: "#" },
  { title: "Allocation of Business Rules relevant to the Department", date: "26 Feb 2026", href: "#" },
  { title: "List of Designated Public Information Officers", date: "12 Feb 2026", href: "#" },
];

export default function Page() {
  return (
    <ListingPage
      title="Miscellaneous"
      breadcrumb={[{ label: "Documents" }, { label: "Miscellaneous" }]}
      lastUpdated="06 Jun 2026"
      description="Miscellaneous documents, directories and downloads published by the Department."
      columns={noticeColumns}
      rows={rows}
      searchKeys={["title"]}
      searchPlaceholder="Search documents…"
    />
  );
}
