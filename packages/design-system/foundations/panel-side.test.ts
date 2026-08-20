import test from "node:test";
import assert from "node:assert/strict";

import {
  panelLeftFor,
  unionOf,
  PANEL_ADJACENT_GAP_PX,
  PANEL_EDGE_MARGIN_PX,
  type Rect,
} from "./panel-side.ts";

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
  // Bounded by the FAR-EDGE margin on the left and the rail clearance on the
  // right. This asserted `left >= 62` until the two were separated — which
  // baked in the bug, because 62 is the rail's reservation on the OTHER side.
  for (const width of [700, 900, 1200, 1920]) {
    const obstacles = [at(width * 0.6, 400, 300, 50)];
    const left = panelLeftFor({ obstacles, ...PANEL, viewport: { width, height: 900 } });
    assert.ok(left >= PANEL_EDGE_MARGIN_PX, `left ${left} at width ${width}`);
    assert.ok(left + 500 <= width - 62, `overflows the rail clearance at width ${width}`);
  }
});

test("a viewport too narrow for either side takes the lesser overlap", () => {
  // Even when neither side can clear the form, the panel must stay inside the
  // viewport AND clear of the rail — an overlap with the form is a compromise,
  // an overlap with the rail is a defect.
  const narrow = { width: 900, height: 900 };
  const obstacles = [at(250, 300, 400, 300)];
  const left = panelLeftFor({ obstacles, ...PANEL, viewport: narrow });
  assert.ok(Number.isFinite(left));
  assert.ok(left >= PANEL_EDGE_MARGIN_PX, `left ${left} is off-screen`);
  assert.ok(left + 500 <= narrow.width - 62, `panel runs under the rail`);
});

test("the panel NEVER runs under the rail, at any viewport width", () => {
  // The invariant, stated once and checked across the range rather than at a
  // width someone happened to try. It failed below ~640px: the clamp's left
  // bound was the RAIL CLEARANCE used as a far-edge margin, so on a narrow
  // viewport the bounds crossed, the left bound won, and the panel's right
  // edge ran 36px under the rail — the rail's glyphs sitting on the panel's
  // "Use" links.
  const RAIL_WIDTH = 52;
  for (let width = 360; width <= 1920; width += 8) {
    const panelWidth = Math.min(500, width - 78);
    if (panelWidth <= 0) continue;
    // A form on the right half, which is what forces the adjacent placement.
    const obstacles = [
      { left: width * 0.62, top: 400, right: width * 0.95, bottom: 620 },
    ];
    const left = panelLeftFor({
      obstacles, panelWidth, panelHeight: 620, inset: 62,
      viewport: { width, height: 900 },
    });
    assert.ok(
      left + panelWidth <= width - RAIL_WIDTH,
      `at ${width}px the panel (${left}..${left + panelWidth}) runs under the rail at ${width - RAIL_WIDTH}`,
    );
    assert.ok(left >= PANEL_EDGE_MARGIN_PX - 0.5, `at ${width}px the panel starts off-screen at ${left}`);
  }
});

test("the far-edge margin and the CSS max-width agree by construction", () => {
  // demo-dock.css caps the panel at `calc(100vw - 78px)`. That 78 must be the
  // rail clearance plus this margin, or the panel cannot span the gap between
  // them at the narrowest width and one of the two is silently wrong.
  assert.equal(62 + PANEL_EDGE_MARGIN_PX, 78);
});

test("an adjacent placement returns a whole pixel", () => {
  const left = panelLeftFor({
    obstacles: [at(893.4, 400, 384, 200)],
    ...PANEL, viewport: VIEWPORT,
  });
  assert.equal(left, Math.round(left), `expected a whole pixel, got ${left}`);
});
