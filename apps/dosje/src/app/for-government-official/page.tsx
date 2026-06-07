import type { Metadata } from "next";
import { ScrollText, Scale, Info, Contact } from "lucide-react";
import { PersonaPage, type PersonaCard } from "@/components/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Government Official | Department of Social Justice & Empowerment",
  description:
    "Circulars, acts, RTI resources and the officer directory — tools and references for government officials.",
};

const cards: PersonaCard[] = [
  {
    icon: ScrollText,
    title: "Circulars & Notifications",
    description:
      "Access the latest circulars, office memoranda and notifications issued by the Ministry and its departments.",
    ctaLabel: "View Circulars",
    href: "/circulars-notifications",
  },
  {
    icon: Scale,
    title: "Acts & Rules",
    description:
      "Refer to the governing acts, rules and statutory frameworks relevant to administration and implementation.",
    ctaLabel: "View Acts & Rules",
    href: "/acts-rules",
  },
  {
    icon: Info,
    title: "RTI",
    description:
      "Find Right to Information disclosures, designated officers and the process for handling RTI requests.",
    ctaLabel: "View RTI",
    href: "/rti",
  },
  {
    icon: Contact,
    title: "Directory",
    description:
      "Look up officers, contact details and office locations across the Ministry in the staff directory.",
    ctaLabel: "Open Directory",
    href: "/mosje-directory",
  },
];

export default function ForGovernmentOfficialPage() {
  return (
    <PersonaPage
      title="For Government Official"
      breadcrumb={[{ label: "For You" }, { label: "Government Official" }]}
      lastUpdated="06 Jun 2026"
      tagline="Resources, circulars and tools for officials."
      cards={cards}
    />
  );
}
