import type { Metadata } from "next";
import { PersonaPage, type PersonaCard } from "@/components/website/templates/PersonaPage";

export const metadata: Metadata = {
  title: "For Student | Department of Social Justice & Empowerment",
  description:
    "Scholarships, application forms, notices and how-to-apply guidance to help students learn, grow and access support.",
};

const cards: PersonaCard[] = [
  {
    icon: "school",
    title: "Scholarships",
    description:
      "Explore pre-matric, post-matric and merit-based scholarships that fund your education and reduce financial barriers.",
    ctaLabel: "View Scholarships",
    href: "/website/schemes-services",
  },
  {
    icon: "description",
    title: "Forms & Templates",
    description:
      "Download the application forms, declarations and templates you need to apply for student schemes.",
    ctaLabel: "Get Forms",
    href: "/website/forms-templates",
  },
  {
    icon: "notifications",
    title: "Notices",
    description:
      "Stay updated with the latest deadlines, results and announcements relevant to students.",
    ctaLabel: "View Notices",
    href: "/website/notices",
  },
  {
    icon: "help",
    title: "How to Apply",
    description:
      "Follow a simple step-by-step guide on eligibility, documents and the online application process.",
    ctaLabel: "Learn How to Apply",
    href: "/website/schemes-services",
  },
];

export default function ForStudentPage() {
  return (
    <PersonaPage
      title="For Student"
      breadcrumb={[{ label: "For You" }, { label: "Student" }]}
      lastUpdated="06 Jun 2026"
      tagline="Scholarships and opportunities to help you learn and grow."
      cards={cards}
    />
  );
}
