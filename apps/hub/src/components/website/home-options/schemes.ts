import { ORGANISATIONS, type Organisation } from "@/data/website";

/**
 * The Department's schemes that run a portal, in the order the homepage shows them.
 *
 * Read from the organisation registry (category "schemes") so a name or a mark
 * cannot drift from the rest of the site. `portalHref` is the one fact the registry
 * does not hold: where the scheme's own portal lives. A scheme whose portal is
 * not built in this estate falls back to its published external address, then to
 * its profile page.
 */
const PORTAL_HREF: Record<string, string> = {
  "PM-AJAY": "/portals/pm-ajay",
  NMBA: "/portals/nmba",
  SCW: "/portals/scw",
  SMILE: "/portals/tg",
};

/** Display order — the schemes with a live portal first. */
const ORDER = ["PM-AJAY", "NMBA", "SCW", "SMILE", "NOS"];

export interface SchemeMark {
  abbr: string;
  name: string;
  /** The square mark, for tiles. */
  markSrc: string;
  /** The horizontal wordmark where one is published, else the square mark. */
  stripSrc: string;
  portalHref: string;
  external: boolean;
}

function toMark(org: Organisation): SchemeMark {
  const portalHref = PORTAL_HREF[org.abbr] ?? org.externalUrl ?? org.profileHref;
  return {
    abbr: org.abbr,
    name: org.name,
    markSrc: org.logoSrc ?? org.wordmarkSrc ?? "",
    stripSrc: org.wordmarkSrc ?? org.logoSrc ?? "",
    portalHref,
    external: portalHref.startsWith("http"),
  };
}

export const SCHEME_MARKS: SchemeMark[] = ORGANISATIONS.filter((o) => o.category === "schemes")
  .filter((o) => o.logoSrc || o.wordmarkSrc)
  .sort((a, b) => {
    const ia = ORDER.indexOf(a.abbr);
    const ib = ORDER.indexOf(b.abbr);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  })
  .map(toMark);
