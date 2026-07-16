import type { Metadata } from "next";
import { ListingPage } from "@/components/website/templates/ListingPage";
import { directoryColumns } from "@/data/website/columns";

export const metadata: Metadata = {
  title: "DAF Directory | Dr. Ambedkar Foundation",
  description:
    "Telephone directory of the Dr. Ambedkar Foundation (DAF) — Member Secretary, Directors, and officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Bhagwan Das Khatana",
    designation: "Member Secretary, Dr. Ambedkar Foundation",
    intercom: "701",
    contact: "011-23320571",
    email: "ms-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 2,
    name: "Suman Lata Arya",
    designation: "Director (Programmes), DAF",
    intercom: "704",
    contact: "011-23320574",
    email: "dir-prog-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 3,
    name: "Yashpal Solanki",
    designation: "Director (Administration), DAF",
    intercom: "707",
    contact: "011-23320577",
    email: "dir-admin-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 4,
    name: "Neha Chaturvedi",
    designation: "Deputy Director, DAF",
    intercom: "710",
    contact: "011-23320580",
    email: "dd-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 5,
    name: "Tarun Sethi",
    designation: "Accounts Officer, DAF",
    intercom: "713",
    contact: "011-23320583",
    email: "ao-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 6,
    name: "Kiran Bedi Negi",
    designation: "Under Secretary, DAF",
    intercom: "716",
    contact: "011-23320586",
    email: "us-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 7,
    name: "Sandeep Kaushik",
    designation: "Research Officer, DAF",
    intercom: "719",
    contact: "011-23320589",
    email: "ro-daf[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="DAF Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DAF Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Dr. Ambedkar Foundation (DAF) — Member Secretary, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
