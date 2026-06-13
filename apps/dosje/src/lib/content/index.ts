import type { SectionRecord, FileRecord } from "@/types/content";
import organisationData from "@/content/organisation.json";
import schemesData from "@/content/schemes.json";
import tendersData from "@/content/tenders.json";
import vacanciesData from "@/content/vacancies.json";
import manifest from "@/content/manifest.json";

/**
 * App basePath — must stay in sync with `basePath` in next.config.ts.
 * Ingested content contains raw `<img src="/content/…">` tags. Next.js only
 * auto-prefixes the basePath for next/image and <Link>, NOT for raw HTML
 * rendered via dangerouslySetInnerHTML, so we prefix those asset URLs here.
 */
const BASE_PATH = "/website";

/** Prefix the app basePath onto ingested `/content/…` asset URLs in raw HTML. */
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

export function getOrganisations(): SectionRecord[] {
  return organisations;
}

export function getOrganisation(slug: string): SectionRecord | undefined {
  return organisations.find((o) => o.slug === slug);
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
