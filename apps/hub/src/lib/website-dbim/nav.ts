/**
 * The DBIM design's information architecture.
 *
 * SOURCE: the DBIM reference build the review team named as the target on
 * 25 Sep 2026 — master-socialjustice.digifootprint.gov.in — captured the same day
 * (docs/research/dbim-reference/). The TOP level is fixed by DBIM and was ruled
 * non-negotiable on that call: Home, Ministry, Offerings, Documents, Media,
 * Connect. The second level is the reference's, and DBIM allows a department to
 * add to it. One addition so far: Ministry › Our Scheme Portals (28 Sep 2026).
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
}

export const DBIM_MENU: DbimMenu[] = [
  {
    label: "Ministry",
    path: "/ministry",
    children: [
      { label: "About Us", path: "/ministry" },
      { label: "Our Team", path: "/ministry/our-team" },
      // No "Our Division" (removed 9 Oct 2026): neither live site has the section; the
      // divisions are Important Links groups, as on socialjustice.gov.in and dosje.gov.in.
      { label: "Our Organisation", path: "/ministry/our-organisation" },
      // The Department's addition to DBIM's second level (28 Sep 2026): the scheme
      // portals, out of Our Organisation as every other design has them.
      { label: "Our Scheme Portals", path: "/ministry/our-scheme-portals" },
      { label: "Our Performance", path: "/ministry/our-performance" },
      { label: "Directory", path: "/ministry/directory" },
    ],
  },
  {
    label: "Offerings",
    path: "/offerings",
    children: [
      { label: "Schemes and Services", path: "/offerings" },
      { label: "Vacancies", path: "/offerings/vacancies" },
      { label: "Tenders", path: "/offerings/tenders" },
    ],
  },
  {
    label: "Documents",
    path: "/documents",
    children: [
      { label: "Reports", path: "/documents" },
      { label: "Orders and Notices", path: "/documents/orders-and-notices" },
      { label: "Publications", path: "/documents/publications" },
    ],
  },
  {
    label: "Media",
    path: "/media",
    children: [
      { label: "Photos", path: "/media" },
      { label: "Videos", path: "/media/videos" },
    ],
  },
  {
    label: "Connect",
    path: "/connect",
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

/**
 * The footer's "Useful Links", in the reference's order, then Feedback: DBIM 3.0 §5.6
 * says the footer "must contain" it (and Table 12 lists it), which the reference omits.
 */
export const DBIM_FOOTER_LINKS: DbimLink[] = [
  { label: "Archives", path: "/archives" },
  { label: "Website Policies", path: "/policies" },
  { label: "Related Links", path: "/related-links" },
  { label: "Sitemap", path: "/sitemap" },
  { label: "Help", path: "/help" },
  { label: "Feedback", path: "/feedback" },
];

/** The policies page's own sub-tabs (reference: Terms of Use, Privacy Policy, Hyperlink Policy). */
export const DBIM_POLICY_TABS: DbimLink[] = [
  { label: "Terms of Use", path: "/policies" },
  { label: "Privacy Policy", path: "/policies/privacy-policy" },
  { label: "Hyperlink Policy", path: "/policies/hyperlink-policy" },
  { label: "Copyright Policy", path: "/policies/copyright-policy" },
  { label: "Accessibility Statement", path: "/policies/accessibility-statement" },
];

/*
 * THE BANNER PHOTOGRAPH, PAGE BY PAGE (30 Sep 2026).
 *
 * A photograph stays only where it says something true about the page; everywhere else
 * the banner is the plain primary band. The instruction: "use the relevant image or
 * remove it" — the reference template's office laptop over the National Action Plan for
 * Drug Demand Reduction is the case it named. Decided page by page, not by section:
 *
 *   Ministry, all tabs, and Feedback — the abstract pattern; neutral, pictures nothing false.
 *   Vacancies, Tenders — the office desk: recruitment and e-procurement are office work.
 *   Schemes and Services and every scheme — NO photograph. A laptop says nothing about a
 *     scheme, and the live listing has no per-scheme picture (one emblem for all 28).
 *   Documents, all tabs — the notebook and pen.
 *   Contact Us, Directory, RTI, Grievance Redressal — the phone in hand: contacting the
 *     Department. Parliament Questions and Events are not contact, so no photograph.
 *   Website Policies, all tabs, and Cookie Policy — the laptop showing a website's code.
 *   Related Links — devices on a network: the page links out to other sites.
 *   Help (a robot hand), and Media, What's New, Important Links, Sitemap, Search,
 *     Personas and Archives (a plain grey fill, never a photograph) — the band.
 *
 * Longest matching rule wins, so a section rule can be narrowed by a page rule; `null`
 * is an explicit "no photograph here".
 */
const HERO = "/website/dbim/heroes";
const HERO_RULES: ReadonlyArray<[path: string, src: string | null]> = [
  ["/ministry", `${HERO}/ministry.jpg`],
  ["/feedback", `${HERO}/ministry.jpg`],
  ["/offerings/vacancies", `${HERO}/offerings.jpg`],
  ["/offerings/tenders", `${HERO}/offerings.jpg`],
  ["/documents", `${HERO}/documents.jpg`],
  ["/connect", `${HERO}/connect.jpg`],
  ["/connect/parliament-questions", null],
  ["/connect/events", null],
  ["/policies", `${HERO}/policies.jpg`],
  ["/cookies", `${HERO}/policies.jpg`],
  ["/related-links", `${HERO}/related-links.jpg`],
];

/** The banner photograph for a DBIM path, or undefined for the plain primary band. */
export function dbimHeroFor(path: string): string | undefined {
  let best: [string, string | null] | undefined;
  for (const rule of HERO_RULES) {
    const [p] = rule;
    if ((path === p || path.startsWith(p + "/")) && (!best || p.length > best[0].length)) best = rule;
  }
  return best?.[1] ?? undefined;
}

/** The menu entry a path belongs to, for the active state. */
export function dbimMenuFor(path: string): DbimMenu | undefined {
  return DBIM_MENU.find((m) => path === m.path || path.startsWith(m.path + "/"));
}
