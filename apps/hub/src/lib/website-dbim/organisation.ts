/**
 * One organisation's page in the DBIM design (Ministry › Our Organisation › <body>),
 * shaped from the live website's page for that body.
 *
 * SOURCE: `lib/website-shared/organisation-profiles.ts` — dosje.gov.in/organisation/<id>/,
 * read on ORGANISATION_PROFILES_AS_ON. Every word is the Department's; this file only
 * arranges it into DBIM's detail layout (ministry.spec.md §4b) and applies the estate's
 * standing rules on the way:
 *
 * - titles in Title Case (ui-restraint-and-copy.md §2) — "About us" → "About Us";
 * - dates day-first, DD.MM.YYYY (DBIM 3.0 §A.5.6, checklist 27) — "19 Jan 2026" → "19.01.2026";
 * - free-mail addresses are not published (CON-09, as every people page of the estate) —
 *   NISD's and DAIC's Gmail addresses are left out, and the live page is one link away;
 * - document files resolve to the estate's local samples (`localiseDocumentUrl`), as
 *   every other document row does;
 * - a link to the live site opens the page the estate holds for it (./live-links.ts);
 *   a "Know More" that leads back to this very section is left out.
 */
import { cleanHtml } from "@/components/website-next/templates/organisation-content";
import type { DbimIconName } from "@/components/website-dbim/ui/icons";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import {
  ORGANISATION_PROFILES_AS_ON,
  getOrganisationProfile,
  type OrgProfileBlock,
  type OrgProfileDocument,
} from "@/lib/website-shared/organisation-profiles";
import { localiseLiveLinks, resolveLiveLink } from "./live-links";
import type { DbimDocRow } from "./ministry";

/* ── Wording ───────────────────────────────────────────────────────────────── */

const SMALL = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "at", "by", "under"]);

/** "About us" → "About Us"; "Rules Of Procedure" → "Rules of Procedure". Acronyms and "&" untouched. */
export function titleCaseHeading(heading: string): string {
  // A label set in capitals ("OUR WORK & IMPACT") is cased from lower case.
  const s = heading === heading.toUpperCase() ? heading.toLowerCase() : heading;
  const words = s.split(" ");
  return words
    .map((w, i) => {
      if (!w || w === "&" || /[A-Z].*[A-Z]/.test(w) || /\d/.test(w)) return w;
      const lower = w.toLowerCase();
      if (i > 0 && i < words.length - 1 && SMALL.has(lower)) return lower;
      return lower.replace(/(^|[-(/‘'])([a-z])/g, (_m, p: string, c: string) => p + c.toUpperCase());
    })
    .join(" ");
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "19 Jan 2026" → "19.01.2026". Anything else is returned as published. */
export function dottedDate(s?: string): string | undefined {
  const m = s?.match(/^(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return s;
  const month = MONTHS.indexOf(m[2]!.toLowerCase()) + 1;
  return month ? `${m[1]!.padStart(2, "0")}.${String(month).padStart(2, "0")}.${m[3]}` : s;
}

const FREE_MAIL = /(gmail|yahoo|rediffmail|hotmail|outlook)(\[dot\]|\.)/i;

/* ── Links ─────────────────────────────────────────────────────────────────── */

export interface DbimOrgLink {
  label: string;
  /** A complete href — a DBIM or estate path, or an absolute URL. */
  href: string;
  external: boolean;
}

/** Resolves a live href for the page of body `here`; undefined where it leads back to this page. */
function orgLink(label: string, href: string | undefined, here: string): DbimOrgLink | undefined {
  if (!href) return undefined;
  const r = resolveLiveLink(href, here);
  return r ? { label, ...r } : undefined;
}

const FILE = /\.(pdf|docx?|xlsx?|pptx?|zip)(\?|$)|cloudfront\.net/i;

/**
 * A document row. A file resolves to the estate's local sample; a row that links a
 * PAGE resolves like any other link. A row with no title, a "#" target, or a target
 * that is this very page is left out: the live DAIC page's Vacancies tab lists four
 * rows titled only "Dr. Ambedkar International Centre (DAIC)" that open DAIC's own
 * page, and its Tenders tab four blank rows linking "#" — a defect of the live page,
 * recorded in docs/audit/dbim-organisation-pages.md, not something to republish.
 */
function docRow(d: OrgProfileDocument, here: string, pageTitle: string): DbimDocRow | undefined {
  if (!d.href || !d.title || d.href === "#" || d.title === pageTitle) return undefined;
  let href = d.href;
  if (FILE.test(href)) href = localiseDocumentUrl(href, d.title, d.type);
  else {
    const r = resolveLiveLink(href, here);
    if (!r) return undefined;
    href = r.href;
  }
  return { title: d.title, href, date: dottedDate(d.date), size: d.size, type: d.format ?? d.type };
}

/* ── Contact lines ─────────────────────────────────────────────────────────── */

/** One line of a contact entry; where it ends in telephone numbers they are split off to dial. */
export interface DbimContactLine {
  text: string;
  /** The numbers as published, each with its `tel:` address. */
  numbers: { label: string; tel: string }[];
}

const NUMBER = String.raw`\+?\d[\d\s-]{6,}\d`;
const TRAILING_NUMBERS = new RegExp(String.raw`^(.*?)[\s:–-]*((?:${NUMBER})(?:\s*,\s*${NUMBER})*)\.?$`);

/**
 * "Queries related to Dr. Ambedkar Chairs- 011-2332 0589" → the purpose and its number.
 * Only a line that ENDS in numbers is split; an address with a PIN code is left whole
 * (a PIN is six digits, under the eight the pattern needs).
 */
function contactLine(v: string, phoneEntry: boolean): DbimContactLine {
  const m = phoneEntry ? v.match(TRAILING_NUMBERS) : null;
  if (!m) return { text: v, numbers: [] };
  const numbers = m[2]!.split(/\s*,\s*/).map((label) => ({ label, tel: `tel:${label.replace(/[^\d+]/g, "")}` }));
  return { text: m[1]!.trim().replace(/[–-]$/, "").trim(), numbers };
}

/* ── Blocks ────────────────────────────────────────────────────────────────── */

const CONTACT_ICON: [RegExp, string][] = [
  [/address/i, "location_on"],
  [/mobile|phone|tele/i, "call"],
  [/fax/i, "fax"],
  [/mail/i, "mail"],
  [/airport/i, "flight"],
  [/railway|train/i, "train"],
  [/metro/i, "subway"],
];

/**
 * The live tiles carry low-resolution clip-art (a map pin, cartoon meetings); a
 * government page draws the estate's icon set instead (the Department's review,
 * 29 Sep 2026). Chosen from the tile's own title; every live tile is listed.
 */
const TILE_ICON: [RegExp, string][] = [
  [/spot visit/i, "pin_drop"], // NCSC
  [/state review/i, "map"], // NCSC
  [/psu|psb|bank/i, "account_balance"], // NCSC
  [/academic/i, "school"], // DAIC
  [/booking/i, "event_available"], // DAIC
  [/panchteerth|memorial|teerth/i, "temple_buddhist"], // DAIC — the five sites associated with Dr. Ambedkar
];

const SOCIAL_ICON: [RegExp, DbimIconName, string][] = [
  [/facebook/i, "facebook", "Facebook"],
  [/twitter|^x\b/i, "x", "X"],
  [/instagram/i, "instagram", "Instagram"],
  [/youtube/i, "youtube", "YouTube"],
];

export type DbimOrgBlock =
  | { kind: "prose"; html: string }
  | { kind: "people"; items: { name: string; designation: string; photo?: string; profile?: DbimOrgLink; tenure?: string }[] }
  | { kind: "cards"; items: { category?: string; title: string; description?: string; link?: DbimOrgLink }[] }
  | { kind: "documents"; items: DbimDocRow[] }
  | { kind: "events"; items: { title: string; date?: string; link?: DbimOrgLink }[] }
  | { kind: "links"; items: DbimOrgLink[] }
  | { kind: "tiles"; items: { title: string; icon: string; link?: DbimOrgLink }[] }
  | { kind: "gallery"; items: { src: string; full?: string; caption: string }[] }
  | { kind: "social"; items: { name: string; icon: DbimIconName; handle?: string; href: string }[] }
  | { kind: "contact"; items: { label: string; icon: string; values: DbimContactLine[] }[] }
  | {
      kind: "tabs";
      items: {
        label: string;
        viewAll?: DbimOrgLink;
        documents: DbimDocRow[];
        events: { title: string; date?: string; link?: DbimOrgLink }[];
        news: DbimOrgLink[];
        empty?: string;
      }[];
    };

const defined = <T,>(x: T | undefined): x is T => x !== undefined;

function shapeBlock(b: OrgProfileBlock, label: string, here: string, pageTitle: string): DbimOrgBlock | undefined {
  switch (b.kind) {
    case "prose": {
      const html = cleanHtml(localiseLiveLinks(b.html, here), { headingLevel: 3, label });
      return html ? { kind: "prose", html } : undefined;
    }
    case "people":
      return {
        kind: "people",
        items: b.items.map((p) => ({ ...p, profile: orgLink(`${p.name}'s profile`, p.profile, here) })),
      };
    case "cards":
      return { kind: "cards", items: b.items.map((c) => ({ ...c, link: orgLink(c.title, c.href, here) })) };
    case "documents": {
      const items = b.items.map((d) => docRow(d, here, pageTitle)).filter(defined);
      return items.length ? { kind: "documents", items } : undefined;
    }
    case "events":
      return { kind: "events", items: b.items.map((e) => ({ title: e.title, date: dottedDate(e.date), link: orgLink(e.title, e.href, here) })) };
    case "links": {
      const items = b.items.map((l) => orgLink(l.label, l.href, here)).filter(defined);
      return items.length ? { kind: "links", items } : undefined;
    }
    case "tiles":
      return {
        kind: "tiles",
        items: b.items.map((t) => ({ title: t.title, icon: TILE_ICON.find(([re]) => re.test(t.title))?.[1] ?? "article", link: orgLink(t.title, t.href, here) })),
      };
    case "gallery": {
      const items = b.items.filter((g): g is typeof g & { src: string } => Boolean(g.src)).map((g) => ({ src: g.src, full: g.full, caption: g.caption }));
      return items.length ? { kind: "gallery", items } : undefined;
    }
    case "social": {
      const items = b.items
        .map((s) => {
          const match = SOCIAL_ICON.find(([re]) => re.test(s.platform));
          return match && s.href ? { name: match[2], icon: match[1], handle: s.handle, href: s.href } : undefined;
        })
        .filter(defined);
      return items.length ? { kind: "social", items } : undefined;
    }
    case "contact": {
      const items = b.items
        .map((c) => ({
          label: titleCaseHeading(/gmail/i.test(c.label) ? "Email" : c.label),
          icon: CONTACT_ICON.find(([re]) => re.test(c.label))?.[1] ?? "info",
          values: c.values.filter((v) => !FREE_MAIL.test(v)).map((v) => contactLine(v, /phone|mobile|tele/i.test(c.label))),
        }))
        .filter((c) => c.values.length);
      return items.length ? { kind: "contact", items } : undefined;
    }
    case "tabs": {
      // A tab whose every row was malformed on the live page is left out, not shown
      // as empty: the live page claims entries there, so "No Data Available" would be
      // untrue. A tab the live page itself calls empty keeps its own words.
      const items = b.items
        .map((t) => ({
          label: titleCaseHeading(t.label),
          viewAll: orgLink(`View All ${t.label}`, t.viewAll, here),
          documents: t.documents.map((d) => docRow(d, here, pageTitle)).filter(defined),
          events: t.events.filter((e) => e.title).map((e) => ({ title: e.title, date: dottedDate(e.date), link: orgLink(e.title, e.href, here) })),
          news: t.news.filter((n) => n.title).map((n) => orgLink(n.title, n.href, here)).filter(defined),
          empty: t.empty,
        }))
        .filter((t) => t.documents.length || t.events.length || t.news.length || t.empty);
      return items.length ? { kind: "tabs", items } : undefined;
    }
  }
}

/* ── The page ──────────────────────────────────────────────────────────────── */

export interface DbimOrgSection {
  /** The in-page anchor the page index links to. */
  anchor: string;
  heading: string;
  intro?: string;
  more?: DbimOrgLink;
  blocks: DbimOrgBlock[];
}

export interface DbimOrgProfile {
  title: string;
  subtitle?: string;
  lead?: string;
  logo?: string;
  /** The live banner. Decorative: its published alt text is a file name ("DAIC banner"). */
  banner?: string;
  actions: DbimOrgLink[];
  facts: { value: string; label: string }[];
  /** The live page's index links that leave the page (Awards, RTI, FAQs), under their group. */
  related: { label: string; links: DbimOrgLink[] }[];
  sections: DbimOrgSection[];
  source: string;
  /** DD.MM.YYYY. */
  asOn: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function organisationProfile(id: string): DbimOrgProfile | undefined {
  const p = getOrganisationProfile(id);
  if (!p) return undefined;
  const here = id;
  const used = new Set<string>();
  const sections = p.sections
    .map((s): DbimOrgSection | undefined => {
      const heading = titleCaseHeading(s.heading);
      const blocks = s.blocks.map((b) => shapeBlock(b, heading, id, p.title)).filter(defined);
      const intro = s.intro ? cleanHtml(localiseLiveLinks(s.intro, id), { headingLevel: 3, label: heading }) : undefined;
      if (!blocks.length && !intro) return undefined;
      let anchor = `org-${slug(heading)}`;
      while (used.has(anchor)) anchor += "-2";
      used.add(anchor);
      return { anchor, heading, intro: intro || undefined, more: s.more ? orgLink(titleCaseHeading(s.more.label), s.more.href, here) : undefined, blocks };
    })
    .filter(defined);
  const [y, m, d] = ORGANISATION_PROFILES_AS_ON.split("-");
  return {
    title: p.title,
    subtitle: p.subtitle,
    lead: p.lead,
    logo: p.logo,
    banner: p.banner?.src,
    actions: p.actions.map((a) => orgLink(a.label, a.href, here)).filter(defined),
    facts: p.facts,
    related: p.index
      .map((g) => ({ label: titleCaseHeading(g.label), links: g.links.map((l) => orgLink(l.label, l.href, here)).filter(defined) }))
      .filter((g) => g.links.length),
    sections,
    source: p.source,
    asOn: `${d}.${m}.${y}`,
  };
}
