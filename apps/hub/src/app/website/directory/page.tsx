import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns } from "@/data/website/columns";

export const metadata: Metadata = {
  title: "Staff Directory | Ministry of Social Justice & Empowerment",
  description:
    "General staff directory of the Ministry of Social Justice & Empowerment, Government of India — officers and officials across divisions with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Pradeep Nautiyal",
    designation: "Director (Scholarships)",
    intercom: "203",
    contact: "011-23385973",
    email: "dir-sch[at]nic[dot]in",
    address: "Room No. 718, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 2,
    name: "Kavita Rani",
    designation: "Director (Disability Affairs)",
    intercom: "211",
    contact: "011-23386154",
    email: "dir-da[at]nic[dot]in",
    address: "Room No. 521, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 3,
    name: "Sanjay Kulkarni",
    designation: "Deputy Secretary (NSAP)",
    intercom: "218",
    contact: "011-23070281",
    email: "ds-nsap[at]nic[dot]in",
    address: "Room No. 634, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 4,
    name: "Reena Mathew",
    designation: "Under Secretary (Coordination)",
    intercom: "226",
    contact: "011-23386440",
    email: "us-coord[at]nic[dot]in",
    address: "Room No. 309, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 5,
    name: "Devendra Pal",
    designation: "Under Secretary (Establishment)",
    intercom: "233",
    contact: "011-23386901",
    email: "us-estt[at]nic[dot]in",
    address: "Room No. 312, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 6,
    name: "Lakshmi Narayanan",
    designation: "Section Officer (Budget)",
    intercom: "241",
    contact: "011-23385612",
    email: "so-budget[at]nic[dot]in",
    address: "Room No. 118, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 7,
    name: "Pooja Aggarwal",
    designation: "Section Officer (Parliament)",
    intercom: "248",
    contact: "011-23385619",
    email: "so-parl[at]nic[dot]in",
    address: "Room No. 124, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 8,
    name: "Harish Chandra Joshi",
    designation: "Senior Technical Director (NIC)",
    intercom: "255",
    contact: "011-23074512",
    email: "std-nic[at]nic[dot]in",
    address: "NIC Cell, Ground Floor, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 9,
    name: "Nidhi Saxena",
    designation: "Assistant Director (OL)",
    intercom: "262",
    contact: "011-23386773",
    email: "ad-ol[at]nic[dot]in",
    address: "Room No. 207, B-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 10,
    name: "Mukesh Ranjan",
    designation: "Accounts Officer",
    intercom: "270",
    contact: "011-24369285",
    email: "ao-sje[at]nic[dot]in",
    address: "PAO (SJE), Lok Nayak Bhawan, Khan Market, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="Staff Directory"
      breadcrumb={[{ label: "Connect" }, { label: "Directory" }]}
      lastUpdated="06 Jun 2026"
      description="General staff directory of the Ministry of Social Justice & Empowerment — officers and officials across divisions with intercom and contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
