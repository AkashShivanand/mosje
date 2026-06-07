import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "PM-AJAY Directory | Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
  description:
    "Telephone directory of the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Project Management Unit — Mission Director, Project Directors, and officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Alok Ranjan Pandey, IAS",
    designation: "Mission Director, PM-AJAY",
    intercom: "470",
    contact: "011-23386551",
    email: "md-pmajay[at]nic[dot]in",
    address: "Room No. 705, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 2,
    name: "Deepika Rawat",
    designation: "Project Director (Adarsh Gram), PM-AJAY",
    intercom: "473",
    contact: "011-23386555",
    email: "pd-ag-pmajay[at]nic[dot]in",
    address: "Room No. 708, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 3,
    name: "Satyendra Nath Bose",
    designation: "Project Director (Grants-in-Aid), PM-AJAY",
    intercom: "476",
    contact: "011-23386559",
    email: "pd-gia-pmajay[at]nic[dot]in",
    address: "Room No. 711, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 4,
    name: "Nazia Parveen",
    designation: "Deputy Director (Hostels), PM-AJAY",
    intercom: "479",
    contact: "011-23386563",
    email: "dd-hostel-pmajay[at]nic[dot]in",
    address: "Room No. 714, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 5,
    name: "Ramesh Babu Konda",
    designation: "Monitoring & Evaluation Officer, PM-AJAY",
    intercom: "482",
    contact: "011-23386567",
    email: "me-pmajay[at]nic[dot]in",
    address: "Room No. 717, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 6,
    name: "Sheetal Aggrawal",
    designation: "Finance Officer, PM-AJAY",
    intercom: "485",
    contact: "011-23386571",
    email: "fo-pmajay[at]nic[dot]in",
    address: "Room No. 720, A-Wing, Shastri Bhawan, New Delhi",
  },
  {
    sno: 7,
    name: "Pankaj Mohanty",
    designation: "IT Consultant, PM-AJAY PMU",
    intercom: "488",
    contact: "011-23386575",
    email: "it-pmajay[at]nic[dot]in",
    address: "Room No. 723, A-Wing, Shastri Bhawan, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="PM-AJAY Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "PM-AJAY Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) Project Management Unit — Mission Director, Project Directors, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
