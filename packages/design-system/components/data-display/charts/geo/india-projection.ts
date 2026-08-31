/* ============================================================================
   lon/lat → the INDIA_STATES_VIEWBOX coordinate system, plus the hex lattice
   the density map bins onto.

   THIS IS THE SAME PROJECTION `generate-india-paths.mjs` BAKED THE OUTLINES
   WITH, restated for runtime use. The generator projects boundaries once, at
   build time, and writes path data; this projects points on demand so a caller
   can put a village where it actually stands instead of at its state's
   centroid.

   The two MUST agree, because a point projected differently from the coastline
   it sits beside lands in the sea. So the parameters below are not "chosen" —
   they are copied:

     geoMercator().center([82.5, 22]).scale(950).translate([400, 280])
     viewBox "0 0 800 560"

   ── THIS FILE HAS NO IMPORTS, ON PURPOSE ────────────────────────────────────

   `scripts/build-pmajay-map-snapshot.mjs` imports it directly under Node's type
   stripping so the committed mirror is binned by the SAME code that draws it.
   Bare Node will not resolve the extensionless `./india-states.paths` that the
   bundler resolves happily, so anything needing the baked outlines lives in
   `india-point-map.tsx` instead. Two implementations of this rounding is how a
   density field ends up half a cell off its own coastline; keeping the file
   import-free is what lets there be only one.
   ============================================================================ */

const DEG = Math.PI / 180;
const SCALE = 950;
const TRANSLATE_X = 400;
const TRANSLATE_Y = 280;
const CENTER_LON = 82.5;
const CENTER_LAT = 22;

/** Spherical Mercator, in radians/natural-log units — d3's `geoMercator` raw. */
function mercator(lonDeg: number, latDeg: number): [number, number] {
  return [lonDeg * DEG, Math.log(Math.tan(Math.PI / 4 + (latDeg * DEG) / 2))];
}

const [CX, CY] = mercator(CENTER_LON, CENTER_LAT);

/** Where a longitude/latitude lands in the 800×560 map viewBox. */
export function projectIndia(lon: number, lat: number): [number, number] {
  const [mx, my] = mercator(lon, lat);
  return [TRANSLATE_X + SCALE * (mx - CX), TRANSLATE_Y - SCALE * (my - CY)];
}

/**
 * The mainland-plus-islands envelope, in DEGREES.
 *
 * A plausibility test, not a border — deliberately generous at every edge,
 * because a village 20 km outside a tight box is a rounding artefact rather
 * than a foreign village.
 */
export const INDIA_LAT_RANGE: readonly [number, number] = [6, 37.6];
export const INDIA_LON_RANGE: readonly [number, number] = [68, 97.5];

export type CoordinateVerdict = "ok" | "transposed" | "unusable";

export interface RepairedCoordinate {
  lat: number;
  lon: number;
  verdict: CoordinateVerdict;
}

function inIndia(lat: number, lon: number): boolean {
  return (
    lat >= INDIA_LAT_RANGE[0] &&
    lat <= INDIA_LAT_RANGE[1] &&
    lon >= INDIA_LON_RANGE[0] &&
    lon <= INDIA_LON_RANGE[1]
  );
}

/**
 * Take a (lat, lon) pair as published and decide what it really is.
 *
 * ── WHY A REPAIR STEP EXISTS AT ALL ─────────────────────────────────────────
 *
 * Government point feeds transpose latitude and longitude. It is the single
 * most common defect in them, because the two are adjacent columns of the same
 * type and nothing downstream complains. In PM-AJAY's `map-points` it affects
 * 155 of 19,971 records — an Assam hostel published at `lat 90.71, lon 26.47`
 * is standing in the Pacific until someone swaps it back.
 *
 * ── WHY THE SWAP IS SAFE HERE, AND WHERE IT WOULD NOT BE ────────────────────
 *
 * India's latitude band (6–37.6) and longitude band (68–97.5) DO NOT OVERLAP.
 * So for any pair at most one of the two readings can be inside the country —
 * there is no coordinate this function has to guess about, and a check across
 * the whole feed finds zero ambiguous rows. A country straddling the equator,
 * or one spanning both bands, would need provenance instead of geometry, and
 * this function would be wrong for it.
 *
 * ── WHAT IT REFUSES TO DO ───────────────────────────────────────────────────
 *
 * It does not snap, clamp, or nudge anything toward land. A pair that is
 * neither valid nor a clean transposition comes back `unusable`, and its record
 * is COUNTED BUT NOT DRAWN — a point invented at a district's centre is
 * indistinguishable, to a reader, from a village that is really there.
 */
export function repairIndiaCoordinate(
  lat: number | null | undefined,
  lon: number | null | undefined,
): RepairedCoordinate {
  const a = typeof lat === "number" && Number.isFinite(lat) ? lat : NaN;
  const b = typeof lon === "number" && Number.isFinite(lon) ? lon : NaN;
  if (Number.isNaN(a) || Number.isNaN(b)) return { lat: 0, lon: 0, verdict: "unusable" };
  if (inIndia(a, b)) return { lat: a, lon: b, verdict: "ok" };
  if (inIndia(b, a)) return { lat: b, lon: a, verdict: "transposed" };
  return { lat: 0, lon: 0, verdict: "unusable" };
}

/**
 * Canonicalise a state name for matching, so "Andaman & Nicobar", "ANDAMAN AND
 * NICOBAR ISLANDS" and "Andaman and Nicobar Island" all reach the same region.
 */
export function normalizeRegionName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/islands?/g, "")
    .replace(/[^a-z]/g, "")
    .trim();
}

/* ── The hex lattice ────────────────────────────────────────────────────────
 *
 * Pointy-top axial coordinates. Binning happens in PROJECTED space, never in
 * degrees: bin in lon/lat and the cells shrink towards the Himalaya, painting a
 * density gradient that is purely an artefact of the projection.
 * ------------------------------------------------------------------------ */

const SQRT3 = Math.sqrt(3);

/** Default hex radius in viewBox units — ~1,000 cells over India's 19.7k points. */
export const INDIA_HEX_RADIUS = 5;

export interface HexBin {
  /** Axial column. */
  q: number;
  /** Axial row. */
  r: number;
  /** How many source points fell in this cell. */
  count: number;
  /**
   * The group most of this cell's points belong to, when the caller supplied
   * one — a state name, typically, so a zoomed view can show that state's
   * cells and not its neighbours'.
   *
   * A cell straddling a border genuinely holds points from both sides, and
   * assigning it to the majority is a small inaccuracy exactly at the border.
   * That is the right trade: the alternative is clipping hexes to state
   * outlines, which costs a polygon intersection per cell to fix a case the
   * reader cannot see at this scale.
   */
  group?: string;
}

/** Centre of hex (q, r) in viewBox units. */
export function hexCenter(q: number, r: number, radius: number): [number, number] {
  return [radius * (SQRT3 * q + (SQRT3 / 2) * r), radius * 1.5 * r];
}

/** Which hex contains a viewBox point — the inverse of `hexCenter`, rounded. */
export function hexAt(x: number, y: number, radius: number): [number, number] {
  const q = ((SQRT3 / 3) * x - y / 3) / radius;
  const r = ((2 / 3) * y) / radius;
  // Cube rounding: round all three axes, then correct whichever moved most.
  let rq = Math.round(q);
  let rr = Math.round(r);
  const s = -q - r;
  const rs = Math.round(s);
  const dq = Math.abs(rq - q);
  const dr = Math.abs(rr - r);
  const ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return [rq, rr];
}

/** SVG path data for one hexagon. */
export function hexPath(cx: number, cy: number, radius: number): string {
  let d = "";
  for (let i = 0; i < 6; i++) {
    const a = ((60 * i - 30) * Math.PI) / 180;
    d += `${i === 0 ? "M" : "L"}${(cx + radius * Math.cos(a)).toFixed(2)} ${(
      cy +
      radius * Math.sin(a)
    ).toFixed(2)}`;
  }
  return `${d}Z`;
}

/**
 * Bin lon/lat points onto the lattice `IndiaPointMap` draws.
 *
 * Runs where the coordinates are — on the server for a live read, and in the
 * snapshot script for the committed mirror — so a page never ships 19,768
 * latitudes to render 1,000 cells.
 */
export function binIndiaPoints(
  points: readonly { lon: number; lat: number; group?: string }[],
  radius: number = INDIA_HEX_RADIUS,
): HexBin[] {
  const acc = new Map<string, { q: number; r: number; count: number; groups?: Map<string, number> }>();
  for (const p of points) {
    const [x, y] = projectIndia(p.lon, p.lat);
    const [q, r] = hexAt(x, y, radius);
    const key = `${q},${r}`;
    let cell = acc.get(key);
    if (!cell) {
      cell = { q, r, count: 0 };
      acc.set(key, cell);
    }
    cell.count += 1;
    if (p.group !== undefined) {
      if (!cell.groups) cell.groups = new Map();
      cell.groups.set(p.group, (cell.groups.get(p.group) ?? 0) + 1);
    }
  }
  return [...acc.values()]
    .map((cell) => {
      const bin: HexBin = { q: cell.q, r: cell.r, count: cell.count };
      if (cell.groups) {
        let best = "";
        let bestN = -1;
        for (const [g, n] of cell.groups) {
          // Ties break alphabetically so a regenerated snapshot is stable
          // rather than following Map insertion order.
          if (n > bestN || (n === bestN && g < best)) {
            best = g;
            bestN = n;
          }
        }
        bin.group = best;
      }
      return bin;
    })
    // Sorted so a regenerated snapshot diffs line by line instead of
    // reshuffling on Map iteration order.
    .sort((a, b) => a.q - b.q || a.r - b.r);
}

/**
 * Median of a list — the centre used for a district's marker.
 *
 * MEDIAN, NOT MEAN, and that is the whole reason this helper exists. A district
 * whose villages are correct except for one row published at the wrong end of
 * the country gets a mean dragged hundreds of kilometres into the sea; the
 * median ignores it. `repairIndiaCoordinate` catches transposition, but nothing
 * catches a plausible-looking coordinate that is simply wrong, and there are
 * such rows in this feed.
 */
export function median(values: readonly number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}
