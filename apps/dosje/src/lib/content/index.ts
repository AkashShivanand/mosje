import type { SectionRecord } from "@/types/content";
import organisationData from "@/content/organisation.json";

const organisations = organisationData as SectionRecord[];

export function getOrganisations(): SectionRecord[] {
  return organisations;
}

export function getOrganisation(slug: string): SectionRecord | undefined {
  return organisations.find((o) => o.slug === slug);
}
