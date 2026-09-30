/**
 * The pages BEHIND an organisation's page in the DBIM design — everything its links
 * open, so none of them has to leave for dosje.gov.in (./live-links.ts):
 *
 *   /ministry/our-organisation/<id>/<page>              the body's own page (Awards, RTI, …)
 *   /ministry/our-organisation/<id>/documents/<register> its annual reports, notices, …
 *   /ministry/our-organisation/<id>/events               its events
 *   /ministry/our-organisation/<id>/gallery              its photo albums
 *   /ministry/our-organisation/<id>/directory            its officers
 *   /ministry/our-organisation/<id>/directory/<slug>     one officer
 *   /connect/events/<slug>                               one event
 *
 * SOURCES: the estate's ingested registers (`content/website/*.json`, read from
 * dosje.gov.in 18 Sep 2026) and, for the two pages the ingest lacks, the organisation
 * profiles snapshot (`lib/website-shared/organisation-profiles.ts`). No word is added.
 */
import { cleanHtml, kindOf, stripTags } from "@/components/website-next/templates/organisation-content";
import { ORGANISATIONS } from "@/data/website";
import { getAllDocuments, getEvent, getEvents, getGalleryItems, getOfficial, getOrganisation } from "@/lib/website/content";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { phoneGroups } from "@/components/website-next/templates/people-format";
import { getOrganisationPage, getOrganisationProfile } from "@/lib/website-shared/organisation-profiles";
import { ORG_REGISTERS, localiseLiveLinks, orgCode } from "./live-links";
import { FREE_MAIL, teamOffices, type DbimDocRow, type DbimTeamOffice } from "./ministry";
import { getDbimAlbums, type DbimAlbum } from "./media";
import { titleCaseHeading } from "./organisation";

/** Records per page on every list here — the estate's DBIM lists page by ten. */
export const ORG_PAGE_SIZE = 10;

/** "2015-11-24" → "24.11.2015" (DBIM 3.0 §A.5.6, checklist 27). */
export function isoDotted(iso?: string): string | undefined {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : undefined;
}

export function organisationName(id: string): string | undefined {
  return ORGANISATIONS.find((o) => o.id === id)?.name ?? getOrganisation(id)?.title;
}

/** Cuts one page from a list; the page asked for is clamped to the pages there are. */
export function pageOf<T>(rows: T[], asked: number): { rows: T[]; page: number; pageCount: number; total: number } {
  const pageCount = Math.max(1, Math.ceil(rows.length / ORG_PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(asked) || 1), pageCount);
  return { rows: rows.slice((page - 1) * ORG_PAGE_SIZE, page * ORG_PAGE_SIZE), page, pageCount, total: rows.length };
}

/* ── A body's own page ─────────────────────────────────────────────────────── */

export interface DbimOrgSubPage {
  title: string;
  sections: { heading?: string; html: string }[];
}

/** `awards` under `dr-ambedkar-foundation` → the ingested page, or the mirrored one. */
export function organisationSubPage(id: string, sub: string): DbimOrgSubPage | undefined {
  const slug = `${id}/${sub}`;
  // A page filed beside the bodies rather than under one (see live-links.ts) is read at its own slug.
  const loose = !sub.includes("/") && !ORGANISATIONS.some((o) => o.id === sub) ? getOrganisation(sub) : undefined;
  const rec = getOrganisation(slug) ?? loose;
  if (rec) {
    const sections = rec.sections
      .filter((s) => kindOf(s) === "prose")
      .map((s) => ({
        heading: s.heading && s.heading.trim() !== rec.title.trim() ? titleCaseHeading(stripTags(s.heading)) : undefined,
        html: cleanHtml(localiseLiveLinks(s.html, id), { headingLevel: 3, label: s.heading ?? rec.title }),
      }))
      .filter((s) => stripTags(s.html) !== "");
    return { title: titleCaseHeading(rec.title), sections };
  }
  const page = getOrganisationPage(slug);
  if (page) return { title: titleCaseHeading(page.title), sections: [{ html: cleanHtml(localiseLiveLinks(page.html, id), { headingLevel: 3, label: page.title }) }] };
  return undefined;
}

/* ── Its document registers ────────────────────────────────────────────────── */

export function organisationDocuments(id: string, register: string): { title: string; rows: DbimDocRow[] } | undefined {
  const reg = ORG_REGISTERS[register];
  const code = orgCode(id);
  if (!reg || !code) return undefined;
  const rows = getAllDocuments()
    .filter((d) => d.organisation?.toUpperCase() === code && d.status !== "Archived")
    .filter((d) => reg.categories.includes(d.category ?? "") || (d.types ?? []).some((t) => reg.categories.includes(t)))
    .sort((a, b) => (b.publishStart ?? b.date ?? "").localeCompare(a.publishStart ?? a.date ?? ""))
    .map((d) => ({
      title: d.title,
      href: d.fileUrl ? localiseDocumentUrl(d.fileUrl, d.category, d.title) : (d.externalUrl ?? d.sourceUrl),
      date: isoDotted(d.publishStart ?? d.date),
      size: d.fileUrl ? d.fileSize : undefined,
      type: d.fileType ?? d.category,
    }));
  return { title: reg.title, rows };
}

/* ── Its events, and one event ─────────────────────────────────────────────── */

export interface DbimOrgEventRow {
  title: string;
  date?: string;
  href: string;
}

export function organisationEvents(id: string): DbimOrgEventRow[] {
  const code = orgCode(id);
  return getEvents()
    .filter((e) => e.organisation?.toUpperCase() === code)
    .sort((a, b) => (b.startDate ?? b.date ?? "").localeCompare(a.startDate ?? a.date ?? ""))
    .map((e) => ({ title: e.title, date: isoDotted(e.startDate ?? e.date), href: `/connect/events/${e.slug}` }));
}

export interface DbimEventDetail {
  title: string;
  when?: string;
  mode?: string;
  location?: string;
  organiser?: string;
  organisationId?: string;
  descriptionHtml?: string;
  document?: DbimDocRow;
}

export function eventDetail(slug: string): DbimEventDetail | undefined {
  const e = getEvent(slug);
  if (!e) return undefined;
  const orgId = ORGANISATIONS.find((o) => orgCode(o.id) === e.organisation?.toUpperCase())?.id;
  return {
    title: e.title,
    when: e.when ?? isoDotted(e.startDate ?? e.date),
    mode: e.mode,
    location: e.location,
    organiser: e.organizer,
    organisationId: orgId,
    descriptionHtml: e.descriptionHtml ? cleanHtml(localiseLiveLinks(e.descriptionHtml, orgId), { headingLevel: 3, label: e.title }) : undefined,
    document: e.pdfUrl ? { title: e.title, href: localiseDocumentUrl(e.pdfUrl, "Events", e.title), date: isoDotted(e.startDate ?? e.date), type: "PDF" } : undefined,
  };
}

/* ── Its gallery ───────────────────────────────────────────────────────────── */

/** The body's photo albums, newest first (Media › Photos' albums, filtered). */
export function organisationAlbums(id: string): DbimAlbum[] {
  const code = orgCode(id);
  const mine = new Set(getGalleryItems().filter((g) => g.organisation?.toUpperCase() === code).map((g) => g.slug));
  return getDbimAlbums().filter((a) => mine.has(a.slug));
}

/* ── Its officers, and one officer ─────────────────────────────────────────── */

export function organisationDirectory(id: string): DbimTeamOffice[] {
  const code = orgCode(id);
  const name = organisationName(id);
  return code && name ? teamOffices(code, name) : [];
}

export interface DbimOfficialProfile {
  name: string;
  designation?: string;
  organisationId?: string;
  organisation?: string;
  tenure?: string;
  photo?: string;
  phones: { text: string; tel?: string }[];
  faxes: string[];
  emails: string[];
  intercom?: string;
  address?: string;
}

export function officialProfile(slug: string): DbimOfficialProfile | undefined {
  const o = getOfficial(slug);
  if (!o) return undefined;
  const orgId = ORGANISATIONS.find((x) => orgCode(x.id) === o.organisation?.toUpperCase())?.id;
  // The photograph the body's own page publishes for this officer, where it links here.
  const person = orgId
    ? getOrganisationProfile(orgId)
        ?.sections.flatMap((s) => s.blocks)
        .flatMap((b) => (b.kind === "people" ? b.items : []))
        .find((p) => p.profile?.replace(/\/$/, "").endsWith(`/official/${slug}`))
    : undefined;
  const phones = phoneGroups(o.phoneOffice);
  return {
    name: o.title.trim(),
    designation: o.designation?.trim(),
    organisationId: orgId,
    organisation: o.organisationName ?? (orgId ? organisationName(orgId) : undefined),
    tenure: o.tenure ?? person?.tenure,
    photo: o.imageUrl ?? person?.photo,
    phones: phones.filter((g) => g.kind !== "fax").flatMap((g) => g.numbers.map((n) => ({ text: n.text, tel: n.tel }))),
    faxes: phones.filter((g) => g.kind === "fax").flatMap((g) => g.numbers.map((n) => n.text)),
    emails: (o.email ?? "").split(/\s*,\s*/).filter((e) => e && !FREE_MAIL.test(e)),
    intercom: o.intercom?.trim() || undefined,
    address: o.address?.trim() || undefined,
  };
}
