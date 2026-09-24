import type { SectionRecord } from "@/types/website/content";
import { getSchemes, routeSlug, withAssetBasePath } from "@/lib/website/content";
import { LEGACY_TO_MASTER, STATE_SCHEME_SLUGS } from "./legacy-scheme-map.generated";
import { SCHEMES } from "./schemes";

/**
 * The 140 scheme listings carried over from the old site, as the redesign treats
 * them. SERVER ONLY: it reads the ingested catalogue, which must not reach the
 * finder's client bundle.
 *
 * Three decisions, each made once here and read by both the scheme page and the
 * search index, so the two can never disagree about a listing:
 *   - a listing that IS a master scheme is that scheme (redirect, not indexed);
 *   - a listing with no meaningful body is not a page (redirect, not indexed);
 *   - a State Government scheme is not the Department's (not indexed).
 */

const MASTER_IDS = new Set(SCHEMES.map((s) => s.id));

/** Below this many characters of prose a listing says nothing a reader can use:
 *  "Sector: Housing Beneficiaries: DNT Aspiring Home Owners" is 55. */
const MIN_BODY_CHARS = 100;

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const same = (a: string, b: string) =>
  a.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === b.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The master scheme a listing is, if it is one. */
export function masterForLegacy(slug: string): string | undefined {
  const key = routeSlug(slug);
  if (MASTER_IDS.has(key)) return key;
  return LEGACY_TO_MASTER[key];
}

/**
 * Old-site words shouted in capitals ("TERM LOAN", "PM YOUNG ACHIEVERS …") set
 * in Title Case. Only the case changes, never a word; an acronym in brackets or
 * of three letters or fewer is left alone.
 */
const SMALL = new Set(["and", "or", "for", "of", "the", "to", "in", "on", "a", "an", "with"]);
const ACRONYMS = new Set(["NAMASTE", "SHREYAS", "YASASVI", "SMILE", "SAGE", "SEED", "AVYAY", "NSKFDC", "NSFDC", "NBCFDC", "CWBA", "PLGIA", "INDIA"]);
export function legacyTitle(title: string): string {
  const t = title.replace(/\s+/g, " ").trim();
  const letters = t.replace(/[^A-Za-z]/g, "");
  if (!letters || t.replace(/[^A-Z]/g, "").length / letters.length < 0.7) return t;
  let depth = 0;
  let first = true;
  return t.replace(/\(|\)|[A-Za-z]+/g, (w) => {
    if (w === "(") return depth++, w;
    if (w === ")") return (depth = Math.max(0, depth - 1)), w;
    const lead = first;
    first = false;
    if (depth > 0 || w !== w.toUpperCase() || w.length <= 2) return w;
    if (ACRONYMS.has(w)) return w === "INDIA" ? "India" : w;
    const lower = w.toLowerCase();
    if (!lead && SMALL.has(lower)) return lower;
    return lower[0]!.toUpperCase() + lower.slice(1);
  });
}

/*
 * The old site's per-page "standfirst" slot — the text of the section headed with
 * the page's own title — was filled by copying from another page on several
 * listings: "Post SSC Scholarship to Girls" and "Seed – Livelihood" both open with
 * SHRESHTA's line about residential schools. A standfirst that appears under more
 * than one title is a copy, and no standfirst is better than a wrong one.
 */
const COPIED = (() => {
  const seen = new Map<string, Set<string>>();
  for (const r of getSchemes()) {
    for (const s of r.sections) {
      if (!s.heading || !same(s.heading, r.title)) continue;
      const text = plain(s.html ?? "");
      if (!text) continue;
      seen.set(text, (seen.get(text) ?? new Set()).add(r.title));
    }
  }
  return new Set([...seen].filter(([, titles]) => titles.size > 1).map(([text]) => text));
})();

/**
 * Ingested HTML, made fit for the redesign's content template:
 * - its own <h1> becomes an <h2> (the page header owns the only h1, ACC-03), and
 *   a heading that merely repeats the page title is dropped;
 * - the old site's "Active / Archived" tab labels, a bare list with no tabs behind
 *   them, are removed;
 * - a document table that says only "No documents found." is removed;
 * - every remaining table scrolls inside a labelled region (MOB-03, ACC-16).
 */
function tidyHtml(html: string, title: string): string {
  return html
    .replace(/<h1(\s|>)/gi, "<h2$1")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, _l, inner: string) => (same(plain(inner), title) ? "" : m))
    .replace(/<ul>\s*<li>\s*Active\s*<\/li>\s*<li>\s*Archived\s*<\/li>\s*<\/ul>/gi, "")
    .replace(/<table>(?:(?!<\/table>)[\s\S])*No documents found\.(?:(?!<\/table>)[\s\S])*<\/table>/gi, "")
    .replace(/<table/gi, '<div class="wn-table-wrap" role="region" aria-label="Table" tabindex="0"><table')
    .replace(/<\/table>/gi, "</table></div>");
}

export interface LegacySection {
  heading?: string;
  html: string;
}

/** What a kept listing renders: its sections, tidied, with nothing empty left. */
export function legacySections(rec: SectionRecord): LegacySection[] {
  return rec.sections
    .flatMap((s): LegacySection[] => {
      const titled = Boolean(s.heading && same(s.heading, rec.title));
      if (titled && COPIED.has(plain(s.html ?? ""))) return [];
      return [{ heading: titled ? undefined : (s.heading ?? undefined), html: tidyHtml(withAssetBasePath(s.html ?? ""), rec.title) }];
    })
    .filter((s) => plain(s.html) || /<img/i.test(s.html));
}

export function hasMeaningfulBody(rec: SectionRecord): boolean {
  return legacySections(rec).reduce((n, s) => n + plain(s.html).length, 0) >= MIN_BODY_CHARS;
}

/** Where a listing's URL should permanently go instead, or null to render it. */
export function legacyRedirect(rec: SectionRecord): string | null {
  const master = masterForLegacy(rec.slug);
  if (master && master !== routeSlug(rec.slug)) return `/website/schemes-services/${master}`;
  if (!master && !hasMeaningfulBody(rec)) return "/website/schemes-services";
  return null;
}

/** Search indexes a listing only when it is a page of its own the Department owns. */
export function isIndexableLegacy(rec: SectionRecord): boolean {
  return !masterForLegacy(rec.slug) && !STATE_SCHEME_SLUGS.has(routeSlug(rec.slug)) && hasMeaningfulBody(rec);
}

/** The listings' titles filed against each master scheme: a master's other names. */
export function legacyTitlesByMaster(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const r of getSchemes()) {
    const id = masterForLegacy(r.slug);
    if (id) out.set(id, [...(out.get(id) ?? []), legacyTitle(r.title)]);
  }
  return out;
}
