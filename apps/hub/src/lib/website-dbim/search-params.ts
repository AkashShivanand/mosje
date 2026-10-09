/**
 * The DBIM search's categories, sorts and addresses — the half of the search that
 * the browser also needs (the Sort control and the pager build addresses from it).
 * Kept apart from search.ts, which reads the whole index and must stay on the server.
 */

export const DBIM_SEARCH_CATEGORIES = [
  { key: "schemes", label: "Schemes and Services" },
  { key: "documents", label: "Documents" },
  { key: "tenders", label: "Tenders" },
  { key: "vacancies", label: "Vacancies" },
  { key: "organisations", label: "Organisations" },
  { key: "divisions", label: "Divisions" },
  { key: "people", label: "People" },
  { key: "pages", label: "Pages" },
] as const;

export type DbimSearchCategory = (typeof DBIM_SEARCH_CATEGORIES)[number]["key"];

export const DBIM_SEARCH_SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
] as const;

export type DbimSearchSort = (typeof DBIM_SEARCH_SORTS)[number]["value"];

/** How many of a category's best matches All Results shows. */
export const PREVIEW_PER_CATEGORY = 3;
/** Rows per page when one category is shown — the reference's listings use 10. */
export const RESULTS_PER_PAGE = 10;

export const categoryLabel = (key: DbimSearchCategory) => DBIM_SEARCH_CATEGORIES.find((c) => c.key === key)?.label ?? "";

export const parseCategory = (v: string | undefined): DbimSearchCategory | undefined =>
  DBIM_SEARCH_CATEGORIES.find((c) => c.key === v)?.key;

export const parseSort = (v: string | undefined): DbimSearchSort =>
  DBIM_SEARCH_SORTS.find((s) => s.value === v)?.value ?? "relevance";

/** The address of a search view — the category, sort and page live in the URL, so every view can be shared. */
export function searchHref(base: string, q: string, opts: { category?: DbimSearchCategory; sort?: DbimSearchSort; page?: number } = {}): string {
  const qs = new URLSearchParams({ q });
  if (opts.category) qs.set("type", opts.category);
  if (opts.sort && opts.sort !== "relevance") qs.set("sort", opts.sort);
  if (opts.page && opts.page > 1) qs.set("page", String(opts.page));
  return `${base}?${qs.toString()}`;
}

/**
 * The title split around the words the reader searched for, so the match can be
 * set in bold as the header's suggestions do. A word matches from its start and
 * runs to its end ("scholar" bolds "Scholarships").
 */
export function highlight(title: string, query: string): { text: string; hit: boolean }[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length >= 2).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!words.length) return [{ text: title, hit: false }];
  const re = new RegExp(`\\b(?:${words.join("|")})[\\p{L}\\p{N}]*`, "giu");
  const out: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const m of title.matchAll(re)) {
    if (m.index > last) out.push({ text: title.slice(last, m.index), hit: false });
    out.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
  }
  if (last < title.length) out.push({ text: title.slice(last), hit: false });
  return out;
}
