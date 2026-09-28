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
