import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { LegacySchemeDetail, SchemeDetail } from "@/components/website-next/templates/SchemeDetail";
import { SCHEMES } from "@/lib/website-next/schemes";
import { displayName, getMasterScheme } from "@/lib/website-next/scheme-view";
import { legacyRedirect, legacySections, legacyTitle } from "@/lib/website-next/legacy-schemes";
import { getSchemes, getScheme, getContentSyncedDate, routeSlug } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

/**
 * Every scheme in the Department's scheme master has a page here, at its master
 * id. Every listing carried over from the old site keeps its URL too, so no link
 * into the site 404s (a listing that is a master scheme, or has nothing on it,
 * answers with a permanent redirect); where a master id and an old slug coincide
 * (pm-daksh), the master record wins.
 */
export function generateStaticParams() {
  const ids = new Set(SCHEMES.map((s) => s.id));
  const legacy = getSchemes()
    .map((s) => routeSlug(s.slug))
    .filter((slug) => !ids.has(slug));
  return [...ids, ...legacy].map((slug) => ({ slug }));
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const master = getMasterScheme(routeSlug(slug));
  if (master) {
    const title = `${displayName(master)} | Department of Social Justice & Empowerment`;
    return { title, description: master.provides, ...socialCard({ title, description: master.provides, url: `/website/schemes-services/${slug}` }) };
  }
  const scheme = getScheme(slug);
  if (!scheme) return { title: "Scheme | Department of Social Justice & Empowerment" };
  const title = `${legacyTitle(scheme.title)} | Department of Social Justice & Empowerment`;
  const first = legacySections(scheme).find((s) => plain(s.html))?.html;
  const description = first ? plain(first).slice(0, 160) : undefined;
  return { title, description, ...socialCard({ title, description, url: `/website/schemes-services/${slug}` }) };
}

/**
 * A listing carried over from the old site takes one of three paths, decided in
 * `legacy-schemes.ts` (the search index reads the same decision):
 * - it IS a master scheme (legacy-scheme-map.generated.ts) → 308 to that page;
 * - it has no meaningful body → 308 to Find a Scheme;
 * - otherwise it renders, as the site published it, in the content template.
 */
export default async function SchemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const master = getMasterScheme(routeSlug(slug));
  if (master) return <SchemeDetail scheme={master} />;

  const scheme = getScheme(slug);
  if (!scheme) notFound();
  const target = legacyRedirect(scheme);
  if (target) permanentRedirect(target);
  return (
    <LegacySchemeDetail
      title={legacyTitle(scheme.title)}
      sections={legacySections(scheme)}
      website={scheme.website}
      lastUpdated={getContentSyncedDate()}
    />
  );
}
