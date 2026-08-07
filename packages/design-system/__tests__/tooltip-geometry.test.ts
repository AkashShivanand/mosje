import { describe, expect, it, beforeEach } from "vitest";
import {
  computeCoords,
  resolveSide,
  type TooltipSide,
} from "../components/feedback/tooltip";

/**
 * The tooltip's placement maths is the part most likely to regress silently —
 * a wrong flip puts the bubble off-screen, which no typecheck catches. These
 * exercise the pure geometry only; the React wiring is verified in the app.
 */

const VIEWPORT = { width: 1280, height: 800 };

/** Minimal DOMRect stand-in — the functions only read these six fields. */
function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

beforeEach(() => {
  // `resolveSide`/`computeCoords` read window dimensions directly.
  globalThis.window = {
    innerWidth: VIEWPORT.width,
    innerHeight: VIEWPORT.height,
  } as Window & typeof globalThis;
});

const bubble = rect(0, 0, 160, 32);
const OFFSET = 6;

describe("resolveSide", () => {
  it("keeps the preferred side when there is room", () => {
    const trigger = rect(600, 400, 80, 24);
    expect(resolveSide("top", trigger, bubble, OFFSET)).toBe("top");
    expect(resolveSide("bottom", trigger, bubble, OFFSET)).toBe("bottom");
  });

  it("flips top → bottom when the trigger is against the top edge", () => {
    const trigger = rect(600, 4, 80, 24);
    expect(resolveSide("top", trigger, bubble, OFFSET)).toBe("bottom");
  });

  it("flips bottom → top when the trigger is against the bottom edge", () => {
    const trigger = rect(600, VIEWPORT.height - 28, 80, 24);
    expect(resolveSide("bottom", trigger, bubble, OFFSET)).toBe("top");
  });

  it("flips left → right when the trigger is against the left edge", () => {
    const trigger = rect(2, 400, 80, 24);
    expect(resolveSide("left", trigger, bubble, OFFSET)).toBe("right");
  });

  it("falls back to the preferred side when neither side fits", () => {
    // A viewport shorter than the bubble: nothing fits, so it must not
    // ping-pong — it returns the preference and the clamp keeps it on-screen.
    globalThis.window = { innerWidth: 1280, innerHeight: 30 } as Window &
      typeof globalThis;
    const trigger = rect(600, 10, 80, 24);
    expect(resolveSide("top", trigger, bubble, OFFSET)).toBe("top");
  });
});

describe("computeCoords", () => {
  it("centres the bubble horizontally over the trigger on top/bottom", () => {
    const trigger = rect(600, 400, 80, 24);
    const { left, top } = computeCoords(trigger, bubble, "top", OFFSET);
    // trigger centre 640 − half bubble 80 = 560
    expect(left).toBe(560);
    // trigger top 400 − bubble height 32 − offset 6 = 362
    expect(top).toBe(362);
  });

  it("places the bubble below the trigger for side=bottom", () => {
    const trigger = rect(600, 400, 80, 24);
    expect(computeCoords(trigger, bubble, "bottom", OFFSET).top).toBe(430);
  });

  it("centres vertically and sits outside the trigger for side=right", () => {
    const trigger = rect(600, 400, 80, 24);
    const { left, top } = computeCoords(trigger, bubble, "right", OFFSET);
    expect(left).toBe(686); // trigger right 680 + offset 6
    expect(top).toBe(396); // 400 + 12 − 16
  });

  it("clamps to the viewport instead of overflowing the left edge", () => {
    const trigger = rect(0, 400, 24, 24);
    const { left } = computeCoords(trigger, bubble, "top", OFFSET);
    expect(left).toBe(8); // the 8px safety margin, not a negative value
  });

  it("clamps to the viewport instead of overflowing the right edge", () => {
    const trigger = rect(VIEWPORT.width - 24, 400, 24, 24);
    const { left } = computeCoords(trigger, bubble, "top", OFFSET);
    expect(left).toBe(VIEWPORT.width - bubble.width - 8);
  });

  it("reports back the side it was asked to place", () => {
    const trigger = rect(600, 400, 80, 24);
    const sides: TooltipSide[] = ["top", "bottom", "left", "right"];
    for (const s of sides) {
      expect(computeCoords(trigger, bubble, s, OFFSET).side).toBe(s);
    }
  });
});
