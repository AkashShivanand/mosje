/* ============================================================================
   "Is this coordinate actually standing on Indian land?"

   `repairIndiaCoordinate` answers a cheaper question — is the pair inside the
   country's bounding BOX, and is it the right way round. That catches absent,
   zeroed and transposed coordinates, which is most of the damage in a
   government point feed. It cannot catch the next class down: a coordinate that
   is perfectly plausible, passes every range check, and puts a village in the
   Arabian Sea.

   PM-AJAY's feed has 33 aggregation cells' worth of those. Drawn, they are pale
   hexes adrift off Gujarat and Kerala that a reader reads as a bug in the map
   rather than a defect in the data.
   ============================================================================ */

import { INDIA_STATES_PATHS } from "./india-states.paths.ts";
import { projectIndia } from "./india-projection.ts";

interface Ring {
  pts: Float64Array;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Every closed ring of every state, with its bounding box, built once on first
 * use rather than at module load.
 *
 * LAZY BECAUSE MOST CALLERS NEVER NEED IT. The map component imports the paths
 * to draw them and never asks this question; only the PM-AJAY reduce does, and
 * only on the server. Parsing ~7,000 points into typed arrays at import time
 * would put that cost on every page that renders any chart.
 */
let RINGS: Ring[] | null = null;

function rings(): Ring[] {
  if (RINGS) return RINGS;
  const out: Ring[] = [];
  for (const region of INDIA_STATES_PATHS) {
    for (const chunk of region.d.split("Z")) {
      const nums = chunk.match(/-?\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 6) continue;
      const pts = new Float64Array(nums.length - (nums.length % 2));
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < pts.length; i += 2) {
        const x = Number(nums[i]);
        const y = Number(nums[i + 1]);
        pts[i] = x;
        pts[i + 1] = y;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      out.push({ pts, minX, minY, maxX, maxY });
    }
  }
  RINGS = out;
  return out;
}

/** Even-odd crossing test against one ring, in viewBox units. */
function inRing(ring: Ring, x: number, y: number): boolean {
  const p = ring.pts;
  let inside = false;
  for (let i = 0, j = p.length - 2; i < p.length; j = i, i += 2) {
    const xi = p[i]!;
    const yi = p[i + 1]!;
    const xj = p[j]!;
    const yj = p[j + 1]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * How far a point may sit outside the baked outline and still count as land,
 * in viewBox units. 6 units is roughly 25 km at this projection's scale.
 *
 * A TOLERANCE IS REQUIRED, NOT OPTIONAL. The outline is quantised TopoJSON: it
 * is a simplified coast, not a survey. A village genuinely standing on the
 * Konkan shore falls outside it often enough that a strict test would report
 * ~58 of PM-AJAY's cells as bad data when they are nothing of the kind. The
 * tolerance is set where the measured distribution has its gap — 58 cells lie
 * within 6 units of land, and the next one out is at 9.
 */
const LAND_TOLERANCE = 6;

/** The eight compass offsets used to dilate the test by the tolerance. */
const DIRS: readonly (readonly [number, number])[] = [
  [1, 0],
  [0.7071, 0.7071],
  [0, 1],
  [-0.7071, 0.7071],
  [-1, 0],
  [-0.7071, -0.7071],
  [0, -1],
  [0.7071, -0.7071],
];

/**
 * Whether a longitude/latitude stands on (or acceptably near) Indian land.
 *
 * ── WHAT A `false` MEANS, AND WHAT IT DOES NOT ──────────────────────────────
 *
 * It means the published coordinate does not correspond to a place inside
 * India. It does NOT mean the record is fictitious — the village exists, and
 * its state and district are recorded; what is wrong is one field. So a caller
 * must COUNT such a record and merely decline to draw it, exactly as it treats
 * a missing coordinate. Silently deleting it would make a map's own totals
 * disagree with the department's.
 *
 * ── AND IT IS NOT A BORDER RULING ───────────────────────────────────────────
 *
 * The outline is a simplified rendering asset, and the tolerance above is
 * deliberately generous. This function is a data-quality check on a feed, and
 * nothing here should ever be read as a statement about a boundary.
 */
export function isOnIndianLand(lon: number, lat: number): boolean {
  const [x, y] = projectIndia(lon, lat);
  const rs = rings();
  const t = LAND_TOLERANCE;

  // Exact hit first — the overwhelmingly common case, and the cheapest.
  for (const r of rs) {
    if (x < r.minX - t || x > r.maxX + t || y < r.minY - t || y > r.maxY + t) continue;
    if (inRing(r, x, y)) return true;
  }
  // Then dilate: eight probes at the tolerance radius. Cheaper and steadier
  // than a true distance-to-polygon, and at this scale indistinguishable.
  for (const [dx, dy] of DIRS) {
    const px = x + dx * t;
    const py = y + dy * t;
    for (const r of rs) {
      if (px < r.minX || px > r.maxX || py < r.minY || py > r.maxY) continue;
      if (inRing(r, px, py)) return true;
    }
  }
  return false;
}
