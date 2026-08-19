import test from "node:test";
import assert from "node:assert/strict";

import {
  railTopFromOccupants,
  WALL_RAIL_GAP_PX,
  WALL_RAIL_MARGIN_PX,
} from "./wall-rail.ts";

const VH = 900;
const RAIL = 153;
const CENTRED = Math.round((VH - RAIL) / 2);

test("an empty wall centres the rail", () => {
  assert.equal(railTopFromOccupants([], RAIL, VH), CENTRED);
});

test("dodges the website's Important Links, using its measured rect", () => {
  // fixed [1403, 378, 37x175] on a 900-tall viewport.
  const importantLinks = { top: 378, bottom: 553 };
  const top = railTopFromOccupants([importantLinks], RAIL, VH);
  const bottom = top + RAIL;
  const clears =
    bottom <= importantLinks.top - WALL_RAIL_GAP_PX ||
    top >= importantLinks.bottom + WALL_RAIL_GAP_PX;
  assert.ok(clears, `rail ${top}-${bottom} still overlaps ${importantLinks.top}-${importantLinks.bottom}`);
});

test("picks the free band nearest the middle, not simply the first", () => {
  // A short obstacle high up leaves a big band below it, whose centre is
  // closer to the viewport middle than the sliver above.
  const top = railTopFromOccupants([{ top: 40, bottom: 120 }], RAIL, VH);
  assert.ok(top > 120, "should sit below the obstacle, in the larger band");
});

test("ignores an occupant too tall to dodge", () => {
  // A full-height sidebar or overlay cannot be avoided; trying gives a worse
  // answer than ignoring it.
  const fullHeight = { top: 0, bottom: VH };
  assert.equal(railTopFromOccupants([fullHeight], RAIL, VH), CENTRED);
});

test("merges adjacent occupants into one obstacle", () => {
  const a = { top: 300, bottom: 380 };
  const b = { top: 390, bottom: 470 };
  const top = railTopFromOccupants([a, b], RAIL, VH);
  const bottom = top + RAIL;
  assert.ok(bottom <= a.top - WALL_RAIL_GAP_PX || top >= b.bottom + WALL_RAIL_GAP_PX);
});

test("stays centred rather than going off-screen when nothing fits", () => {
  // Two obstacles leaving no gap big enough. An overlap is recoverable; a
  // widget outside the viewport is not.
  const top = railTopFromOccupants(
    [{ top: 100, bottom: 260 }, { top: 300, bottom: 460 }],
    RAIL,
    600,
  );
  assert.ok(top >= WALL_RAIL_MARGIN_PX);
  assert.ok(top + RAIL <= 600 - WALL_RAIL_MARGIN_PX + 1);
});

test("never places the rail outside the viewport margins", () => {
  for (const vh of [500, 700, 900, 1200]) {
    const top = railTopFromOccupants([{ top: 0, bottom: 200 }], RAIL, vh);
    assert.ok(top >= WALL_RAIL_MARGIN_PX, `top ${top} at vh ${vh}`);
  }
});
