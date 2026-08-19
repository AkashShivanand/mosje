import test from "node:test";
import assert from "node:assert/strict";

import { panelSideFor, type Rect } from "./panel-side.ts";

const VIEWPORT = { width: 1440, height: 900 };
const PANEL = { panelWidth: 500, panelHeight: 648, inset: 62 };

const at = (left: number, top: number, w: number, h: number): Rect => ({
  left, top, right: left + w, bottom: top + h,
});

test("nothing to avoid keeps the panel on its preferred side", () => {
  assert.equal(
    panelSideFor({ obstacles: [], ...PANEL, viewport: VIEWPORT }),
    "right",
  );
});

test("the measured NMBA login case moves the panel off the form", () => {
  // The rects that produced the defect: the panel at right covered both
  // credential fields and the submit button.
  const obstacles = [
    at(946, 441, 384, 50),   // input#mobile
    at(946, 533, 384, 50),   // input#password
    at(946, 620, 384, 48),   // submit
  ];
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT }),
    "left",
  );
});

test("a left-aligned form pushes the panel right", () => {
  const obstacles = [at(80, 400, 380, 50), at(80, 480, 380, 50)];
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT }),
    "right",
  );
});

test("a form outside the panel's vertical band is not an obstacle", () => {
  // Far above the vertically-centred panel: no overlap either way, so the
  // preferred side stands and the panel does not move for nothing.
  const obstacles = [at(946, 4, 384, 40)];
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT }),
    "right",
  );
});

test("a centred form that both sides cover equally does not thrash", () => {
  // Symmetric about the viewport centre: overlap is identical on both sides,
  // so the tie must resolve to `preferred` rather than flip-flopping.
  const obstacles = [at((1440 - 400) / 2, 400, 400, 50)];
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT, preferred: "right" }),
    "right",
  );
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT, preferred: "left" }),
    "left",
  );
});

test("picks the lesser of two evils when both sides are partly covered", () => {
  const obstacles = [
    at(1000, 300, 380, 300), // heavily under a right-side panel
    at(200, 300, 120, 60),   // barely under a left-side panel
  ];
  assert.equal(
    panelSideFor({ obstacles, ...PANEL, viewport: VIEWPORT }),
    "left",
  );
});
