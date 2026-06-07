import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "Chairperson's Office | Ministry of Social Justice & Empowerment",
  description:
    "Directory of the Chairperson's Office under the Ministry of Social Justice & Empowerment — the Chairperson and supporting secretariat officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Justice (Retd.) Hansraj Gangaram Ahir",
    designation: "Chairperson",
    intercom: "301",
    contact: "011-24360801",
    email: "chairperson[at]nic[dot]in",
    address: "Room No. 101, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 2,
    name: "Sudhir Vasant Deshpande",
    designation: "Secretary to Chairperson",
    intercom: "303",
    contact: "011-24360805",
    email: "secy-cp[at]nic[dot]in",
    address: "Room No. 104, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 3,
    name: "Anjali Deshmukh",
    designation: "Private Secretary",
    intercom: "305",
    contact: "011-24360808",
    email: "ps-cp[at]nic[dot]in",
    address: "Room No. 106, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 4,
    name: "Ravindra Kumar Singh",
    designation: "Deputy Director",
    intercom: "308",
    contact: "011-24360812",
    email: "dd-cp[at]nic[dot]in",
    address: "Room No. 110, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 5,
    name: "Geeta Chauhan",
    designation: "Under Secretary",
    intercom: "311",
    contact: "011-24360816",
    email: "us-cp[at]nic[dot]in",
    address: "Room No. 114, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 6,
    name: "Naresh Babu",
    designation: "Section Officer",
    intercom: "314",
    contact: "011-24360820",
    email: "so-cp[at]nic[dot]in",
    address: "Room No. 118, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
  {
    sno: 7,
    name: "Shabnam Khatoon",
    designation: "Research Officer",
    intercom: "317",
    contact: "011-24360824",
    email: "ro-cp[at]nic[dot]in",
    address: "Room No. 121, B-2 Wing, Antyodaya Bhawan, CGO Complex, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="Chairperson's Office"
      breadcrumb={[{ label: "Connect" }, { label: "Chairperson's Office" }]}
      lastUpdated="06 Jun 2026"
      description="Directory of the Chairperson's Office — the Chairperson and supporting secretariat officers with intercom and contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
