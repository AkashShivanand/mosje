import type { Metadata } from "next";
import { PersonaPage, type PersonaSection } from "@/components/website-next/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Government Officials | Department of Social Justice & Empowerment",
  description:
    "Circulars and notifications, Acts and rules, forms, tenders, the staff directory and grant-in-aid procedures of the Department of Social Justice & Empowerment.",
};

const sections: PersonaSection[] = [
  {
    kind: "links",
    id: "orders-and-references",
    title: "Orders and References",
    links: [
      {
        title: "Circulars & Notifications",
        description: "Circulars, office memoranda and notifications of the Department and its organisations.",
        href: "/website/circulars-notifications",
        icon: "article",
      },
      {
        title: "Acts & Rules",
        description: "Acts of Parliament, rules and statutory instruments administered by the Department.",
        href: "/website/acts-rules",
        icon: "balance",
      },
      {
        title: "Forms & Templates",
        description: "Application forms, proformas and templates for the Department's schemes.",
        href: "/website/forms-templates",
        icon: "edit_document",
      },
      {
        title: "Tenders",
        description: "Tender notices, expressions of interest and requests for proposal.",
        href: "/website/tenders",
        icon: "gavel",
      },
      {
        title: "Staff Directory",
        description: "Officers of the Department and of every body under it, with contact details.",
        href: "/website/directory",
        icon: "contact_phone",
      },
      {
        title: "Right to Information (RTI)",
        description: "Proactive disclosures, annual returns and reports under the RTI Act, 2005.",
        href: "/website/rti",
        icon: "info",
      },
    ],
  },
  {
    kind: "links",
    id: "grant-in-aid",
    title: "Grant-in-Aid to Voluntary Organisations",
    links: [
      {
        title: "Procedure for Processing Grant-in-Aid Cases",
        href: "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations",
        icon: "rule",
      },
      {
        title: "Guidelines for Assisting NGOs / Voluntary Organisations",
        href: "/website/guidelines-for-assisting-ngos-voluntary-organisations",
        icon: "menu_book",
      },
      {
        title: "Prioritization Guidelines for Funding Projects by Voluntary Organisations",
        href: "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations",
        icon: "low_priority",
      },
      {
        title: "Inspection and Monitoring Procedure",
        href: "/website/inspection-and-monitoring-procedure",
        icon: "fact_check",
      },
      {
        title: "Grants-in-Aid to NGOs: FAQs",
        href: "/website/grants-in-aid-to-ngos-faqs",
        icon: "help",
      },
      {
        title: "e-Anudaan Portal",
        description: "Grant-in-aid applications for voluntary organisations.",
        href: "https://grants-msje.gov.in",
        icon: "language",
        external: true,
      },
    ],
  },
];

export default function ForGovernmentOfficialPage() {
  return (
    <PersonaPage
      title="For Government Officials"
      breadcrumb={[{ label: "Schemes & Services" }, { label: "For Government Officials" }]}
      description="Orders, references, forms and grant-in-aid procedures of the Department."
      sections={sections}
    />
  );
}
