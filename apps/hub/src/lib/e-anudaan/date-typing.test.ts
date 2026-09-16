/**
 * Usability audit UX-09 (14 Sep 2026): "20092026" typed into Schedule Inspection's date field was
 * silently cleared on blur. The DS DatePicker's typed-date parser is tested here because the PMU
 * inspection desk is where it failed; the parser itself lives in the design system.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DATE_FORMAT_MESSAGE,
  isoToDisplay,
  parseTypedDate,
  typedDateError,
} from "../../../../../packages/design-system/components/forms/date-typing.ts";

const iso = (t: string) => {
  const r = parseTypedDate(t);
  return r.kind === "date" ? r.iso : r.kind;
};

test("reads digits only, and the three separators people type", () => {
  for (const t of ["20092026", "20/09/2026", "20-09-2026", "20.09.2026", "20 09 2026", " 20 / 09 / 2026 "]) {
    assert.equal(iso(t), "2026-09-20", t);
  }
  assert.equal(iso("5/9/2026"), "2026-09-05");
});

test("an empty field is empty, not invalid", () => {
  assert.deepEqual(parseTypedDate("   "), { kind: "empty" });
  assert.equal(typedDateError(parseTypedDate("")), null);
});

test("ambiguous entries are refused, never guessed", () => {
  for (const t of ["2092026", "200926", "20/09/26", "2026-09-20", "20th Sept", "20/09/20266"]) {
    assert.deepEqual(parseTypedDate(t), { kind: "invalid", reason: "format" }, t);
    assert.equal(typedDateError(parseTypedDate(t)), DATE_FORMAT_MESSAGE, t);
  }
});

test("a date that does not exist is caught by round-trip", () => {
  assert.deepEqual(parseTypedDate("31022027"), { kind: "invalid", reason: "nonexistent" });
  assert.match(typedDateError(parseTypedDate("31/02/2027"))!, /does not exist/);
  assert.equal(iso("29/02/2028"), "2028-02-29");
});

test("bounds are stated in the reader's own date order", () => {
  const p = parseTypedDate("01/09/2026");
  assert.equal(typedDateError(p, "2026-09-14"), "Enter a date on or after 14/09/2026.");
  assert.equal(typedDateError(p, undefined, "2026-08-31"), "Enter a date on or before 31/08/2026.");
  assert.equal(typedDateError(p, "2026-09-01", "2026-09-01"), null);
});

test("isoToDisplay round-trips the parser", () => {
  assert.equal(isoToDisplay("2026-09-20"), "20/09/2026");
  assert.equal(iso(isoToDisplay("1962-08-14")), "1962-08-14");
  assert.equal(isoToDisplay("not a date"), "");
});
