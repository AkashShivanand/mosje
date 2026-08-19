import test from "node:test";
import assert from "node:assert/strict";

import {
  railTopFromOccupants,
  WALL_RAIL_GAP_PX,
  WALL_RAIL_MARGIN_PX,
} from "./wall-rail.ts";

const VH = 900;
const RAIL = 153;
// The rule: 16px below whatever is on the wall; centred when nothing is.
const CENTRED = Math.round((VH - RAIL) / 2);

test("an empty wall centres the rail", () => {
  assert.equal(railTopFromOccupants([], RAIL, VH), CENTRED);
});

test("sits exactly 16px below Important Links, using its measured rect", () => {
  const importantLinks = { top: 378, bottom: 553 };
  const top = railTopFromOccupants([importantLinks], RAIL, VH);
  assert.equal(top - importantLinks.bottom, WALL_RAIL_GAP_PX);
});

test("that same slot also clears the corner widget, both present", () => {
  // The website. "Just below Important Links" and "just above the corner
  // widget" name the same band, so satisfying one satisfies both.
  const importantLinks = { top: 378, bottom: 553 };
  const corner = { top: 806, bottom: 876 };
  const top = railTopFromOccupants([importantLinks, corner], RAIL, VH);
  assert.equal(top - importantLinks.bottom, WALL_RAIL_GAP_PX);
  assert.ok(top + RAIL <= corner.top - WALL_RAIL_GAP_PX, "must clear the corner widget");
});

test("an occupant near the floor is sat ABOVE, since below is off-screen", () => {
  // The corner widget alone — a chatbot launcher's case. "Below" would put
  // the rail outside the viewport, so the same intent reads as "just above".
  const corner = { top: 806, bottom: 876 };
  const top = railTopFromOccupants([corner], RAIL, VH);
  assert.equal(corner.top - (top + RAIL), WALL_RAIL_GAP_PX);
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

test("falls back to centred rather than going off-screen", () => {
  // Two obstacles leaving no gap big enough. An overlap is recoverable; a
  // widget outside the viewport is not.
  const top = railTopFromOccupants(
    [{ top: 100, bottom: 260 }, { top: 300, bottom: 460 }],
    RAIL,
    600,
  );
  assert.ok(top >= 0);
  assert.ok(top + RAIL <= 600);
});

test("never places the rail outside the viewport margins", () => {
  for (const vh of [500, 700, 900, 1200]) {
    const top = railTopFromOccupants([{ top: 0, bottom: 200 }], RAIL, vh);
    assert.ok(top >= WALL_RAIL_MARGIN_PX, `top ${top} at vh ${vh}`);
  }
});

test("always returns a whole pixel, even from fractional occupant rects", () => {
  // getBoundingClientRect is fractional; an un-rounded answer put the rail at
  // 569.16 on the website, straddling a device pixel.
  const top = railTopFromOccupants([{ top: 378.4, bottom: 553.16 }], RAIL, VH);
  assert.equal(top, Math.round(top), `expected a whole pixel, got ${top}`);
  assert.equal(top, 569);
});
