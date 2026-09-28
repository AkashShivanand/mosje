import "server-only";

/**
 * The DBIM home page's middle sections — Key Offerings, What's New, Recent Documents,
 * Explore User Personas and Important Links — read from the estate's own content.
 *
 * SOURCE: Key Offerings, the live site's own lists shared with every design
 * (`@/lib/website-shared/offerings`); the document and
 * update registers (`@/lib/website/content`, through the DBIM Offerings and Documents
 * modules so a row means the same thing on the home page as on its own page), the
 * Department's divisions (`@/data/website`) and the DBIM reference build's persona
 * drawings (`DBIM_PERSONA_ART`). Mapping and reasoning:
 * docs/research/dbim-reference/components/home-mid.spec.md.
 */
import {
  OFFERING_TENDERS, OFFERING_VACANCIES, offeringSchemesInOrder,
} from "@/lib/website-shared/offerings";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { whatsNew } from "@/lib/website-next/whats-new";
import { dbimHref } from "./nav";
import { DBIM_PERSONA_ART } from "./assets";
import { DBIM_IMPORTANT_LINKS, DBIM_PERSONAS } from "./utility";
import {
  DBIM_DOC_TABS, documentSeries, seriesDocuments, whatsNewTarget, type DbimDocTab,
} from "./documents";

export interface DbimHomeLink {
  key: string;
  title: string;
  href: string;
  /** Leaves the estate: opens in a new tab and says so. */
  external?: boolean;
}

/* ── Key Offerings ─────────────────────────────────────────────────────── */

/**
 * FIVE ROWS A TAB, from the live site's own Offerings (lib/website-shared/offerings.ts)
 * — the lists every design shows. DBIM 3.0 §A.4.1 vi asks for "the five most recent
 * entries in each category"; the reference build showed four schemes it chose itself
 * and the four newest register rows.
 *
 * Schemes: the live section's schemes in the order it first names them (the live site
 * dates none, so its order stands for "most recent"). A scheme the master holds opens
 * its DBIM page; one it does not opens the scheme list; a document opens the document.
 * Vacancies and tenders: the live section's own, each opening its page here.
 */
export const KEY_OFFERING_ROWS = 5;

export function dbimKeySchemes(): DbimHomeLink[] {
  return offeringSchemesInOrder()
    .slice(0, KEY_OFFERING_ROWS)
    .map((s) => ({
      key: s.slug ?? s.file ?? s.title,
      title: s.title,
      href: s.masterId
        ? dbimHref(`/offerings/schemes-and-services/${s.masterId}`)
        : s.file
          ? localiseDocumentUrl(s.file, s.title)
          : dbimHref("/offerings"),
    }));
}

export function dbimKeyVacancies(): DbimHomeLink[] {
  return OFFERING_VACANCIES.slice(0, KEY_OFFERING_ROWS).map((v) => ({
    key: v.file,
    title: v.title,
    href: dbimHref("/offerings/vacancies"),
  }));
}

/** The third tab is DBIM 3.0 Figure 56 (Schemes · Vacancies · Tenders). */
export function dbimKeyTenders(): DbimHomeLink[] {
  return OFFERING_TENDERS.slice(0, KEY_OFFERING_ROWS).map((t) => ({
    key: t.file,
    title: t.title,
    href: dbimHref("/offerings/tenders"),
  }));
}

/* ── What's New ────────────────────────────────────────────────────────── */

/**
 * The four newest items of the estate's What's New feed — four, because that is what
 * the reference's 301px panel holds at 1440 (measured: four items of one- and two-line
 * titles take 238 of its 269px; a fifth would not fit). Dates are on the What's New page
 * (`whatsNew()`: updates, circulars, notices, results and announcements of the last
 * twelve months). Each item opens where `whatsNewTarget` sends it — the same target the
 * Announcements bar and the What's New page give it.
 */
export function dbimHomeNews(limit = 4): DbimHomeLink[] {
  return whatsNew()
    .flatMap((n): DbimHomeLink[] => {
      const t = whatsNewTarget(n);
      return t ? [{ key: n.key, title: n.title, ...t }] : [];
    })
    .slice(0, limit);
}

/* ── Recent Documents ──────────────────────────────────────────────────── */

export interface DbimRecentDoc extends DbimHomeLink {
  /** The Documents tab it sits under — the card's bold first line. */
  category: string;
}

/*
 * The reference's mix — one Reports card, one Orders and Notices, two Publications —
 * each the newest live document of its tab. A card opens the document's series page
 * (`/documents/<tab>/<series>`), where it heads the list.
 */
const RECENT_MIX: [DbimDocTab, number][] = [["reports", 1], ["orders-and-notices", 1], ["publications", 2]];

function newestInTab(tab: DbimDocTab, n: number): DbimRecentDoc[] {
  const label = DBIM_DOC_TABS.find((t) => t.key === tab)?.label ?? "";
  // The newest file of a tab lives in one of its newest folders; three is ample for two picks.
  const rows = documentSeries(tab)
    .slice(0, 3)
    .flatMap((s) => (seriesDocuments(tab, s.slug)?.rows.slice(0, n) ?? []).map((r) => ({ r, s })))
    .sort((a, b) => (b.r.date ?? "").localeCompare(a.r.date ?? ""));
  const seen = new Set<string>();
  return rows
    .filter(({ r }) => !seen.has(r.key) && !!seen.add(r.key))
    .slice(0, n)
    .map(({ r, s }) => ({
      key: `${tab}-${r.key}`,
      category: label,
      title: r.title,
      href: dbimHref(`/documents/${tab}/${s.slug}`),
    }));
}

export function dbimRecentDocuments(): DbimRecentDoc[] {
  return RECENT_MIX.flatMap(([tab, n]) => newestInTab(tab, n));
}

/* ── Explore User Personas ─────────────────────────────────────────────── */

export interface DbimPersonaSlide {
  slug: string;
  /** The persona page's own title (`DBIM_PERSONAS`). */
  label: string;
  art: string;
  alt: string;
  href: string;
}

/*
 * The Department's audiences are the classic site's four pages — For Student, For
 * Beneficiary, For Government Official, For Researcher. Only three drawings exist,
 * and each goes to the audience it genuinely depicts or to none:
 *   persona-1 (suit and tie, on a call, holding a tablet) → Government Official
 *   persona-3 (young man reading an open book; the reference's own "Researcher") → Researcher
 *   persona-2 (a business owner) → none; no Department audience is one.
 * Student and Beneficiary have no drawing that shows them and are left out rather
 * than given one that does not.
 */
const PERSONA_ART: Record<string, { art: string; alt: string }> = {
  "government-official": { art: DBIM_PERSONA_ART[0], alt: "Drawing of an official in a suit holding a tablet" },
  researcher: { art: DBIM_PERSONA_ART[2], alt: "Drawing of a researcher reading an open book" },
};

/** The Department's personas (`DBIM_PERSONAS`, the canonical list) that have a drawing. */
export const DBIM_HOME_PERSONAS: DbimPersonaSlide[] = DBIM_PERSONAS.flatMap((p) => {
  const a = PERSONA_ART[p.slug];
  return a ? [{ slug: p.slug, label: p.title, art: a.art, alt: a.alt, href: dbimHref(`/persona/${p.slug}`) }] : [];
});

/* ── Important Links ───────────────────────────────────────────────────── */

/*
 * The first four rows of the Department's Important Links (`DBIM_IMPORTANT_LINKS`,
 * one per Division), the same list the Important Links page shows — so one list feeds
 * both. That list leads with the three the reference leads with (Scheduled Caste
 * Welfare, Social Defence, Grants-in-Aid to NGOs); the reference's fourth,
 * "Inauguration", is a webcast link with no source in the estate.
 */
export function dbimHomeImportantLinks(): DbimHomeLink[] {
  return DBIM_IMPORTANT_LINKS.slice(0, 4).flatMap((l): DbimHomeLink[] => {
    if (l.path) return [{ key: l.path, title: l.label, href: dbimHref(l.path) }];
    if (l.href) return [{ key: l.href, title: l.label, href: l.href, external: true }];
    return [];
  });
}
