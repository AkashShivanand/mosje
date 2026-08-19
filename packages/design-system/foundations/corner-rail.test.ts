import { test } from "node:test";
import assert from "node:assert/strict";

import {
  railOffsetFromRects,
  CORNER_RAIL_REST_PX,
  CORNER_RAIL_GAP_PX,
  MAX_RAIL_OFFSET_PX,
} from "./corner-rail.ts";

const VIEWPORT = { width: 1280, height: 800 };

/** A rect in the bottom-right corner, sized and offset like a real launcher. */
function launcher({
  size = 70,
  right = 20,
  bottom = 24,
}: { size?: number; right?: number; bottom?: number } = {}) {
  return {
    top: VIEWPORT.height - bottom - size,
    bottom: VIEWPORT.height - bottom,
    right: VIEWPORT.width - right,
    height: size,
  };
}

test("an empty corner rests at 32px", () => {
  assert.equal(railOffsetFromRects([], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("stacks above the UX4G widget's 70px trigger", () => {
  // Trigger occupies 24 → 94px from the bottom; the rail clears its top by 16.
  assert.equal(
    railOffsetFromRects([launcher()], VIEWPORT),
    24 + 70 + CORNER_RAIL_GAP_PX,
  );
});

test("stacks above the TOPMOST of several occupants", () => {
  const low = launcher({ size: 56, bottom: 24 });
  const high = launcher({ size: 48, bottom: 100 });
  assert.equal(
    railOffsetFromRects([low, high], VIEWPORT),
    100 + 48 + CORNER_RAIL_GAP_PX,
  );
});

test("ignores an occupant that is not in the bottom-right corner", () => {
  const topLeft = { top: 10, bottom: 60, right: 60, height: 50 };
  assert.equal(railOffsetFromRects([topLeft], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("ignores an occupant on the right edge but nowhere near the bottom", () => {
  const midRight = { top: 300, bottom: 350, right: 1275, height: 50 };
  assert.equal(railOffsetFromRects([midRight], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("ignores a PANEL — an open chatbot must not shove the rail up the page", () => {
  // The regression this guard exists for: a 480px conversation panel opens in
  // the same corner and the dock would otherwise fly to the top of the screen.
  const openPanel = launcher({ size: 480, bottom: 24 });
  assert.equal(railOffsetFromRects([openPanel], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("ignores a hidden (zero-height) occupant", () => {
  // Exactly the UX4G trigger's state on any page carrying an AccessibilityBar.
  const hidden = { top: 0, bottom: 0, right: 0, height: 0 };
  assert.equal(railOffsetFromRects([hidden], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("the resting offset is a FLOOR — a low occupant never pulls the rail down", () => {
  // A 20px chip pinned flush to the bottom would compute 20 + 16 = 36... but a
  // 4px-tall one would compute 20, below the rest offset. Clamped, not applied.
  const tiny = { top: 796, bottom: 800, right: 1280, height: 4 };
  assert.equal(railOffsetFromRects([tiny], VIEWPORT), CORNER_RAIL_REST_PX);
});

test("the ceiling is exactly the tallest legal occupant at the top of the zone", () => {
  // The extreme admissible case: a 140px occupant (the largest still counted
  // as a launcher) whose bottom sits right on the corner zone's upper edge.
  // Anything more extreme is excluded by one of the two guards, so this is
  // simultaneously the worst case and the ceiling — which is why the ceiling
  // is derived from them rather than chosen.
  const extreme = {
    top: VIEWPORT.height - 220 - 140,
    bottom: VIEWPORT.height - 220,
    right: VIEWPORT.width,
    height: 140,
  };
  assert.equal(railOffsetFromRects([extreme], VIEWPORT), MAX_RAIL_OFFSET_PX);
  assert.equal(MAX_RAIL_OFFSET_PX, 220 + 140 + CORNER_RAIL_GAP_PX);
});
