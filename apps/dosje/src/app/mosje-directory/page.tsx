import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "MoSJE Directory | Ministry of Social Justice & Empowerment",
  description:
    "Official telephone directory of the Ministry of Social Justice & Empowerment, Government of India — Ministers and senior secretariat officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Dr. Virendra Kumar, HMSJE",
    designation: "Union Minister of Social Justice and Empowerment",
    intercom: "110",
    contact: "011-24105009, 24105011, 26110251",
    email: "min-sje[at]nic[dot]in",
    address: "Room No. 8605, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
  },
  {
    sno: 2,
    name: "Jatin Chopra, IRTS",
    designation: "Private Secretary",
    intercom: "110",
    contact: "011-24105009, 24105011",
    email: "min-sje[at]nic[dot]in",
    address: "8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
  },
  {
    sno: 3,
    name: "Prabhat Kumar Tripathy",
    designation: "Additional Private Secretary",
    intercom: "110",
    contact: "011-24105009",
    email: "min-sje[at]nic[dot]in",
    address: "8th Floor, Zone-6, GPOA-3, New Delhi",
  },
  {
    sno: 4,
    name: "Bharat",
    designation: "Assistant Private Secretary",
    intercom: "110",
    contact: "011-24105009",
    email: "min-sje[at]nic[dot]in",
    address: "8th Floor, Zone-6, GPOA-3, New Delhi",
  },
  {
    sno: 5,
    name: "Amit Yadav, IAS",
    designation: "Secretary",
    intercom: "121",
    contact: "011-23381001, 23386946",
    email: "secy-sje[at]nic[dot]in",
    address: "Room No. 615, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 6,
    name: "Surendra Singh, IAS",
    designation: "Additional Secretary",
    intercom: "134",
    contact: "011-23070315",
    email: "as-sje[at]nic[dot]in",
    address: "Room No. 605, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 7,
    name: "Rajiv Sharma, IAS",
    designation: "Joint Secretary (SCD)",
    intercom: "145",
    contact: "011-23381322",
    email: "js-scd[at]nic[dot]in",
    address: "Room No. 729, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 8,
    name: "Anita Bhatnagar, IES",
    designation: "Economic Adviser",
    intercom: "158",
    contact: "011-23386578",
    email: "ea-sje[at]nic[dot]in",
    address: "Room No. 712, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 9,
    name: "Mahendra Pratap Singh",
    designation: "Chief Controller of Accounts",
    intercom: "162",
    contact: "011-24369280",
    email: "cca-sje[at]nic[dot]in",
    address: "Room No. 7, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 10,
    name: "Sunita Verma",
    designation: "Deputy Secretary (Admin)",
    intercom: "176",
    contact: "011-23386152",
    email: "ds-admin[at]nic[dot]in",
    address: "Room No. 543, A-Wing, Shastri Bhawan, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="MoSJE Directory"
      breadcrumb={[{ label: "Department" }, { label: "Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Ministry of Social Justice & Empowerment — Ministers and senior secretariat officers with intercom and contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
