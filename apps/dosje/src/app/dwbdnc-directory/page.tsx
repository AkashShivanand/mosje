import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title:
    "DWBDNC Directory | Development & Welfare Board for De-notified, Nomadic & Semi-Nomadic Communities",
  description:
    "Telephone directory of the Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — Chairman, Members, and officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Bhiku Ramji Idate",
    designation: "Chairman, DWBDNC",
    intercom: "601",
    contact: "011-22904915",
    email: "chairman-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 2,
    name: "Dr. Gangaram Bhopi",
    designation: "Member, DWBDNC",
    intercom: "604",
    contact: "011-22904918",
    email: "member1-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 3,
    name: "Sunita Kale",
    designation: "Member, DWBDNC",
    intercom: "607",
    contact: "011-22904921",
    email: "member2-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 4,
    name: "Rameshwar Nath Pandey",
    designation: "Member Secretary, DWBDNC",
    intercom: "610",
    contact: "011-22904924",
    email: "ms-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 5,
    name: "Vandana Rathore",
    designation: "Director, DWBDNC",
    intercom: "613",
    contact: "011-22904927",
    email: "dir-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 6,
    name: "Ashok Kumar Pawar",
    designation: "Deputy Director, DWBDNC",
    intercom: "616",
    contact: "011-22904930",
    email: "dd-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
  {
    sno: 7,
    name: "Firoz Alam Ansari",
    designation: "Under Secretary, DWBDNC",
    intercom: "619",
    contact: "011-22904933",
    email: "us-dwbdnc[at]nic[dot]in",
    address: "Dr. Ambedkar International Centre, 15 Janpath, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="DWBDNC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DWBDNC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities (DWBDNC) — Chairman, Members, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
