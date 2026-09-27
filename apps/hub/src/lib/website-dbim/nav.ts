/**
 * The DBIM design's information architecture.
 *
 * SOURCE: the DBIM reference build the review team named as the target on
 * 25 Sep 2026 — master-socialjustice.digifootprint.gov.in — captured the same day
 * (docs/research/dbim-reference/). The TOP level is fixed by DBIM and was ruled
 * non-negotiable on that call: Home, Ministry, Offerings, Documents, Media,
 * Connect. The second level is the reference's, and DBIM allows a department to
 * add to it; nothing has been added yet.
 *
 * Every href is a `/website` address. The proxy serves it from `app/website-dbim`
 * while the demo rail's Website tab says "DBIM" (lib/website-design/constants.ts),
 * so an address copied from this design is the address a citizen would see.
 */

export const DBIM_BASE = "/website";

/** A `/website` address for a path inside the DBIM tree ("/" is the home page). */
export function dbimHref(path: string): string {
  if (path === "/" || path === "") return DBIM_BASE;
  return DBIM_BASE + (path.startsWith("/") ? path : `/${path}`);
}

export interface DbimLink {
  label: string;
  /** Path inside the DBIM tree, e.g. "/ministry/our-team". Resolve with `dbimHref`. */
  path: string;
}

export interface DbimMenu extends DbimLink {
  /** Second-level entries, in the order the dropdown and the page sub-tabs show them. */
  children: DbimLink[];
  /** The inner-page banner photograph for every page under this entry. */
  hero: string;
}

const HERO = "/website/dbim/heroes";

export const DBIM_MENU: DbimMenu[] = [
  {
    label: "Ministry",
    path: "/ministry",
    hero: `${HERO}/ministry.jpg`,
    children: [
      { label: "About Us", path: "/ministry" },
      { label: "Our Team", path: "/ministry/our-team" },
      { label: "Our Division", path: "/ministry/our-division" },
      { label: "Our Organisation", path: "/ministry/our-organisation" },
      { label: "Our Performance", path: "/ministry/our-performance" },
      { label: "Directory", path: "/ministry/directory" },
    ],
  },
  {
    label: "Offerings",
    path: "/offerings",
    hero: `${HERO}/offerings.jpg`,
    children: [
      { label: "Schemes and Services", path: "/offerings" },
      { label: "Vacancies", path: "/offerings/vacancies" },
      { label: "Tenders", path: "/offerings/tenders" },
    ],
  },
  {
    label: "Documents",
    path: "/documents",
    hero: `${HERO}/documents.jpg`,
    children: [
      { label: "Reports", path: "/documents" },
      { label: "Orders and Notices", path: "/documents/orders-and-notices" },
      { label: "Publications", path: "/documents/publications" },
    ],
  },
  {
    label: "Media",
    path: "/media",
    hero: `${HERO}/default.png`,
    children: [
      { label: "Photos", path: "/media" },
      { label: "Videos", path: "/media/videos" },
    ],
  },
  {
    label: "Connect",
    path: "/connect",
    hero: `${HERO}/connect.jpg`,
    children: [
      { label: "Contact Us", path: "/connect" },
      { label: "Directory", path: "/connect/directory" },
      { label: "RTI", path: "/connect/rti" },
      { label: "Grievance Redressal", path: "/connect/grievance-redressal" },
      { label: "Parliament Questions", path: "/connect/parliament-questions" },
      { label: "Events", path: "/connect/events" },
    ],
  },
];

/** The footer's "Useful Links", in the reference's order. */
export const DBIM_FOOTER_LINKS: DbimLink[] = [
  { label: "Archives", path: "/archives" },
  { label: "Website Policies", path: "/policies" },
  { label: "Related Links", path: "/related-links" },
  { label: "Sitemap", path: "/sitemap" },
  { label: "Help", path: "/help" },
];

/** The policies page's own sub-tabs (reference: Terms of Use, Privacy Policy, Hyperlink Policy). */
export const DBIM_POLICY_TABS: DbimLink[] = [
  { label: "Terms of Use", path: "/policies" },
  { label: "Privacy Policy", path: "/policies/privacy-policy" },
  { label: "Hyperlink Policy", path: "/policies/hyperlink-policy" },
  { label: "Copyright Policy", path: "/policies/copyright-policy" },
  { label: "Accessibility Statement", path: "/policies/accessibility-statement" },
];

/** Banner photographs for pages that sit outside the six menus. */
export const DBIM_HEROES = {
  default: `${HERO}/default.png`,
  help: `${HERO}/help.jpg`,
  policies: `${HERO}/policies.jpg`,
  relatedLinks: `${HERO}/related-links.jpg`,
} as const;

/** The menu entry a path belongs to, for the active state and the page banner. */
export function dbimMenuFor(path: string): DbimMenu | undefined {
  return DBIM_MENU.find((m) => path === m.path || path.startsWith(m.path + "/"));
}
