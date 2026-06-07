import type { Metadata } from "next";
import { ListingPage } from "@/components/templates/ListingPage";
import { directoryColumns } from "@/data/columns";

export const metadata: Metadata = {
  title: "NSKFDC Directory | National Safai Karamcharis Finance & Development Corporation",
  description:
    "Telephone directory of the National Safai Karamcharis Finance and Development Corporation (NSKFDC) — Chairman-cum-Managing Director, General Managers, and officers with contact details.",
};

const rows = [
  {
    sno: 1,
    name: "Ashutosh Niranjan Tiwari",
    designation: "Chairman-cum-Managing Director, NSKFDC",
    intercom: "330",
    contact: "011-26382476",
    email: "cmd-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 2,
    name: "Vijaya Lakshmi Reddy",
    designation: "General Manager (Projects), NSKFDC",
    intercom: "333",
    contact: "011-26382480",
    email: "gm-proj-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 3,
    name: "Manohar Lal Saini",
    designation: "General Manager (Finance), NSKFDC",
    intercom: "336",
    contact: "011-26382484",
    email: "gm-fin-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 4,
    name: "Swati Patankar",
    designation: "Deputy General Manager, NSKFDC",
    intercom: "339",
    contact: "011-26382488",
    email: "dgm-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 5,
    name: "Naveen Bhatt",
    designation: "Assistant General Manager, NSKFDC",
    intercom: "342",
    contact: "011-26382492",
    email: "agm-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 6,
    name: "Rukmini Devi Patel",
    designation: "Company Secretary, NSKFDC",
    intercom: "345",
    contact: "011-26382496",
    email: "cs-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
  {
    sno: 7,
    name: "Sudhanshu Mohanty",
    designation: "Manager (Sanitation), NSKFDC",
    intercom: "348",
    contact: "011-26382500",
    email: "mgr-san-nskfdc[at]nic[dot]in",
    address: "Block No. 3, 7th Floor, Plate-B, CGO Complex, Lodhi Road, New Delhi",
  },
];

export default function Page() {
  return (
    <ListingPage
      title="NSKFDC Directory"
      breadcrumb={[{ label: "Associated Organisations" }, { label: "NSKFDC Directory" }]}
      lastUpdated="06 Jun 2026"
      description="Telephone directory of the National Safai Karamcharis Finance and Development Corporation (NSKFDC) — CMD, General Managers, and officers with contact details."
      columns={directoryColumns}
      rows={rows}
      searchKeys={["name", "designation"]}
      searchPlaceholder="Search by name or designation…"
    />
  );
}
