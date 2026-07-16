import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns } from "@/data/website/columns";

export const metadata: Metadata = {
  title: "BJRNF Directory | Babu Jagjivan Ram National Foundation",
  description:
    "Telephone directory of the Babu Jagjivan Ram National Foundation (BJRNF) — Member Secretary, Directors, and officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Krishna Murari Lal Das",
    designation: "Member Secretary, BJRNF",
    intercom: "550",
    contact: "011-23320591",
    email: "ms-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 2,
    name: "Sushma Vaidya",
    designation: "Director (Programmes), BJRNF",
    intercom: "553",
    contact: "011-23320594",
    email: "dir-prog-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 3,
    name: "Mahesh Chandra Vyas",
    designation: "Director (Administration), BJRNF",
    intercom: "556",
    contact: "011-23320597",
    email: "dir-admin-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 4,
    name: "Roshni Mahato",
    designation: "Deputy Director, BJRNF",
    intercom: "559",
    contact: "011-23320600",
    email: "dd-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 5,
    name: "Vinod Kumar Tyagi",
    designation: "Accounts Officer, BJRNF",
    intercom: "562",
    contact: "011-23320603",
    email: "ao-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 6,
    name: "Anjana Srivastava",
    designation: "Under Secretary, BJRNF",
    intercom: "565",
    contact: "011-23320606",
    email: "us-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 7,
    name: "Dilip Singh Rana",
    designation: "Research Officer, BJRNF",
    intercom: "568",
    contact: "011-23320609",
    email: "ro-bjrnf[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="BJRNF Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "BJRNF Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Babu Jagjivan Ram National Foundation (BJRNF) — Member Secretary, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
