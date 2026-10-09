/**
 * OUR ORGANISATIONS — the words the live home page puts around the list of
 * organisations, shared by the designs that show the section (New and Classic
 * on their home pages; DBIM under Ministry › Our Organisation, as DBIM 3.0
 * §A.5.1.3 places it, never on its home page). Rule: home.ts.
 *
 * The organisations themselves — names, categories, order, logos — are the
 * estate's registry, data/website/organisations.ts, which already feeds the
 * masthead, the logo marquee and search. Its category labels and order follow
 * the live section too.
 *
 * SOURCE: the "Our Organisations" section of https://dosje.gov.in/, read on
 * ORGANISATIONS_AS_ON.
 */

import { ORGANISATIONS, type Organisation } from "@/data/website/organisations";

export const ORGANISATIONS_AS_ON = "2026-09-28";

export const ORGANISATIONS_SECTION = {
  title: "Our Organisations",
  /**
   * The live sub-line, verbatim. It repeats the Offerings section's promise
   * (schemes, careers, partnerships) rather than describing organisations —
   * almost certainly a copy on the live page — but it is what the Department
   * publishes, so it is mirrored; the correction belongs on the live site.
   */
  subtitle: "Explore our schemes, career opportunities, and business partnerships",
  intro:
    "The Ministry of Social Justice and Empowerment works through key organisations that drive social inclusion, economic empowerment, and equal opportunity across India.",
  /** The four claims the live section sets beside the list. */
  claims: [
    "Promotes equality and social participation for all communities.",
    "Builds skills and education pathways for self-reliance.",
    "Enables financial inclusion and livelihood opportunities.",
    "Provides rehabilitation and welfare support for vulnerable groups.",
  ],
} as const;

/* ------------------------------------------------------------ scheme portals */

/**
 * SCHEME PORTALS — a section of its own, not a fourth group of organisations.
 *
 * The scheme portals left Our Organisations on 24 Sep 2026 (New design, home page)
 * and the masthead's Associated Organisations on 22 Sep 2026 (option M2: they sit
 * under Offerings). A citizen looking for somewhere to apply should not have to
 * scroll past commissions and corporations to find the portals. The DBIM design
 * follows the same split under Ministry: Our Organisation holds the commissions,
 * corporations and bodies; Our Scheme Portals holds these.
 *
 * The portals themselves are the registry's `category: "schemes"` entries — names,
 * marks and `portalHref` are never retyped here.
 */
export const SCHEME_PORTALS_SECTION = {
  title: "Scheme Portals",
  description: "Apply for, track and manage the Department’s schemes on their own portals.",
} as const;

/*
 * The order every design lists them in, which is not the registry's: the two
 * schemes that reach the most people first, then the four addressed to one group
 * each. The registry orders by when each portal joined the estate, which is a fact
 * about us rather than about the citizen reading the row. The two SMILE portals
 * share an abbreviation and keep their registry order (Transgender, then Beggary).
 */
const SCHEME_PORTAL_ORDER = ["PM-AJAY", "NMBA", "SCW", "SMILE", "NOS", "NHAA"];

/** The scheme portals, in the order above. */
export function schemePortals(): Organisation[] {
  return ORGANISATIONS.filter((o) => o.category === "schemes").sort(
    (a, b) => SCHEME_PORTAL_ORDER.indexOf(a.abbr) - SCHEME_PORTAL_ORDER.indexOf(b.abbr),
  );
}
