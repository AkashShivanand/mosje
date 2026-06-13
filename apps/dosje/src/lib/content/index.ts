import type { SectionRecord } from "@/types/content";
import organisationData from "@/content/organisation.json";
import schemesData from "@/content/schemes.json";

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
