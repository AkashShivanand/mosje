/**
 * The Ministry's internal divisions, and the links each one publishes.
 *
 * This replaces CATEGORIZED_LINKS, which lived inside ImportantLinks.tsx and was an
 * incomplete transcription of the Department's own rail: nine entries had been dropped,
 * six of them from Grants-in-Aid alone (the live group carries eleven; ours carried five).
 * Five of the nine pointed at pages this estate had already built and then left
 * unreachable — the FAQs, the penalties and cessation pages, and two Social Defence pages.
 *
 * A DIVISION IS NOT AN ORGANISATION. Divisions are internal parts of the Ministry;
 * organisations.ts holds the attached bodies. They were conflated before, and the tell was
 * `SCW`: /website/scw-directory is the Scheduled Caste Welfare division's telephone
 * directory, but `SCW` in the organisation registry is the Senior Citizens Welfare portal.
 * Two concepts, one abbreviation. They are separated here, and the directory hangs off the
 * division where it belongs.
 *
 * `href` starting with "http" is rendered as an external link automatically — the rail adds
 * target, rel and an open_in_new affordance without being told. Four entries point at
 * dosje.gov.in because the content is statutory and volatile; see ImportantLinks.tsx.
 */

export interface DivisionLink {
  label: string;
  href: string;
}

export interface Division {
  id: string;
  /** Group heading, as the Department words it. */
  name: string;
  /** "About the Division" page, where one exists. */
  aboutHref?: string;
  /** Telephone directory, where one exists. */
  directoryHref?: string;
  links: DivisionLink[];
}

export const DIVISIONS: Division[] = [
  {
    id: "scheduled-caste-welfare",
    name: "Scheduled Caste Welfare",
    aboutHref: "/website/about-the-division",
    directoryHref: "/website/scw-directory",
    links: [
      { label: "About the Division: Scheduled Caste Welfare", href: "/website/about-the-division" },
      { label: "List of Scheduled Castes", href: "https://www.dosje.gov.in/list-of-scheduled-castes/" },
      { label: "Policies / Acts / Rules / Circular", href: "/website/policies-acts-rules-circular" },
    ],
  },
  {
    id: "welfare-of-other-backward-classes",
    name: "Welfare Of The Other Backward Classes",
    aboutHref: "/website/about-the-division-welfare-of-the-other-backward-classes",
    links: [
      { label: "About the Division: Welfare Of The Other Backward Classes", href: "/website/about-the-division-welfare-of-the-other-backward-classes" },
      { label: "Policies / Acts / Rules / Codes / Circular", href: "/website/policies-acts-rules-codes-circular" },
      { label: "Welfare Of The Other Backward Classes FAQs", href: "/website/welfare-of-the-other-backward-classes" },
    ],
  },
  {
    id: "grants-in-aid-to-ngos",
    name: "Grants-In-Aid To NGOs",
    links: [
      { label: "Prioritization Guidelines for funding Projects by Voluntary Organisations", href: "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations" },
      { label: "Procedure for processing Grant-in-Aid Cases for Voluntary Organisations", href: "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations" },
      { label: "Inspection and Monitoring Procedure", href: "/website/inspection-and-monitoring-procedure" },
      { label: "Penalties in case of Misutilisation of Grants", href: "/website/penalties-in-case-of-misutilisation-of-grants" },
      { label: "Cessation of Voluntary Organisation Activities", href: "/website/cessation-of-voluntary-organisation-activities" },
      { label: "Guidelines for Assisting NGOs / Voluntary Organisations", href: "/website/guidelines-for-assisting-ngos-voluntary-organisations" },
      { label: "Minutes of Screening Committees", href: "/website/minutes-of-screening-committees" },
      { label: "Grants Suspended List / Blacklisted NGOs", href: "/website/grants-suspended-list-blacklisted-ngos" },
      { label: "List of De-Blacklisted NGOs", href: "/website/list-of-de-blacklisted-ngos" },
      { label: "Grants-In-Aid To NGOs: FAQs", href: "/website/grants-in-aid-to-ngos-faqs" },
      { label: "Online Portal for Grant in Aid Schemes (e-Anudaan)", href: "https://grants-msje.gov.in/ngo-login" },
    ],
  },
  {
    id: "budget-and-account",
    name: "Budget And Account",
    links: [
      { label: "Detailed Demand For Grant", href: "https://www.dosje.gov.in/detailed-demand-for-grant/" },
      { label: "Contact Person", href: "/website/contact-person" },
    ],
  },
  {
    id: "social-defence",
    name: "Social Defence",
    aboutHref: "/website/about-the-division-social-defence",
    links: [
      { label: "Rashtriya Vayoshri Yojana", href: "https://alimco.in/" },
      { label: "About the Division: Social Defence", href: "/website/about-the-division-social-defence" },
      { label: "Drug Division", href: "/website/drug-division" },
      { label: "Organisation under Division: Social Defence", href: "/website/organisation-under-division-social-division" },
      { label: "Policies / Acts / Rules / Codes / Circular: Social Defence", href: "/website/policies-acts-rules-codes-circular-social-defence" },
      { label: "Social Defence FAQs", href: "/website/social-defence-faqs" },
    ],
  },
  {
    id: "public-grievance",
    name: "Public Grievance",
    links: [
      { label: "Public Grievance Redressal Mechanism (CPGRAMS)", href: "https://pgportal.gov.in/" },
    ],
  },
  {
    id: "statistics-division",
    name: "Statistics Division",
    aboutHref: "/website/about-the-division-statistics-division",
    links: [
      { label: "SECC 2011", href: "https://secc.dord.gov.in/" },
      { label: "About the Division: Statistics Division", href: "/website/about-the-division-statistics-division" },
      { label: "List of Research Evaluation Studies", href: "/website/list-of-research-evaluation-studies" },
      { label: "Handbook on Social Welfare Statistics", href: "https://www.dosje.gov.in/handbook-on-social-welfare-statistics/" },
    ],
  },
  {
    id: "official-language",
    name: "Official Language",
    links: [
      { label: "Official Language: Background", href: "/website/official-language-background" },
      { label: "Official Language Act", href: "/website/official-language-act" },
      { label: "Activities of the Ministry: Official Language", href: "/website/activities-of-the-ministry-official-language" },
    ],
  },
  {
    id: "parliamentary-matters",
    name: "Parliamentary Matters",
    links: [
      { label: "Assurances", href: "/website/assurances" },
      { label: "Special Mention / Matters Raised Under Rule 377", href: "https://www.dosje.gov.in/special-mention-matters-raised-under-377/" },
    ],
  },
  {
    id: "plan-division",
    name: "Plan Division",
    aboutHref: "/website/about-the-division-2",
    links: [
      { label: "About the Division: Plan Division", href: "/website/about-the-division-2" },
    ],
  },
];

export function getDivision(id: string): Division | undefined {
  return DIVISIONS.find((d) => d.id === id);
}

/** Divisions holding a telephone directory. */
export const DIVISIONS_WITH_DIRECTORY = DIVISIONS.filter((d) => d.directoryHref);
