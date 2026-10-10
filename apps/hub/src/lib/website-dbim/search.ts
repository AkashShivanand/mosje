/**
 * The DBIM design's search results, by category — DBIM 3.0 §9 iv ("filter/refine
 * search results by categories such as documents, schemes, services, or attributes
 * like date"). The figures and ranking are the estate's (lib/website/search); this
 * file only decides which category a hit belongs to, how it is described on its
 * row, where it opens, and how a category is sorted and paged.
 *
 * The categories follow the Department's dev build (devmosje.negd.in), which
 * groups a search into Schemes and Services, Documents, Tenders, Organisations and
 * Pages — with Vacancies, Divisions and People added because this index holds them.
 *
 * Design: Figma MoSJE Website DBIM DS, Templates — Desktop 1920 / Mobile 390 ›
 * Site Utilities › Search Results; components Search Result, Search Category and
 * Search Categories on Lists & Data.
 */
import { rank, searchIndex } from "@/lib/website/search";
import type { WebsiteSearchEntry } from "@/lib/website/search";
import { dbimDate } from "./date";
import { dbimSearchTarget } from "./utility";
import {
  DBIM_SEARCH_CATEGORIES,
  RESULTS_PER_PAGE,
  PREVIEW_PER_CATEGORY,
  categoryLabel,
  type DbimSearchCategory,
  type DbimSearchSort,
} from "./search-params";

export * from "./search-params";

export interface DbimSearchHit {
  title: string;
  /** "Tender · 14 Dec 2025 · PDF" — what the result is, before it is opened. */
  meta: string;
  excerpt: string;
  /** A page of this website… */
  path?: string;
  /** …or a file or another website, opened in a new tab. */
  href?: string;
  file: boolean;
  /** ISO date, where the source records one; sorts Newest / Oldest. */
  updated?: string;
}

export interface DbimSearchGroup {
  key: DbimSearchCategory;
  label: string;
  count: number;
  hits: DbimSearchHit[];
}

function categoryOf(entry: WebsiteSearchEntry): DbimSearchCategory {
  switch (entry.type) {
    case "scheme":
      return "schemes";
    case "organisation":
      return "organisations";
    case "division":
      return "divisions";
    case "official":
      return "people";
    case "page":
      return "pages";
    case "document":
      return entry.source === "tenders" ? "tenders" : entry.source === "vacancies" ? "vacancies" : "documents";
  }
}

const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|zip)(\?|#|$)/i;
const fileType = (href: string) => FILE_RE.exec(href)?.[1]?.toUpperCase().replace(/X$/, "");

/** The row's meta line — the kind of thing, its category where it has one, its date, and PDF for a file. */
function metaFor(entry: WebsiteSearchEntry, category: DbimSearchCategory): string {
  const date = dbimDate(entry.updated);
  const type = fileType(entry.href);
  const parts: (string | undefined)[] = (() => {
    switch (category) {
      case "schemes":
        // "Find a Scheme" is the master list's own name, not a category.
        return ["Scheme", entry.section && entry.section !== "Find a Scheme" ? entry.section : undefined];
      case "documents":
        return [entry.section || "Document", date, type];
      case "tenders":
        return ["Tender", date, type];
      case "vacancies":
        return ["Vacancy", date, type];
      case "organisations":
        return ["Organisation"];
      case "divisions":
        return ["Division"];
      case "people":
        return ["Directory"];
      case "pages":
        return ["Page", entry.section && entry.section !== "Pages" ? entry.section : undefined];
    }
  })();
  return parts.filter(Boolean).join(" · ");
}

/**
 * Where a hit opens in this design. People open the Directory, which lists the
 * officers — the estate's `official` pages map to Our Team, which holds only the
 * Ministers, and every officer collapsing onto it hid all but one of them.
 */
function targetFor(entry: WebsiteSearchEntry, category: DbimSearchCategory): { path: string } | { href: string } | null {
  if (category === "people") return { path: "/connect/directory" };
  return dbimSearchTarget(entry.href);
}

/**
 * Hits in rank order, one per destination. A file is keyed by its title as well:
 * the mirrored registers point many records at one file address, and keying on the
 * address alone collapsed every document into the first.
 */
function hitsFor(query: string): (DbimSearchHit & { category: DbimSearchCategory })[] {
  const seen = new Set<string>();
  const out: (DbimSearchHit & { category: DbimSearchCategory })[] = [];
  for (const { entry } of rank(searchIndex(), query)) {
    const category = categoryOf(entry);
    const target = targetFor(entry, category);
    if (!target) continue;
    const dest = "path" in target ? target.path : target.href;
    const file = "href" in target && FILE_RE.test(target.href);
    const key = file || category === "people" ? `${dest}|${entry.title}` : dest;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ title: entry.title, meta: metaFor(entry, category), excerpt: entry.description, file, updated: entry.updated, category, ...target });
  }
  return out;
}

function sorted(hits: DbimSearchHit[], sort: DbimSearchSort): DbimSearchHit[] {
  if (sort === "relevance") return hits;
  const dir = sort === "newest" ? -1 : 1;
  // Undated hits keep their rank order, after the dated ones.
  return [...hits].sort((a, b) => {
    if (!a.updated || !b.updated) return a.updated ? -1 : b.updated ? 1 : 0;
    return dir * a.updated.localeCompare(b.updated);
  });
}

export interface DbimSearchOutcome {
  total: number;
  /** Every category that holds a result, in category order — what the filter lists. */
  counts: { key: DbimSearchCategory; label: string; count: number }[];
  /** All Results: each category's best few. One category: that category's page. */
  groups: DbimSearchGroup[];
  page: number;
  pageCount: number;
}

export function dbimSearch(query: string, opts: { category?: DbimSearchCategory; sort?: DbimSearchSort; page?: number } = {}): DbimSearchOutcome {
  const sort = opts.sort ?? "relevance";
  const all = hitsFor(query);
  const byCategory = new Map<DbimSearchCategory, DbimSearchHit[]>();
  for (const { category, ...hit } of all) {
    const list = byCategory.get(category) ?? [];
    list.push(hit);
    byCategory.set(category, list);
  }
  const counts = DBIM_SEARCH_CATEGORIES.filter((c) => byCategory.has(c.key)).map((c) => ({ key: c.key, label: c.label, count: byCategory.get(c.key)!.length }));

  if (!opts.category) {
    const groups = counts.map((c) => ({ ...c, hits: sorted(byCategory.get(c.key)!, sort).slice(0, PREVIEW_PER_CATEGORY) }));
    return { total: all.length, counts, groups, page: 1, pageCount: 1 };
  }

  const list = sorted(byCategory.get(opts.category) ?? [], sort);
  const pageCount = Math.max(1, Math.ceil(list.length / RESULTS_PER_PAGE));
  const page = Math.min(Math.max(1, opts.page ?? 1), pageCount);
  const hits = list.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);
  return {
    total: all.length,
    counts,
    groups: [{ key: opts.category, label: categoryLabel(opts.category), count: list.length, hits }],
    page,
    pageCount,
  };
}
