// Run: node --test src/lib/e-anudaan/weekly-attendance.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { LONG_ABSENCE_DAYS, STAFF_THRESHOLD_PERCENT, markOn, mondayOf, readWeek } from "./weekly-attendance.ts";

const now = new Date(2026, 8, 17, 12); // Thursday 17 Sep 2026
const people = Array.from({ length: 200 }, (_, i) => ({ id: `ben-${i}`, name: `Person ${i}` }));

test("the week starts on Monday and days after today carry no mark", () => {
  assert.equal(mondayOf(now).getDate(), 14);
  const w = readWeek(people.slice(0, 3), "beneficiaries", now, now, undefined);
  assert.equal(w.recordedDays, 4);
  for (const r of w.rows) assert.deepEqual(r.marks.slice(4), [null, null, null]);
});

test("marks are deterministic", () => {
  const d = new Date(2026, 7, 3);
  assert.equal(markOn("ben-7", "beneficiaries", d, now, undefined), markOn("ben-7", "beneficiaries", d, now, undefined));
});

test("a project not yet owing returns has no marks at all", () => {
  const w = readWeek(people.slice(0, 5), "beneficiaries", new Date(2026, 8, 7), now, null);
  assert.equal(w.recordedDays, 0);
  assert.equal(w.percent, null);
  assert.ok(w.rows.every((r) => r.percent === null && !r.flag));
});

test("marks begin on the day returns are owed from", () => {
  const w = readWeek(people.slice(0, 2), "beneficiaries", new Date(2026, 8, 7), now, "2026-09-10T00:00:00.000Z");
  assert.equal(w.recordedDays, 4); // Thu 10 – Sun 13
  assert.deepEqual(w.rows[0]!.marks.slice(0, 3), [null, null, null]);
});

test("the total is person-days present over person-days owed, and the flags follow the rules", () => {
  const w = readWeek(people, "beneficiaries", new Date(2026, 8, 7), now, undefined);
  const present = w.rows.reduce((n, r) => n + r.present, 0);
  const owed = w.rows.reduce((n, r) => n + r.recorded, 0);
  assert.equal(w.percent, Math.round((present / owed) * 1000) / 10);
  assert.equal(w.flagged, w.rows.filter((r) => r.flag).length);
  for (const r of w.rows) assert.equal(r.flag === "long-absence", r.absentStreak >= LONG_ABSENCE_DAYS, r.id);

  const staff = readWeek(people.slice(0, 40).map((p) => ({ ...p, id: `emp-${p.id}` })), "staff", new Date(2026, 8, 7), now, undefined);
  for (const r of staff.rows) assert.equal(r.flag === "below-threshold", r.percent !== null && r.percent < STAFF_THRESHOLD_PERCENT, r.id);
  assert.ok(staff.flagged > 0, "the demo roster has staff below the threshold");
});
