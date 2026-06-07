import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Who's Who | Ministry of Social Justice & Empowerment",
  description:
    "Who's Who of the Ministry of Social Justice & Empowerment, Government of India — senior leadership including the Union Minister, Ministers of State, and Secretaries.",
};

const rows = [
  {
    sno: 1,
    name: "Dr. Virendra Kumar",
    designation: "Union Minister of Social Justice and Empowerment",
    intercom: "110",
    contact: "011-24105009, 24105011",
    email: "min-sje[at]nic[dot]in",
    address: "Room No. 8605, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
  },
  {
    sno: 2,
    name: "Ramdas Athawale",
    designation: "Minister of State (Social Justice and Empowerment)",
    intercom: "112",
    contact: "011-23381390",
    email: "mos1-sje[at]nic[dot]in",
    address: "Room No. 251, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 3,
    name: "B. L. Verma",
    designation: "Minister of State (Social Justice and Empowerment)",
    intercom: "114",
    contact: "011-23381405",
    email: "mos2-sje[at]nic[dot]in",
    address: "Room No. 254, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 4,
    name: "Amit Yadav, IAS",
    designation: "Secretary",
    intercom: "121",
    contact: "011-23381001, 23386946",
    email: "secy-sje[at]nic[dot]in",
    address: "Room No. 615, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 5,
    name: "Surendra Singh, IAS",
    designation: "Additional Secretary",
    intercom: "134",
    contact: "011-23070315",
    email: "as-sje[at]nic[dot]in",
    address: "Room No. 605, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 6,
    name: "Rajiv Sharma, IAS",
    designation: "Joint Secretary (SCD)",
    intercom: "145",
    contact: "011-23381322",
    email: "js-scd[at]nic[dot]in",
    address: "Room No. 729, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 7,
    name: "Meenakshi Iyer, IAS",
    designation: "Joint Secretary (BC & DNT)",
    intercom: "149",
    contact: "011-23381340",
    email: "js-bc[at]nic[dot]in",
    address: "Room No. 733, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 8,
    name: "Arun Kumar Mishra, IAS",
    designation: "Joint Secretary (Disability Affairs)",
    intercom: "152",
    contact: "011-23381355",
    email: "js-da[at]nic[dot]in",
    address: "Room No. 521, B-Wing, Shastri Bhawan, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="Who's Who"
      breadcrumb={[{ label: "Department" }, { label: "Who's Who" }]}
      lastUpdated="06 Jun 2026"
      description="Senior leadership of the Ministry of Social Justice & Empowerment — the Union Minister, Ministers of State, and Secretaries with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
