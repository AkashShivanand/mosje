import "server-only";

/**
 * The DBIM home page's middle sections — Key Offerings, What's New, Recent Documents,
 * Explore User Personas and Important Links — read from the estate's own content.
 *
 * SOURCE: Key Offerings, the live site's own lists shared with every design
 * (`@/lib/website-shared/offerings`); the document and
 * update registers (`@/lib/website/content`, through the DBIM Offerings and Documents
 * modules so a row means the same thing on the home page as on its own page), the
 * Department's divisions (`@/data/website`), and the applicant groups finalised with
 * the AS (`./applicants`) with the handoff file's drawings (`DBIM_PERSONA_ART`).
 * Mapping and reasoning:
 * docs/research/dbim-reference/components/home-mid.spec.md.
 */
import {
  OFFERING_TENDERS, OFFERING_VACANCIES, keyOfferingSchemes,
} from "@/lib/website-shared/offerings";
import { RECENT_DOCUMENTS } from "@/lib/website-shared/documents";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { whatsNew } from "@/lib/website-next/whats-new";
import { dbimHref } from "./nav";
import { DBIM_PERSONA_ART } from "./assets";
import { DBIM_APPLICANT_TYPES } from "./applicants";
import { DBIM_IMPORTANT_LINKS } from "./utility";
import {
  documentSeries, whatsNewTarget,
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
 * Schemes: the live Key Offerings tab's five, in its order (`keyOfferingSchemes`). A
 * scheme the master holds opens its DBIM page; one it does not opens the scheme list; a
 * document opens the document.
 * Vacancies and tenders: the live section's own, each opening its page here.
 */
export const KEY_OFFERING_ROWS = 5;

export function dbimKeySchemes(): DbimHomeLink[] {
  return keyOfferingSchemes()
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
 * The six newest items of the estate's What's New feed. The reference's panel held four
 * (301px at 1440; the live site still shows four); six on the instruction of 8 Oct 2026,
 * so the four senior-citizen and yoga items added that week do not push the Lok Adalat
 * material and the NAPDDR call off the home page. The panel and the Key Offerings box
 * share the band's height, and the offering rows spread to fill it (home-mid.css), so
 * both View More buttons stay on one line. Dates are on the What's New page. Each item
 * opens where `whatsNewTarget` sends it — the same target the Announcements bar and the
 * What's New page give it.
 */
export const HOME_NEWS_COUNT = 6;

export function dbimHomeNews(limit = HOME_NEWS_COUNT): DbimHomeLink[] {
  return whatsNew()
    .flatMap((n): DbimHomeLink[] => {
      const t = whatsNewTarget(n);
      return t ? [{ key: n.key, title: dbimFeedTitle(n.title), ...t }] : [];
    })
    .slice(0, limit);
}

/** Acronyms the Department's feed prints in capitals, kept so when a title is sentence-cased. */
const FEED_ACRONYMS = new Set([
  "AJAY", "DAIC", "DANM", "DNT", "EBC", "EOI", "GIA", "NBCFDC", "NCSC", "NGO", "NGOS", "NOS",
  "NSFDC", "NSKFDC", "OBC", "OBCS", "PM", "RTI", "SC", "SCS", "SSE", "ST", "UT", "UTS",
]);

/** Words a Title Case title keeps lowercase unless they open it (ui-restraint-and-copy.md §2). */
const SMALL_WORDS = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "at", "by", "from", "as"]);

/**
 * A feed title as the DBIM home prints it (decided 28 Sep 2026; the source data is
 * untouched, and the divergence is recorded in docs/audit/dbim-home-figma-parity-2026-09-28.md):
 *
 * - DBIM 3.0 §4.1.1 ii: "All capital text must not be used for long sentences". A title
 *   whose letters are 80% or more capitals is set in Title Case, the estate's rule for
 *   titles. Acronyms (the list above, or a short word in parentheses), anything with a
 *   digit and tokens that already mix cases (Rs.5.00, RRs) are kept as published.
 * - §7.1.3, no spelling errors: "lnviting" and "lnterest" — a lowercase L where the
 *   Department typed a capital I — read "Inviting" and "Interest". No English word opens
 *   with "ln", so the repair cannot touch a correct one. Other misspellings are left.
 */
export function dbimFeedTitle(title: string): string {
  const fixed = title.replace(/\bln(?=[a-z])/g, "In");
  const letters = fixed.replace(/[^A-Za-z]/g, "");
  if (letters.length < 16 || letters.replace(/[^A-Z]/g, "").length / letters.length < 0.8) return fixed;
  const word = (w: string, first: boolean): string => {
    const bare = w.replace(/[^A-Za-z]/g, "");
    if (!bare || /\d/.test(w) || /[a-z]/.test(w) || FEED_ACRONYMS.has(bare.toUpperCase())) return w;
    if (/^\(.*\)$/.test(w.replace(/[^A-Za-z()]/g, "")) && bare.length <= 6) return w;
    const lower = w.toLowerCase();
    if (!first && SMALL_WORDS.has(bare.toLowerCase())) return lower;
    return lower.replace(/[a-z]/, (c) => c.toUpperCase());
  };
  let first = true;
  return fixed.replace(/\S+/g, (token) => {
    const out = token
      .split(/([-/])/)
      .map((part, i) => (i % 2 ? part : word(part, first && i === 0)))
      .join("");
    if (/[A-Za-z]/.test(token)) first = false;
    return out;
  });
}

/* ── Recent Documents ──────────────────────────────────────────────────── */

export interface DbimRecentDoc extends DbimHomeLink {
  /** The Documents tab it sits under — the card's bold first line. */
  category: string;
}

/**
 * The live site's four Recent Documents, shared with every design
 * (lib/website-shared/documents.ts) — the reference build's mix of one Report, one
 * Order and two Publications, each the newest of its tab, is gone. A card's bold first
 * line is the live card's "Type:", and it opens the series page that holds it here.
 */
export function dbimRecentDocuments(): DbimRecentDoc[] {
  return RECENT_DOCUMENTS.map((d) => {
    const series = documentSeries("reports").find((s) => s.title.toLowerCase() === d.type.toLowerCase());
    return {
      key: d.slug,
      category: d.type,
      title: d.title,
      href: series ? dbimHref(`/documents/reports/${series.slug}`) : dbimHref("/documents"),
    };
  });
}

/* ── Explore User Personas ─────────────────────────────────────────────── */

export interface DbimPersonaSlide {
  slug: string;
  /** The applicant group's name, as the finalised chips word it. */
  label: string;
  art: string;
  alt: string;
  href: string;
}

/*
 * THE ELEVEN APPLICANT GROUPS, one slide each (instruction, 30 Sep 2026: the chips
 * finalised with the AS — lib/website-dbim/applicants.ts), each with the handoff file's
 * drawing for it (`DBIM_PERSONA_ART`). Each opens Schemes and Services with that Type of
 * Applicant chosen. The alt text says what the drawing shows, not who the group is:
 * the slide's name already says that.
 */
const PERSONA_ALT: Record<string, string> = {
  student: "Drawing of a student with a backpack",
  sc: "Drawing of a man in a shirt with a cloth over his shoulder",
  obc: "Drawing of a bearded man with a scarf",
  dnt: "Drawing of a young man in a turban",
  safai: "Drawing of a worker in a cap holding a broom",
  senior: "Drawing of an older woman in a sari holding a booklet",
  tg: "Drawing of a woman in a sari",
  drug: "Drawing of a young man in a shirt",
  begging: "Drawing of an older man with a cloth over his shoulder",
  atrocity: "Drawing of a woman in a sari holding a book",
  ngo: "Drawing of a woman with a shoulder bag",
};

/** The home page's personas: every applicant group that has a drawing, in the finalised order. */
export const DBIM_HOME_PERSONAS: DbimPersonaSlide[] = DBIM_APPLICANT_TYPES.flatMap((a) => {
  const art = DBIM_PERSONA_ART[a.id];
  return art
    ? [{ slug: a.id, label: a.label, art, alt: PERSONA_ALT[a.id] ?? "", href: `${dbimHref("/offerings")}?applicant=${a.id}` }]
    : [];
});

/* ── Important Links ───────────────────────────────────────────────────── */

/*
 * THE FIRST FOUR ROWS OF `DBIM_IMPORTANT_LINKS`, AND "VIEW MORE" OPENS THE REST.
 *
 * The home section is a WINDOW on that list, never a list of its own, so the home page
 * and the Important Links page cannot disagree about what the Department's links are.
 * The four are the actions a citizen may have arrived for — the Nasha Mukt Bharat
 * e-pledge, the Mitr sign-up, the de-addiction centre finder and the SAMAVESH gateway.
 * Behind "View more" stand the Department's priority destinations, nine rows in all,
 * searchable on the page itself.
 *
 * The reference's own fourth row, "Inauguration", is a webcast link with no source in
 * this estate, so it is not drawn.
 */
export function dbimHomeImportantLinks(): DbimHomeLink[] {
  return DBIM_IMPORTANT_LINKS.slice(0, 4).flatMap((l): DbimHomeLink[] => {
    if (l.path) return [{ key: l.path, title: l.label, href: dbimHref(l.path) }];
    if (l.href) return [{ key: l.href, title: l.label, href: l.href, external: true }];
    return [];
  });
}
