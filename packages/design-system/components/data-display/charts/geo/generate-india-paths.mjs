/* ============================================================================
   Bakes India's State/UT boundaries into static SVG path data so the DS map
   components need no d3-geo / topojson-client at runtime.

   SOURCE: Bharat Maps (NIC) — the Government of India's own map service.
   The State layer of BharatMapService/Admin_Boundary_District, simplified from
   1:50,000 Survey of India topographic data, coded with Census 2011 codes, and
   current to the 36 States/UTs (Ladakh separate; Dadra and Nagar Haveli and
   Daman and Diu one UT). A boundary on a Government of India page is a
   regulated artefact; drawing the Government's own removes the question of
   whose border it is.

   Usage:
     node generate-india-paths.mjs --fetch   # re-download the source, then bake
     node generate-india-paths.mjs           # bake from the committed source

   The source is committed (source/bharat-maps-states.geojson) so a bake is
   reproducible offline and a boundary change shows up as a reviewable diff.

   Projection — unchanged, because IndiaPointMap and the PM-AJAY snapshot project
   coordinates with the same parameters (india-projection.ts):
     geoMercator().center([82.5, 22]).scale(950).translate([400, 280])
   ============================================================================ */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { URLSearchParams, fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, "source/bharat-maps-states.geojson");
const OUTPUT = resolve(__dirname, "india-states.paths.ts");
const SERVICE =
  "https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_District/MapServer/0/query";

const CENTER = [82.5, 22];
const SCALE = 950;
const TRANSLATE = [400, 280];
/**
 * Douglas–Peucker tolerance, in viewBox units. 0.6 is ~0.036° — under one CSS pixel at the
 * largest size the estate draws India (~700px for 502 units). Weight, measured: ~29 KB gzipped
 * (0.25 was 51 KB, on every page that draws a map). Of that, ~7 KB is the islands kept below
 * — the price of a map with all of Lakshadweep and the Andaman and Nicobar Islands on it.
 */
const TOLERANCE = 0.6;
/**
 * ISLANDS ARE NEVER LOST. At dashboard sizes 1 km is ~0.15 viewBox units — a fifth of a pixel
 * — so a plain simplification deletes Lakshadweep (largest island 5 km²) and most of the
 * Andaman and Nicobar Islands, and a map of India missing its islands is wrong. So, as
 * official small-scale maps do, every island of at least MIN_ISLAND_KM2 is kept at its true
 * position, and one too small to see is drawn at ISLAND_R — enlarged, never moved. Only rocks
 * and sandbanks below the threshold are left out. The bake fails if any State/UT ends with
 * fewer pieces than its source has islands above the threshold.
 */
const MIN_ISLAND_KM2 = 0.01;
const ISLAND_R = 1.2;
/**
 * An ENCLAVE — a piece of one State/UT surrounded by another's land (Yanam inside Andhra
 * Pradesh, Sunel inside Madhya Pradesh) — is not an island: enlarging a 2 km² one would
 * paint a blob inside its neighbour. Enclaves of at least this size are kept at the minimum
 * mark, as official small-scale maps keep them; smaller ones are drawn true to size, which
 * at national scale is invisible, as it is on those maps.
 */
const MIN_ENCLAVE_KM2 = 5;
/** Room around the land in the viewBox. */
const MARGIN = 8;

/** Bharat Maps' names → the estate's State/UT names (lib/kpi/geography STATE_NAMES). */
const NAME = {
  "Andaman & Nicobar": "Andaman and Nicobar Islands",
  "Jammu & Kashmir": "Jammu and Kashmir",
  "Dadra,Nagar Haveli,Daman & Diu": "Dadra and Nagar Haveli and Daman and Diu",
};

if (process.argv.includes("--fetch")) {
  const params = new URLSearchParams({
    where: "1=1",
    outFields: "STNAME,STCODE11",
    outSR: "4326",
    maxAllowableOffset: "0.005",
    geometryPrecision: "4",
    f: "geojson",
  });
  // curl, not fetch: mapservice.gov.in omits its intermediate certificate, which curl
  // recovers from the system trust store and Node's fetch does not. Verification stays on.
  const json = JSON.parse(execFileSync("curl", ["-sfL", "--max-time", "120", `${SERVICE}?${params}`], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8"));
  if (!Array.isArray(json.features) || json.features.length !== 36)
    throw new Error(`expected 36 States/UTs, got ${json.features?.length}`);
  mkdirSync(dirname(SOURCE), { recursive: true });
  writeFileSync(SOURCE, JSON.stringify(json));
  console.log(`✓ fetched ${json.features.length} States/UTs → ${SOURCE}`);
}

const DEG = Math.PI / 180;
const mercator = (lonDeg, latDeg) => [lonDeg * DEG, Math.log(Math.tan(Math.PI / 4 + (latDeg * DEG) / 2))];
const [cx, cy] = mercator(CENTER[0], CENTER[1]);
/** lon/lat → viewBox units, matching d3 geoMercator with the params above. */
const project = (lon, lat) => {
  const [mx, my] = mercator(lon, lat);
  return [TRANSLATE[0] + SCALE * (mx - cx), TRANSLATE[1] - SCALE * (my - cy)];
};

function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy);
  let index = 0;
  let worst = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const d = len > 1e-9 ? Math.abs(dy * px - dx * py + bx * ay - by * ax) / len : Math.hypot(px - ax, py - ay);
    if (d > worst) [index, worst] = [i, d];
  }
  if (worst <= tol) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, index + 1), tol).slice(0, -1), ...simplify(pts.slice(index), tol)];
}

/** A ring's area in km², from lon/lat (equirectangular at the ring's latitude; ample for a threshold). */
function areaKm2(ring) {
  const lat = ring.reduce((t, p) => t + p[1], 0) / ring.length;
  const kx = 111.32 * Math.cos(lat * DEG);
  const ky = 110.57;
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * kx * ring[i + 1][1] * ky - ring[i + 1][0] * kx * ring[i][1] * ky;
  return Math.abs(a) / 2;
}

/** A hexagon of radius r — an island's minimum mark. Straight edges, so every consumer that parses rings as polygons still can. */
const hexagon = (x, y, r) =>
  Array.from({ length: 7 }, (_, i) => [x + r * Math.cos((i % 6) * (Math.PI / 3)), y + r * Math.sin((i % 6) * (Math.PI / 3))]);

const geo = JSON.parse(readFileSync(SOURCE, "utf8"));

/**
 * India's four extreme points — the northern tip of Ladakh, Indira Point, Kutch, and
 * Kibithu in Arunachal Pradesh. Simplification never moves them: shaving 4 km off a tip
 * would draw India smaller than it is, and the first bake without this cut Indira Point
 * off Great Nicobar.
 */
const EXTREMES = (() => {
  const all = geo.features.flatMap((f) => {
    const g = f.geometry;
    return (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]).flat(2);
  });
  const by = (cmp) => all.reduce((m, p) => (cmp(p, m) ? p : m));
  return [by((p, m) => p[1] > m[1]), by((p, m) => p[1] < m[1]), by((p, m) => p[0] < m[0]), by((p, m) => p[0] > m[0])];
})();
const isExtreme = (p) => EXTREMES.some((e) => e[0] === p[0] && e[1] === p[1]);

/** Douglas–Peucker that keeps the given indices: the ring is simplified between them. */
function simplifyKeeping(pts, keep, tol) {
  const cuts = [0, ...keep.filter((i) => i > 0 && i < pts.length - 1).sort((a, b) => a - b), pts.length - 1];
  const out = [];
  for (let k = 0; k < cuts.length - 1; k++) {
    const seg = simplify(pts.slice(cuts[k], cuts[k + 1] + 1), tol);
    out.push(...(k === 0 ? seg : seg.slice(1)));
  }
  return out;
}

/** Even-odd test of a lon/lat point against a ring. */
function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/** Every State/UT's mainland-sized outer rings, to tell an enclave from an island. */
const LAND = geo.features.map((f) => {
  const g = f.geometry;
  const polygons = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
  return { name: f.properties.STNAME, rings: polygons.map((p) => p[0]).filter((r) => areaKm2(r) > 50) };
});
const surroundedBy = (self, ring) => {
  const x = ring.reduce((t, p) => t + p[0], 0) / ring.length;
  const y = ring.reduce((t, p) => t + p[1], 0) / ring.length;
  return LAND.find((l) => l.name !== self && l.rings.some((r) => inRing(r, x, y)))?.name;
};

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
const audit = [];

const states = geo.features
  .map((f) => {
    const g = f.geometry;
    const polygons = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
    const name = NAME[f.properties.STNAME] ?? f.properties.STNAME;
    const rings = [];
    /** Pieces drawn at the minimum mark, kept apart so a map can draw them solid, without the white border between States/UTs. */
    const marks = [];
    let islands = 0;
    let islandsDrawn = 0;
    let enlarged = 0;
    for (const polygon of polygons) {
      polygon.forEach((ring, index) => {
        // Holes (index > 0) are kept only if large enough to draw; a hole is never enlarged.
        const km2 = areaKm2(ring);
        if (km2 < MIN_ISLAND_KM2) return;
        const projected = ring.map(([lon, lat]) => project(lon, lat));
        const keep = ring.flatMap((p, i) => (isExtreme(p) ? [i] : []));
        let pts = keep.length ? simplifyKeeping(projected, keep, TOLERANCE) : simplify(projected, TOLERANCE);
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const tooSmall = pts.length < 4 || Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) < 2 * ISLAND_R;
        const enclave = index === 0 && km2 <= 50 ? surroundedBy(f.properties.STNAME, ring) : undefined;
        const island = index === 0 && !enclave;
        if (island) islands++;
        if (tooSmall) {
          if (index > 0) return;
          if (enclave && km2 < MIN_ENCLAVE_KM2) {
            // True to size: drawn only if the simplification left it a shape at all.
            if (pts.length < 4) return;
            rings.push(pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z");
            return;
          }
          const cxr = projected.reduce((t, p) => t + p[0], 0) / projected.length;
          const cyr = projected.reduce((t, p) => t + p[1], 0) / projected.length;
          pts = hexagon(cxr, cyr, ISLAND_R);
          enlarged++;
          for (const [x, y] of pts) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
          if (island) islandsDrawn++;
          marks.push(pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z");
          return;
        }
        for (const [x, y] of pts) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
        if (island) islandsDrawn++;
        rings.push(pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z");
      });
    }
    audit.push({ name, islands, drawn: islandsDrawn, enlarged });
    return { id: String(f.properties.STCODE11), name, d: rings.join(" "), islands: marks.join(" ") };
  })
  .filter((s) => s.d || s.islands)
  .sort((a, b) => a.name.localeCompare(b.name));

// Every piece of land that is not an enclave — mainland and every island — must reach the page.
const lost = audit.filter((a) => a.drawn < a.islands);
if (states.length !== 36 || lost.length) throw new Error(`land lost in the bake: ${JSON.stringify(lost)} (${states.length} States/UTs)`);
for (const a of audit.filter((x) => x.enlarged)) console.log(`  ${a.name}: ${a.islands} islands and mainland pieces, all drawn; ${a.enlarged} pieces enlarged to the minimum mark`);

/* ── The political check ───────────────────────────────────────────────────
 * A map of India on a Government of India page must show the whole of India as
 * the Government does: Jammu and Kashmir including the territory under Pakistan's
 * occupation, Ladakh including Gilgit-Baltistan, the Shaksgam Valley and Aksai
 * Chin, Kalapani in Uttarakhand, Arunachal Pradesh whole, and every island group —
 * and nothing that is not India. The bake FAILS unless every place below lands in
 * the State/UT shown, both in the source and in the shapes drawn (the topmost
 * shape, as the map paints them). Points are well inside their territory, not on
 * a border, so the test is exact. Add a place; never remove one to make a bake pass.
 */
const POLITICAL = [
  ["Gilgit", 35.92, 74.31, "Ladakh"],
  ["Skardu", 35.3, 75.63, "Ladakh"],
  ["Hunza", 36.32, 74.66, "Ladakh"],
  ["Shaksgam Valley", 36.05, 76.55, "Ladakh"],
  ["Siachen Glacier", 35.42, 77.1, "Ladakh"],
  ["Aksai Chin", 35.2, 79.4, "Ladakh"],
  ["Demchok", 32.7, 79.45, "Ladakh"],
  ["Muzaffarabad", 34.37, 73.47, "Jammu and Kashmir"],
  ["Mirpur", 33.15, 73.75, "Jammu and Kashmir"],
  ["Srinagar", 34.08, 74.8, "Jammu and Kashmir"],
  ["Kalapani", 30.2, 80.98, "Uttarakhand"],
  ["Tawang", 27.59, 91.86, "Arunachal Pradesh"],
  ["Kibithu", 28.28, 97.02, "Arunachal Pradesh"],
  ["Great Nicobar", 7.0, 93.85, "Andaman and Nicobar Islands"],
  ["Barren Island", 12.28, 93.86, "Andaman and Nicobar Islands"],
  ["Port Blair", 11.62, 92.73, "Andaman and Nicobar Islands"],
  ["Kavaratti", 10.57, 72.64, "Lakshadweep"],
  ["Minicoy", 8.28, 73.05, "Lakshadweep"],
  ["Kanyakumari", 8.09, 77.54, "Tamil Nadu"],
  ["Diu", 20.71, 70.98, "Dadra and Nagar Haveli and Daman and Diu"],
  ["Yanam", 16.73, 82.21, "Puducherry"],
  ["Lahore", 31.55, 74.34, null],
  ["Islamabad", 33.69, 73.06, null],
  ["Peshawar", 34.01, 71.58, null],
  ["Kathmandu", 27.72, 85.32, null],
  ["Thimphu", 27.47, 89.64, null],
  ["Dhaka", 23.81, 90.41, null],
  ["Lhasa", 29.65, 91.12, null],
  ["Kashgar", 39.47, 75.99, null],
  ["Yangon", 16.84, 96.17, null],
  ["Colombo", 6.93, 79.85, null],
  ["Kachchativu (ceded to Sri Lanka, 1974)", 9.38, 79.52, null],
  ["Male", 4.18, 73.51, null],
  ["Coco Islands (Myanmar)", 14.1, 93.36, null],
];

/** Winding number of a ring around a point — non-zero means inside, as SVG fills it. */
function winding(ring, x, y) {
  let w = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const side = (xi - xj) * (y - yj) - (x - xj) * (yi - yj);
    if (yj <= y) { if (yi > y && side > 0) w++; } else if (yi <= y && side < 0) w--;
  }
  return w;
}
const ringsOf = (d) =>
  d.split("Z").map((r) => (r.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)).filter((n) => n.length >= 6)
    .map((n) => n.reduce((pts, v, i) => (i % 2 ? (pts[pts.length - 1].push(v), pts) : (pts.push([v]), pts)), []));
const sourceState = (lon, lat) => {
  for (const f of geo.features) {
    const g = f.geometry;
    for (const poly of g.type === "MultiPolygon" ? g.coordinates : [g.coordinates])
      if (inRing(poly[0], lon, lat) && !poly.slice(1).some((h) => inRing(h, lon, lat))) return NAME[f.properties.STNAME] ?? f.properties.STNAME;
  }
  return null;
};
const drawnState = (lon, lat) => {
  const [x, y] = project(lon, lat);
  let top = null;
  for (const s of states) {
    if (s.d && ringsOf(s.d).reduce((t, r) => t + winding(r, x, y), 0) !== 0) top = s.name;
    if (s.islands && ringsOf(s.islands).some((r) => winding(r, x, y) !== 0)) top = s.name;
  }
  return top;
};
const wrong = POLITICAL.flatMap(([place, lat, lon, want]) => {
  const src = sourceState(lon, lat);
  const drawn = drawnState(lon, lat);
  return src === want && drawn === want ? [] : [`${place}: expected ${want ?? "outside India"}, source ${src}, drawn ${drawn}`];
});
// India's extent as drawn must be India's extent: the four extreme points survive the bake.
for (const [name, [lon, lat]] of [["northernmost", EXTREMES[0]], ["southernmost (Indira Point)", EXTREMES[1]], ["westernmost", EXTREMES[2]], ["easternmost", EXTREMES[3]]]) {
  const [x, y] = project(lon, lat);
  const at = `M${x.toFixed(1)} ${y.toFixed(1)}`;
  const kept = states.some((st) => st.d.includes(at) || st.d.includes(`L${x.toFixed(1)} ${y.toFixed(1)}`));
  if (!kept) wrong.push(`the ${name} point (${lat}°N, ${lon}°E) was not kept`);
}
if (wrong.length) throw new Error(`political check failed:\n  ${wrong.join("\n  ")}`);
console.log(`✓ political check: ${POLITICAL.length} places in the right State/UT or outside India, in the source and as drawn; India's four extreme points kept`);

const vx = Math.floor(minX - MARGIN);
const vy = Math.floor(minY - MARGIN);
const viewBox = `${vx} ${vy} ${Math.ceil(maxX + MARGIN) - vx} ${Math.ceil(maxY + MARGIN) - vy}`;

const body = `/* GENERATED by generate-india-paths.mjs — do not edit.
   Regenerate: node packages/design-system/components/data-display/charts/geo/generate-india-paths.mjs [--fetch]

   Boundaries: Bharat Maps (NIC), State layer of BharatMapService/Admin_Boundary_District —
   simplified from 1:50,000 Survey of India topographic data, Census 2011 codes, 36 States/UTs. */

/**
 * The window onto the projected coordinate space: the land plus an ${MARGIN}-unit margin.
 *
 * The projection writes into an 800x560 space, but India occupies only its middle and is
 * very nearly square; framed at 800x560 the map was width-bound in every consumer and
 * carried empty sea on both sides (fix of 1 Sep 2026). The window is computed from the
 * baked paths, so it follows the boundaries if they ever change. The projection, the paths
 * and \`INDIA_STATE_BOXES\` share one coordinate space; a viewBox only chooses what is shown.
 */
export const INDIA_STATES_VIEWBOX = "${viewBox}";

export interface IndiaRegionPath {
  /** Census 2011 State/UT code (Bharat Maps STCODE11). */
  id: string;
  /** State/UT name, as the estate writes it (lib/kpi/geography STATE_NAMES). */
  name: string;
  /** SVG path data in the INDIA_STATES_VIEWBOX coordinate system: every piece drawn true to its shape. */
  d: string;
  /**
   * Islands (and large enclaves) too small to see, each drawn at the minimum mark at its true
   * position. Kept apart from \`d\` so a map draws them solid, WITHOUT the white border it puts
   * between States/UTs — on a 3px island that border reads as a hollow ring. "" when none.
   * Lakshadweep is all islands, so its \`d\` is "".
   */
  islands: string;
}

export const INDIA_STATES_PATHS: IndiaRegionPath[] = ${JSON.stringify(states, null, 0)
  .replace(/\},\{/g, "},\n  {")
  .replace(/^\[/, "[\n  ")
  .replace(/\]$/, ",\n]")};
`;

writeFileSync(OUTPUT, body);
console.log(`✓ wrote ${states.length} States/UTs, viewBox "${viewBox}", ${(body.length / 1024).toFixed(0)} KB → ${OUTPUT}`);
