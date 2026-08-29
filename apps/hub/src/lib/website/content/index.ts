import type { SectionRecord, FileRecord } from "@/types/website/content";
import organisationData from "@/content/website/organisation.json";
import schemesData from "@/content/website/schemes.json";
import tendersData from "@/content/website/tenders.json";
import vacanciesData from "@/content/website/vacancies.json";
import documentsData from "@/content/website/documents.json";
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
  return html.replaceAll('src="/content/', `src="${BASE_PATH}/content/`);
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

const tenders = tendersData as FileRecord[];

export function getTenders(): FileRecord[] {
  return tenders;
}

const vacancies = vacanciesData as FileRecord[];

export function getVacancies(): FileRecord[] {
  return vacancies;
}

const documents = documentsData as FileRecord[];

export function getDocuments(): FileRecord[] {
  return documents;
}

export function getDocumentsByType(category: string): FileRecord[] {
  return documents.filter((d) => d.category === category);
}
