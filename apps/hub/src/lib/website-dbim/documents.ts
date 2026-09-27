/**
 * The DBIM design's document shelves: Documents (Reports · Orders and Notices ·
 * Publications), their series pages, What's New and Archives.
 *
 * SOURCE: the estate's own register — `getAllDocuments()` (dosje.gov.in's
 * documents-type library plus the Central List of OBCs), `getTenders()`,
 * `getVacancies()` and `whatsNew()`. The grouping is the DBIM reference build's
 * (master-socialjustice.digifootprint.gov.in, captured 25 Sep 2026): three
 * Documents tabs, each a list of folders ("series") that open onto a list of files.
 * Mapping and reasoning: docs/research/dbim-reference/components/documents.spec.md.
 *
 * Server-only in practice (it reads the whole register); pages pass the trimmed
 * rows below to client lists.
 *
 * WEIGHT (measured 25 Sep 2026, JSON of the rows a series page ships for client
 * search, sort and paging): Central List of OBCs, 2,668 rows — 455 KB raw, 67 KB
 * gzipped; Advices, 972 rows — 38 KB gzipped; every other series under 4 KB. Only
 * the OBC page pays the 67 KB, and it is a register a reader searches by name, so
 * the whole list is what the search needs. Folder lists ship no file rows at all.
 */
import { getAllDocuments, getDocument, getTenders, getVacancies, getUpdates } from "@/lib/website/content";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { whatsNew, type NewsItem } from "@/lib/website-next/whats-new";
import { dateValue, isArchived, tidyTitle, dedupeNotices, displayNoticeTitle } from "@/components/website-next/ui/records";
import type { DocumentRecord } from "@/types/website/content";
import { dbimHref, type DbimLink } from "@/lib/website-dbim/nav";

export type DbimDocTab = "reports" | "orders-and-notices" | "publications";

export const DBIM_DOC_TABS: { key: DbimDocTab; label: string; path: string }[] = [
  { key: "reports", label: "Reports", path: "/documents" },
  { key: "orders-and-notices", label: "Orders and Notices", path: "/documents/orders-and-notices" },
  { key: "publications", label: "Publications", path: "/documents/publications" },
];

export const docTab = (key: string) => DBIM_DOC_TABS.find((t) => t.key === key);

/*
 * Which tab a documents-type belongs to. Reports and Orders and Notices are named;
 * EVERYTHING ELSE is Publications — the reference files Advertisement, Policies /
 * Acts / Rules, Guidelines and Meta Data there — so a type added to the register
 * later lands somewhere rather than nowhere.
 */
const REPORT_TYPES = new Set([
  "Annual Reports", "Reports", "Tour Reports", "Special Report", "Evaluations",
  "Impact of Commission Intervention", "Statement", "Monitoring Committees",
  "Vigilance Committees", "State Commissions Designated Agencies",
  "Total No. Of Deaths / Compensation", "Case Which Legal Heir Not Traceable",
]);
const ORDER_TYPES = new Set([
  "Circulars & Notifications", "Notice", "Office Memorandum", "Gazette Notifications",
  "Announcement", "Advices", "Hearing/Proceeding", "Supreme Court Judgement", "Results",
  "Letters to Nodal officers",
]);

export function tabOfType(type: string): DbimDocTab {
  if (REPORT_TYPES.has(type)) return "reports";
  if (ORDER_TYPES.has(type)) return "orders-and-notices";
  return "publications";
}

/** A record with no type: the reference's own catch-all name. */
const GENERAL = "General";

/** Title Case for the few register terms that are not (ui-restraint-and-copy.md §2). */
const DISPLAY: Record<string, string> = {
  POLICY: "Policy",
  MOU: "MoU",
  citizen: "Citizen",
  "Central List of OBC's": "Central List of OBCs",
  "Total No. Of Deaths / Compensation": "Total No. of Deaths / Compensation",
  "Letters to Nodal officers": "Letters to Nodal Officers",
};
export const seriesTitle = (type: string) => DISPLAY[type] ?? type;

export const seriesSlug = (type: string) =>
  seriesTitle(type).toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** One file row, trimmed to what a list renders. */
export interface DbimDocRow {
  key: string;
  title: string;
  /** YYYY-MM-DD */
  date?: string;
  size?: string;
  href: string;
  /** Opens outside the estate (a dosje.gov.in page, or a linked host). */
  external: boolean;
  /** The series name, for an archive's Category filter. */
  category?: string;
}

/** One folder: a series with the newest date across its files. */
export interface DbimSeries {
  slug: string;
  title: string;
  tab: DbimDocTab;
  count: number;
  date?: string;
  /** Set when the series holds a single file — the row opens it directly. */
  only?: DbimDocRow;
}

const typesOf = (d: DocumentRecord) => (d.types?.length ? d.types : [GENERAL]);
const published = (d: DocumentRecord) => d.publishStart ?? d.date;
const isFlaggedArchived = (d: DocumentRecord) => d.status === "Archived";

export function docRow(d: DocumentRecord, category?: string): DbimDocRow {
  const file = d.fileUrl ? localiseDocumentUrl(d.fileUrl, d.category, d.title) : undefined;
  const href = file ?? d.externalUrl ?? d.sourceUrl;
  return {
    key: d.slug,
    title: tidyTitle(d.title),
    date: published(d),
    size: d.fileUrl ? d.fileSize : undefined,
    href,
    external: /^https?:\/\//i.test(href),
    category,
  };
}

const newestFirst = (a: { date?: string }, b: { date?: string }) => dateValue(b.date) - dateValue(a.date);

/* Every live (not Archived) document, indexed by series, built once per process. */
let index: Map<string, DocumentRecord[]> | undefined;
function liveIndex(): Map<string, DocumentRecord[]> {
  if (index) return index;
  index = new Map();
  for (const d of getAllDocuments()) {
    if (isFlaggedArchived(d)) continue;
    for (const t of typesOf(d)) {
      const list = index.get(t) ?? [];
      list.push(d);
      index.set(t, list);
    }
  }
  return index;
}

function toSeries(type: string, docs: DocumentRecord[]): DbimSeries {
  const rows = docs.map((d) => docRow(d)).sort(newestFirst);
  return {
    slug: seriesSlug(type),
    title: seriesTitle(type),
    tab: tabOfType(type),
    count: rows.length,
    date: rows[0]?.date,
    only: rows.length === 1 ? rows[0] : undefined,
  };
}

/** The folders on one Documents tab, newest first. */
export function documentSeries(tab: DbimDocTab): DbimSeries[] {
  return [...liveIndex()]
    .filter(([type]) => tabOfType(type) === tab)
    .map(([type, docs]) => toSeries(type, docs))
    .sort(newestFirst);
}

/** A series page: its folder and every file in it, newest first. */
export function seriesDocuments(tab: string, slug: string): { series: DbimSeries; rows: DbimDocRow[] } | undefined {
  for (const [type, docs] of liveIndex()) {
    if (tabOfType(type) !== tab || seriesSlug(type) !== slug) continue;
    return { series: toSeries(type, docs), rows: docs.map((d) => docRow(d)).sort(newestFirst) };
  }
  return undefined;
}

export function allSeriesParams(): { category: DbimDocTab; series: string }[] {
  return [...liveIndex().keys()].map((type) => ({ category: tabOfType(type), series: seriesSlug(type) }));
}

/* ── Archives ─────────────────────────────────────────────────────────────── */

export type DbimArchiveKind = "tenders" | "vacancies" | DbimDocTab;

/** The reference's archive tabs, in its order, keeping those the register fills. */
export const DBIM_ARCHIVE_TABS: (DbimLink & { key: DbimArchiveKind })[] = [
  { key: "tenders", label: "Tenders", path: "/archives" },
  { key: "vacancies", label: "Vacancies", path: "/archives/vacancies" },
  { key: "reports", label: "Reports", path: "/archives/reports" },
  { key: "orders-and-notices", label: "Orders and Notices", path: "/archives/orders-and-notices" },
  { key: "publications", label: "Publications", path: "/archives/publications" },
];

/**
 * Tenders and vacancies leave their live page twelve months after publication —
 * the rule the classic Archives page and the redesign's /tenders apply
 * (`isArchived`), so an item is on exactly one of the two.
 */
function archivedFiles(rows: { slug: string; title: string; date?: string; fileUrl?: string; sourceUrl: string }[], notices: boolean): DbimDocRow[] {
  return (notices ? dedupeNotices(rows) : rows)
    .filter((r) => isArchived(r.date))
    .map((r) => ({
      key: r.slug,
      title: notices ? displayNoticeTitle(r.title) : tidyTitle(r.title),
      date: r.date,
      href: r.fileUrl ?? r.sourceUrl,
      external: !r.fileUrl,
    }))
    .sort(newestFirst);
}

/** Rows for one archive tab. Documents are those the Department flagged Archived. */
export function archiveRows(kind: DbimArchiveKind): DbimDocRow[] {
  if (kind === "tenders") return archivedFiles(getTenders(), true);
  if (kind === "vacancies") return archivedFiles(getVacancies(), false);
  const rows: DbimDocRow[] = [];
  for (const d of getAllDocuments()) {
    if (!isFlaggedArchived(d)) continue;
    const type = typesOf(d).find((t) => tabOfType(t) === kind);
    if (type) rows.push(docRow(d, seriesTitle(type)));
  }
  return rows.sort(newestFirst);
}

/* ── What's New ───────────────────────────────────────────────────────────── */

export interface WhatsNewGroup {
  tab: DbimDocTab;
  label: string;
  series: DbimSeries[];
}

/**
 * What's New, grouped as the reference groups it: Documents → one group per tab →
 * folders. Orders and Notices take the estate's own What's New composition
 * (`whatsNew()` — circulars, notices, results and announcements of the last twelve
 * months, de-duplicated); Reports and Publications take their series with a
 * document published in the same twelve months. A folder's count is its NEW files.
 */
export function whatsNewDocuments(): WhatsNewGroup[] {
  const news = whatsNew();
  const fresh = new Map<string, DocumentRecord[]>();
  const add = (type: string, d: DocumentRecord) => fresh.set(type, [...(fresh.get(type) ?? []), d]);

  for (const n of news) {
    if (!n.key.startsWith("d-")) continue;
    const d = getDocument(n.key.slice(2));
    if (!d || isFlaggedArchived(d)) continue;
    const type = typesOf(d).find((t) => tabOfType(t) === "orders-and-notices");
    if (type) add(type, d);
  }
  for (const [type, docs] of liveIndex()) {
    if (tabOfType(type) === "orders-and-notices") continue;
    for (const d of docs) if (!isArchived(d.date)) add(type, d);
  }

  return DBIM_DOC_TABS.map((t) => ({
    tab: t.key,
    label: t.label,
    series: [...fresh]
      .filter(([type]) => tabOfType(type) === t.key)
      .map(([type, docs]) => {
        const s = toSeries(type, docs);
        // A folder of one new file still opens the whole series when it holds more.
        const whole = liveIndex().get(type)?.length ?? 0;
        return whole > 1 ? { ...s, only: undefined } : s;
      })
      .sort(newestFirst),
  })).filter((g) => g.series.length > 0);
}

/**
 * WHERE A WHAT'S NEW ITEM OPENS in the DBIM design — the one answer the Announcements
 * bar, the home page's What's New box and the What's New page all read
 * (data-state-completeness.md §2). The estate's feed (`whatsNew()`) links the other
 * design's `/website/documents/<slug>` and `/website/updates/<slug>` pages, which this
 * design does not have, so the feed's own `href` is never used here.
 *
 *   document → the series page that lists it (`/documents/<tab>/<series>`) — the
 *              folder the What's New page shows it under — or, where that series holds
 *              this one file, the file itself, as the folder row does; a document the
 *              Department flagged Archived is in no series, so it opens its file
 *   update   → its first attachment, else its dosje.gov.in page
 *
 * `undefined` when the item has nowhere to go; callers leave it out.
 */
export function whatsNewTarget(n: Pick<NewsItem, "key" | "title">): { href: string; external: boolean } | undefined {
  const link = (href: string | undefined) => (href ? { href, external: /^https?:\/\//i.test(href) } : undefined);
  if (n.key.startsWith("d-")) {
    const d = getDocument(n.key.slice(2));
    if (!d) return undefined;
    if (isFlaggedArchived(d)) return link(docRow(d).href);
    // Orders and Notices first: What's New files a notice there even when it carries a second type.
    const types = typesOf(d);
    const type = types.find((t) => tabOfType(t) === "orders-and-notices") ?? types[0];
    const tab = type ? tabOfType(type) : undefined;
    const found = type && tab ? seriesDocuments(tab, seriesSlug(type)) : undefined;
    if (!found) return link(docRow(d).href);
    return found.series.only ? link(found.series.only.href) : link(dbimHref(`/documents/${tab}/${found.series.slug}`));
  }
  if (n.key.startsWith("u-")) {
    const u = updatesBySlug().get(n.key.slice(2));
    const file = u?.attachments?.[0]?.url;
    return link(file ? localiseDocumentUrl(file, u?.attachments?.[0]?.label, n.title) : u?.sourceUrl);
  }
  return undefined;
}

let updatesIndex: Map<string, ReturnType<typeof getUpdates>[number]> | undefined;
const updatesBySlug = () => (updatesIndex ??= new Map(getUpdates().map((u) => [u.slug, u])));

/** The updates in What's New, each opening where `whatsNewTarget` sends it. */
export function whatsNewUpdates(): DbimDocRow[] {
  return whatsNew()
    .filter((n) => n.key.startsWith("u-"))
    .flatMap((n) => {
      const t = whatsNewTarget(n);
      return t ? [{ key: n.key, title: n.title, date: n.date, ...t }] : [];
    });
}
