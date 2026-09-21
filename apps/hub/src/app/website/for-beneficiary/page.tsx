import type { Metadata } from "next";
import { PersonaPage, type PersonaSection } from "@/components/website-next/templates/PersonaPage";
import { MASTER_DATE } from "@/lib/website-next/scheme-view";

export const metadata: Metadata = {
  title: "For Beneficiaries | Department of Social Justice & Empowerment",
  description:
    "Schemes of the Department of Social Justice & Empowerment for each of the groups it serves, with helplines, Acts and the offices to contact.",
};

const sections: PersonaSection[] = [
  {
    kind: "groups",
    id: "groups",
    title: "Find Schemes for Your Group",
    description: "Each group opens the schemes that name it.",
  },
  {
    kind: "links",
    id: "help",
    title: "Help and Information",
    links: [
      {
        title: "Find a Scheme",
        description: "Every scheme of the Department, by who it is for and what it provides.",
        href: "/website/schemes-services",
        icon: "search",
      },
      {
        title: "Acts & Rules",
        description: "Acts of Parliament, rules and statutory instruments administered by the Department.",
        href: "/website/acts-rules",
        icon: "balance",
      },
      {
        title: "Annual Reports",
        description: "Annual reports of the Department and of the bodies under it.",
        href: "/website/annual-reports",
        icon: "summarize",
      },
      {
        title: "Contact Us",
        description: "The Department's offices and how to reach them.",
        href: "/website/contact-us",
        icon: "call",
      },
    ],
  },
];

export default function ForBeneficiaryPage() {
  return (
    <PersonaPage
      title="For Beneficiaries"
      breadcrumb={[{ label: "Schemes & Services" }, { label: "For Beneficiaries" }]}
      description="The schemes of the Department for each of the groups it serves."
      lastUpdated={MASTER_DATE}
      sections={sections}
    />
  );
}
