// De-addiction Centre (Nasha Mukti Kendra) constants for the public locator on the
// DoSJE home page and /website/de-addiction-centres.
//
// THE 487 CENTRES ARE NOT HERE. They live in
// `apps/hub/public/website/data/deaddiction-centres.json` and are FETCHED, not
// imported — see `@/lib/website/deaddiction-centres`. Measured before the split,
// the array was 114,392 of this file's 118,639 bytes, and it reached the browser
// on every home-page visit as ~27.5 KB gzipped of client bundle, for a locator
// most readers never scroll to. `data-state-completeness.md` §6 is the rule:
// a large dataset is left out, paged from the server, or fetched on intent.
// Bundling it and hoping is not one of the three.
//
// WHAT BELONGS HERE is everything a SERVER component needs without the rows —
// the helpline, the published totals, the type legend — because those are read
// by `NmbaHomeCompact`, `DeaddictionMapSection` and `CentreMapCanvas`, and an
// import of any of them used to drag all 487 centres in behind it.
//
// Counts are from the same national feed as the rows and are published figures,
// not derived from the array: they render before the fetch resolves and must not
// wait for it. To refresh both, re-fetch https://nmba.dosje.gov.in/mapSchData and
// regenerate the JSON asset; update `asOn` there in the same pass.

export type CentreType = "IRCA" | "DDAC" | "ATF" | "ODIC" | "SLCA" | "CPLI";

export interface DeAddictionCentre {
  type: CentreType;
  name: string;
  address: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
}

export const CENTRE_TYPE_META: Record<
  CentreType,
  { label: string; short: string; color: string; count: number }
> = {
  IRCA: { label: "Integrated Rehabilitation Centre for Addicts", short: "Inpatient counselling & treatment", color: "var(--sa-chart-cat-1)", count: 282 },
  DDAC: { label: "District De-addiction Centre", short: "One-stop centre \u2014 all services", color: "var(--sa-chart-cat-4)", count: 91 },
  ATF: { label: "Addiction Treatment Facility", short: "Medical treatment facility", color: "var(--sa-chart-cat-5)", count: 56 },
  ODIC: { label: "Outreach & Drop-in Centre", short: "Screening, assessment & counselling", color: "var(--sa-chart-cat-3)", count: 33 },
  SLCA: { label: "State Level Coordinating Agency", short: "State coordination & monitoring", color: "var(--sa-chart-cat-6)", count: 15 },
  CPLI: { label: "Community Peer Led Intervention", short: "Youth-focused prevention", color: "var(--sa-chart-cat-2)", count: 10 },
};

export const CENTRE_TYPE_ORDER: CentreType[] = ["IRCA", "DDAC", "ATF", "ODIC", "SLCA", "CPLI"];

// 487 geo-tagged centres shown on the map; 768 is the published national total.
export const TOTAL_CENTRES = 487;
export const PUBLISHED_TOTAL = 768;
export const HELPLINE = "14446";

// Live campaign counters (legacy site).
export const PLEDGE_STATS = {
  ePledges: "25,20,056",
  ePledgesRaw: 2520056,
  recoveredPledges: "6,60,523",
  recoveredPledgesRaw: 660523,
  individualsReached: "23 crore+",
  youthReached: "7.81 crore",
  womenReached: "5.24 crore",
  institutions: "17 lakh",
};



/* ──────────────────────────────────────────────────────────────────────────
   Geo sanitisation.

   The upstream NMBA feed carries 8 rows (of 487) whose coordinates are not
   usable as published: three have lat and lng transposed, one is a pair of
   Web Mercator metres (1244230, 7718093), one is null island, and three fall
   in west Africa. Left alone they are not a cosmetic problem — Leaflet's
   `fitBounds` fits the CLUSTER's bounds, so a single 7,718,093° longitude
   zooms the map out past the whole world and every real centre collapses into
   a speck. Both this section and /website/de-addiction-centres were rendering
   an empty world map for exactly that reason.

   A transposed pair is safely recoverable — if (lng, lat) lands inside India
   and (lat, lng) does not, it was written the wrong way round. The rest are
   not recoverable, so they keep their place in the list (they are real
   centres, with real addresses and a real district) and are simply not
   plotted.
   ────────────────────────────────────────────────────────────────────────── */

const INDIA_BOUNDS = { latMin: 6.0, latMax: 37.6, lngMin: 68.0, lngMax: 97.5 };

const inIndia = (lat: number, lng: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= INDIA_BOUNDS.latMin &&
  lat <= INDIA_BOUNDS.latMax &&
  lng >= INDIA_BOUNDS.lngMin &&
  lng <= INDIA_BOUNDS.lngMax;

/**
 * The upstream row, corrected where it is safely correctable.
 *
 * Applied at UNPACK time now that the rows are fetched, so every consumer of the
 * asset gets the same corrected data and no caller can forget to apply it.
 */
export const normaliseGeo = (c: DeAddictionCentre): DeAddictionCentre =>
  !inIndia(c.lat, c.lng) && inIndia(c.lng, c.lat) ? { ...c, lat: c.lng, lng: c.lat } : c;

/** True when the centre can be plotted. Filter the MAP by this; never the list. */
export const isPlottable = (c: DeAddictionCentre) => inIndia(c.lat, c.lng);
