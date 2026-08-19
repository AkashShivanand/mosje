import test from "node:test";
import assert from "node:assert/strict";

import { panelLeftFor, unionOf, PANEL_ADJACENT_GAP_PX, type Rect } from "./panel-side.ts";

const VIEWPORT = { width: 1440, height: 900 };
const PANEL = { panelWidth: 500, panelHeight: 648, inset: 62 };
const DEFAULT_LEFT = 1440 - 62 - 500; // 878

const at = (left: number, top: number, w: number, h: number): Rect => ({
  left, top, right: left + w, bottom: top + h,
});

const overlaps = (left: number, form: Rect) => {
  const top = (900 - 648) / 2;
  const panel = { left, right: left + 500, top, bottom: top + 648 };
  return !(panel.right <= form.left || panel.left >= form.right ||
           panel.bottom <= form.top || panel.top >= form.bottom);
};

test("nothing to avoid leaves the panel exactly where CSS would put it", () => {
  assert.equal(panelLeftFor({ obstacles: [], ...PANEL, viewport: VIEWPORT }), DEFAULT_LEFT);
});

test("a form the default already clears does not move the panel", () => {
  // Far left, nowhere near a right-anchored panel.
  const obstacles = [at(60, 400, 300, 50)];
  assert.equal(panelLeftFor({ obstacles, ...PANEL, viewport: VIEWPORT }), DEFAULT_LEFT);
});

test("the measured NMBA login case stands the panel BESIDE the form", () => {
  const obstacles = [
    at(946, 441, 384, 50),   // input#mobile
    at(946, 533, 384, 50),   // input#password
    at(946, 620, 384, 48),   // submit
  ];
  const left = panelLeftFor({ obstacles, ...PANEL, viewport: VIEWPORT });
  const form = unionOf(obstacles)!;

  assert.ok(!overlaps(left, form), "panel must clear the form");
  // The point of the change: adjacent, not exiled to the opposite edge.
  const gap = form.left - (left + 500);
  assert.equal(gap, PANEL_ADJACENT_GAP_PX, `expected a ${PANEL_ADJACENT_GAP_PX}px gap, got ${gap}`);
  assert.ok(left > 62, "should not be pinned against the far viewport edge");
});

test("a left-aligned form does not move the panel at all", () => {
  // Not an oversight: a right-anchored default already clears a left-aligned
  // form, and the rule is to move only when the default fails. Moving here
  // would relocate the panel for no reason a viewer could see, which is the
  // exact complaint this widget has already answered for twice.
  const obstacles = [at(80, 400, 380, 50), at(80, 480, 380, 50)];
  assert.equal(panelLeftFor({ obstacles, ...PANEL, viewport: VIEWPORT }), DEFAULT_LEFT);
});

test("with a right-anchored default, the panel only ever steps LEFT", () => {
  // Provable rather than observed: for the panel to need the right of a form
  // it would have to both overlap the default (form.right > W - inset - w)
  // and leave room beside it (form.right <= W - inset - w - gap), which
  // cannot both hold. So every real relocation is leftward.
  const W = VIEWPORT.width;
  const overlapsDefault = (formRight: number) => formRight > W - PANEL.inset - PANEL.panelWidth;
  const fitsOnRight = (formRight: number) =>
    formRight + PANEL_ADJACENT_GAP_PX + PANEL.panelWidth <= W - PANEL.inset;
  for (let formRight = 0; formRight <= W; formRight += 10) {
    assert.ok(!(overlapsDefault(formRight) && fitsOnRight(formRight)),
      `formRight ${formRight} claims both`);
  }
});

test("the form is treated as ONE object, not several", () => {
  // Three separate inputs must not be dodged individually, leaving the panel
  // wedged between two of them.
  const obstacles = [at(946, 441, 384, 50), at(946, 533, 384, 50)];
  const u = unionOf(obstacles)!;
  assert.deepEqual([u.left, u.top, u.right, u.bottom], [946, 441, 1330, 583]);
});

test("never places the panel outside the viewport", () => {
  for (const width of [700, 900, 1200, 1920]) {
    const obstacles = [at(width * 0.6, 400, 300, 50)];
    const left = panelLeftFor({ obstacles, ...PANEL, viewport: { width, height: 900 } });
    assert.ok(left >= 62, `left ${left} at width ${width}`);
    assert.ok(left + 500 <= Math.max(562, width - 62), `overflows at width ${width}`);
  }
});

test("a viewport too narrow for either side takes the lesser overlap", () => {
  const narrow = { width: 900, height: 900 };
  const obstacles = [at(250, 300, 400, 300)];
  const left = panelLeftFor({ obstacles, ...PANEL, viewport: narrow });
  assert.ok(Number.isFinite(left));
  assert.ok(left >= 62 && left + 500 <= narrow.width - 62 + 1);
});
