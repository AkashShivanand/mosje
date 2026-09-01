/**
 * Turn the department's raw `map-points` feed into the compact payload the
 * reach map draws.
 *
 * ── ONE IMPLEMENTATION, TWO CALLERS ─────────────────────────────────────────
 *
 * `getPmajayReach()` calls this on the server for a live read;
 * `scripts/build-pmajay-map-snapshot.mjs` calls THE SAME FUNCTION to build the
 * committed mirror. The mirror and the live read therefore cannot disagree
 * about how a village is placed, which they would within a month if the script
 * carried its own copy of the hex rounding.
 *
 * That is also why the geometry below is imported by an explicit `.ts` path
 * rather than from `@mosje/design-system`: the barrel pulls in React and CSS,
 * and the snapshot script runs in bare Node under type stripping, which
 * resolves neither. `allowImportingTsExtensions` is already set in this
 * project's tsconfig for the same class of problem (see its comment there), and
 * `india-projection.ts` is deliberately import-free so it stays reachable this
 * way. The alternative — a hand-copied hex lattice in the script — is a
 * density field that drifts half a cell off its own coastline and nothing
 * catches it.
 *
 * ── WHAT LEAVES THE SERVER ──────────────────────────────────────────────────
 *
 * The feed is ~5.4 MB: 19,768 village points and 203 hostel points. The page
 * ships roughly 85 KB of it — a binned density field, one row per district, one
 * per state, and every hostel in full. Villages are not shipped individually
 * because 19,768 marks cannot be told apart on a 800×560 canvas; the bins say
 * everything a reader can actually see, at 1/60th the weight.
 */

import {
  repairIndiaCoordinate,
  binIndiaPoints,
  median,
  INDIA_HEX_RADIUS,
  type HexBin,
} from "../../../../../packages/design-system/components/data-display/charts/geo/india-projection.ts";
import { isOnIndianLand } from "../../../../../packages/design-system/components/data-display/charts/geo/india-land.ts";

export type { HexBin };

/**
 * How a hostel is classified — IN THE DEPARTMENT'S OWN WORDS.
 *
 * ── THE THIRD VALUE IS "SANCTIONED HOSTEL", AND IT IS NOT AN ABSENCE ────────
 *
 * `hostel_type` publishes exactly three values: `Girls` (34), `Boys` (32) and
 * `Sanctioned Hostel` (137). This map used to relabel the third one "Not
 * recorded", on the reasoning that it carries no gender and correlates
 * perfectly with `is_legacy`.
 *
 * That was wrong, and it is the class of wrong this estate cares most about:
 * the department published a value and we printed a different word over it.
 * "Not recorded" is our INFERENCE about what the value means. It may even be a
 * correct inference — but a citizen reading "Not recorded" cannot check it
 * against anything the department has published, and an officer comparing this
 * page with the MIS finds a category that exists nowhere in their own system.
 *
 * So all three values are the feed's own. What the correlation with
 * `is_legacy` buys us is the decision to offer ONE dimension rather than two:
 * every `Sanctioned Hostel` row has `is_legacy: true` and all 66 `Girls`/`Boys`
 * rows have `is_legacy: false`, so type and era are one fact wearing two names.
 * Offering them as independent filters would let a reader select Girls +
 * legacy, get zero, and conclude PM-AJAY built no girls' hostels in its earlier
 * years — false, rather than merely unknown.
 */
export type HostelType = "girls" | "boys" | "sanctioned";

export interface HostelPin {
  /** The department's own project id. */
  id: string;
  state: string;
  district: string;
  lat: number;
  lon: number;
  type: HostelType;
  /**
   * Whether this hostel has a usable coordinate.
   *
   * UNPLACEABLE HOSTELS ARE STILL IN THIS LIST, and that is the point. Dropping
   * them made the map's own rail disagree with the total above it: Uttar Pradesh
   * has six hostels and two of them are published at coordinates outside India,
   * so the rail said "4 hostels" under a card saying 203. The map draws only
   * `placed` pins; every count is taken over the whole list.
   */
  placed: boolean;
}

export interface DistrictRow {
  state: string;
  district: string;
  villages: number;
  hostels: number;
  /** Median of the district's own placeable points — see `median`. */
  lat: number;
  lon: number;
}

export interface StateRow {
  state: string;
  villages: number;
  hostels: number;
  /** Districts in this state that the scheme has reached. */
  districts: number;
}

/**
 * What the map could and could not draw.
 *
 * Rendered on the page rather than kept in a log. A map that quietly drops 423
 * of 19,971 records and prints "19,768 villages" beneath it is telling a reader
 * that every one of them is on the map.
 */
export interface CoverageReport {
  villagesTotal: number;
  villagesPlaced: number;
  villagesRepaired: number;
  villagesUnplaceable: number;
  /** Passed every range check and still landed in the sea — see below. */
  villagesOffshore: number;
  hostelsTotal: number;
  hostelsPlaced: number;
  hostelsRepaired: number;
  hostelsUnplaceable: number;
  hostelsOffshore: number;
  /** Villages the feed gives a name for. The rest can only be searched by place. */
  villagesNamed: number;
  /** States publishing a name for none of their villages, in the feed's order. */
  statesWithoutVillageNames: string[];
}

export interface ReachSnapshot {
  /** Village density, on the lattice `IndiaPointMap` renders. */
  bins: HexBin[];
  hostels: HostelPin[];
  districts: DistrictRow[];
  states: StateRow[];
  coverage: CoverageReport;
  /** Distinct districts the scheme has reached, either component. */
  districtCount: number;
  villageTotal: number;
  hostelTotal: number;
}

export interface RawVillage {
  state_name?: string;
  district_name?: string;
  village_name?: string | null;
  latitude?: number;
  longitude?: number;
}

/**
 * One named village, for the rail's search.
 *
 * ── WHY THIS IS A SEARCH INDEX AND NOT A THIRD DRILL LEVEL ──────────────────
 *
 * `village_name` is published for 10,157 of 19,768 records — 51.4%. The gap is
 * not scattered: TWENTY-TWO states publish a name for essentially every
 * village (Tamil Nadu, Rajasthan, Odisha, Madhya Pradesh, Jharkhand, Punjab,
 * Telangana, Uttarakhand, Himachal Pradesh, Gujarat and Tripura are at a flat
 * 100%), and **West Bengal and Bihar publish none at all** — zero of 5,792 and
 * zero of 2,853. Those two are 44% of the entire programme.
 *
 * That shape decides the interaction. A browsable "villages in this district"
 * level would open on a page of blanks for the two largest states in the
 * scheme, which reads as "your village is not covered" when the truth is "the
 * MIS has not published its name". A SEARCH answers the citizen's actual
 * question — *is my village on this list* — for the 22 states that can answer
 * it, and returns nothing for a West Bengal village, which the empty state
 * then explains rather than implies.
 *
 * The names are deduplicated per district: 9,673 distinct names across 10,157
 * records, so two hamlets sharing a name inside one district collapse to one
 * row rather than to two identical ones.
 *
 * ── AND WHY IT IS NOT IN THE PAGE'S BUNDLE ──────────────────────────────────
 *
 * Baked into `pmajay-map-snapshot.ts` the index took the page's mirrored data
 * from 21 KB gzipped to 106 KB — a fivefold rise, on every visit, for a lookup
 * most readers will never run. It is written to
 * `public/website/data/pmajay-villages.json` instead and fetched the first
 * time someone types in the rail's search. The page pays nothing until the
 * feature is used, which is the only honest way to carry 10,000 rows on a
 * government page.
 */
export interface VillageName {
  name: string;
  state: string;
  district: string;
}

export interface RawHostel {
  project_id?: string;
  state_name?: string;
  district_name?: string;
  hostel_type?: string;
  latitude?: number;
  longitude?: number;
}

export interface RawMapPoints {
  vdp_villages: RawVillage[];
  hostels: RawHostel[];
}

/**
 * "JAMMU AND KASHMIR" → "Jammu and Kashmir".
 *
 * The feed shouts every place name. The map matches states case-insensitively
 * so it would draw either way, but the ranked list beside it is read by a
 * person, and a column of block capitals reads as an error message. Joining
 * words stay lowercase — "Andaman and Nicobar", not "Andaman And Nicobar".
 */
const JOINERS = new Set(["and", "of", "the"]);

export function titleCasePlace(raw: string): string {
  return raw
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && JOINERS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function classifyHostel(raw: string | undefined): HostelType {
  const t = (raw ?? "").trim().toLowerCase();
  if (t === "girls") return "girls";
  if (t === "boys") return "boys";
  // Everything else is the feed's third value, `Sanctioned Hostel`. A row with
  // no `hostel_type` at all would land here too; there are none today, and if
  // one appears it is counted under the department's own residual category
  // rather than under a fourth one this page invented.
  return "sanctioned";
}

interface Placed {
  state: string;
  district: string;
  lat: number;
  lon: number;
  group: string;
}

/**
 * The reduce's full output: what the page imports, plus the village index that
 * is written out as a separate fetched asset.
 */
export interface ReducedMapPoints {
  snapshot: ReachSnapshot;
  villageNames: VillageName[];
}

/** The page's own reduce. Most callers want this. */
export function reducePmajayMapPoints(raw: RawMapPoints): ReachSnapshot {
  return reducePmajayMapPointsFull(raw).snapshot;
}

export function reducePmajayMapPointsFull(raw: RawMapPoints): ReducedMapPoints {
  const villages = Array.isArray(raw.vdp_villages) ? raw.vdp_villages : [];
  const hostelsRaw = Array.isArray(raw.hostels) ? raw.hostels : [];

  const coverage: CoverageReport = {
    villagesTotal: villages.length,
    villagesPlaced: 0,
    villagesRepaired: 0,
    villagesUnplaceable: 0,
    villagesOffshore: 0,
    hostelsTotal: hostelsRaw.length,
    hostelsPlaced: 0,
    hostelsRepaired: 0,
    hostelsUnplaceable: 0,
    hostelsOffshore: 0,
    villagesNamed: 0,
    statesWithoutVillageNames: [],
  };

  /*
   * THE SECOND CLASS OF BAD COORDINATE, and the one a range check cannot see.
   *
   * `repairIndiaCoordinate` catches absent, zeroed and transposed pairs. What
   * it cannot catch is a pair that is entirely plausible — right hemisphere,
   * right ranges, right way round — and puts a village in the Arabian Sea.
   * PM-AJAY's feed has 33 aggregation cells of those.
   *
   * They are COUNTED AND NOT DRAWN, the same treatment an absent coordinate
   * gets, for the same reason: the village exists and its state and district
   * are recorded, so deleting it would make the map's totals disagree with the
   * department's, while drawing it puts a pale cell adrift off Gujarat that a
   * reader takes for a bug in the map rather than a defect in the data.
   */

  /*
   * Counting and placing are separate passes over the same record, deliberately.
   * A village with an unusable coordinate is still a village the scheme has
   * reached — it belongs in its state's and district's TOTAL, and only its dot
   * is missing. Filtering first would silently deduct it from the count as well,
   * which is the failure the coverage report exists to make impossible.
   */
  /*
   * District keys join on NUL, not a space. "Andhra Pradesh" + "Alluri
   * Sitharama Raju" split on a space gives the state "Andhra" and the district
   * "Pradesh" — most Indian state AND district names carry spaces, so any
   * printable separator that reads naturally is one a place name can contain.
   */
  const placedVillages: Placed[] = [];
  const villageNames: VillageName[] = [];
  /** `state -> district -> names`, so a repeated name inside one district collapses. */
  const namesSeen = new Map<string, Set<string>>();
  const stateNamed = new Map<string, number>();
  const stateVillages = new Map<string, number>();
  const districtVillages = new Map<string, number>();
  const districtPoints = new Map<string, { lats: number[]; lons: number[] }>();
  const districtsSeen = new Set<string>();

  for (const v of villages) {
    const state = titleCasePlace(String(v.state_name ?? "").trim());
    if (!state) continue;
    const district = titleCasePlace(String(v.district_name ?? "").trim()) || "Not stated";
    const dkey = `${state}\u0000${district}`;

    stateVillages.set(state, (stateVillages.get(state) ?? 0) + 1);
    districtVillages.set(dkey, (districtVillages.get(dkey) ?? 0) + 1);
    districtsSeen.add(dkey);

    /*
     * A NAME IS INDEPENDENT OF A COORDINATE, so it is captured before the
     * placement checks below and never inside them. 30 of the named villages
     * cannot be drawn on the map; a citizen searching for one of those should
     * still be told their village is in the scheme.
     */
    const name = typeof v.village_name === "string" ? v.village_name.trim() : "";
    if (name) {
      coverage.villagesNamed += 1;
      stateNamed.set(state, (stateNamed.get(state) ?? 0) + 1);
      const seen = namesSeen.get(dkey) ?? new Set<string>();
      if (!seen.has(name)) {
        seen.add(name);
        namesSeen.set(dkey, seen);
        villageNames.push({ name, state, district });
      }
    }

    const fixed = repairIndiaCoordinate(v.latitude, v.longitude);
    if (fixed.verdict === "unusable") {
      coverage.villagesUnplaceable += 1;
      continue;
    }
    if (!isOnIndianLand(fixed.lon, fixed.lat)) {
      coverage.villagesOffshore += 1;
      continue;
    }
    if (fixed.verdict === "transposed") coverage.villagesRepaired += 1;
    coverage.villagesPlaced += 1;
    // `group` is what lets a zoomed map draw West Bengal's cells and not
    // Jharkhand's; see `HexBin.group`.
    placedVillages.push({ state, district, lat: fixed.lat, lon: fixed.lon, group: state });

    const pts = districtPoints.get(dkey);
    if (pts) {
      pts.lats.push(fixed.lat);
      pts.lons.push(fixed.lon);
    } else {
      districtPoints.set(dkey, { lats: [fixed.lat], lons: [fixed.lon] });
    }
  }

  const hostels: HostelPin[] = [];
  const stateHostels = new Map<string, number>();
  const districtHostels = new Map<string, number>();

  hostelsRaw.forEach((h, i) => {
    const state = titleCasePlace(String(h.state_name ?? "").trim());
    if (!state) return;
    const district = titleCasePlace(String(h.district_name ?? "").trim()) || "Not stated";
    const dkey = `${state}\u0000${district}`;

    stateHostels.set(state, (stateHostels.get(state) ?? 0) + 1);
    districtHostels.set(dkey, (districtHostels.get(dkey) ?? 0) + 1);
    districtsSeen.add(dkey);

    const fixed = repairIndiaCoordinate(h.latitude, h.longitude);
    const offshore = fixed.verdict !== "unusable" && !isOnIndianLand(fixed.lon, fixed.lat);
    const placed = fixed.verdict !== "unusable" && !offshore;
    if (fixed.verdict === "unusable") coverage.hostelsUnplaceable += 1;
    else if (offshore) coverage.hostelsOffshore += 1;
    else {
      if (fixed.verdict === "transposed") coverage.hostelsRepaired += 1;
      coverage.hostelsPlaced += 1;
    }

    hostels.push({
      // `project_id` is the department's own key, but it is not guaranteed
      // unique in this feed, and React needs one that is — so the index rides
      // along. The visible id stays the department's.
      id: `${String(h.project_id ?? "").trim() || "hostel"}#${i}`,
      state,
      district,
      lat: fixed.lat,
      lon: fixed.lon,
      type: classifyHostel(h.hostel_type),
      placed,
    });

    if (!placed) return;

    const pts = districtPoints.get(dkey);
    if (pts) {
      pts.lats.push(fixed.lat);
      pts.lons.push(fixed.lon);
    } else {
      districtPoints.set(dkey, { lats: [fixed.lat], lons: [fixed.lon] });
    }
  });

  const districts: DistrictRow[] = [...districtsSeen]
    .map((dkey) => {
      const [state = "", district = ""] = dkey.split("\u0000");
      const pts = districtPoints.get(dkey);
      return {
        state,
        district,
        villages: districtVillages.get(dkey) ?? 0,
        hostels: districtHostels.get(dkey) ?? 0,
        lat: pts ? Number(median(pts.lats).toFixed(4)) : 0,
        lon: pts ? Number(median(pts.lons).toFixed(4)) : 0,
      };
    })
    .sort(
      (a, b) =>
        b.villages + b.hostels - (a.villages + a.hostels) ||
        a.state.localeCompare(b.state) ||
        a.district.localeCompare(b.district),
    );

  const districtsPerState = new Map<string, number>();
  for (const d of districts) {
    districtsPerState.set(d.state, (districtsPerState.get(d.state) ?? 0) + 1);
  }

  const states: StateRow[] = [...new Set([...stateVillages.keys(), ...stateHostels.keys()])]
    .map((state) => ({
      state,
      villages: stateVillages.get(state) ?? 0,
      hostels: stateHostels.get(state) ?? 0,
      districts: districtsPerState.get(state) ?? 0,
    }))
    // Descending by villages, then hostels, then alphabetical.
    .sort(
      (a, b) => b.villages - a.villages || b.hostels - a.hostels || a.state.localeCompare(b.state),
    );

  /*
   * A state is listed as publishing no village names only when it has villages
   * AND none of them is named — not when it simply has none in the feed. The
   * empty state quotes this list back to the reader, so a state that appears
   * here wrongly is a sentence on a government page that is not true.
   */
  coverage.statesWithoutVillageNames = [...stateVillages.keys()]
    .filter((state) => (stateNamed.get(state) ?? 0) === 0)
    .sort((a, b) => (stateVillages.get(b) ?? 0) - (stateVillages.get(a) ?? 0));

  villageNames.sort(
    (a, b) => a.name.localeCompare(b.name) || a.state.localeCompare(b.state) ||
      a.district.localeCompare(b.district),
  );

  return {
    snapshot: {
      bins: binIndiaPoints(placedVillages, INDIA_HEX_RADIUS),
      hostels,
      districts,
      states,
      coverage,
      districtCount: districtsSeen.size,
      villageTotal: villages.length,
      hostelTotal: hostelsRaw.length,
    },
    villageNames,
  };
}
