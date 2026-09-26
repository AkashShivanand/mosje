/**
 * Which design of the public website a visitor sees.
 *
 * The 2026 redesign is served at `/website/*` from `app/website/`. The design it
 * replaced is archived, unchanged, at `app/website-classic/`, and is reached at the
 * SAME addresses: `proxy.ts` rewrites `/website/*` to `/website-classic/*` while
 * this cookie says `classic`. Both trees stay statically rendered, nothing is sent
 * twice, and a link copied in either design opens the same page in the other.
 *
 * The cookie is written by the demo rail's Website tab and nowhere else. It is a
 * review convenience for comparing the two designs, not a user preference.
 */
export const WEBSITE_DESIGN_COOKIE = "sa-website-design";

export type WebsiteDesign = "new" | "classic";

export const WEBSITE_DESIGNS: ReadonlyArray<{ value: WebsiteDesign; label: string; hint: string }> = [
  { value: "new", label: "New Design", hint: "The 2026 redesign on the SAMAVESH design system" },
  { value: "classic", label: "Classic Design", hint: "The archived design, kept for comparison" },
];

/** Where the classic tree lives. Addresses under it are archive copies and are not indexed. */
export const CLASSIC_PREFIX = "/website-classic";

/**
 * The internal path the proxy serves for a `/website` address, or null when the
 * address is not a page of the website (public files under `/website/*` carry a
 * dot and are the same for both designs).
 */
export function classicRewriteTarget(pathname: string): string | null {
  if (pathname !== "/website" && !pathname.startsWith("/website/")) return null;
  if (pathname.includes(".")) return null;
  return CLASSIC_PREFIX + pathname.slice("/website".length);
}
