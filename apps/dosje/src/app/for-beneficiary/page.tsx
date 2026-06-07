import type { Metadata } from "next";
import { Sparkles, Scale, FileBarChart, Mail } from "lucide-react";
import { PersonaPage, type PersonaCard } from "@/components/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Beneficiary | Department of Social Justice & Empowerment",
  description:
    "Find schemes, acts, reports and the right office to help citizens access the Ministry's welfare and social justice services.",
};

const cards: PersonaCard[] = [
  {
    icon: Sparkles,
    title: "Explore Schemes",
    description:
      "Discover all welfare initiatives, social justice schemes, and citizen services offered by the Ministry and its departments.",
    ctaLabel: "Explore Schemes",
    href: "/schemes-services",
  },
  {
    icon: Scale,
    title: "View Acts & Policies",
    description:
      "Browse the key legislations, policy frameworks, and government guidelines that protect rights and drive inclusive development.",
    ctaLabel: "View Acts & Policies",
    href: "/acts-rules",
  },
  {
    icon: FileBarChart,
    title: "View Reports",
    description:
      "Access annual, financial, and performance reports — track progress, transparency, and impact.",
    ctaLabel: "View Reports",
    href: "/annual-reports",
  },
  {
    icon: Mail,
    title: "Contact Us",
    description: "Reach the right office for help with services, schemes or grievances.",
    ctaLabel: "Contact Us",
    href: "/contact-us",
  },
];

export default function ForBeneficiaryPage() {
  return (
    <PersonaPage
      title="For Beneficiary"
      breadcrumb={[{ label: "For You" }, { label: "Beneficiary" }]}
      lastUpdated="06 Jun 2026"
      tagline="Here's how the Ministry empowers citizens like you."
      cards={cards}
    />
  );
}
