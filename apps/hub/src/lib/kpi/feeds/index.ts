import type { PortalFeed } from "../live";
import type { PortalId } from "../types";
import { getNmbaFeed } from "./nmba";

/**
 * A portal's live feed, read on the server, or null. Add a portal here the day its API
 * answers; until then its dashboard reads the illustrative model.
 */
export async function getPortalFeed(portal: PortalId): Promise<PortalFeed | null> {
  if (portal === "nmba") {
    const feed = await getNmbaFeed();
    return feed ? { portal: "nmba", feed } : null;
  }
  return null;
}

/** Every connected portal's feed, keyed by portal, for a view that shows several. */
export async function getPortalFeeds(portals: PortalId[]): Promise<Partial<Record<PortalId, PortalFeed>>> {
  const entries = await Promise.all(portals.map(async (p) => [p, await getPortalFeed(p)] as const));
  return Object.fromEntries(entries.filter(([, f]) => f !== null)) as Partial<Record<PortalId, PortalFeed>>;
}
