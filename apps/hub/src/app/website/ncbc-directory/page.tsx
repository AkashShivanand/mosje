import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns } from "@/data/website/columns";

export const metadata: Metadata = {
  title: "NCBC Directory | National Commission for Backward Classes",
  description:
    "Telephone directory of the National Commission for Backward Classes (NCBC) — Chairman, Members, and supporting officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Hansraj Gangaram Ahir",
    designation: "Chairman, NCBC",
    intercom: "401",
    contact: "011-24360801",
    email: "chairman-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 2,
    name: "Dr. Suresh Pal",
    designation: "Vice-Chairman, NCBC",
    intercom: "404",
    contact: "011-24360805",
    email: "vc-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 3,
    name: "Kashim Ali Khan",
    designation: "Member, NCBC",
    intercom: "407",
    contact: "011-24360808",
    email: "member1-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 4,
    name: "Bhagwan Lal Sahni",
    designation: "Member, NCBC",
    intercom: "410",
    contact: "011-24360811",
    email: "member2-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 5,
    name: "Renuka Patil",
    designation: "Secretary, NCBC",
    intercom: "413",
    contact: "011-24360815",
    email: "secy-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 6,
    name: "Dinesh Chand Meena",
    designation: "Joint Secretary, NCBC",
    intercom: "416",
    contact: "011-24360818",
    email: "js-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 7,
    name: "Aarti Singhania",
    designation: "Deputy Secretary, NCBC",
    intercom: "419",
    contact: "011-24360821",
    email: "ds-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 8,
    name: "Mohan Lal Yadav",
    designation: "Under Secretary, NCBC",
    intercom: "422",
    contact: "011-24360824",
    email: "us-ncbc[at]nic[dot]in",
    address: "B-2 Wing, 2nd Floor, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NCBC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NCBC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Commission for Backward Classes (NCBC) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
