/**
 * The Department's divisions, as the DBIM design's Important Links groups them: where
 * each division's link goes. Kept apart from `./ministry.ts`, which reads server-only
 * content, because `./utility.ts` imports it and `./utility.ts` reaches the browser.
 */
import { DIVISIONS } from "@/data/website";
import { DBIM_REGISTERS, registerPath } from "./division-registers";

/**
 * WHERE A DIVISION'S LINK GOES IN THE DBIM DESIGN. The divisions live in Important
 * Links, each as a group of its own links — socialjustice.gov.in's and dosje.gov.in's
 * own arrangement (read 9 Oct 2026). This design has no division pages: Ministry › Our
 * Division was removed on 9 Oct 2026, as neither live site has such a section.
 *
 * `DIVISIONS[].links` point at pages of the 2026 design, which this design does not
 * have, and a DBIM page never links to a page that does not exist in it. Each internal
 * link is mapped here, in this order of preference: an existing DBIM page carrying the
 * same content; a DBIM register page rendering the same data (`./division-registers.ts`);
 * otherwise the Department's own page on dosje.gov.in, which carries the content as text
 * this design cannot read (every address checked for a 200 on 9 Oct 2026; two keep the
 * live site's own spelling, "vuluntary" and "misutilization"). External links pass
 * through untouched. A link missing from this map is dropped, so a link added to the
 * shared data later cannot 404 here — add its row.
 */
type LinkTarget = { path: string } | { href: string };

const LIVE = (slug: string): LinkTarget => ({ href: `https://dosje.gov.in/${slug}/` });

export const DBIM_DIVISION_LINK_MAP: Record<string, LinkTarget> = {
  // Scheduled Caste Welfare
  "/website/about-the-division": LIVE("about-the-division"),
  "/website/policies-acts-rules-circular": { path: "/documents/publications/acts-rules" },
  // Welfare of the Other Backward Classes
  "/website/about-the-division-welfare-of-the-other-backward-classes": LIVE("about-the-division-welfare-of-the-other-backward-classes"),
  "/website/policies-acts-rules-codes-circular": { path: "/documents/publications/acts-rules" },
  "/website/welfare-of-the-other-backward-classes": LIVE("welfare-of-the-other-backward-classes"),
  // Grants-in-Aid to NGOs
  "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations": LIVE("prioritization-guidelines-for-funding-projects-by-vuluntary-organisations"),
  "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations": LIVE("procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations"),
  "/website/inspection-and-monitoring-procedure": LIVE("inspection-and-monitoring-procedure"),
  "/website/penalties-in-case-of-misutilisation-of-grants": LIVE("penalties-in-case-of-misutilization-of-grants"),
  "/website/cessation-of-voluntary-organisation-activities": LIVE("cessation-of-voluntary-organisation-activities"),
  "/website/guidelines-for-assisting-ngos-voluntary-organisations": LIVE("guidelines-for-assisting-ngos-voluntary-organisations"),
  "/website/grants-in-aid-to-ngos-faqs": LIVE("grants-in-aid-to-ngos-faqs"),
  // Budget and Account — the accounts office's contacts are in the Department's directory (PR.CCA).
  "/website/contact-person": { path: "/ministry/directory" },
  // Social Defence
  "/website/about-the-division-social-defence": LIVE("about-the-division-social-defence"),
  "/website/drug-division": LIVE("drug-division"),
  "/website/organisation-under-division-social-division": { path: "/ministry/our-organisation/national-institute-of-social-defence" },
  "/website/policies-acts-rules-codes-circular-social-defence": { path: "/documents/publications/acts-rules" },
  "/website/social-defence-faqs": LIVE("social-defence-faqs"),
  // Statistics Division
  "/website/about-the-division-statistics-division": LIVE("about-the-division-statistics-division"),
  "/website/list-of-research-evaluation-studies": LIVE("list-of-research-evaluation-studies"),
  // Official Language
  "/website/official-language-background": LIVE("official-language-background"),
  "/website/official-language-act": LIVE("official-language-act"),
  "/website/activities-of-the-ministry-official-language": LIVE("activities-of-the-ministry-official-language"),
  // Parliamentary Matters
  "/website/assurances": LIVE("assurances"),
  // Plan Division
  "/website/about-the-division-2": LIVE("about-the-division-2"),
  // The registers the estate holds as data: a DBIM page each.
  ...Object.fromEntries(DBIM_REGISTERS.map((r) => [r.from, { path: registerPath(r) }])),
};

/** One link in a division's group: a DBIM page (`path`) or another website (`href`). */
export interface DbimDivisionLink {
  label: string;
  path?: string;
  href?: string;
}

function divisionLink(l: { label: string; href: string }): DbimDivisionLink[] {
  if (/^https?:/.test(l.href)) return [{ label: l.label, href: l.href }];
  const t = DBIM_DIVISION_LINK_MAP[l.href];
  return t ? [{ label: l.label, ...t }] : [];
}

/** A division and its links, in the shared data's order. */
export function dbimDivisionLinks(id: string): DbimDivisionLink[] {
  return DIVISIONS.find((d) => d.id === id)?.links.flatMap(divisionLink) ?? [];
}
