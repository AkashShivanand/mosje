/**
 * The estate's single registry of organisations attached to the Ministry.
 *
 * Before this file the same 17 bodies were enumerated by hand in Organisations.tsx,
 * LogoStrip.tsx, samavesh-citizen-portals and whos-who — four lists that had already
 * drifted: NCBC's logo was org-logos/ncbc.png in one and nsfdc-1.png in another, names
 * were restated inside `alt` strings, and hrefs were live in one list and "#" in the next.
 * Anything that names an organisation now reads it from here.
 *
 * Two modelling notes, both of which were defects before:
 *
 * 1. `category: "all"` was a FILTER SENTINEL masquerading as a category. Six scheme
 *    portals carried it, and because the filter compares `org.category === active`, none
 *    of them could ever be reached by a category tab. They are `"schemes"` now, which is
 *    what they are, and the tab list is derived from this array — so the counts cannot go
 *    stale the way the hand-written ones did (foundations said 3; there are 4).
 *
 * 2. `SCW` named two different things. Here it is Senior Citizens Welfare, the scheme
 *    portal. The Scheduled Caste Welfare DIVISION also abbreviates to SCW and owns
 *    /website/scw-directory — that lives in divisions.ts, and deliberately does NOT hang
 *    off this organisation. One name, one concept.
 */

export type OrganisationCategory =
  | "commissions"
  | "corporations"
  | "foundations"
  | "training"
  | "schemes";

export interface Organisation {
  /** Stable key — the slug of the organisation's profile page. */
  id: string;
  abbr: string;
  name: string;
  category: OrganisationCategory;
  /** Narrative profile, rendered from ingested content. */
  profileHref: string;
  /** Telephone directory, where one exists. Absent is meaningful: there is no page. */
  directoryHref?: string;
  logoSrc: string;
  /**
   * Horizontal wordmark for the homepage logo strip — a different asset from `logoSrc`,
   * which is the square icon the organisation cards use. Only the nine bodies that appear
   * in the strip have one.
   */
  wordmarkSrc?: string;
  /** The organisation's own live portal, where it runs one. */
  externalUrl?: string;
}

export const ORGANISATIONS: Organisation[] = [
  {
    id: "national-commission-for-scheduled-castes",
    abbr: "NCSC",
    name: "National Commission for Scheduled Castes",
    category: "commissions",
    profileHref: "/website/organisation/national-commission-for-scheduled-castes",
    logoSrc: "/website/images/org-logos/ncsc.png",
  },
  {
    id: "national-commission-for-safai-karamcharis",
    abbr: "NCSK",
    name: "National Commission for Safai Karamcharis",
    category: "commissions",
    profileHref: "/website/organisation/national-commission-for-safai-karamcharis",
    directoryHref: "/website/ncsk-directory",
    logoSrc: "/website/images/org-logos/ncsk.png",
  },
  {
    id: "national-commission-for-backward-classes-ncbc",
    abbr: "NCBC",
    name: "National Commission for Backward Classes",
    category: "commissions",
    profileHref: "/website/organisation/national-commission-for-backward-classes-ncbc",
    directoryHref: "/website/ncbc-directory",
    logoSrc: "/website/images/org-logos/ncbc.png",
  },
  {
    id: "dr-ambedkar-foundation",
    abbr: "DAF",
    name: "Dr. Ambedkar Foundation",
    category: "foundations",
    profileHref: "/website/organisation/dr-ambedkar-foundation",
    directoryHref: "/website/daf-directory",
    logoSrc: "/website/images/org-logos/daf.png",
  },
  {
    id: "dr-ambedkar-international-centre",
    abbr: "DAIC",
    name: "Dr. Ambedkar International Centre",
    category: "foundations",
    profileHref: "/website/organisation/dr-ambedkar-international-centre",
    directoryHref: "/website/daic-directory",
    logoSrc: "/website/images/org-logos/daic.png",
    wordmarkSrc: "/website/images/DAIC-LOGO-.png",
  },
  {
    id: "babu-jagjivan-ram-national-foundation-jrf",
    abbr: "BJRNF",
    name: "Babu Jagjivan Ram National Foundation",
    category: "foundations",
    profileHref: "/website/organisation/babu-jagjivan-ram-national-foundation-jrf",
    directoryHref: "/website/bjrnf-directory",
    logoSrc: "/website/images/org-logos/jrf.png",
  },
  {
    id: "national-scheduled-castes-finance-and-development-corporation",
    abbr: "NSFDC",
    name: "National Scheduled Castes Finance and Development Corporation",
    category: "corporations",
    profileHref: "/website/organisation/national-scheduled-castes-finance-and-development-corporation",
    directoryHref: "/website/nsfdc-directory",
    logoSrc: "/website/images/org-logos/nsfdc.png",
    wordmarkSrc: "/website/images/nsfdc-1.png",
  },
  {
    id: "national-safai-karamcharis-finance-development-corporation",
    abbr: "NSKFDC",
    name: "National Safai Karamcharis Finance and Development Corporation",
    category: "corporations",
    profileHref: "/website/organisation/national-safai-karamcharis-finance-development-corporation",
    directoryHref: "/website/nskfdc-directory",
    logoSrc: "/website/images/org-logos/nskfdc.png",
    wordmarkSrc: "/website/images/Logo-NSKFDC.png",
  },
  {
    id: "national-backward-classes-financeand-development-corporationnbcfdc",
    abbr: "NBCFDC",
    name: "National Backward Classes Finance and Development Corporation",
    category: "corporations",
    profileHref: "/website/organisation/national-backward-classes-financeand-development-corporationnbcfdc",
    directoryHref: "/website/nbcfdc-directory",
    logoSrc: "/website/images/org-logos/nbcfdc.png",
    wordmarkSrc: "/website/images/NBCFDC.png",
  },
  {
    id: "national-institute-of-social-defence",
    abbr: "NISD",
    name: "National Institute of Social Defence",
    category: "training",
    profileHref: "/website/organisation/national-institute-of-social-defence",
    directoryHref: "/website/nisd-directory",
    logoSrc: "/website/images/org-logos/nisd.png",
    wordmarkSrc: "/website/images/NISD-.png",
  },
  {
    id: "development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
    abbr: "DWBDNC",
    name: "Development and Welfare Board for De-notified, Nomadic, and Semi-Nomadic Communities",
    category: "foundations",
    profileHref: "/website/organisation/development-and-welfare-board-for-de-notified-nomadic-and-semi-nomadic",
    directoryHref: "/website/dwbdnc-directory",
    logoSrc: "/website/images/org-logos/dwbdnc.png",
  },
  {
    id: "senior-citizens-welfarescw",
    abbr: "SCW",
    name: "Senior Citizens Welfare",
    category: "schemes",
    profileHref: "/website/organisation/senior-citizens-welfarescw",
    logoSrc: "/website/images/org-logos/scw.png",
  },
  {
    id: "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
    abbr: "PM-AJAY",
    name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    category: "schemes",
    profileHref: "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay",
    directoryHref: "/website/pm-ajay-directory",
    logoSrc: "/website/images/org-logos/pm-ajay.png",
    wordmarkSrc: "/website/images/PM-AJAY-logo.png",
  },
  {
    id: "national-portal-for-transgender-persons",
    abbr: "SMILE",
    name: "National Portal for Transgender Persons",
    category: "schemes",
    profileHref: "/website/organisation/national-portal-for-transgender-persons",
    logoSrc: "/website/images/org-logos/smile.png",
    wordmarkSrc: "/website/images/Logo-Transgender-Portal-1.png",
  },
  {
    id: "national-overseas-scholarship",
    abbr: "NOS",
    name: "National Overseas Scholarship",
    category: "schemes",
    profileHref: "/website/organisation/national-overseas-scholarship",
    logoSrc: "/website/images/org-logos/nos.png",
    wordmarkSrc: "/website/images/NOS-Logo.png",
    externalUrl: "https://nosmsje.gov.in",
  },
  {
    id: "nasha-mukt-bharat-abhiyaan",
    abbr: "NMBA",
    name: "Nasha Mukt Bharat Abhiyaan",
    category: "schemes",
    profileHref: "/website/organisation/nasha-mukt-bharat-abhiyaan",
    logoSrc: "/website/images/org-logos/nmba.png",
    wordmarkSrc: "/website/images/NMBA-1.png",
  },
  {
    id: "national-helpline-against-atrocities",
    abbr: "NHAA",
    name: "National Helpline Against Atrocities",
    category: "schemes",
    /* SAMBAL, the National Helpline Against Atrocities. It has no record in
       `content/website/organisation.json`, so `/website/organisation/<id>`
       404s — the profile page it pointed at was never ingested. The helpline's
       own portal is the real destination. */
    profileHref: "/portals/nhapoa",
    logoSrc: "/website/images/National-Emblem-logo.svg",
  },
];

/** Organisations holding a telephone directory, in registry order. */
export const ORGANISATIONS_WITH_DIRECTORY = ORGANISATIONS.filter((o) => o.directoryHref);

export function getOrganisation(id: string): Organisation | undefined {
  return ORGANISATIONS.find((o) => o.id === id);
}

export function getOrganisationByAbbr(abbr: string): Organisation | undefined {
  return ORGANISATIONS.find((o) => o.abbr === abbr);
}

/** Category tabs with counts DERIVED from the registry, never hand-maintained. */
export const ORGANISATION_CATEGORY_LABELS: Record<OrganisationCategory, string> = {
  commissions: "Commissions",
  corporations: "Corporations",
  foundations: "Foundations & Autonomous Bodies",
  training: "Training & Capacity Building",
  schemes: "Schemes & Portals",
};

export function organisationCategoryTabs(): { key: OrganisationCategory | "all"; label: string; count: number }[] {
  const keys = Object.keys(ORGANISATION_CATEGORY_LABELS) as OrganisationCategory[];
  return [
    { key: "all", label: "All", count: ORGANISATIONS.length },
    ...keys.map((key) => ({
      key,
      label: ORGANISATION_CATEGORY_LABELS[key],
      count: ORGANISATIONS.filter((o) => o.category === key).length,
    })),
  ];
}
