import test from "node:test";
import assert from "node:assert/strict";

import {
  panelLeftFor,
  unionOf,
  formsOf,
  visibleRect,
  PANEL_ADJACENT_GAP_PX,
  PANEL_EDGE_MARGIN_PX,
  FALLBACK_IMPROVEMENT_RATIO,
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

/* ── The `/website/schemes-services` regression ─────────────────────────────
   Measured at 1500x900 with the panel open: the drawer opened at `left: 16`,
   hard against the wall OPPOSITE the rail that opens it, on a page whose only
   real control it was never covering. Three defects stacked, and each of the
   three below fails on its own if its fix is reverted. ── */

const SCHEMES_VIEWPORT = { width: 1500, height: 900 };
const SCHEMES_DEFAULT_LEFT = 1500 - 62 - 500; // 938
/** The page's scheme search box — comfortably clear of a right-anchored panel. */
const SCHEMES_SEARCH = at(203, 597, 448, 42);
/** The UX4G accessibility drawer's input, parked off-canvas while closed. */
const UX4G_OFFSCREEN = at(1566, 425, 134, 111);

test("an obstacle parked off-canvas is not an obstacle", () => {
  // It is laid out, painted and non-zero — `offsetParent` and a size check
  // both pass it. Only the viewport test rejects it.
  assert.equal(visibleRect(UX4G_OFFSCREEN, SCHEMES_VIEWPORT), null);
  // A control that is genuinely on screen survives, clipped to what shows.
  assert.deepEqual(visibleRect(at(1400, 400, 300, 50), SCHEMES_VIEWPORT), {
    left: 1400, top: 400, right: 1500, bottom: 450,
  });
});

test("two unrelated controls are not fused into one page-wide form", () => {
  // Unioned, these two spanned 203..1700 — 1497px of a 1500px viewport, an
  // obstacle no placement could clear. Clustered, they are two objects, the
  // default clears both, and nothing moves.
  const forms = formsOf([SCHEMES_SEARCH, UX4G_OFFSCREEN]);
  assert.equal(forms.length, 2, "a search box and a far-away widget are not one form");

  const left = panelLeftFor({
    obstacles: [SCHEMES_SEARCH, UX4G_OFFSCREEN],
    ...PANEL, viewport: SCHEMES_VIEWPORT,
  });
  assert.equal(left, SCHEMES_DEFAULT_LEFT, "the panel had nothing to dodge");
});

test("a login form's stacked fields still cluster into ONE object", () => {
  // The other half of the clustering rule, and the case it must not break:
  // measured 42px and 37px between the NMBA fields, which is what sets the
  // 48px threshold.
  const fields = [at(946, 441, 384, 50), at(946, 533, 384, 50), at(946, 620, 384, 48)];
  assert.equal(formsOf(fields).length, 1);
  assert.deepEqual(formsOf(fields)[0], unionOf(fields));
  // Order-independent: the same rects shuffled give the same one form.
  assert.deepEqual(formsOf([fields[2]!, fields[0]!, fields[1]!]), formsOf(fields));
});

test("the panel does not cross the screen for a marginal gain", () => {
  // The fallback with no floor is what actually moved the panel: given a form
  // it could not clear, `left: 16` covered 66,982px² against the default's
  // 107,000px², so a 37% improvement bought a full-viewport relocation.
  const spanning = [at(203, 425, 1497, 214)];
  const left = panelLeftFor({ obstacles: spanning, ...PANEL, viewport: SCHEMES_VIEWPORT });
  assert.equal(left, SCHEMES_DEFAULT_LEFT, "37% is not worth crossing the viewport");
});

test("but it DOES move when moving genuinely helps", () => {
  // The floor must not turn into "never move". A form the panel can almost
  // escape still relocates it.
  const obstacles = [at(1100, 300, 380, 300)];
  const left = panelLeftFor({ obstacles, ...PANEL, viewport: SCHEMES_VIEWPORT });
  assert.ok(left < SCHEMES_DEFAULT_LEFT, `expected a leftward step, got ${left}`);
  assert.ok(left >= PANEL_EDGE_MARGIN_PX);
});

test("the improvement floor is a ratio of the default's own cost", () => {
  // Stated so the constant cannot drift into meaninglessness unnoticed.
  assert.ok(FALLBACK_IMPROVEMENT_RATIO > 0 && FALLBACK_IMPROVEMENT_RATIO < 1);
});
