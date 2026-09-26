import type { Metadata } from "next";
import { PersonaPage, type PersonaSection } from "@/components/website-next/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Researchers | Department of Social Justice & Empowerment",
  description:
    "Publications, research and evaluation studies, the Handbook on Social Welfare Statistics, annual reports and open data of the Department of Social Justice & Empowerment.",
};

const sections: PersonaSection[] = [
  {
    kind: "links",
    id: "reports-and-data",
    title: "Reports, Studies and Data",
    links: [
      {
        title: "Research & Evaluation Studies",
        description: "Studies commissioned by the Department on its schemes.",
        href: "/website/list-of-research-evaluation-studies",
        icon: "science",
      },
      {
        title: "Handbook on Social Welfare Statistics",
        description: "Compiled by the Statistics Division of the Department.",
        href: "/website/handbook-on-social-welfare-statistics",
        icon: "bar_chart",
      },
      {
        title: "Annual Reports",
        description: "Annual reports of the Department and of the bodies under it.",
        href: "/website/annual-reports",
        icon: "summarize",
      },
      {
        title: "Publications",
        description: "Publications, journals and thematic documents of the Department and its organisations.",
        href: "/website/publications",
        icon: "menu_book",
      },
      {
        title: "Statistics Division",
        description: "The division of the Department that compiles its statistics.",
        href: "/website/about-the-division-statistics-division",
        icon: "query_stats",
      },
      {
        title: "Open Government Data Platform",
        description: "data.gov.in, the Government of India's open data portal.",
        href: "https://www.data.gov.in",
        icon: "database",
        external: true,
      },
    ],
  },
];

export default function ForResearcherPage() {
  return (
    <PersonaPage
      title="For Researchers"
      breadcrumb={[{ label: "Schemes & Services" }, { label: "For Researchers" }]}
      description="Reports, studies, statistics and data published by the Department."
      sections={sections}
    />
  );
}
