// Tests for keeping the same section on screen across a website design switch.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { normaliseHeading, rankHeadings, resolveScroll, type SectionAnchor } from "./section-anchor.ts";

test("headings compare blind to case, punctuation, apostrophes and ampersands", () => {
  assert.equal(normaliseHeading("What’s New"), normaliseHeading("Whats new"));
  assert.equal(normaliseHeading("Department of Social Justice & Empowerment"), "department of social justice and empowerment");
  assert.equal(normaliseHeading("  About Us: "), "about us");
});

test("the heading just above the reading line outranks the next one below it", () => {
  // Viewport 900: the line is at 225.
  const ranked = rankHeadings(
    [
      { text: "Our Offerings", top: 400 },
      { text: "About Us", top: 60 },
      { text: "Quote from the Prime Minister", top: -500 },
    ],
    900,
  );
  assert.deepEqual(ranked.map((h) => h.text), ["About Us", "Our Offerings", "Quote from the Prime Minister"]);
});

test("a heading printed twice is only kept once", () => {
  const ranked = rankHeadings(
    [
      { text: "Recent Documents", top: 100 },
      { text: "Recent documents", top: 700 },
    ],
    900,
  );
  assert.equal(ranked.length, 1);
});

const anchor = (headings: SectionAnchor["headings"], fraction = 0.5): SectionAnchor => ({
  path: "/website",
  headings,
  fraction,
  at: 0,
});

test("the first heading the new design also carries goes back to the same place on screen", () => {
  const found = new Map([["about us", 785]]);
  const y = resolveScroll(anchor([{ text: "Latest Updates", top: 40 }, { text: "About Us", top: 120 }]), found, 900, 8000);
  assert.equal(y, 785 - 120);
});

test("a fallback heading that was off-screen is brought back into view", () => {
  const found = new Map([["quote from the prime minister", 749]]);
  const y = resolveScroll(anchor([{ text: "Quote from the Prime Minister", top: -600 }]), found, 900, 8000);
  assert.equal(y, 749);
});

test("with nothing in common the reader keeps the same share of the page", () => {
  const y = resolveScroll(anchor([{ text: "Our Organisations", top: 50 }], 0.25), new Map(), 900, 3000);
  assert.equal(y, 750);
});

test("the answer never runs past either end of the page", () => {
  assert.equal(resolveScroll(anchor([{ text: "Footer", top: 10 }]), new Map([["footer", 5000]]), 900, 3000), 3000);
  assert.equal(resolveScroll(anchor([{ text: "Header", top: 300 }]), new Map([["header", 100]]), 900, 3000), 0);
});
