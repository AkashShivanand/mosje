/**
 * Where this deployment actually lives — the one answer `metadataBase` needs.
 *
 * Every social card, every `og:image`, every canonical URL is an ABSOLUTE url,
 * and Next can only build one if it is told the origin. Without `metadataBase`
 * Next falls back to `http://localhost:3000` and logs a build warning, which is
 * how an estate ends up publishing preview cards nobody outside the machine can
 * fetch.
 *
 * Resolution order, most explicit first:
 *
 *   1. `NEXT_PUBLIC_SITE_URL` — set this the day the estate moves to its own
 *      domain. It is the only value that survives a Vercel project rename.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — the project's stable production host,
 *      the same on every deployment. Preferred over `VERCEL_URL` because that
 *      one is the *per-deployment* host, so a card built on a preview would
 *      point at a URL that changes on the next push.
 *   3. `VERCEL_URL` — a preview deployment, where the per-deployment host is
 *      genuinely the right answer.
 *   4. Local dev, on the hub's port.
 *
 * Note the port: 3007, not Next's 3000. The estate is one process on 3007 (see
 * CLAUDE.md), and a localhost:3000 fallback here would silently produce dead
 * image URLs in every local preview check.
 */
const DEV_ORIGIN = "http://localhost:3007";

function normalise(value: string): string {
  const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalise(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return normalise(production);

  const deployment = process.env.VERCEL_URL;
  if (deployment) return normalise(deployment);

  return DEV_ORIGIN;
}

/**
 * `og:site_name` for the estate as a whole. The website and the design system
 * override it with their own names — a link to a scheme page should say it came
 * from the department, not from "the digital estate".
 */
export const SITE_NAME = "SAMAVESH — MoSJE Digital Estate";
