import type { Metadata } from "next";
import { SchemesCatalog, type SchemeItem } from "@/components/website/templates/SchemesCatalog";
import { getSchemes, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const SCHEMES_TITLE = "Schemes & Services | DoSJE";
const SCHEMES_DESCRIPTION =
  "Flagship welfare schemes and scholarships offered by the Department of Social Justice & Empowerment for SC, OBC, EBC and DNT communities.";

export const metadata: Metadata = {
  title: SCHEMES_TITLE,
  description: SCHEMES_DESCRIPTION,
  ...socialCard({
    title: SCHEMES_TITLE,
    description: SCHEMES_DESCRIPTION,
    url: "/website/schemes-services",
  }),
};

export default function SchemesPage() {
  const rawSchemes = getSchemes();

  const schemes: SchemeItem[] = rawSchemes.map((s) => {
    // Extract first paragraph for description snippet
    const descSection = s.sections.find((sec) => sec.html);
    const cleanText = descSection
      ? descSection.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
      : undefined;

    return {
      slug: s.slug,
      title: s.title,
      category: s.category,
      targetGroup: s.targetGroup,
      description: cleanText ? `${cleanText}…` : undefined,
      sourceUrl: s.sourceUrl,
    };
  });

  return (
    <SchemesCatalog
      title="Schemes & Services"
      description="Explore welfare schemes, scholarships, and financial assistance programs delivered by the Department of Social Justice & Empowerment."
      breadcrumb={[{ label: "Offerings" }, { label: "Schemes & Services" }]}
      lastUpdated={getContentSyncedDate()}
      schemes={schemes}
    />
  );
}
