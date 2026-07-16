import type { Metadata } from "next";
import { FileBarChart, BookOpen, FlaskConical, Database } from "lucide-react";
import { PersonaPage, type PersonaCard } from "@/components/website/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Researcher | Department of Social Justice & Empowerment",
  description:
    "Annual reports, publications, evaluation studies and statistical handbooks to support evidence-based research.",
};

const cards: PersonaCard[] = [
  {
    icon: FileBarChart,
    title: "Annual Reports",
    description:
      "Read detailed annual reports documenting the Ministry's programmes, outcomes and expenditure year on year.",
    ctaLabel: "View Annual Reports",
    href: "/website/annual-reports",
  },
  {
    icon: BookOpen,
    title: "Publications",
    description:
      "Browse official publications, journals and thematic documents on social justice and empowerment.",
    ctaLabel: "View Publications",
    href: "/website/publications",
  },
  {
    icon: FlaskConical,
    title: "Research & Evaluation Studies",
    description:
      "Access commissioned research and independent evaluation studies assessing scheme impact and effectiveness.",
    ctaLabel: "View Studies",
    href: "/website/list-of-research-evaluation-studies",
  },
  {
    icon: Database,
    title: "Statistics & Handbooks",
    description:
      "Find datasets, statistical handbooks and reference data for quantitative analysis and citation.",
    ctaLabel: "View Statistics",
    href: "/website/publications",
  },
];

export default function ForResearcherPage() {
  return (
    <PersonaPage
      title="For Researcher"
      breadcrumb={[{ label: "For You" }, { label: "Researcher" }]}
      lastUpdated="06 Jun 2026"
      tagline="Data, reports and studies to support your research."
      cards={cards}
    />
  );
}
