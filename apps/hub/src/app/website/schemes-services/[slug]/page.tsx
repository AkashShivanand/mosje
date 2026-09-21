import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacySchemeDetail, SchemeDetail } from "@/components/website-next/templates/SchemeDetail";
import { SCHEMES } from "@/lib/website-next/schemes";
import { getMasterScheme } from "@/lib/website-next/scheme-view";
import { getSchemes, getScheme, withAssetBasePath, getContentSyncedDate, routeSlug } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

/**
 * Every scheme in the Department's scheme master has a page here, at its master
 * id. Every listing carried over from the old site keeps its URL too, so no link
 * into the site 404s; where a master id and an old slug coincide (pm-daksh), the
 * master record wins.
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
    const title = `${master.name} | DoSJE`;
    return { title, description: master.provides, ...socialCard({ title, description: master.provides, url: `/website/schemes-services/${slug}` }) };
  }
  const scheme = getScheme(slug);
  if (!scheme) return { title: "Scheme | DoSJE" };
  const title = `${scheme.title.replace(/\s+/g, " ").trim()} | DoSJE`;
  const first = scheme.sections.find((s) => s.html)?.html;
  const description = first ? plain(first).slice(0, 160) : undefined;
  return { title, description, ...socialCard({ title, description, url: `/website/schemes-services/${slug}` }) };
}

/**
 * Ingested HTML, made fit for the redesign's content template:
 * - its own <h1> becomes an <h2>; the page header owns the only one (ACC-03);
 * - the old site's "Active / Archived" tab labels, which arrive as a bare list
 *   with no tabs behind them, are removed;
 * - a document table that says only "No documents found." is removed (the
 *   populated one beside it stays);
 * - every remaining table scrolls inside a labelled region, so a wide table
 *   scrolls on a phone instead of the page (MOB-03, ACC-16).
 */
function tidyLegacyHtml(html: string): string {
  return html
    .replace(/<h1(\s|>)/gi, "<h2$1")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<ul>\s*<li>\s*Active\s*<\/li>\s*<li>\s*Archived\s*<\/li>\s*<\/ul>/gi, "")
    .replace(/<table>(?:(?!<\/table>)[\s\S])*No documents found\.(?:(?!<\/table>)[\s\S])*<\/table>/gi, "")
    .replace(/<table/gi, '<div class="wn-table-wrap" role="region" aria-label="Table" tabindex="0"><table')
    .replace(/<\/table>/gi, "</table></div>");
}

export default async function SchemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const master = getMasterScheme(routeSlug(slug));
  if (master) return <SchemeDetail scheme={master} />;

  const scheme = getScheme(slug);
  if (!scheme) notFound();
  return (
    <LegacySchemeDetail
      title={scheme.title.replace(/\s+/g, " ").trim()}
      sections={scheme.sections
        .map((s) => ({ heading: s.heading ?? undefined, html: tidyLegacyHtml(withAssetBasePath(s.html ?? "")) }))
        .filter((s) => plain(s.html) || /<(img|table)/i.test(s.html))}
      sourceUrl={scheme.sourceUrl}
      website={scheme.website}
      lastUpdated={getContentSyncedDate()}
    />
  );
}
