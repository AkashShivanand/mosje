import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "NBCFDC Directory | National Backward Classes Finance & Development Corporation",
  description:
    "Telephone directory of the National Backward Classes Finance and Development Corporation (NBCFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Naveen Kumar Sinha",
    designation: "Chairman-cum-Managing Director, NBCFDC",
    intercom: "901",
    contact: "011-45854400",
    email: "cmd-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, August Kranti Marg, New Delhi",
  },
  {
    sno: 2,
    name: "Rajeshwari Pillai",
    designation: "General Manager (Finance), NBCFDC",
    intercom: "904",
    contact: "011-45854404",
    email: "gm-fin-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 3,
    name: "Devraj Hooda",
    designation: "General Manager (Schemes), NBCFDC",
    intercom: "907",
    contact: "011-45854408",
    email: "gm-sch-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 4,
    name: "Sneha Kulshrestha",
    designation: "Deputy General Manager, NBCFDC",
    intercom: "910",
    contact: "011-45854412",
    email: "dgm-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 5,
    name: "Imran Sheikh",
    designation: "Assistant General Manager, NBCFDC",
    intercom: "913",
    contact: "011-45854416",
    email: "agm-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 6,
    name: "Pallavi Deshpande",
    designation: "Company Secretary, NBCFDC",
    intercom: "916",
    contact: "011-45854420",
    email: "cs-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 7,
    name: "Gaurav Tandon",
    designation: "Manager (IT), NBCFDC",
    intercom: "919",
    contact: "011-45854424",
    email: "mgr-it-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
  {
    sno: 8,
    name: "Anuradha Bhise",
    designation: "Manager (HR), NBCFDC",
    intercom: "922",
    contact: "011-45854428",
    email: "mgr-hr-nbcfdc[at]nic[dot]in",
    address: "5th Floor, NCUI Building, 3 Siri Institutional Area, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NBCFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NBCFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Backward Classes Finance and Development Corporation (NBCFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
