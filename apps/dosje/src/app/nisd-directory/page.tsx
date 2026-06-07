import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "NISD Directory | National Institute of Social Defence",
  description:
    "Telephone directory of the National Institute of Social Defence (NISD) — Director General, Registrar, faculty, and officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Dr. Ashok Kumar Bhola",
    designation: "Director General, NISD",
    intercom: "120",
    contact: "011-26852316",
    email: "dg-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 2,
    name: "Dr. Savita Nagpal",
    designation: "Registrar, NISD",
    intercom: "123",
    contact: "011-26852319",
    email: "registrar-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 3,
    name: "Prof. Harbans Lal Khanna",
    designation: "Head, Department of Geriatric Care, NISD",
    intercom: "126",
    contact: "011-26852322",
    email: "geriatric-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 4,
    name: "Dr. Lalita Mohanlal",
    designation: "Head, Department of Drug Abuse Prevention, NISD",
    intercom: "129",
    contact: "011-26852325",
    email: "drug-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 5,
    name: "Subrata Banerjee",
    designation: "Assistant Director (Training), NISD",
    intercom: "132",
    contact: "011-26852328",
    email: "ad-train-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 6,
    name: "Komal Aggarwal",
    designation: "Accounts Officer, NISD",
    intercom: "135",
    contact: "011-26852331",
    email: "ao-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
  {
    sno: 7,
    name: "Yogesh Khandelwal",
    designation: "Research Officer, NISD",
    intercom: "138",
    contact: "011-26852334",
    email: "ro-nisd[at]nic[dot]in",
    address: "West Block-1, Wing-7, R.K. Puram, Sector-1, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NISD Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NISD Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Institute of Social Defence (NISD) — Director General, Registrar, faculty, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
