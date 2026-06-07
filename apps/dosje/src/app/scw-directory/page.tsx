import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "SCW Directory | Schedule Caste Welfare",
  description:
    "Telephone directory of the Scheduled Caste Welfare (SCW) division — Director, Deputy Secretaries, and officers handling SC welfare programmes with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Dr. Ramakant Solanki",
    designation: "Director (SC Welfare)",
    intercom: "440",
    contact: "011-23386521",
    email: "dir-scw[at]nic[dot]in",
    address: "Room No. 808, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 2,
    name: "Manisha Borkar",
    designation: "Deputy Secretary (SCW Schemes)",
    intercom: "443",
    contact: "011-23386525",
    email: "ds-scw[at]nic[dot]in",
    address: "Room No. 811, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 3,
    name: "Gopal Krishna Murthy",
    designation: "Deputy Secretary (Scholarships, SCW)",
    intercom: "446",
    contact: "011-23386529",
    email: "ds-sch-scw[at]nic[dot]in",
    address: "Room No. 814, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 4,
    name: "Farida Begum",
    designation: "Under Secretary (SCW)",
    intercom: "449",
    contact: "011-23386533",
    email: "us-scw[at]nic[dot]in",
    address: "Room No. 817, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 5,
    name: "Prashant Deshmukh",
    designation: "Section Officer (SCW Coordination)",
    intercom: "452",
    contact: "011-23386537",
    email: "so-scw[at]nic[dot]in",
    address: "Room No. 820, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 6,
    name: "Lata Mangeshkar Pawar",
    designation: "Research Officer (SCW)",
    intercom: "455",
    contact: "011-23386541",
    email: "ro-scw[at]nic[dot]in",
    address: "Room No. 823, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 7,
    name: "Abhishek Raghuvanshi",
    designation: "Assistant Director (SCW Monitoring)",
    intercom: "458",
    contact: "011-23386545",
    email: "ad-scw[at]nic[dot]in",
    address: "Room No. 826, A-Wing, Shastri Bhawan, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="SCW Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "SCW Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Scheduled Caste Welfare (SCW) division — Director, Deputy Secretaries, and officers handling SC welfare programmes with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
