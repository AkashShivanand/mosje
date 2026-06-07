import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "DAIC Directory | Dr. Ambedkar International Centre",
  description:
    "Telephone directory of the Dr. Ambedkar International Centre (DAIC) — Director General, Directors, and officers with intercom and contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Lt. Gen. (Retd.) Prakash Menon",
    designation: "Director General, DAIC",
    intercom: "801",
    contact: "011-23062387",
    email: "dg-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 2,
    name: "Dr. Shalini Bhardwaj",
    designation: "Director (Research & Studies), DAIC",
    intercom: "804",
    contact: "011-23062390",
    email: "dir-rs-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 3,
    name: "Vikram Aditya Rao",
    designation: "Director (Operations), DAIC",
    intercom: "807",
    contact: "011-23062393",
    email: "dir-ops-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 4,
    name: "Preeti Wadhwa",
    designation: "Deputy Director (Events), DAIC",
    intercom: "810",
    contact: "011-23062396",
    email: "dd-events-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 5,
    name: "Anand Mohan Jha",
    designation: "Manager (Facilities), DAIC",
    intercom: "813",
    contact: "011-23062399",
    email: "mgr-fac-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 6,
    name: "Ritika Malhotra",
    designation: "Accounts Officer, DAIC",
    intercom: "816",
    contact: "011-23062402",
    email: "ao-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
  {
    sno: 7,
    name: "Suraj Prakash Dubey",
    designation: "Research Associate, DAIC",
    intercom: "819",
    contact: "011-23062405",
    email: "ra-daic[at]nic[dot]in",
    address: "15 Janpath, Dr. Ambedkar International Centre, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="DAIC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "DAIC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the Dr. Ambedkar International Centre (DAIC) — Director General, Directors, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
