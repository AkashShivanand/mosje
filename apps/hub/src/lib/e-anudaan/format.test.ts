/**
 * Design audit M7 and M8: one money formatter, one date formatter.
 *
 * The same amount used to render as `₹24.38 L`, `₹24,38,356` and a bare `24,38,356` in three
 * places, and dates in three shapes across two locales.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { rupees, rupeesShort, formatDate } from "./format.ts";

test("rupees groups in the Indian system and always carries the symbol", () => {
  assert.equal(rupees(2438356), "₹24,38,356");
  assert.equal(rupees(0), "₹0");
  assert.equal(rupees(178200), "₹1,78,200");
});

test("rupees never emits a fraction of a rupee", () => {
  assert.equal(rupees(888.31), "₹888");
});

test("the short form abbreviates only where it saves room, and agrees below the threshold", () => {
  assert.equal(rupeesShort(2438356), "₹24.38 L");
  assert.equal(rupeesShort(15_000_000), "₹1.50 Cr");
  assert.equal(rupeesShort(99_999), rupees(99_999), "below a lakh the two forms must agree");
});

test("one date shape, from a Date or an ISO string", () => {
  assert.equal(formatDate(new Date("2026-09-03T00:00:00Z")), "03 Sep 2026");
  assert.equal(formatDate("2026-09-03T00:00:00Z"), formatDate(new Date("2026-09-03T00:00:00Z")));
});

test("the date shape is stable across months that abbreviate differently", () => {
  assert.equal(formatDate("2026-01-09T00:00:00Z"), "09 Jan 2026");
  assert.equal(formatDate("2026-12-31T00:00:00Z"), "31 Dec 2026");
});

test("September is Sep, not the locale's Sept", () => {
  // `en-IN` abbreviates September to four letters where every other month gets three, and ICU
  // data varies by runtime — so the month names are ours, not the platform's.
  assert.equal(formatDate("2026-09-03T00:00:00Z"), "03 Sep 2026");
  assert.ok(!formatDate("2026-09-03T00:00:00Z").includes("Sept"));
});

test("every month abbreviates to exactly three letters", () => {
  for (let m = 0; m < 12; m += 1) {
    const out = formatDate(new Date(2026, m, 15));
    assert.equal(out.split(" ")[1]!.length, 3, out);
  }
});

test("an unparseable date is empty, not the string 'Invalid Date'", () => {
  assert.equal(formatDate("not a date"), "");
});
