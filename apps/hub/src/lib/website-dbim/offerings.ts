import "server-only";

import { ROUTES, SCHEMES, applyLabel, type Scheme } from "@/lib/website-next/schemes";
import { divisionsOf, displayName, expandSource, getMasterScheme } from "@/lib/website-next/scheme-view";
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
import { SCHEME_GROUPS, SCHEME_IMAGE, listedScheme, listedSchemes, type ListedScheme } from "@/lib/website-shared/scheme-listing";
import { SD_SCHEMES } from "@/lib/explorations/service-discovery-master";
import { dbimFeedTitle } from "./home-mid";
import { tidyProse } from "./prose";
import { DBIM_APPLICANT_TYPES } from "./applicants";
import { getDbimContact } from "./connect";

/**
 * The DBIM design's Offerings pages, read from the estate's own content.
 * SERVER ONLY: it reads the ingested scheme pages and document registers, which
 * must not reach a client bundle. The client list components receive the plain
 * rows built here.
 *
 * Every selector the redesign already settled is reused rather than re-decided,
 * so a scheme, a tender or a vacancy is the same thing in every design:
 *   - the live website's listing is the list of the Department's schemes
 *     (lib/website-shared/scheme-listing.ts; instruction, 29 Sep 2026) — not the
 *     reference's (issue X-IA-04), and no longer the scheme master, which still
 *     supplies the page of every listed scheme it holds;
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

export interface DbimSchemeCard {
  /** The page's address: the scheme master's id where it holds the scheme, else the live address. */
  id: string;
  name: string;
  /** "Who It Is For", as the live listing's tags; empty where the live card has none. */
  line: string;
  /** The Category select's values: every live group the scheme is filed under. */
  categories: string[];
  /** The Type of Applicant select's values: the applicant groups (`DBIM_APPLICANT_TYPES` ids) it serves. */
  audiences: string[];
  art: { src: string; position: string };
}

/** The live listing's groups in the live order, for the Category select. */
export const DBIM_SCHEME_GROUPS = SCHEME_GROUPS;

/** A listed scheme's page: the master's where the live address maps to it, else its own. */
const pageId = (s: ListedScheme): string => masterForLegacy(s.slug) ?? s.slug;

/** Master id → the listed scheme it is, so a page says the name its card said. */
const LISTED_BY_MASTER = new Map(listedSchemes().flatMap((s) => {
  const id = masterForLegacy(s.slug);
  return id ? [[id, s] as const] : [];
}));

/**
 * The live website's Schemes & Services listing: its 28 schemes once each, in its
 * order, under its names, each card the live listing's one image
 * (lib/website-shared/scheme-listing.ts). The reference's photographs and portal
 * logos are gone: the live cards carry neither.
 */
export function dbimSchemeCards(): DbimSchemeCard[] {
  return listedSchemes().map((s) => ({
    id: pageId(s),
    name: s.title,
    line: s.who.length ? `Who It Is For: ${s.who.join(", ")}` : "",
    categories: s.groups,
    audiences: audiencesOf(s),
    art: { src: SCHEME_IMAGE.src, position: SCHEME_IMAGE.position },
  }));
}

const APPLICANT_BY_LABEL = new Map(DBIM_APPLICANT_TYPES.map((a) => [a.label, a.id] as const));
const MASTER_WHO = new Map(SD_SCHEMES.map((s) => [s.id, s.who] as const));

/**
 * The applicant groups a listed scheme serves: its live "Who It Is For" tags (ten of
 * the eleven groups use the live wording exactly), joined with the scheme master's own
 * list where the master holds the scheme. The join is what finds De-notified, Nomadic
 * and Semi-Nomadic Tribes, which the live listing tags on no scheme.
 */
function audiencesOf(s: ListedScheme): string[] {
  const ids = new Set<string>();
  for (const w of s.who) {
    const id = APPLICANT_BY_LABEL.get(w);
    if (id) ids.add(id);
  }
  const master = masterForLegacy(s.slug);
  for (const id of (master && MASTER_WHO.get(master)) || []) ids.add(id);
  return DBIM_APPLICANT_TYPES.map((a) => a.id).filter((id) => ids.has(id));
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

/** A labelled fact: an eligibility condition, a benefit, a contact line. */
export interface DbimSchemeFact {
  label: string;
  text?: string;
  href?: string;
}

/** One of the template's sections: its labelled facts, then whatever of it is prose. */
export interface DbimSchemeBlock {
  facts: DbimSchemeFact[];
  parts: DbimSchemePart[];
}

/**
 * One scheme's page. Its CONTENT covers the sections of the Scheme Details template
 * (MoSJE [Handoff], node 3363:13864) — About the Scheme · Eligibility · Benefits &
 * Financial Assistance · Application Process · Documents · FAQs · Contact & Support;
 * its LAYOUT stays the DBIM reference's (rail left, text right). dosje.gov.in's own
 * scheme pages use the same headings, so each section is the Department's text where
 * its page publishes one, and the scheme master's where it does not. A section
 * neither source fills is left off — no scheme publishes FAQs today.
 */
export interface DbimSchemeDetail {
  /** The page's address (see DbimSchemeCard.id). */
  id: string;
  /** The scheme master's record; absent for a listed scheme the master does not hold. */
  scheme?: Scheme;
  name: string;
  /** One sentence for the page's description. */
  summary: string;
  /** The VISIT bar: the first apply route with a confirmed web address. */
  visit?: { href: string; label: string };
  about: DbimSchemeSection[];
  eligibility: DbimSchemeBlock | null;
  benefits: DbimSchemeBlock | null;
  /** The rail's How to Apply box: every apply route the VISIT bar does not already open. */
  apply: DbimApplyRoute[];
  /** Application Process: every apply route as a step (text — the rail holds the
   *  links), then the page's own text on it. */
  steps: string[];
  process: DbimSchemePart[];
  faqs: DbimSchemeFact[];
  contact: DbimSchemeFact[];
  /** The page's own document tables, where the scheme-documents register lists none. */
  documentParts: DbimSchemePart[];
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

const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

function toParts(raw: string): DbimSchemePart[] {
  /* The page's own structure — sub-headings, lists, paragraphs — restored first (prose.ts). */
  const html = tidyProse(raw);
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
function ingestedSections(slugs: string[], name: string): LegacySection[] | null {
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
  const names = [norm(best.title), norm(name)];
  return best.sections.map((x, i) => ({
    /* A first heading that only repeats the scheme's name opens About the Scheme —
       the h1 already says the name. */
    heading: i === 0 && x.heading && names.some((n) => n.startsWith(norm(x.heading!)) || norm(x.heading!).startsWith(n)) ? undefined : x.heading,
    html: x.html,
  }));
}

/* The template's sections, as dosje.gov.in heads them on its scheme pages. A heading
   that is none of these is a section of the scheme's own and follows About. */
const ABOUT = /^(about the scheme|introduction)$/i;
const ELIGIBILITY = /^eligibility$/i;
const BENEFITS = /^benefits(\s*&\s*financial assistance)?$/i;
const PROCESS = /^application process$/i;
const CONTACT = /^contact\s*&\s*support$/i;
const FAQS = /^(faqs?|frequently asked questions)$/i;
const DOCUMENTS = /^documents?$/i;

/**
 * The live pages set a labelled fact as an `<h6>` label and the `<div>` after it —
 * "Applicant" / "Students belonging to …", or a benefit's name alone. Anything
 * before the first label is the section's prose.
 */
function toBlock(html: string): DbimSchemeBlock {
  const heads = [...html.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
  if (!heads.length) return { facts: [], parts: toParts(html) };
  const facts = heads.flatMap((m, i): DbimSchemeFact[] => {
    const end = heads[i + 1]?.index ?? html.length;
    const label = text(m[1] ?? "");
    const body = text(html.slice(m.index! + m[0].length, end));
    return label ? [body ? { label, text: body } : { label }] : [];
  });
  const lead = html.slice(0, heads[0]!.index);
  return { facts, parts: text(lead) ? toParts(lead) : [] };
}

/* dosje.gov.in's one Contact & Support section carries a template's placeholder
   helpline and the Ministry's name where an email belongs (issue X-CON-02). Neither
   is a way to reach anyone, so neither is printed. */
const usableContact = (f: DbimSchemeFact) =>
  !(f.text && /1800-123-4567/.test(f.text)) && !(/^e-?mail$/i.test(f.label) && !f.text?.includes("@"));

/** The ingested page, sorted into the template's sections. */
function templateSections(sections: LegacySection[] | null, documents: DbimSchemeDocument[]) {
  const about: DbimSchemeSection[] = [];
  let eligibility: DbimSchemeBlock | null = null;
  let benefits: DbimSchemeBlock | null = null;
  let process: DbimSchemePart[] = [];
  let contact: DbimSchemeFact[] = [];
  let faqs: DbimSchemeFact[] = [];
  const documentParts: DbimSchemePart[] = [];
  for (const x of sections ?? []) {
    const h = x.heading?.trim();
    if (!h || ABOUT.test(h)) {
      /* The page's untitled opening and its About the Scheme are one section. */
      const lead = about[0] && !about[0].heading ? about[0] : null;
      if (lead) lead.parts.push(...toParts(x.html));
      else about.unshift({ parts: toParts(x.html) });
    } else if (ELIGIBILITY.test(h)) eligibility = toBlock(x.html);
    else if (BENEFITS.test(h)) benefits = toBlock(x.html);
    else if (PROCESS.test(h)) process = toParts(x.html);
    else if (FAQS.test(h)) faqs = toBlock(x.html).facts;
    else if (CONTACT.test(h)) contact = toBlock(x.html).facts.filter(usableContact);
    /* The Department's page carries its own "Documents" section — the same files as
       raw HTML tables. Where the scheme-documents register lists them, the page's
       Documents list is the one answer and the scraped copy goes; where it lists
       nothing, the scraped section stays, so no scheme loses its files. */
    else if (DOCUMENTS.test(h)) {
      if (!documents.length) documentParts.push(...toParts(x.html));
    }
    else about.push({ heading: h, parts: toParts(x.html) });
  }
  return { about, eligibility, benefits, process, faqs, contact, documentParts };
}

function schemeDocuments(id: string): DbimSchemeDocument[] {
  return getSchemeDocuments()
    .filter((d) => {
      const m = /\/schemes-and-services\/([^/]+)\/?$/.exec(d.schemeUrl ?? "");
      /* A master id collects every live address that maps to it; a live-only page, its own. */
      return m?.[1] ? (masterForLegacy(m[1]) ?? routeSlug(m[1])) === id : false;
    })
    .sort((a, b) => dateValue(b.publishStart ?? b.date) - dateValue(a.publishStart ?? a.date))
    .flatMap((d) => {
      const raw = d.fileUrl ?? d.externalUrl;
      if (!raw) return [];
      return [{
        /* DBIM 3.0 §4.1.1 ii: a title the register holds in capitals reads in Title Case, as on Home. */
        title: dbimFeedTitle(displayNoticeTitle(d.title)),
        href: localiseDocumentUrl(raw, d.title),
        type: fileTypeOf(d.fileUrl, d.fileType),
        size: formatFileSize(d.fileSize),
        date: PDF_DATE(d.publishStart ?? d.date),
      }];
    });
}

const NODAL: DbimSchemeFact = {
  label: "Nodal Department",
  text: "Department of Social Justice and Empowerment, Ministry of Social Justice and Empowerment",
};

/** The Department's address, from the Contact Us register (connect.ts). The Contact
 *  Us page's telephone and email are a named officer's, and are not repeated on
 *  every scheme; Contact & Support links to that page instead. */
const departmentAddress = (): DbimSchemeFact => ({
  label: "Address",
  text: getDbimContact().lines.filter((l) => !/,\s*Director$/.test(l)).join(" "),
});

export function dbimSchemeDetail(id: string): DbimSchemeDetail | undefined {
  const s = getMasterScheme(routeSlug(id));
  if (!s) return liveSchemeDetail(id);
  const apply = s.apply.flatMap((r): DbimApplyRoute[] => {
    const route = ROUTES[r];
    if (!route) return [];
    const web = route.href && /^https?:/.test(route.href) ? route.href : undefined;
    return [{ label: applyLabel(r), href: web }];
  });
  /* The VISIT bar opens the first web route; the How to Apply box lists the rest, so
     no two controls on the page go to the same place. */
  const firstWeb = apply.find((a) => a.href);
  const documents = schemeDocuments(s.id);
  /* A scheme on the live listing takes the listing's name, so its card and its page agree. */
  const name = LISTED_BY_MASTER.get(s.id)?.title ?? displayName(s);
  const page = templateSections(ingestedSections([s.id, ...(LISTINGS_BY_MASTER.get(s.id) ?? [])], s.name), documents);
  const divisions = divisionsOf(s).map((d) => d.label);
  /* Without a page of its own, About the Scheme is what the master records of the
     scheme's standing — its kind and its umbrella — with the master's note. */
  const standing = /^(central sector|centrally sponsored)$/i.test(s.type)
    ? `A ${s.type} Scheme of the Department of Social Justice and Empowerment${s.umbrella ? `, under the ${s.umbrella}` : ""}.`
    : s.umbrella
      ? `Under the ${s.umbrella}.`
      : "";
  const provides = `<p>${escapeHtml(s.provides)}</p>`;
  const masterAbout = [standing, s.note].filter(Boolean).map((t) => `<p>${escapeHtml(t!)}</p>`).join("");
  return {
    id: s.id,
    scheme: s,
    name,
    summary: s.provides,
    visit: firstWeb ? { href: firstWeb.href!, label: firstWeb.label } : undefined,
    about: page.about.length ? page.about : [{ parts: [{ kind: "html", html: masterAbout || provides }] }],
    /* Where the page publishes no section of its own, the master's record fills it —
       what the scheme provides is its Benefits, unless it is all About can say. */
    eligibility: page.eligibility ?? { facts: [{ label: "Who Can Apply", text: s.named }], parts: [] },
    benefits: page.benefits ?? (page.about.length || masterAbout ? { facts: [], parts: [{ kind: "html", html: provides }] } : null),
    apply: apply.filter((a) => a !== firstWeb),
    steps: apply.map((a) => a.label),
    process: page.process,
    faqs: page.faqs,
    contact: page.contact.length
      ? page.contact
      : [
          NODAL,
          ...(divisions.length ? [{ label: divisions.length > 1 ? "Divisions" : "Division", text: divisions.join(" and ") }] : []),
          departmentAddress(),
        ],
    documentParts: page.documentParts,
    sources: s.sources.map(expandSource),
    documents,
  };
}

/**
 * A scheme the live listing carries and the scheme master does not — the umbrella
 * pages (AVYAY, SMILE, PM-YASASVI) and six more. Its page is the Department's own,
 * from the register mirror, with its documents; there are no apply routes to list.
 */
function liveSchemeDetail(slug: string): DbimSchemeDetail | undefined {
  const listed = listedScheme(slug);
  if (!listed) return undefined;
  const documents = schemeDocuments(slug);
  const page = templateSections(ingestedSections([slug], listed.title), documents);
  return {
    id: slug,
    name: listed.title,
    summary: listed.who.length ? `${listed.title}, for ${listed.who.join(", ")}.` : listed.title,
    about: page.about,
    eligibility: page.eligibility,
    benefits: page.benefits,
    apply: [],
    steps: [],
    process: page.process,
    faqs: page.faqs,
    contact: page.contact.length ? page.contact : [NODAL, departmentAddress()],
    documentParts: page.documentParts,
    sources: [{ text: "Department of Social Justice and Empowerment", href: `https://www.dosje.gov.in/schemes-and-services/${slug}/` }],
    documents,
  };
}

/** Every page: each scheme in the master, and each listed scheme the master does not hold. */
export const dbimSchemeIds = (): string[] => [
  ...SCHEMES.map((s) => s.id),
  ...listedSchemes().filter((s) => !masterForLegacy(s.slug)).map((s) => s.slug),
];

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
