import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rowOfEachItem } from "./description-list-rows.ts";

/**
 * `divided` strips the hairline from the grid's LAST row, because a rule under
 * the final fact hangs under nothing. Which items sit in that row is arithmetic
 * no `:nth-last-child()` gets right for every count, so it is computed — and
 * these are the counts that broke the selector versions of the same idea.
 */
const last = (rows: number[]) => rows.map((r) => r === rows[rows.length - 1]);
const plain = (n: number) => Array.from({ length: n }, (_, i) => ({ term: `t${i}`, value: i }));

describe("rowOfEachItem", () => {
  it("pairs items across two columns", () => {
    assert.deepEqual(rowOfEachItem(plain(6), 2), [0, 0, 1, 1, 2, 2]);
  });

  it("leaves an odd final item alone in its own row", () => {
    // `:nth-last-child(-n+2)` would strip the rule from item 4 as well, which
    // sits in the row ABOVE and still needs one.
    assert.deepEqual(rowOfEachItem(plain(5), 2), [0, 0, 1, 1, 2]);
    assert.deepEqual(last(rowOfEachItem(plain(5), 2)), [false, false, false, false, true]);
  });

  it("gives a wide item a row of its own", () => {
    const items = [
      { term: "a", value: 1 },
      { term: "b", value: 2, wide: true },
      { term: "c", value: 3 },
    ];
    assert.deepEqual(rowOfEachItem(items, 2), [0, 1, 2]);
  });

  it("wraps a wide item that cannot fit beside what precedes it", () => {
    const items = [
      { term: "a", value: 1 },
      { term: "b", value: 2 },
      { term: "c", value: 3, wide: true },
    ];
    assert.deepEqual(rowOfEachItem(items, 2), [0, 0, 1]);
  });

  it("puts every item on its own row in one column", () => {
    assert.deepEqual(rowOfEachItem(plain(4), 1), [0, 1, 2, 3]);
  });

  it("fills three columns before wrapping", () => {
    assert.deepEqual(rowOfEachItem(plain(7), 3), [0, 0, 0, 1, 1, 1, 2]);
  });

  it("has no rows to strip when there are no items", () => {
    assert.deepEqual(rowOfEachItem([], 2), []);
  });
});
