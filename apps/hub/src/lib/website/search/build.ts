/**
 * Builds the website's search index by DERIVING it from the content layer.
 *
 * Nothing here retypes a fact. Organisations, divisions and officials come from
 * `data/website/`; schemes, documents, tenders, vacancies and organisation
 * profiles come from the ingested catalogue in `content/website/`; the 81 static
 * routes come from `static-pages.generated.ts`, which is generated from the pages
 * themselves and gated by `npm run check:search-index`.
 *
 * That leaves exactly one thing this module adds that no source records: the
 * CITIZEN WORDS, from `vocabulary.ts`. A concept's words belong to the concept,
 * so they are attached here at read time rather than baked into any source file
 * — a new rule in the vocabulary reaches every existing entry with no regenerate.
 *
 * COST. About 2,700 entries, built once per process and memoised. The whole index
 * is roughly a megabyte of strings, which is smaller than the JSON it is derived
 * from (already imported by the pages) and far cheaper than a search service for
 * a corpus this size. If the corpus grows an order of magnitude, this is the
 * module to replace — not the ranking.
 */
import {
  ORGANISATIONS,
  DIVISIONS,
  getOfficials,
} from "@/data/website";
import {
  getSchemes,
  getOrganisations as getOrganisationPages,
  getDocuments,
  getTenders,
  getVacancies,
} from "@/lib/website/content";
import { STATIC_PAGES, DIRECTORY_PAGES } from "./static-pages.generated";
import { citizenKeywordsFor } from "./vocabulary";
import type { WebsiteSearchEntry } from "./types";

/**
 * First readable PROSE from ingested section HTML, trimmed to a result snippet.
 *
 * Tables are stripped before the text is taken. Many ingested pages open with a
 * downloads table, and flattening its cells produces "Active Archived Title Size
 * Start Publish Date End Publish Date Action…" — which is what several scheme
 * results showed as their description on the first run of this page. A table read
 * as a sentence is worse than no description, because the reader has to parse it
 * before working out it says nothing.
 */
function snippet(sections: { html: string }[] | undefined, max = 180): string {
  if (!sections) return "";
  for (const section of sections) {
    const text = section.html
      .replace(/<table[\s\S]*?<\/table>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length > 20) return text.length > max ? `${text.slice(0, max)}…` : text;
  }
  return "";
}

/** Words a reader might type that a slug already contains, e.g. "pre-matric". */
function slugWords(slug: string): string {
  return slug.replace(/[/-]/g, " ");
}

function buildIndex(): WebsiteSearchEntry[] {
  const entries: WebsiteSearchEntry[] = [];

  /* ── Static pages ─────────────────────────────────────────────────────────
     Title and description are the page's own metadata, so a result row and the
     browser tab cannot disagree. */
  for (const page of STATIC_PAGES) {
    entries.push({
      title: page.title,
      description: page.description,
      href: page.href,
      keywords: `${slugWords(page.href)} ${citizenKeywordsFor(page.title, page.description)}`,
      type: "page",
      section: page.section,
      iconName: page.iconName,
    });
  }

  /* ── Organisations, from the registry ─────────────────────────────────────
     Abbreviation AND full name are both searchable, deliberately: a reader who
     knows "NSFDC" and a reader who knows "National Scheduled Castes Finance and
     Development Corporation" are usually not the same person, and neither knows
     the other's word. */
  for (const org of ORGANISATIONS) {
    entries.push({
      title: `${org.name} (${org.abbr})`,
      description: `Profile, mandate and activities of ${org.name}.`,
      href: org.profileHref,
      keywords: `${org.abbr} ${org.name} ${slugWords(org.id)} ${citizenKeywordsFor(org.name)}`,
      type: "organisation",
      section: "Organisations",
      iconName: "corporate_fare",
    });

    if (org.directoryHref) {
      entries.push({
        title: `${org.abbr} Telephone Directory`,
        description: `Officers, designations, intercom and email for ${org.name}.`,
        href: org.directoryHref,
        keywords: `${org.abbr} ${org.name} directory telephone contact phone email ${citizenKeywordsFor("directory contact")}`,
        type: "page",
        section: "Contact & Directory",
        iconName: "contacts",
      });
    }
  }

  /* ── Organisation profile pages, from the ingest ───────────────────────────
     175 pages including each body's own sub-pages ("…/achievements"). Kept
     separate from the registry above because these are CONTENT and those are the
     canonical bodies; a reader searching "Babuji's biography" wants this one. */
  for (const page of getOrganisationPages()) {
    const body = snippet(page.sections);
    entries.push({
      title: page.title,
      description: body,
      href: `/website/organisation/${page.slug}`,
      keywords: `${slugWords(page.slug)} ${citizenKeywordsFor(page.title, body)}`,
      type: "organisation",
      section: "Organisations",
      iconName: "corporate_fare",
    });
  }

  /* ── Divisions ───────────────────────────────────────────────────────────── */
  for (const division of DIVISIONS) {
    entries.push({
      title: `${division.name} Division`,
      description: `Mandate, schemes and functions of the ${division.name} Division.`,
      href: division.aboutHref ?? division.links[0]?.href ?? "/website/about-us",
      keywords: `${division.name} division ${slugWords(division.id)} ${citizenKeywordsFor(division.name)}`,
      type: "division",
      section: "Divisions",
      iconName: "account_tree",
    });
  }

  /* ── Officials ────────────────────────────────────────────────────────────
     A person is findable by name, by post, and by the body they serve — three
     things a citizen might know, of which they usually know one. The href is the
     directory page that actually shows them, read out of that page's own
     `directoryRows()` call by the generator. */
  for (const directory of DIRECTORY_PAGES) {
    for (const official of getOfficials(directory.ownerId)) {
      entries.push({
        title: official.name,
        description: `${official.designation} — ${directory.title}`,
        href: directory.href,
        keywords: `${official.designation} ${slugWords(directory.ownerId)} ${official.email ?? ""} ${official.phone ?? ""} ${official.intercom ?? ""} contact phone number officer`,
        type: "official",
        section: "People",
        iconName: "person",
      });
    }
  }

  /* ── Schemes ──────────────────────────────────────────────────────────────
     The part the vocabulary exists for. Every scheme inherits the citizen words
     of every concept its title or text matches, so "school money" reaches a
     pre-matric scholarship whose own title contains neither word. */
  for (const scheme of getSchemes()) {
    const body = snippet(scheme.sections);
    entries.push({
      title: scheme.title,
      description: body,
      href: `/website/schemes-services/${scheme.slug}`,
      keywords: `scheme yojana योजना ${slugWords(scheme.slug)} ${scheme.targetGroup?.join(" ") ?? ""} ${citizenKeywordsFor(scheme.title, body)}`,
      type: "scheme",
      section: scheme.category ?? "Schemes",
      iconName: "volunteer_activism",
    });
  }

  /* ── Documents, tenders and vacancies ─────────────────────────────────────
     Title and metadata only. The full text of these PDFs is NOT indexed — that
     needs a real extraction pipeline and is a later phase, so a reader searching
     for a phrase that appears only inside a PDF will not find it. Their href is
     the document itself on dosje.gov.in, which is where the file lives; the
     results page marks those as leaving the site. */
  const files: [ReturnType<typeof getDocuments>, string, string][] = [
    [getDocuments(), "Documents", "description"],
    [getTenders(), "Tenders", "receipt_long"],
    [getVacancies(), "Vacancies", "work"],
  ];

  for (const [records, section, iconName] of files) {
    for (const record of records) {
      entries.push({
        title: record.title,
        // No description. Category and date already appear in the result row's
        // meta line, and repeating them underneath read as two different facts
        // ("Notice · 01 Mar 2026" above "Notice · 2026-03-01") rather than one
        // said twice. There is no other prose to show — the text is inside a PDF
        // this index does not read.
        description: "",
        href: record.fileUrl ?? record.sourceUrl,
        keywords: `${record.category ?? ""} ${slugWords(record.slug)} ${citizenKeywordsFor(record.title, record.category)}`,
        type: "document",
        section: record.category ?? section,
        updated: record.date,
        iconName,
      });
    }
  }

  return entries;
}

let cached: WebsiteSearchEntry[] | null = null;

/** The index, built once per process. */
export function searchIndex(): WebsiteSearchEntry[] {
  cached ??= buildIndex();
  return cached;
}
