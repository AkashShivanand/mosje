import type { Metadata } from "next";
import { ContactPage, type ContactOfficer } from "@/components/website/templates/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Department of Social Justice & Empowerment",
  description:
    "Get in touch with the Department of Social Justice & Empowerment — office address, phone, email and key officers.",
};

const ADDRESS =
  "8th Floor, GPOA-3, Netaji Subhash Place, Wazirpur, New Delhi – 110034";

const officers: ContactOfficer[] = [
  {
    role: "Chief Information Officer",
    name: "Sh. Rajeev Menon",
    phone: "011-24105012",
    email: "rajeev.menon[at]nic[dot]in",
    address: ADDRESS,
  },
  {
    role: "Web Information Manager",
    name: "Smt. Anjali Verma",
    phone: "011-24105014",
    email: "anjali.verma[at]nic[dot]in",
    address: ADDRESS,
  },
  {
    role: "Central Public Information Officer (CPIO)",
    name: "Sh. Pradeep Kumar",
    phone: "011-24105016",
    email: "pradeep.kumar[at]nic[dot]in",
    address: ADDRESS,
  },
  {
    role: "First Appellate Authority",
    name: "Dr. Sunita Rao",
    phone: "011-24105018",
    email: "sunita.rao[at]nic[dot]in",
    address: ADDRESS,
  },
];

export default function ContactUsPage() {
  return (
    <ContactPage
      title="Contact Us"
      breadcrumb={[{ label: "Connect" }, { label: "Contact Us" }]}
      description="Get in touch with the Department of Social Justice & Empowerment."
      office={{
        name: "Department of Social Justice & Empowerment",
        address: ADDRESS,
        phone: "011-24105009, 24105011",
        email: "min-sje[at]nic[dot]in",
      }}
      mapSrc="https://www.google.com/maps?q=Netaji+Subhash+Place+New+Delhi&output=embed"
      officers={officers}
    />
  );
}
