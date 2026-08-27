import test from "node:test";
import assert from "node:assert/strict";

import {
  panelLeftFor,
  visibleRect,
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

test("no login form leaves the panel exactly where CSS would put it", () => {
  assert.equal(panelLeftFor({ form: null, ...PANEL, viewport: VIEWPORT }), DEFAULT_LEFT);
});

test("a login form the default already clears does not move the panel", () => {
  // Far left, nowhere near a right-anchored panel.
  assert.equal(
    panelLeftFor({ form: at(60, 400, 300, 200), ...PANEL, viewport: VIEWPORT }),
    DEFAULT_LEFT,
  );
});

test("the measured NMBA login case stands the panel BESIDE the form", () => {
  // The <form> wrapping input#mobile, input#password and the submit button.
  const form = at(946, 441, 384, 227);
  const left = panelLeftFor({ form, ...PANEL, viewport: VIEWPORT });

  assert.ok(!overlaps(left, form), "panel must clear the form");
  // The point of the rule: adjacent, not exiled to the opposite edge.
  const gap = form.left - (left + 500);
  assert.equal(gap, PANEL_ADJACENT_GAP_PX, `expected a ${PANEL_ADJACENT_GAP_PX}px gap, got ${gap}`);
  assert.ok(left > 62, "should not be pinned against the far viewport edge");
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

test("never places the panel outside the viewport", () => {
  // Bounded by the FAR-EDGE margin on the left and the rail clearance on the
  // right. This asserted `left >= 62` until the two were separated — which
  // baked in the bug, because 62 is the rail's reservation on the OTHER side.
  for (const width of [700, 900, 1200, 1920]) {
    const form = at(width * 0.6, 400, 300, 200);
    const left = panelLeftFor({ form, ...PANEL, viewport: { width, height: 900 } });
    assert.ok(left >= PANEL_EDGE_MARGIN_PX, `left ${left} at width ${width}`);
    assert.ok(left + 500 <= width - 62, `overflows the rail clearance at width ${width}`);
  }
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
    const form = { left: width * 0.62, top: 400, right: width * 0.95, bottom: 620 };
    const left = panelLeftFor({
      form, panelWidth, panelHeight: 620, inset: 62, viewport: { width, height: 900 },
    });
    assert.ok(
      left + panelWidth <= width - RAIL_WIDTH,
      `at ${width}px the panel (${left}..${left + panelWidth}) runs under the rail`,
    );
    assert.ok(left >= PANEL_EDGE_MARGIN_PX - 0.5, `at ${width}px the panel starts off-screen`);
  }
});

test("the far-edge margin and the CSS max-width agree by construction", () => {
  // demo-dock.css caps the panel at `calc(100vw - 78px)`. That 78 must be the
  // rail clearance plus this margin, or the panel cannot span the gap between
  // them at the narrowest width and one of the two is silently wrong.
  assert.equal(62 + PANEL_EDGE_MARGIN_PX, 78);
});

test("an adjacent placement returns a whole pixel", () => {
  const left = panelLeftFor({ form: at(893.4, 400, 384, 200), ...PANEL, viewport: VIEWPORT });
  assert.equal(left, Math.round(left), `expected a whole pixel, got ${left}`);
});

test("a login form scrolled out of view is not dodged", () => {
  // The panel is fixed; it can only cover what is on screen.
  assert.equal(visibleRect(at(946, 1400, 384, 227), VIEWPORT), null);
  assert.equal(visibleRect(at(946, -400, 384, 200), VIEWPORT), null);
  // Half on screen clips to the half that shows.
  assert.deepEqual(visibleRect(at(1300, 400, 300, 200), VIEWPORT), {
    left: 1300, top: 400, right: 1440, bottom: 600,
  });
});

/* ── The two pages the old general obstacle scan got wrong ─────────────────
   Both are regressions, and both are now answered by the same fact: neither
   page has a login form, so `form` is null and nothing moves. They are kept
   as tests because the failure was never in the arithmetic — it was in what
   got fed to it. ── */

test("the schemes page's search box never moves the panel", () => {
  // Measured 1500x900. Its scheme search box (203..651) unioned with the UX4G
  // accessibility drawer parked off-canvas (1566..1700) made a 1497px "form"
  // nothing could clear, and the panel was thrown to left: 16.
  const viewport = { width: 1500, height: 900 };
  assert.equal(
    panelLeftFor({ form: null, ...PANEL, viewport }),
    1500 - 62 - 500,
    "a search box is not a login form",
  );
});

test("the masthead search box never moves the panel, at any window height", () => {
  // Measured 1600x860. The panel's band starts at 0.14*vh — 120.5 — and the
  // masthead search box ends at 123. That 2.5px graze relocated the panel
  // 700px from its own rail. The height sweep is the point: the old rule
  // was correct at 900 and wrong at 860, so testing one height proved
  // nothing.
  for (let height = 700; height <= 1000; height += 4) {
    const panelHeight = Math.min(680, 0.72 * height);
    const left = panelLeftFor({
      form: null, panelWidth: 500, panelHeight, inset: 62, viewport: { width: 1600, height },
    });
    assert.equal(left, 1600 - 62 - 500, `moved at height ${height}`);
  }
});
