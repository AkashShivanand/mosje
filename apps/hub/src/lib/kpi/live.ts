import { readPortal, type ModelAnchors } from "./model.ts";
import type { AreaScope, KpiReading, PortalId, PortalReading } from "./types.ts";

/**
 * LIVE FIRST, MODEL SECOND — how a portal's feed and the illustrative model combine,
 * per data mode (`.claude/rules/prototype-data-modes.md`). Pure, so the server sends the
 * raw feed and the browser resolves the mode, as the PM-AJAY dashboards do.
 *
 * Today only NMBA has a feed. A portal with none reads as it always has: the model in the
 * Illustrative and Live + illustrative modes, nothing in Live.
 */

/** One area's NMBA figures. `null` = the feed did not answer for that field. */
export interface NmbaMetrics {
  people: number | null;
  women: number | null;
  youth: number | null;
  pledges: number | null;
  mitras: number | null;
}

export interface NmbaFeed {
  national: NmbaMetrics;
  /** Keyed by the feed's state name, which matches `IndiaMap`'s spelling. */
  byState: Record<string, NmbaMetrics>;
  /** YYYY-MM-DD, the day the feed was read. */
  readAt: string;
}

export type PortalFeed = { portal: "nmba"; feed: NmbaFeed };

const NMBA_LIVE_SOURCE = "Nasha Mukt Bharat Abhiyaan portal";

const NMBA_FIELDS: [string, keyof NmbaMetrics][] = [
  ["nmba.outreach", "people"],
  ["nmba.women", "women"],
  ["nmba.youth", "youth"],
  ["nmba.pledges", "pledges"],
  ["nmba.mitras", "mitras"],
];

function nmbaLive(feed: NmbaFeed, scope: AreaScope): PortalReading {
  const m = scope.state ? feed.byState[scope.state] : feed.national;
  if (!m || scope.district) return {};
  const asOn = feed.readAt.split("-").reverse().join(".");
  const live = (value: number): KpiReading => ({ value: { kind: "figure", value }, origin: "live", source: NMBA_LIVE_SOURCE, asOn });
  const out: PortalReading = {};
  for (const [id, field] of NMBA_FIELDS) {
    const v = m[field];
    if (v !== null) out[id] = live(v);
  }
  // One comparison, one source: the map is live only if EVERY State/UT answered.
  if (!scope.state) {
    const rows = Object.entries(feed.byState).map(([area, s]) => ({ area, value: s.people ?? 0 }));
    const complete = rows.length >= 30 && rows.every((r) => r.value > 0);
    if (complete && m.people !== null) {
      out["nmba.outreach-by-state"] = { value: { kind: "areas", total: m.people, rows }, origin: "live", source: NMBA_LIVE_SOURCE, asOn };
    }
  }
  return out;
}

/** The figures a model should be scaled to, so a modelled gap agrees with the live total beside it. */
function anchorsOf(feed: PortalFeed | null | undefined): ModelAnchors | undefined {
  if (feed?.portal !== "nmba") return undefined;
  const n = feed.feed.national;
  return { outreach: n.people ?? undefined, women: n.women ?? undefined, youth: n.youth ?? undefined, pledges: n.pledges ?? undefined, mitras: n.mitras ?? undefined };
}

export type DataModeName = "live" | "mock" | "hybrid";

/**
 * The reading a dashboard draws, for one portal, area and mode.
 *  - live:   the feed only. A KPI the feed does not carry is absent.
 *  - mock:   the model and its mirrored snapshot, throughout.
 *  - hybrid: the feed where it answers; the model, scaled to the feed's totals, for the rest.
 */
export function resolveReading(portal: PortalId, scope: AreaScope, mode: DataModeName, feed?: PortalFeed | null): PortalReading {
  const live = feed?.portal === portal && portal === "nmba" ? nmbaLive(feed.feed, scope) : {};
  if (mode === "live") return live;
  if (mode === "mock") return readPortal(portal, scope);
  return { ...readPortal(portal, scope, anchorsOf(feed)), ...live };
}
