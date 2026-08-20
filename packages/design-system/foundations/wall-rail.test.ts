import test from "node:test";
import assert from "node:assert/strict";

import {
  railTopFromOccupants,
  WALL_RAIL_GAP_PX,
  WALL_RAIL_MARGIN_PX,
  wallNeedsCompact,
} from "./wall-rail.ts";

const VH = 900;
const RAIL = 153;
// The rule: 16px below whatever is on the wall; centred when nothing is.
const CENTRED = Math.round((VH - RAIL) / 2);

test("an empty wall centres the rail", () => {
  assert.equal(railTopFromOccupants([], RAIL, VH), CENTRED);
});

test("centres on the height it HAS, not the height it reserves", () => {
  // The rail reserves its open height (153) so the drawer has somewhere to
  // go, but it is folded (56) almost always. Centring on the reserve put the
  // visible tab 48px above the true centre — centred on nothing a viewer can
  // see. The tab's own centre must land on the viewport's.
  const FOLDED = 56;
  const top = railTopFromOccupants([], RAIL, VH, FOLDED);
  assert.equal(top + FOLDED / 2, VH / 2, `tab centre ${top + FOLDED / 2} != ${VH / 2}`);
});

test("the open state still fits after centring on the folded one", () => {
  // Centring on the smaller number must not push the OPEN rail past the
  // bottom margin — the reserve is still what every fit test uses.
  const FOLDED = 56;
  for (const vh of [560, 700, 900, 1200]) {
    const top = railTopFromOccupants([], RAIL, vh, FOLDED);
    assert.ok(top >= WALL_RAIL_MARGIN_PX, `top ${top} at vh ${vh}`);
    assert.ok(top + RAIL <= vh - WALL_RAIL_MARGIN_PX, `open rail overflows at vh ${vh}`);
  }
});

test("a folded rail still dodges an occupant using its OPEN height", () => {
  // The danger of centring on the folded height: the fit test must still use
  // the reserve, or the drawer would open straight into the occupant below.
  const FOLDED = 56;
  const occupant = { top: 500, bottom: 560 };
  const top = railTopFromOccupants([occupant], RAIL, VH, FOLDED);
  const clears =
    top + RAIL <= occupant.top - WALL_RAIL_GAP_PX ||
    top >= occupant.bottom + WALL_RAIL_GAP_PX;
  assert.ok(clears, `open rail ${top}-${top + RAIL} hits ${occupant.top}-${occupant.bottom}`);
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

test("a CORNER widget does not move the rail — centred is already clear", () => {
  // The portals. The accessibility trigger (and the assistant launcher) sit at
  // roughly 806-876 while the centred rail spans 373-526; they never touch.
  // Treating "on the wall" as "in the way" parked the rail at 637 on every
  // portal, off-centre to avoid something 280px away.
  const corner = { top: 806, bottom: 876 };
  const top = railTopFromOccupants([corner], RAIL, VH);
  assert.equal(top, CENTRED);
  assert.ok(top + RAIL < corner.top, "and it genuinely clears it");
});

test("only an occupant overlapping the CENTRE displaces the rail", () => {
  // Important Links straddles the middle of the wall, so it does.
  const straddling = { top: 378, bottom: 553 };
  assert.notEqual(railTopFromOccupants([straddling], RAIL, VH), CENTRED);
  // Anything clear of the centred slot does not, wherever it sits.
  for (const clearOfCentre of [{ top: 40, bottom: 120 }, { top: 700, bottom: 800 }]) {
    assert.equal(railTopFromOccupants([clearOfCentre], RAIL, VH), CENTRED);
  }
});

test("an occupant overlapping the centre with no room below is sat ABOVE", () => {
  // The remaining fallback: it must straddle the centre AND leave nothing
  // beneath it, which is rare now that centred is tried first.
  const tall = { top: 420, bottom: 800 };
  const top = railTopFromOccupants([tall], RAIL, VH);
  assert.ok(top + RAIL <= tall.top - WALL_RAIL_GAP_PX, `expected above, got ${top}`);
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

// ── Compact mode ─────────────────────────────────────────────────────────

test("a tall viewport holds everything at full size", () => {
  // Important Links 175 + chatbot 84 + rail 153 + 2 gaps + 2 margins = 460.
  assert.equal(wallNeedsCompact([175, 84], RAIL, 900), false);
});

test("a short viewport asks the occupants to shed their labels", () => {
  assert.equal(wallNeedsCompact([175, 84], RAIL, 440), true);
});

test("an empty wall is never compact", () => {
  // Nothing to shed and nothing to collide with; compacting would strip a
  // label to solve a problem that does not exist.
  assert.equal(wallNeedsCompact([], RAIL, 200), false);
});

test("the decision does NOT change when the labels come off", () => {
  // The oscillation guard, stated as a test. Naturals are declared, so the
  // second evaluation sees the same input as the first and the state settles
  // instead of flapping every frame.
  const naturals = [175, 84];
  const first = wallNeedsCompact(naturals, RAIL, 440);
  const second = wallNeedsCompact(naturals, RAIL, 440);
  assert.equal(first, second);
  assert.equal(first, true);
});

test("the RESTING tab clears occupants even when the open rail cannot", () => {
  // A wall with no band big enough for the 153 reserve, but room for the 56
  // tab. The visible widget must not overlap; the drawer may, while open.
  const FOLDED = 56;
  const occupants = [{ top: 120, bottom: 200 }, { top: 320, bottom: 400 }];
  const top = railTopFromOccupants(occupants, RAIL, 520, FOLDED);
  const clearsFolded = occupants.every(
    (o) => top + FOLDED <= o.top - WALL_RAIL_GAP_PX || top >= o.bottom + WALL_RAIL_GAP_PX,
  );
  assert.ok(clearsFolded, `folded tab ${top}-${top + FOLDED} overlaps an occupant`);
});

test("the clamp respects the height the FALLBACK chose, not the reserve", () => {
  // The measured regression, at 360px tall with Important Links compacted to
  // 52px at top 151. The resting-height fallback picks 219; a clamp bounded
  // by the 153 reserve drags it to 183 — straight back onto the occupant it
  // was placed to avoid. Each clamp must use the height it is clamping for.
  const FOLDED = 105;
  const occupant = { top: 151, bottom: 203 };
  const top = railTopFromOccupants([occupant], RAIL, 360, FOLDED);
  const clears =
    top + FOLDED <= occupant.top - WALL_RAIL_GAP_PX ||
    top >= occupant.bottom + WALL_RAIL_GAP_PX;
  assert.ok(clears, `folded rail ${top}-${top + FOLDED} overlaps ${occupant.top}-${occupant.bottom}`);
  assert.ok(top + FOLDED <= 360 - WALL_RAIL_MARGIN_PX, "and stays on screen");
});
