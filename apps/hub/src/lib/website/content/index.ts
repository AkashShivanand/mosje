import { localiseDocumentLinks, sampleDocumentFor } from "../sample-documents";
import type {
  SectionRecord, FileRecord, DocumentRecord, EventRecord, GalleryRecord,
  OfficialRecord, CpioRecord, BookingRecord, UpdateRecord, SewerDeathCaseRecord,
} from "@/types/website/content";
import organisationData from "@/content/website/organisation.json";
import schemesData from "@/content/website/schemes.json";
import tendersData from "@/content/website/tenders.json";
import vacanciesData from "@/content/website/vacancies.json";
import documentsData from "@/content/website/documents.json";
import obcData from "@/content/website/documents-central-list-of-obcs.json";
import schemeDocumentsData from "@/content/website/scheme-documents.json";
import suoMotoData from "@/content/website/suo-moto-disclosure.json";
import eventsData from "@/content/website/events.json";
import galleryData from "@/content/website/gallery.json";
import officialData from "@/content/website/official.json";
import cpioData from "@/content/website/cpio.json";
import bookingData from "@/content/website/booking.json";
import updatesData from "@/content/website/updates.json";
import sewerCasesData from "@/content/website/sewer-death-cases.json";
import manifest from "@/content/website/manifest.json";

/**
 * Public-asset prefix for the website's own files, which live at
 * apps/hub/public/website/… and therefore serve under /website/….
 * Ingested content contains raw `<img src="/content/…">` tags; those are plain
 * HTML rendered via dangerouslySetInnerHTML, so nothing rewrites them for us and
 * we prefix them here. (This was the app's basePath before it mounted natively in
 * the hub — the value is unchanged, but it is now a literal folder path.)
 */
const BASE_PATH = "/website";

/** Prefix `/website` onto ingested `/content/…` asset URLs in raw HTML. */
export function withAssetBasePath(html: string): string {
  /*
   * TWO REWRITES, AND THE SECOND IS THE REASON THIS FUNCTION IS ON EVERY
   * INGESTED SECTION.
   *
   * Images get the base path, as they always did. Document links get a LOCAL
   * SAMPLE: the ingest's prose carries 97 links to `durwo6bhtjtqt.cloudfront.net`
   * across `organisation.json` and `schemes.json`, so a reader following a link
   * inside a paragraph left the prototype exactly as they did from the document
   * shelves. Pages are untouched — see `sample-documents.ts` for what counts as a
   * file and what counts as a place.
   */
  return localiseDocumentLinks(
    html.replaceAll('src="/content/', `src="${BASE_PATH}/content/`),
  );
}

/** Human date of the last content ingest, e.g. "13 Jun 2026" (for "Last updated"). */
export function getContentSyncedDate(): string {
  const iso = (manifest as { generatedAt?: string }).generatedAt;
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const organisations = organisationData as SectionRecord[];
const orgMap = new Map<string, SectionRecord>(organisations.map((o) => [o.slug, o]));

export function getOrganisations(): SectionRecord[] {
  return organisations;
}

export function getOrganisation(slug: string): SectionRecord | undefined {
  return orgMap.get(slug);
}

const schemes = schemesData as SectionRecord[];

export function getSchemes(): SectionRecord[] {
  return schemes;
}

export function getScheme(slug: string): SectionRecord | undefined {
  return schemes.find((s) => s.slug === slug);
}

/*
 * EVERY INGESTED FILE RECORD CARRIES A LOCAL `fileUrl`.
 *
 * `documents.json`, `tenders.json` and `vacancies.json` hold a `sourceUrl`
 * pointing at a dosje.gov.in PAGE and, for most rows, no `fileUrl` at all — so
 * every card rendered by `DocumentLibrary`, the notice ticker and the document
 * catalogue offered "Download PDF" and delivered a web page on another site.
 *
 * The sample is chosen from the row's own category and title, so a circular
 * opens a memorandum and a newsletter opens a newsletter. `sourceUrl` is left
 * exactly as it is: it is where the document actually lives, and a consumer that
 * wants the real thing still has it.
 *
 * Mapped once at module scope rather than per call — these three lists are read
 * on nearly every website route, and re-deriving 2,000 hrefs per render to
 * produce the same eight strings would be work for nothing.
 */
const withLocalFile = (rows: FileRecord[]): FileRecord[] =>
  rows.map((d) => ({ ...d, fileUrl: sampleDocumentFor(d.category, d.title) }));

const tenders = withLocalFile(tendersData as FileRecord[]);

export function getTenders(): FileRecord[] {
  return tenders;
}

const vacancies = withLocalFile(vacanciesData as FileRecord[]);

export function getVacancies(): FileRecord[] {
  return vacancies;
}

const documents = withLocalFile(documentsData as FileRecord[]);

export function getDocuments(): FileRecord[] {
  return documents;
}

export function getDocumentsByType(category: string): FileRecord[] {
  return documents.filter((d) => d.category === category);
}

/*
 * EVERY OTHER RECORD COLLECTION ON dosje.gov.in.
 *
 * These are the full ingested sets, with the site's own metadata: file URL, size
 * and type, publish window, event venue and gallery images, an official's contact
 * card. Every file and image URL points at the LIVE site — nothing is mirrored
 * locally yet, so a consumer that needs a local asset must mirror it first.
 *
 * Nothing renders them yet; they exist so a page can be built against real data.
 */
const centralListOfObcs = obcData as DocumentRecord[];

/** The Central List of OBCs — 2,667 state-wise entries, kept in its own file. */
export function getCentralListOfObcs(): DocumentRecord[] {
  return centralListOfObcs;
}

/** Every document, the library's own rows plus the Central List of OBCs. */
export function getAllDocuments(): DocumentRecord[] {
  return [...(documentsData as DocumentRecord[]), ...centralListOfObcs];
}

const schemeDocuments = schemeDocumentsData as DocumentRecord[];

/** Documents attached to a scheme (each carries `scheme` / `schemeUrl`). */
export function getSchemeDocuments(): DocumentRecord[] {
  return schemeDocuments;
}

const suoMotoDisclosures = suoMotoData as DocumentRecord[];

/** RTI section 4(1)(b) suo-moto disclosures. */
export function getSuoMotoDisclosures(): DocumentRecord[] {
  return suoMotoDisclosures;
}

const events = eventsData as EventRecord[];

export function getEvents(): EventRecord[] {
  return events;
}

export function getEvent(slug: string): EventRecord | undefined {
  return events.find((e) => e.slug === slug);
}

const gallery = galleryData as GalleryRecord[];

export function getGalleryItems(): GalleryRecord[] {
  return gallery;
}

/** Gallery items of one type: "Photos", "Videos" or "News". */
export function getGalleryItemsByType(type: string): GalleryRecord[] {
  return gallery.filter((g) => g.type === type);
}

export function getGalleryItem(slug: string): GalleryRecord | undefined {
  return gallery.find((g) => g.slug === slug);
}

const officials = officialData as OfficialRecord[];

export function getOfficials(): OfficialRecord[] {
  return officials;
}

/** Officials of one organisation, by its abbreviation, e.g. "NCSK". */
export function getOfficialsByOrganisation(organisation: string): OfficialRecord[] {
  return officials.filter((o) => o.organisation === organisation);
}

export function getOfficial(slug: string): OfficialRecord | undefined {
  return officials.find((o) => o.slug === slug);
}

const cpios = cpioData as CpioRecord[];

/** Central Public Information Officers and appellate authorities (RTI). */
export function getCpios(): CpioRecord[] {
  return cpios;
}

const bookings = bookingData as BookingRecord[];

/** Bookable DAIC venues, with their rate cards. */
export function getBookableVenues(): BookingRecord[] {
  return bookings;
}

const updates = updatesData as UpdateRecord[];

export function getUpdates(): UpdateRecord[] {
  return updates;
}

/** Updates with a given component status, e.g. "Active" or "Archived". */
export function getUpdatesByStatus(status: string): UpdateRecord[] {
  return updates.filter((u) => u.status === status);
}

const sewerDeathCases = sewerCasesData as SewerDeathCaseRecord[];

/** Sewer and septic-tank death cases recorded by the NCSK. */
export function getSewerDeathCases(): SewerDeathCaseRecord[] {
  return sewerDeathCases;
}

/** Sewer-death cases in one state, as the register names it. */
export function getSewerDeathCasesByState(state: string): SewerDeathCaseRecord[] {
  return sewerDeathCases.filter((c) => c.state === state);
}
