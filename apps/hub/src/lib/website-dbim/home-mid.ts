import "server-only";

/**
 * The DBIM home page's middle sections — Key Offerings, What's New, Recent Documents,
 * Explore User Personas and Important Links — read from the estate's own content.
 *
 * SOURCE: the scheme master (`@/lib/website-next/schemes`), the vacancy, document and
 * update registers (`@/lib/website/content`, through the DBIM Offerings and Documents
 * modules so a row means the same thing on the home page as on its own page), the
 * Department's divisions (`@/data/website`) and the DBIM reference build's persona
 * drawings (`DBIM_PERSONA_ART`). Mapping and reasoning:
 * docs/research/dbim-reference/components/home-mid.spec.md.
 */
import { SCHEMES } from "@/lib/website-next/schemes";
import { whatsNew } from "@/lib/website-next/whats-new";
import { dbimHref } from "./nav";
import { DBIM_PERSONA_ART } from "./assets";
import { DBIM_IMPORTANT_LINKS, DBIM_PERSONAS } from "./utility";
import { dbimVacancies } from "./offerings";
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

/*
 * THE RULE FOR THE FOUR SCHEMES — four, because the reference's 245px box shows four
 * rows (View More carries the rest): the reference's own first four, matched to the scheme
 * master wherever the Department runs that scheme, in the reference's order —
 * AVYAY (its lead component, the Integrated Programme for Senior Citizens), the
 * National Action Plan for Drug Demand Reduction and SHRESHTA. The reference's fourth, "National Awards … Prevention of Alcoholism", is
 * not in the master, so its slot goes to the Post Matric Scholarship for SCs, the
 * Department's largest scheme (Demand for Grants 2026-27). The redesign picks per
 * audience group (`Offerings.tsx`), which a four-row list with no groups cannot use.
 */
const KEY_SCHEME_IDS = ["avyay-ipsrc", "napddr", "shreshta", "pms-sc"] as const;

export function dbimKeySchemes(): DbimHomeLink[] {
  return KEY_SCHEME_IDS.flatMap((id) => {
    const s = SCHEMES.find((x) => x.id === id);
    return s ? [{ key: s.id, title: s.name, href: dbimHref(`/offerings/schemes-and-services/${s.id}`) }] : [];
  });
}

/** Rows the reference's Key Offerings box holds (245px at 1440). */
export const KEY_OFFERING_ROWS = 4;

/** The four newest vacancies not yet archived; each opens the Vacancies page. */
export function dbimKeyVacancies(): DbimHomeLink[] {
  return dbimVacancies()
    .slice(0, KEY_OFFERING_ROWS)
    .map((v) => ({ key: v.slug, title: v.title, href: dbimHref("/offerings/vacancies") }));
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
