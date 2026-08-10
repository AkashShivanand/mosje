import test from "node:test";
import assert from "node:assert/strict";
import * as g from "../build/grammar.mjs";

/**
 * ONE WORD, ONE SLOT.
 *
 * The parser fills slots greedily and positionally. When a word lives in two dictionaries
 * that are reachable at the same point in the same path, the parser silently picks the
 * first and the second meaning is unreachable — no error, just a token that quietly means
 * something other than what it spells. This has now happened twice, most recently with
 * `default`, which sat in prominence, state AND the link variant simultaneously, so
 * `text/link/visited/default` parsed as a prominence and never reached the state slot.
 *
 * Two dictionaries overlapping is only a defect when they are reachable at the SAME
 * position of the SAME grammar. `bg` being both a Tier-2 ROLE (first segment) and a Tier-3
 * PROPERTY (last segment of a component path) is not ambiguity — no single position ever
 * consults both. So the guard is scoped to what the parser actually does.
 */

/** The dictionaries parseColourPath consults, in order, for a given family. */
const colourSlotSequence = (family) => [
  ["variant", g.VARIANT[family] ?? new Set()],
  ["qualifier", g.QUALIFIER],
  ["prominence", g.PROMINENCE_SLOT],
  ["state", g.STATE],
];

/**
 * Ambiguities that exist today, pinned deliberately so they cannot grow.
 *
 * These are NOT endorsements — each is the same class of defect as `default` was, and each
 * is resolved by the parser's greedy order rather than by the grammar being unambiguous.
 * They are listed rather than fixed because fixing them renames shipped tokens, which is a
 * separate, deliberate change with its own visual-contract review.
 *
 *   brand/primary|secondary|tertiary — VARIANT.brand vs INK_PROMINENCE. `text/brand/primary`
 *     resolves to the brand variant; the ink-prominence reading is unreachable for this
 *     family.
 *   link/visited — VARIANT.link vs STATE. `text/link/visited/...` resolves to the visited
 *     link FAMILY; the "canonical link in the visited state" reading is spelled
 *     `text/link/brand/visited` instead.
 */
const KNOWN_AMBIGUITIES = new Set([
  "brand: primary in variant + prominence",
  "brand: secondary in variant + prominence",
  "brand: tertiary in variant + prominence",
  "link: visited in variant + state",
]);

/** Every word reachable in two slots of one family's path, as stable `family: word in a + b`. */
function findOverlaps() {
  const found = new Set();

  for (const family of g.FAMILY) {
    const slots = colourSlotSequence(family);
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const [nameA, setA] = slots[i];
        const [nameB, setB] = slots[j];
        for (const word of setA) {
          if (setB.has(word)) found.add(`${family}: ${word} in ${nameA} + ${nameB}`);
        }
      }
    }
  }
  return found;
}

test("no word is reachable in two slots of the same colour path", () => {
  const novel = [...findOverlaps()].filter((f) => !KNOWN_AMBIGUITIES.has(f));

  assert.deepEqual(
    novel,
    [],
    `new slot ambiguity — the parser will bind these greedily and the second meaning becomes ` +
      `unreachable. Rename one of them:\n  ${novel.join("\n  ")}`,
  );
});

test("the pinned ambiguity list has no stale entries", () => {
  const found = findOverlaps();
  const stale = [...KNOWN_AMBIGUITIES].filter((k) => !found.has(k));
  assert.deepEqual(
    stale,
    [],
    `these ambiguities are fixed — delete them from KNOWN_AMBIGUITIES so the guard stays ` +
      `honest:\n  ${stale.join("\n  ")}`,
  );
});

test("`default` means exactly one thing: a state", () => {
  const holders = [
    ["prominence", g.PROMINENCE_SLOT.has("default")],
    ["state", g.STATE.has("default")],
    ["link variant", g.VARIANT.link.has("default")],
    ["qualifier", g.QUALIFIER.has("default")],
  ].filter(([, has]) => has);

  assert.deepEqual(
    holders.map(([slot]) => slot),
    ["state"],
    "`default` is the canonical STATE. It previously also occupied the prominence slot and " +
      "the link variant, which is exactly how text/link/visited/default came to parse as a " +
      "prominence. Prominence uses `base`; the link variant uses `brand`.",
  );
});

test("text/link/visited/default binds its last segment to the state slot", () => {
  const { slots } = g.parse(["text", "link", "visited", "default"], "sys");
  assert.equal(slots.state, "default");
  assert.equal(slots.prominence, undefined);
});

test("the canonical link is spelled text/link/brand/default", () => {
  const { slots } = g.parse(["text", "link", "brand", "default"], "sys");
  assert.deepEqual(slots, { role: "text", family: "link", variant: "brand", state: "default" });
});
