import { readPortal, scwMirror, SCW_SOURCES, type ModelAnchors } from "./model.ts";
import type { AreaScope, KpiReading, Labelled, PortalId, PortalReading } from "./types.ts";

/**
 * LIVE FIRST, MODEL SECOND — how a portal's feed and the illustrative model combine,
 * per data mode (`.claude/rules/prototype-data-modes.md`). Pure, so the server sends the
 * raw feed and the browser resolves the mode, as the PM-AJAY dashboards do.
 *
 * NMBA and Senior Citizens Welfare have feeds. A portal with none reads as it always has: the
 * model in the Illustrative and Live + illustrative modes, nothing in Live.
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

/** Senior Citizens Welfare's three public feeds. `null` = that feed did not answer. */
export interface ScwFeed {
  /** IPSrC facilities by type, counted from `facilities_list`. */
  facilities: Labelled[] | null;
  pledges: number | null;
  rvy: { camps: number; beneficiaries: number; devices: number } | null;
  /** YYYY-MM-DD, the day the feed was read. */
  readAt: string;
}

export type PortalFeed = { portal: "nmba"; feed: NmbaFeed } | { portal: "senior-citizens"; feed: ScwFeed };

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

/**
 * Senior Citizens Welfare: each feed that answered, live; each that did not, its dated mirror
 * (`scwMirror`) — live first, snapshot second, never an empty card. All India only.
 */
function scwLive(feed: ScwFeed | undefined, scope: AreaScope): PortalReading {
  if (scope.state) return {};
  const out: PortalReading = scwMirror();
  if (!feed) return out;
  const asOn = feed.readAt.split("-").reverse().join(".");
  const live = (value: KpiReading["value"], source: string): KpiReading => ({ value, origin: "live", source, asOn });
  if (feed.facilities) out["senior-citizens.ipsrc.projects"] = live({ kind: "breakdown", chart: "bar", items: feed.facilities }, SCW_SOURCES.portal);
  if (feed.pledges) out["senior-citizens.pledge.count"] = live({ kind: "figure", value: feed.pledges }, SCW_SOURCES.portal);
  if (feed.rvy) {
    out["senior-citizens.rvy.beneficiaries"] = live({ kind: "figure", value: feed.rvy.beneficiaries }, SCW_SOURCES.rvy);
    out["senior-citizens.rvy.devices"] = live({ kind: "figure", value: feed.rvy.devices }, SCW_SOURCES.rvy);
    out["senior-citizens.rvy.camps"] = live({ kind: "figure", value: feed.rvy.camps }, SCW_SOURCES.rvy);
  }
  return out;
}

/** The figures a model should be scaled to, so a modelled gap agrees with the live total beside it. */
function anchorsOf(feed: PortalFeed | null | undefined): ModelAnchors | undefined {
  if (feed?.portal === "senior-citizens") return feed.feed.rvy ? { rvyDevices: feed.feed.rvy.devices } : undefined;
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
  const live =
    feed?.portal === "nmba" && portal === "nmba" ? nmbaLive(feed.feed, scope)
    : portal === "senior-citizens" ? scwLive(feed?.portal === "senior-citizens" ? feed.feed : undefined, scope)
    : {};
  if (mode === "live") return live;
  if (mode === "mock") return readPortal(portal, scope);
  return { ...readPortal(portal, scope, anchorsOf(feed)), ...live };
}
