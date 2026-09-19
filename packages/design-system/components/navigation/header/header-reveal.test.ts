import test from "node:test";
import assert from "node:assert/strict";

import { nextReveal, REVEAL_THRESHOLD, type HeaderReveal } from "./header-reveal.ts";

const PEEL = 143; // accessibility bar 46 + identity row 97, measured at 375

/** Replay a scroll session and return the state after each position. */
function replay(ys: number[], opts: { peel?: number; holdingAt?: number[] } = {}): HeaderReveal[] {
  const peel = opts.peel ?? PEEL;
  let current: HeaderReveal = "top";
  let lastY = 0;
  return ys.map((y, i) => {
    const r = nextReveal({ y, lastY, peel, holding: !!opts.holdingAt?.includes(i), current });
    current = r.reveal;
    lastY = r.lastY;
    return current;
  });
}

test("within the masthead's own height the page decides: top", () => {
  assert.deepEqual(replay([0, 40, 100, 142]), ["top", "top", "top", "top"]);
});

test("scrolling down past it hides the masthead", () => {
  assert.deepEqual(replay([0, 100, 200, 500]), ["top", "top", "hidden", "hidden"]);
});

test("any upward flick of the threshold or more brings it back", () => {
  const states = replay([0, 500, 500 - REVEAL_THRESHOLD]);
  assert.equal(states.at(-1), "shown");
});

test("jitter under the threshold changes nothing, in either direction", () => {
  assert.deepEqual(replay([0, 500, 495, 499, 492]), ["top", "hidden", "hidden", "hidden", "hidden"]);
});

test("slow travel accumulates: four 3px steps up still turn it", () => {
  const states = replay([0, 500, 497, 494, 491, 488]);
  assert.equal(states.at(-2), "hidden");
  assert.equal(states.at(-1), "shown");
});

test("back inside the masthead's height it returns to top, however it got there", () => {
  assert.deepEqual(replay([0, 500, 480, 100]), ["top", "hidden", "shown", "top"]);
});

test("an iOS rubber-band overscroll is top, not a direction", () => {
  assert.equal(replay([0, 500, -30]).at(-1), "top");
});

test("focus or an open disclosure holds it shown, even scrolling down", () => {
  assert.deepEqual(replay([0, 500, 600, 700], { holdingAt: [2, 3] }), ["top", "hidden", "shown", "shown"]);
});

test("before the masthead is measured nothing is transformed", () => {
  assert.deepEqual(replay([0, 500, 400], { peel: 0 }), ["top", "top", "top"]);
});
