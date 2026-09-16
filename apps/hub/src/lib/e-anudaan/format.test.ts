/**
 * One money rule and one date rule (design audit M7/M8, design-director audit X-03 and N-03).
 *
 * Every date here is built from a UTC instant, so the suite passes on a UTC CI runner and an IST
 * laptop alike — which is the property the IST rule exists to guarantee.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CRORE,
  LAKH,
  formatDate,
  formatDateTime,
  formatMoney,
  formatMonthShort,
  formatMonthYear,
  formatTime,
  rupees,
  rupeesShort,
} from "./format.ts";

/* ── money ─────────────────────────────────────────────────────────────── */

test("the exact form groups in the Indian system and always carries the symbol", () => {
  assert.equal(formatMoney(2438356, "exact"), "₹24,38,356");
  assert.equal(formatMoney(0, "exact"), "₹0");
  assert.equal(formatMoney(178200, "exact"), "₹1,78,200");
  assert.equal(formatMoney(222797125, "exact"), "₹22,27,97,125");
});

test("the exact form never emits a fraction of a rupee", () => {
  assert.equal(formatMoney(888.31, "exact"), "₹888");
});

test("summary is the default: lakh from ₹1 lakh, crore from ₹1 crore, two decimals", () => {
  assert.equal(formatMoney(2438356), "₹24.38 L");
  assert.equal(formatMoney(2_900_000), "₹29.00 L");
  assert.equal(formatMoney(LAKH), "₹1.00 L");
  assert.equal(formatMoney(CRORE), "₹1.00 Cr");
  assert.equal(formatMoney(222797125), "₹22.28 Cr");
  assert.equal(formatMoney(15_000_000), "₹1.50 Cr");
});

test("below the lakh threshold the summary and exact forms agree", () => {
  assert.equal(formatMoney(99_999), formatMoney(99_999, "exact"));
  assert.equal(formatMoney(99_999), "₹99,999");
});

test("the unit is chosen after rounding — never ₹100.00 L", () => {
  assert.equal(formatMoney(9_999_999), "₹1.00 Cr");
  assert.equal(formatMoney(9_999_400), "₹99.99 L");
  assert.equal(formatMoney(99_999.6), "₹1.00 L");
});

test("a shortfall keeps its sign in both forms", () => {
  assert.equal(formatMoney(-6_350_000), "-₹63.50 L");
  assert.equal(formatMoney(-6_350_000, "exact"), "-₹63,50,000");
});

test("a figure that is not a number is a dash, not NaN", () => {
  assert.equal(formatMoney(Number.NaN), "—");
  assert.equal(formatMoney(Number.POSITIVE_INFINITY, "exact"), "—");
});

test("the legacy names are the two contexts of the one formatter", () => {
  for (const n of [0, 888.31, 99_999, 2_500_000, 222_797_125]) {
    assert.equal(rupees(n), formatMoney(n, "exact"));
    assert.equal(rupeesShort(n), formatMoney(n, "summary"));
  }
});

/* ── dates ─────────────────────────────────────────────────────────────── */

test("one date shape, from a Date or an ISO string", () => {
  assert.equal(formatDate(new Date("2026-09-16T06:12:00Z")), "16 Sep 2026");
  assert.equal(formatDate("2026-09-16T06:12:00Z"), "16 Sep 2026");
});

test("one date-and-time shape: 16 Sep 2026, 11:42 AM", () => {
  // 06:12 UTC is 11:42 IST.
  assert.equal(formatDateTime("2026-09-16T06:12:00.000Z"), "16 Sep 2026, 11:42 AM");
  assert.equal(formatDateTime(new Date(Date.UTC(2026, 8, 13, 14, 17))), "13 Sep 2026, 07:47 PM");
});

test("every instant is read in India Standard Time, whatever the machine's zone", () => {
  // 20:00 UTC on 15 Sep is 01:30 on 16 Sep in India. A UTC server used to print the 15th and
  // the reader's browser the 16th for the same notification.
  assert.equal(formatDate("2026-09-15T20:00:00Z"), "16 Sep 2026");
  assert.equal(formatTime("2026-09-15T20:00:00Z"), "01:30 AM");
  assert.equal(formatDate("2026-09-16T01:30:00+05:30"), "16 Sep 2026");
});

test("a bare calendar date is that date everywhere", () => {
  assert.equal(formatDate("2015-04-01"), "01 Apr 2015");
  assert.equal(formatDate("2026-12-31"), "31 Dec 2026");
});

test("September is Sep, not the locale's Sept, and every month is three letters", () => {
  assert.ok(!formatDate("2026-09-03T00:00:00Z").includes("Sept"));
  for (let m = 0; m < 12; m += 1) {
    const out = formatDate(new Date(Date.UTC(2026, m, 15, 6)));
    assert.equal(out.split(" ")[1]!.length, 3, out);
  }
});

test("an unparseable date is empty, not the string 'Invalid Date'", () => {
  assert.equal(formatDate("not a date"), "");
  assert.equal(formatDateTime("nope"), "");
  assert.equal(formatTime("nope"), "");
});

test("one time shape: 12-hour, zero-padded, upper-case AM/PM; a bare HH:mm is read as written", () => {
  assert.equal(formatTime("10:30"), "10:30 AM");
  assert.equal(formatTime("18:25"), "06:25 PM");
  assert.equal(formatTime("00:05"), "12:05 AM");
  assert.equal(formatTime("12:00"), "12:00 PM");
  assert.equal(formatTime("25:00"), "");
});

test("months name themselves without the locale's Sept", () => {
  assert.equal(formatMonthYear("2026-09-01T00:00:00.000Z"), "September 2026");
  assert.equal(formatMonthShort("2026-09-01T00:00:00.000Z"), "Sep 26");
});
