/**
 * Deep-linking a portal login's ROLE TAB.
 *
 * Split out of `portal-login-template.tsx` because these two are pure string
 * functions with no JSX, and Node can run a `.ts` under `node --test` but not a
 * `.tsx`. Keeping them here is what makes them testable at all.
 *
 * They are also the ONE place that knows the parameter is called `role`, so
 * renaming it cannot leave a caller behind.
 */

/** The query parameter carrying the role. */
export const ROLE_PARAM = "role";

/** The hash form the tab anchors used before the query existed. Still read. */
const LEGACY_HASH_PREFIX = "#role-";

/**
 * Build a link to a portal login with a role tab preselected.
 *
 *   portalLoginUrl("/portals/scw/login", "officer")  // "/portals/scw/login?role=officer"
 *   portalLoginUrl("/portals/scw/login")             // "/portals/scw/login"
 *
 * An existing `role` is REPLACED rather than appended, so passing a URL that
 * already carries one cannot produce `?role=citizen&role=officer` — which reads
 * as ambiguous and resolves differently across parsers.
 */
export function portalLoginUrl(path: string, roleId?: string): string {
  if (!roleId) return path;
  const [base, existing] = path.split("?");
  const params = new URLSearchParams(existing);
  params.set(ROLE_PARAM, roleId);
  return `${base}?${params.toString()}`;
}

/**
 * Read a role id out of a URL — query first, then the legacy hash.
 *
 * Returns `null` rather than guessing. A caller must check the id against its
 * own roles before using it: a stale or hand-typed link should open the default
 * tab, not select a role that does not exist.
 */
export function roleFromUrl(href: string): string | null {
  try {
    // The base only matters for relative input; it is never read back.
    const url = new URL(href, "http://local");
    const fromQuery = url.searchParams.get(ROLE_PARAM);
    if (fromQuery) return fromQuery;
    return url.hash.startsWith(LEGACY_HASH_PREFIX)
      ? decodeURIComponent(url.hash.slice(LEGACY_HASH_PREFIX.length))
      : null;
  } catch {
    return null;
  }
}
