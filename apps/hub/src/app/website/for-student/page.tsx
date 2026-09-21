import type { Metadata } from "next";
import { PersonaPage, type PersonaSection } from "@/components/website-next/templates/PersonaPage";
import { matchSchemes, type Scheme } from "@/lib/website-next/schemes";
import { MASTER_DATE, groupByOffering } from "@/lib/website-next/scheme-view";

export const metadata: Metadata = {
  title: "For Students | Department of Social Justice & Empowerment",
  description:
    "Scholarships, fellowships, residential schools, hostels and coaching of the Department of Social Justice & Empowerment for students, with where to apply.",
};

/* The schemes the master tags for students (X-IA-07: a real filtered list, not
   an unfiltered one). The two largest kinds of support get a section each; the
   rest share one, each scheme listed once. */
const STUDENT = matchSchemes({ who: "student" });
const groups = groupByOffering(STUDENT, { who: "student" });
const lead = groups.filter((g) => g.id === "scholarship" || g.id === "schooling");
const shown = new Set<string>();
const leadSections: PersonaSection[] = lead.map((g) => {
  const schemes = g.schemes.filter((s) => !shown.has(s.id));
  schemes.forEach((s) => shown.add(s.id));
  return { kind: "schemes", id: g.id, title: g.title, schemes, who: "student" };
});
const other: Scheme[] = STUDENT.filter((s) => !shown.has(s.id));

const sections: PersonaSection[] = [
  ...leadSections,
  ...(other.length
    ? [
        {
          kind: "schemes" as const,
          id: "other-support",
          title: "Other Support for Students",
          schemes: other,
          who: "student" as const,
          viewAll: { label: "View All in Find a Scheme", href: "/website/schemes-services?who=student" },
        },
      ]
    : []),
  {
    kind: "links",
    id: "apply-and-documents",
    title: "Applications and Documents",
    links: [
      {
        title: "National Scholarship Portal",
        description: "Scholarships from pre-matric to post-matric, in one place.",
        href: "https://scholarships.gov.in",
        icon: "language",
        external: true,
      },
      {
        title: "Scheme Documents",
        description: "Guidelines, performance statements and circulars published against a scheme.",
        href: "/website/scheme-documents",
        icon: "description",
      },
      {
        title: "Forms & Templates",
        description: "Application forms, proformas and templates for the Department's schemes.",
        href: "/website/forms-templates",
        icon: "edit_document",
      },
      {
        title: "Public Notices",
        description: "Public notices and administrative announcements.",
        href: "/website/notices",
        icon: "campaign",
      },
    ],
  },
];

export default function ForStudentPage() {
  return (
    <PersonaPage
      title="For Students"
      breadcrumb={[{ label: "Schemes & Services" }, { label: "For Students" }]}
      description="Scholarships, fellowships, schools, hostels and coaching for students from the groups the Department serves."
      lastUpdated={MASTER_DATE}
      sections={sections}
    />
  );
}
