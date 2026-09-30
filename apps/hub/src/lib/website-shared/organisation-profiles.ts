/**
 * ORGANISATION PROFILES — each body's own page on the live website, as one
 * dated record every design can read. Rule: .claude/rules/website-shared-content.md.
 *
 * SOURCE: https://www.dosje.gov.in/organisation/<id>/, read on
 * ORGANISATION_PROFILES_AS_ON by `scripts/build-organisation-profiles.mjs`, which
 * writes `organisation-profiles.json` beside this file. Re-run it to refresh;
 * never edit the JSON by hand — the next run replaces it.
 *
 * The live pages carry far more than the older scrape (`content/website/
 * organisation.json`): headline figures, the leadership with photographs, scheme
 * cards, dated reports, tabbed updates, a gallery, social accounts and a contact
 * block. Every word is the Department's, whitespace collapsed. One body has no
 * page on the live site (Babu Jagjivan Ram National Foundation) and so has no
 * profile; the designs fall back to the scrape for it.
 */
import data from "./organisation-profiles.json";

export interface OrgProfileDocument {
  title: string;
  /** As published: "19 Jan 2026". */
  date?: string;
  /** The register it sits in: "Annual Reports", "Notice", "Resources". */
  type?: string;
  /** "PDF". */
  format?: string;
  /** "8.6 MB". */
  size?: string;
  href?: string;
}

export interface OrgProfileEvent {
  title: string;
  date?: string;
  href?: string;
}

export interface OrgProfileTab {
  label: string;
  viewAll?: string;
  documents: OrgProfileDocument[];
  events: OrgProfileEvent[];
  news: { title: string; href?: string }[];
  /** The live page's own words for an empty tab: "No vacancies found." */
  empty?: string;
}

export type OrgProfileBlock =
  | { kind: "prose"; html: string }
  | { kind: "people"; items: { name: string; designation: string; photo?: string; profile?: string; tenure?: string }[] }
  | { kind: "cards"; items: { category?: string; title: string; description?: string; href?: string }[] }
  | { kind: "documents"; items: OrgProfileDocument[] }
  | { kind: "events"; items: OrgProfileEvent[] }
  | { kind: "links"; items: { label: string; href?: string }[] }
  | { kind: "tiles"; items: { title: string; image?: string; href?: string }[] }
  | { kind: "gallery"; items: { src?: string; full?: string; caption: string }[] }
  | { kind: "social"; items: { platform: string; handle?: string; href?: string }[] }
  | { kind: "contact"; items: { label: string; values: string[] }[] }
  | { kind: "tabs"; items: OrgProfileTab[] };

export interface OrgProfileSection {
  /** The live page's anchor, where it has one. */
  id?: string;
  heading: string;
  /** Markup under the heading, before the section's cards or lists. */
  intro?: string;
  /** The section's own "Know More" / "View All" / "Visit Gallery" link. */
  more?: { label: string; href?: string };
  blocks: OrgProfileBlock[];
}

export interface OrganisationProfile {
  source: string;
  title: string;
  /** The line under the name: "(An Autonomous Body under …) · Government of India". */
  subtitle?: string;
  lead?: string;
  logo?: string;
  banner?: { src?: string; alt: string };
  /** Buttons in the banner: NCSC's e-Grievance Management Portal. */
  actions: { label: string; href?: string }[];
  /** The figures strip: "1992 · Established". */
  facts: { value: string; label: string }[];
  /** The page index's links OFF the page — Awards, RTI, FAQs — under their group. */
  index: { label: string; links: { label: string; href: string }[] }[];
  sections: OrgProfileSection[];
}

/** A body's own page the older scrape lacks, mirrored as its title and text. */
export interface OrganisationPage {
  source: string;
  title: string;
  html: string;
}

const snapshot = data as unknown as {
  asOn: string;
  profiles: Record<string, OrganisationProfile>;
  pages?: Record<string, OrganisationPage>;
};

/** The date the live pages were read, YYYY-MM-DD. */
export const ORGANISATION_PROFILES_AS_ON = snapshot.asOn;

export function getOrganisationProfile(id: string): OrganisationProfile | undefined {
  return snapshot.profiles[id];
}

/** `dr-ambedkar-foundation/ambedkar-national-memorial` → its mirrored page, where the scrape lacks it. */
export function getOrganisationPage(slug: string): OrganisationPage | undefined {
  return snapshot.pages?.[slug];
}
