import type { Metadata } from "next";
import { ContactPage, type ContactOfficer } from "@/components/templates/ContactPage";

export const metadata: Metadata = {
  title: "Ministry Contact | Ministry of Social Justice & Empowerment",
  description:
    "Reach the Ministry of Social Justice & Empowerment — office address, phone, email and nodal officers.",
};

const ADDRESS =
  "Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi – 110001";

const officers: ContactOfficer[] = [
  {
    role: "Public Grievance Officer",
    name: "Sh. Arvind Nair",
    phone: "011-23381003",
    email: "arvind.nair[at]nic[dot]in",
    address: ADDRESS,
  },
  {
    role: "Nodal Officer",
    name: "Smt. Kavita Sharma",
    phone: "011-23381005",
    email: "kavita.sharma[at]nic[dot]in",
    address: ADDRESS,
  },
];

export default function MosjeContactPage() {
  return (
    <ContactPage
      title="Ministry Contact"
      breadcrumb={[{ label: "Connect" }, { label: "Ministry Contact" }]}
      description="Reach the Ministry of Social Justice & Empowerment."
      office={{
        name: "Ministry of Social Justice & Empowerment",
        address: ADDRESS,
        phone: "011-23381001",
        email: "min-sje[at]nic[dot]in",
      }}
      mapSrc="https://www.google.com/maps?q=Shastri+Bhawan+New+Delhi&output=embed"
      officers={officers}
    />
  );
}
