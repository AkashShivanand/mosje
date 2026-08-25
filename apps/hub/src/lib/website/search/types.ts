/**
 * What a searchable thing on the public website looks like.
 *
 * Modelled on `SearchEntry` in `lib/design-system/search-data.ts` — the estate's
 * existing, shipped search — and extended for public content, which differs in
 * three ways that matter:
 *
 *  1. It is DERIVED, never typed by hand. Facts about organisations, divisions,
 *     officials, schemes and documents live once in `data/website/` and
 *     `content/website/`. An index that restates them is a second copy that will
 *     drift, which is the exact failure `data/website/index.ts` was created to end.
 *  2. It carries `keywords` in CITIZEN language, not administrative language.
 *     Nobody searches "Pre-Matric Scholarship for OBC"; they search "school money"
 *     or "छात्रवृत्ति". See `vocabulary.ts`.
 *  3. It carries `updated`, because a citizen looking for a tender or a notice is
 *     usually looking for the most recent one, not the best-matching one.
 */
export type WebsiteSearchType =
  | "page"
  | "scheme"
  | "organisation"
  | "document"
  | "official"
  | "division";

export interface WebsiteSearchEntry {
  title: string;
  description: string;
  href: string;
  /**
   * Free-text synonyms, lower-cased at build time. This is where citizen words go
   * — including Hindi and its transliterations, and the misspellings people
   * actually type. Matched as whole words, so padding it is cheap but not free.
   */
  keywords: string;
  type: WebsiteSearchType;
  /** Facet label shown on the result, e.g. "Schemes", "Organisations". */
  section: string;
  /** ISO date (YYYY-MM-DD), where the source records one. Sorts the date facet. */
  updated?: string;
  iconName: string;
}

/** The facets offered on the results page, in the order they are shown. */
export const SEARCH_FACETS = [
  { type: "scheme", label: "Schemes" },
  { type: "organisation", label: "Organisations" },
  { type: "document", label: "Documents" },
  { type: "official", label: "People" },
  { type: "division", label: "Divisions" },
  { type: "page", label: "Pages" },
] as const satisfies readonly { type: WebsiteSearchType; label: string }[];

export function facetLabel(type: WebsiteSearchType): string {
  return SEARCH_FACETS.find((f) => f.type === type)?.label ?? "Pages";
}

/** Type weight, applied to every score. A scheme outranks a gallery page. */
export const TYPE_WEIGHT: Record<WebsiteSearchType, number> = {
  scheme: 1.25,
  organisation: 1.15,
  division: 1.1,
  page: 1,
  official: 0.95,
  document: 0.9,
};
