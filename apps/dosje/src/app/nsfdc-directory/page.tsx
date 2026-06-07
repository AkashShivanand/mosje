import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "NSFDC Directory | National Scheduled Castes Finance & Development Corporation",
  description:
    "Telephone directory of the National Scheduled Castes Finance and Development Corporation (NSFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Rajesh Kumar Bansal",
    designation: "Chairman-cum-Managing Director, NSFDC",
    intercom: "210",
    contact: "011-26449653",
    email: "cmd-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 2,
    name: "Shobha Rani Naidu",
    designation: "General Manager (Operations), NSFDC",
    intercom: "213",
    contact: "011-26449657",
    email: "gm-ops-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 3,
    name: "Brijesh Mohan Gupta",
    designation: "General Manager (Finance), NSFDC",
    intercom: "216",
    contact: "011-26449661",
    email: "gm-fin-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 4,
    name: "Karuna Sengupta",
    designation: "Deputy General Manager, NSFDC",
    intercom: "219",
    contact: "011-26449665",
    email: "dgm-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 5,
    name: "Aniruddh Choudhary",
    designation: "Assistant General Manager, NSFDC",
    intercom: "222",
    contact: "011-26449669",
    email: "agm-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 6,
    name: "Meera Krishnan",
    designation: "Company Secretary, NSFDC",
    intercom: "225",
    contact: "011-26449673",
    email: "cs-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 7,
    name: "Hemant Wankhede",
    designation: "Manager (Schemes), NSFDC",
    intercom: "228",
    contact: "011-26449677",
    email: "mgr-sch-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
  {
    sno: 8,
    name: "Divya Ranganathan",
    designation: "Manager (IT), NSFDC",
    intercom: "231",
    contact: "011-26449681",
    email: "mgr-it-nsfdc[at]nic[dot]in",
    address: "14th Floor, Scope Minar, North Tower, Laxmi Nagar District Centre, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NSFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NSFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Scheduled Castes Finance and Development Corporation (NSFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
