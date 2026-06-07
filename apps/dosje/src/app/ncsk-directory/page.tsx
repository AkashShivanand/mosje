import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "NCSK Directory | National Commission for Safai Karamcharis",
  description:
    "Telephone directory of the National Commission for Safai Karamcharis (NCSK) — Chairman, Members, and supporting officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "M. Venkatesan",
    designation: "Chairman, NCSK",
    intercom: "501",
    contact: "011-22054393",
    email: "chairman-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 2,
    name: "Jagdish Prasad Ahirwar",
    designation: "Vice-Chairman, NCSK",
    intercom: "504",
    contact: "011-22054396",
    email: "vc-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 3,
    name: "Manju Diwakar",
    designation: "Member, NCSK",
    intercom: "507",
    contact: "011-22054399",
    email: "member1-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 4,
    name: "Sukhdev Singh Patwa",
    designation: "Member, NCSK",
    intercom: "510",
    contact: "011-22054402",
    email: "member2-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 5,
    name: "Praveen Kumar Lal",
    designation: "Secretary, NCSK",
    intercom: "513",
    contact: "011-22054405",
    email: "secy-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 6,
    name: "Sarita Bairwa",
    designation: "Director, NCSK",
    intercom: "516",
    contact: "011-22054408",
    email: "dir-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 7,
    name: "Omkar Nath Tiwari",
    designation: "Under Secretary, NCSK",
    intercom: "519",
    contact: "011-22054411",
    email: "us-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
  {
    sno: 8,
    name: "Bhuvneshwar Paswan",
    designation: "Research Officer, NCSK",
    intercom: "522",
    contact: "011-22054414",
    email: "ro-ncsk[at]nic[dot]in",
    address: "Standard Building, 1st Floor, Barakhamba Road, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NCSK Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NCSK Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Commission for Safai Karamcharis (NCSK) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
