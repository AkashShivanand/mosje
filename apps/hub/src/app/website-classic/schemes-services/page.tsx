import type { Metadata } from "next";
import { SchemesCatalog, type SchemeItem } from "@/components/website/templates/SchemesCatalog";
import { getSchemes, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const DESCRIPTION =
  "Flagship welfare schemes and scholarships offered by the Department of Social Justice & Empowerment for SC, OBC, EBC and DNT communities.";

/**
 * The title and description are WRITTEN OUT AS LITERALS here, not hoisted, and
 * must stay that way.
 *
 * `scripts/build-search-index.mjs` reads both straight out of this object with a
 * regex — deliberately, so the site-search result and the page's own `<title>`
 * cannot disagree. A constant is invisible to it: hoisting the title made this
 * page unindexable, and hoisting the description silently indexed it with an
 * EMPTY summary, which is the worse of the two because nothing failed. The gate
 * caught both.
 *
 * The duplication below is therefore the point, not an oversight. The constant
 * is kept only for the social block, which no regex reads.
 */
export const metadata: Metadata = {
  title: "Schemes & Services | DoSJE",
  description:
    "Flagship welfare schemes and scholarships offered by the Department of Social Justice & Empowerment for SC, OBC, EBC and DNT communities.",
  ...socialCard({
    title: "Schemes & Services | DoSJE",
    description: DESCRIPTION,
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
