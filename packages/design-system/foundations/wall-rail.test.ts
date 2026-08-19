import test from "node:test";
import assert from "node:assert/strict";

import {
  railTopFromOccupants,
  WALL_RAIL_GAP_PX,
  WALL_RAIL_MARGIN_PX,
} from "./wall-rail.ts";

const VH = 900;
const RAIL = 153;
// The rail rests LOW on the wall, not centred: it is a utility, and the two
// things it coexists with (Important Links above, the corner widget below)
// leave exactly one sensible band between them.
const REST = VH - RAIL - WALL_RAIL_MARGIN_PX;

test("an empty wall rests the rail low, above the bottom margin", () => {
  assert.equal(railTopFromOccupants([], RAIL, VH), REST);
});

test("stacks ABOVE a corner occupant, which is where a chatbot will sit", () => {
  const corner = { top: 806, bottom: 876 };  // the UX4G trigger, measured
  const top = railTopFromOccupants([corner], RAIL, VH);
  assert.ok(top + RAIL <= corner.top - WALL_RAIL_GAP_PX,
    `rail bottom ${top + RAIL} must clear ${corner.top - WALL_RAIL_GAP_PX}`);
});

test("sits BELOW Important Links and ABOVE the corner widget at once", () => {
  // The website: both descriptions of the right answer are the same band.
  const importantLinks = { top: 378, bottom: 553 };
  const corner = { top: 806, bottom: 876 };
  const top = railTopFromOccupants([importantLinks, corner], RAIL, VH);
  assert.ok(top >= importantLinks.bottom + WALL_RAIL_GAP_PX, "must be below Important Links");
  assert.ok(top + RAIL <= corner.top - WALL_RAIL_GAP_PX, "must be above the corner widget");
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

test("prefers the LOWEST band that fits, not the nearest the centre", () => {
  // An earlier rule took the band nearest the viewport middle, which on the
  // website put the rail at y=117 - above Important Links, hard against the
  // masthead.
  const top = railTopFromOccupants([{ top: 378, bottom: 553 }], RAIL, VH);
  assert.ok(top > 553, `expected the band below, got top ${top}`);
});

test("ignores an occupant too tall to dodge", () => {
  // A full-height sidebar or overlay cannot be avoided; trying gives a worse
  // answer than ignoring it.
  const fullHeight = { top: 0, bottom: VH };
  assert.equal(railTopFromOccupants([fullHeight], RAIL, VH), REST);
});

test("merges adjacent occupants into one obstacle", () => {
  const a = { top: 300, bottom: 380 };
  const b = { top: 390, bottom: 470 };
  const top = railTopFromOccupants([a, b], RAIL, VH);
  const bottom = top + RAIL;
  assert.ok(bottom <= a.top - WALL_RAIL_GAP_PX || top >= b.bottom + WALL_RAIL_GAP_PX);
});

test("falls back to the resting position rather than going off-screen", () => {
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
