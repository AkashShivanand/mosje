/**
 * Which design of the public website a visitor sees.
 *
 * The DBIM design is the DEFAULT (the Department's instruction, 30 Sep 2026): a visitor
 * with no cookie is served `app/website-dbim/` at the `/website/*` addresses. The 2026
 * redesign lives in `app/website/` and is reached with the cookie set to `new`. The design it
 * replaced is archived, unchanged, at `app/website-classic/`, and is reached at the
 * SAME addresses: `proxy.ts` rewrites `/website/*` to `/website-classic/*` while
 * this cookie says `classic`. Both trees stay statically rendered, nothing is sent
 * twice, and a link copied in either design opens the same page in the other.
 *
 * The cookie is written by the demo rail's Website tab and nowhere else. It is a
 * review convenience for comparing the two designs, not a user preference.
 */
export const WEBSITE_DESIGN_COOKIE = "sa-website-design";

export type WebsiteDesign = "new" | "classic" | "dbim";

export const WEBSITE_DESIGNS: ReadonlyArray<{ value: WebsiteDesign; label: string; hint: string }> = [
  { value: "new", label: "New Design", hint: "The 2026 redesign on the SAMAVESH design system" },
  { value: "classic", label: "Classic Design", hint: "The archived design, kept for comparison" },
  {
    value: "dbim",
    label: "DBIM Design",
    hint: "The DBIM 3.0 reference template (Colour Group 5), as the DBIM review team asked on 25 Sep 2026, with the Department's own content",
  },
];

/** Where the classic tree lives. An internal folder, never an address: `designTreeOf` redirects it. */
export const CLASSIC_PREFIX = "/website-classic";

/**
 * Where the DBIM tree lives. It is a clone of the DBIM reference build the review team
 * named as the target (master-socialjustice.digifootprint.gov.in), so it follows THAT
 * site's information architecture — Home, Ministry, Offerings, Documents, Media, Connect —
 * not ours. An address that exists in one tree and not the other falls through to the
 * website's own not-found page, which is the honest answer for a comparison view.
 */
export const DBIM_PREFIX = "/website-dbim";

/** The design a visitor gets when they have not chosen one — decided 30 Sep 2026. */
export const DEFAULT_WEBSITE_DESIGN: WebsiteDesign = "dbim";

/** Narrow a raw cookie value to a design, defaulting to DBIM. */
export function parseWebsiteDesign(value: string | undefined): WebsiteDesign {
  return value === "new" || value === "classic" || value === "dbim" ? value : DEFAULT_WEBSITE_DESIGN;
}

/**
 * The internal path the proxy serves for a `/website` address, or null when the
 * address is not a page of the website (public files under `/website/*` carry a
 * dot and are the same for both designs).
 */
export function designRewriteTarget(pathname: string, design: WebsiteDesign): string | null {
  if (design === "new") return null;
  if (pathname !== "/website" && !pathname.startsWith("/website/")) return null;
  if (pathname.includes(".")) return null;
  return (design === "dbim" ? DBIM_PREFIX : CLASSIC_PREFIX) + pathname.slice("/website".length);
}

/**
 * A direct request for one of the design trees' internal folders, mapped back to the
 * public `/website` address that serves it — or null. Public files carry a dot and
 * are left alone.
 */
export function designTreeOf(pathname: string): { design: WebsiteDesign; publicPath: string } | null {
  if (pathname.includes(".")) return null;
  for (const [prefix, design] of [[DBIM_PREFIX, "dbim"], [CLASSIC_PREFIX, "classic"]] as const) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return { design, publicPath: "/website" + pathname.slice(prefix.length) };
    }
  }
  return null;
}
