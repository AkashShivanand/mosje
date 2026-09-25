import "server-only";

import { SCHEMES, ROUTES, applyLabel, type Scheme } from "@/lib/website-next/schemes";
import { administeredBy, displayName, expandSource, getMasterScheme } from "@/lib/website-next/scheme-view";
import { LEGACY_TO_MASTER } from "@/lib/website-next/legacy-scheme-map.generated";
import { legacySections, masterForLegacy, type LegacySection } from "@/lib/website-next/legacy-schemes";
import { getScheme, getSchemeDocuments, getTenders, getVacancies, routeSlug } from "@/lib/website/content";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import {
  dateValue,
  dedupeNotices,
  displayNoticeTitle,
  fileTypeOf,
  formatFileSize,
  isArchived,
} from "@/components/website-next/ui/records";
import { DBIM_SCHEME_ART, DBIM_SCHEME_ART_FALLBACK } from "./assets";

/**
 * The DBIM design's Offerings pages, read from the estate's own content.
 * SERVER ONLY: it reads the ingested scheme pages and document registers, which
 * must not reach a client bundle. The client list components receive the plain
 * rows built here.
 *
 * Every selector the redesign already settled is reused rather than re-decided,
 * so a scheme, a tender or a vacancy is the same thing in every design:
 *   - the scheme master is the list of the Department's schemes (the reference's
 *     own list is not — issue X-IA-04);
 *   - tenders and vacancies published more than twelve months ago are in the
 *     Archives (`isArchived`, issue MAN-06) — the register publishes no closing
 *     date, so the publish date is the only date the rule can read;
 *   - notices published twice are listed once, and a title the ingest cut short
 *     ends in an ellipsis (`dedupeNotices`, `displayNoticeTitle`).
 */

const PDF_DATE = (iso: string | undefined): string | undefined => {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return undefined;
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
};

/* ─── Schemes and Services ──────────────────────────────────────────────── */

const DBIM = "/website/dbim/schemes";
const PORTAL_LOGOS: Record<string, { src: string; alt: string }> = {
  eanudaan: { src: `${DBIM}/logo-e-anudaan.jpg`, alt: "Apply through the e-Anudaan portal" },
  nisd: { src: `${DBIM}/logo-nisd.jpg`, alt: "Delivered through the National Institute of Social Defence" },
};

export interface DbimSchemeCard {
  id: string;
  name: string;
  /** What the scheme provides — the card's one line. */
  line: string;
  /** The Category select's value: the scheme master's `type`. */
  category: string;
  art: string;
  logo?: { src: string; alt: string };
}

/**
 * Every scheme in the master, in the master's order. The photograph is the
 * reference's own where a word in the name or umbrella matches one, else the two
 * generic photographs in turn, so neighbouring cards do not repeat.
 */
export function dbimSchemeCards(): DbimSchemeCard[] {
  let fallback = 0;
  return SCHEMES.map((s) => {
    const hay = `${s.name} ${s.umbrella ?? ""}`;
    const art =
      DBIM_SCHEME_ART.find((a) => a.match.test(hay))?.src ??
      DBIM_SCHEME_ART_FALLBACK[fallback++ % DBIM_SCHEME_ART_FALLBACK.length]!;
    const logoKey = s.apply.find((r) => PORTAL_LOGOS[r]);
    return {
      id: s.id,
      name: displayName(s),
      line: s.provides,
      category: s.type,
      art,
      logo: logoKey ? PORTAL_LOGOS[logoKey] : undefined,
    };
  });
}

/* ─── Scheme details ────────────────────────────────────────────────────── */

export interface DbimApplyRoute {
  label: string;
  href?: string;
}

export interface DbimSchemeDocument {
  title: string;
  href: string;
  type?: string;
  size?: string;
  date?: string;
}

/** A register table from the ingested page, reduced to its cell text so it can be paged. */
export interface DbimRegister {
  columns: string[];
  rows: string[][];
}

export type DbimSchemePart = { kind: "html"; html: string } | { kind: "register"; register: DbimRegister };

export interface DbimSchemeSection {
  heading?: string;
  parts: DbimSchemePart[];
}

export interface DbimSchemeDetail {
  scheme: Scheme;
  name: string;
  /** The VISIT bar: the first apply route with a confirmed web address. */
  visit?: { href: string; label: string };
  apply: DbimApplyRoute[];
  /** The ingested scheme page, where the estate has one. */
  sections: DbimSchemeSection[] | null;
  administeredBy?: string;
  sources: { text: string; href?: string }[];
  documents: DbimSchemeDocument[];
}

const plainLength = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;

/** Master id → the old-site listings that are that scheme (the generated map, inverted). */
const LISTINGS_BY_MASTER = (() => {
  const out = new Map<string, string[]>();
  for (const [slug, id] of Object.entries(LEGACY_TO_MASTER)) out.set(id, [...(out.get(id) ?? []), slug]);
  return out;
})();

const norm = (t: string) => t.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

/**
 * REGISTERS. Three old-site scheme pages carry a directory widget scraped as a
 * table — IPSrC's 727 Senior Citizens' Homes, RVY's 298 distribution centres,
 * SAPSrC's 253 fund releases. Printed whole, the IPSrC page is 88,000px tall.
 * A table with a header row and more than REGISTER_ROWS body rows is therefore
 * lifted out and paged (contract rule 10: long lists are paged, never scrolled).
 *
 * It is reduced to cell TEXT: the cells carry no links (the widget's "View
 * Location" column is empty and is dropped with every other headerless column),
 * and the text alone is about a fifth of the markup's weight in the page payload.
 * The widget's own filter labels ("State District Project Type Search Reset")
 * and its dead "Open in Google Maps" anchor are scraped residue and are removed.
 */
const REGISTER_ROWS = 20;
const text = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#0?39;|&rsquo;/gi, "’").replace(/\s+/g, " ").trim();

function toParts(html: string): DbimSchemePart[] {
  const parts: DbimSchemePart[] = [];
  const re = /<div class="wn-table-wrap"[^>]*>\s*<table[^>]*>([\s\S]*?)<\/table>\s*<\/div>/gi;
  let last = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    const inner = m[1] ?? "";
    const head = /<thead[^>]*>([\s\S]*?)<\/thead>/i.exec(inner)?.[1];
    const body = /<tbody[^>]*>([\s\S]*?)<\/tbody>/i.exec(inner)?.[1] ?? "";
    const trs = body.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    if (!head || trs.length <= REGISTER_ROWS) continue;
    const headers = (head.match(/<th[\s\S]*?<\/th>/gi) ?? []).map(text);
    const keep = headers.map((h, i) => (h ? i : -1)).filter((i) => i >= 0);
    const rows = trs.map((tr) => {
      const cells = (tr.match(/<td[\s\S]*?<\/td>/gi) ?? []).map(text);
      return keep.map((i) => cells[i] ?? "");
    });
    const before = html.slice(last, m.index).replace(/(?:<span>[\s\S]*?<\/span>\s*)*[^<>]*\bSearch\s+Reset\s*$/, "");
    if (before.trim()) parts.push({ kind: "html", html: before });
    parts.push({ kind: "register", register: { columns: keep.map((i) => headers[i]!), rows } });
    last = m.index + m[0].length;
  }
  const rest = html.slice(last).replace(/Location\s*<a[^>]*>\s*Open in Google Maps\s*<\/a>/gi, "");
  if (rest.trim()) parts.push({ kind: "html", html: rest });
  return parts;
}

/** The listing with the most prose among those that are this scheme, as sections. */
function ingestedSections(s: Scheme): DbimSchemeSection[] | null {
  const slugs = [s.id, ...(LISTINGS_BY_MASTER.get(s.id) ?? [])];
  let best: { title: string; sections: LegacySection[] } | null = null;
  let bestLen = 0;
  for (const slug of slugs) {
    const rec = getScheme(slug);
    if (!rec) continue;
    const sections = legacySections(rec);
    const len = sections.reduce((n, x) => n + plainLength(x.html), 0);
    if (len > bestLen) {
      best = { title: rec.title, sections };
      bestLen = len;
    }
  }
  /* Under 100 characters a listing says nothing a reader can use
     (legacy-schemes.ts, MIN_BODY_CHARS); the master's facts are better. */
  if (!best || bestLen < 100) return null;
  const names = [norm(best.title), norm(s.name)];
  return best.sections.map((x, i) => ({
    /* A first heading that only repeats the scheme's name gives way to the
       reference's "Introduction" — the h1 and the rail already say the name. */
    heading: i === 0 && x.heading && names.some((n) => n.startsWith(norm(x.heading!)) || norm(x.heading!).startsWith(n)) ? undefined : x.heading,
    parts: toParts(x.html),
  }));
}

function schemeDocuments(id: string): DbimSchemeDocument[] {
  return getSchemeDocuments()
    .filter((d) => {
      const m = /\/schemes-and-services\/([^/]+)\/?$/.exec(d.schemeUrl ?? "");
      return m?.[1] ? masterForLegacy(m[1]) === id : false;
    })
    .sort((a, b) => dateValue(b.publishStart ?? b.date) - dateValue(a.publishStart ?? a.date))
    .flatMap((d) => {
      const raw = d.fileUrl ?? d.externalUrl;
      if (!raw) return [];
      return [{
        title: displayNoticeTitle(d.title),
        href: localiseDocumentUrl(raw, d.title),
        type: fileTypeOf(d.fileUrl, d.fileType),
        size: formatFileSize(d.fileSize),
        date: PDF_DATE(d.publishStart ?? d.date),
      }];
    });
}

export function dbimSchemeDetail(id: string): DbimSchemeDetail | undefined {
  const s = getMasterScheme(routeSlug(id));
  if (!s) return undefined;
  const apply = s.apply.flatMap((r): DbimApplyRoute[] => {
    const route = ROUTES[r];
    if (!route) return [];
    const web = route.href && /^https?:/.test(route.href) ? route.href : undefined;
    return [{ label: applyLabel(r), href: web }];
  });
  const firstWeb = apply.find((a) => a.href);
  return {
    scheme: s,
    name: displayName(s),
    visit: firstWeb ? { href: firstWeb.href!, label: firstWeb.label } : undefined,
    apply,
    sections: ingestedSections(s),
    administeredBy: administeredBy(s),
    sources: s.sources.map(expandSource),
    documents: schemeDocuments(s.id),
  };
}

export const dbimSchemeIds = (): string[] => SCHEMES.map((s) => s.id);

/* ─── Vacancies and Tenders ─────────────────────────────────────────────── */

export interface DbimNotice {
  slug: string;
  title: string;
  /** dd.mm.yyyy, as the reference prints dates; absent when the register has none. */
  published?: string;
  /** For sorting on the client. */
  time: number;
  category?: string;
  /** The file the record carries (a local sample of its kind). */
  fileUrl?: string;
  fileType?: string;
  /** The record's own page on dosje.gov.in, which lists all its files. */
  sourceUrl: string;
}

function toNotice(r: { slug: string; title: string; date?: string; category?: string; fileUrl?: string; sourceUrl: string }): DbimNotice {
  return {
    slug: r.slug,
    title: displayNoticeTitle(r.title),
    published: PDF_DATE(r.date),
    time: Number.isFinite(dateValue(r.date)) ? dateValue(r.date) : 0,
    category: r.category,
    fileUrl: r.fileUrl,
    fileType: fileTypeOf(r.fileUrl),
    sourceUrl: r.sourceUrl,
  };
}

const newestFirst = (a: DbimNotice, b: DbimNotice) => b.time - a.time;

/** Vacancies not yet in the Archives, newest first. */
export function dbimVacancies(): DbimNotice[] {
  return getVacancies().filter((v) => !isArchived(v.date)).map(toNotice).sort(newestFirst);
}

/** Tenders not yet in the Archives, listed once each, newest first. */
export function dbimTenders(): DbimNotice[] {
  return dedupeNotices(getTenders().filter((t) => !isArchived(t.date))).map(toNotice).sort(newestFirst);
}
