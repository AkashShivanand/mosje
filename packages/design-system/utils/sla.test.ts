import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SLA_DEFAULT_THRESHOLDS,
  slaConsumed,
  slaFractionForRemaining,
  slaRemaining,
  slaStatus,
  slaSummary,
  slaTone,
  slaValueText,
} from "./sla.ts";

test("derives the ordinary statuses from the fraction consumed", () => {
  const total = 20;
  assert.equal(slaStatus({ total, elapsed: 0 }), "on-track");
  assert.equal(slaStatus({ total, elapsed: 14 }), "on-track"); // 70%
  assert.equal(slaStatus({ total, elapsed: 15 }), "due-soon"); // 75% — exactly on the threshold
  assert.equal(slaStatus({ total, elapsed: 17 }), "due-soon"); // 85%
  assert.equal(slaStatus({ total, elapsed: 18 }), "at-risk"); // 90% — exactly on
  assert.equal(slaStatus({ total, elapsed: 20 }), "at-risk"); // 100% used, not yet over
  assert.equal(slaStatus({ total, elapsed: 21 }), "breached");
});

test("a stopped clock outranks the thresholds", () => {
  // The department is waiting on the applicant. Escalating a warning for time the officer is
  // not accountable for is both wrong and corrosive to trust in the number.
  assert.equal(slaStatus({ total: 20, elapsed: 19, paused: true }), "paused");
  assert.equal(slaStatus({ total: 20, elapsed: 25, paused: true }), "paused");
});

test("completion separates met from missed, and outranks everything", () => {
  assert.equal(slaStatus({ total: 20, elapsed: 12, completed: true }), "met");
  assert.equal(slaStatus({ total: 20, elapsed: 20, completed: true }), "met", "on the deadline is met");
  assert.equal(slaStatus({ total: 20, elapsed: 21, completed: true }), "missed");
  // A delivered service is finished even if the clock was paused when it landed.
  assert.equal(slaStatus({ total: 20, elapsed: 12, completed: true, paused: true }), "met");
});

test("breached and missed are distinct — one is still failing, the other has closed", () => {
  // Reports need to separate "we are currently in breach" from "we breached and finished".
  assert.equal(slaStatus({ total: 10, elapsed: 15 }), "breached");
  assert.equal(slaStatus({ total: 10, elapsed: 15, completed: true }), "missed");
});

test("thresholds are configurable, and absolute rules convert cleanly", () => {
  // NHAPOA's real rule: 30-day allowance, warn at 5 days remaining.
  const total = 30;
  const dueSoonAt = slaFractionForRemaining(total, 5);
  assert.equal(dueSoonAt, 25 / 30);
  assert.equal(slaStatus({ total, elapsed: 24, thresholds: { dueSoonAt } }), "on-track");
  assert.equal(slaStatus({ total, elapsed: 25, thresholds: { dueSoonAt } }), "due-soon");
});

test("slaFractionForRemaining is clamped and safe at the edges", () => {
  assert.equal(slaFractionForRemaining(30, 40), 0, "more remaining than the total");
  assert.equal(slaFractionForRemaining(30, -5), 1, "already overdue");
  assert.equal(slaFractionForRemaining(0, 5), 1, "no allowance");
});

test("a zero or negative allowance never divides by zero", () => {
  assert.equal(slaConsumed({ total: 0, elapsed: 0 }), 1);
  assert.equal(slaStatus({ total: 0, elapsed: 0 }), "at-risk");
  assert.equal(slaConsumed({ total: -5, elapsed: 3 }), 1);
});

test("remaining goes negative once overdue", () => {
  assert.equal(slaRemaining({ total: 20, elapsed: 5 }), 15);
  assert.equal(slaRemaining({ total: 20, elapsed: 23 }), -3);
});

test("tone maps status to a semantic colour family, with paused deliberately neutral", () => {
  assert.equal(slaTone("on-track"), "primary");
  assert.equal(slaTone("due-soon"), "warning");
  assert.equal(slaTone("at-risk"), "danger");
  assert.equal(slaTone("breached"), "danger");
  assert.equal(slaTone("missed"), "danger");
  assert.equal(slaTone("met"), "success");
  assert.equal(slaTone("paused"), "neutral", "a stopped clock carries no urgency");
});

test("the summary always states a concrete time, never a vague status", () => {
  // UX4G calls out "Processing…" as a Don't: a vague status is what erodes confidence in a
  // service guarantee. Every branch must name a number and a unit.
  const cases = [
    { input: { total: 20, elapsed: 5 }, expect: "15 days left" },
    { input: { total: 20, elapsed: 19 }, expect: "1 day left" },
    { input: { total: 20, elapsed: 23 }, expect: "3 days overdue" },
    { input: { total: 20, elapsed: 12, completed: true }, expect: "Delivered in 12 days" },
    { input: { total: 20, elapsed: 24, completed: true }, expect: "Delivered late — 4 days over" },
    { input: { total: 20, elapsed: 8, paused: true }, expect: "Paused — 12 days left when resumed" },
  ];
  for (const c of cases) {
    assert.equal(slaSummary(c.input), c.expect);
  }
});

test("singular and plural units are handled", () => {
  assert.equal(slaSummary({ total: 20, elapsed: 19 }), "1 day left");
  assert.equal(slaSummary({ total: 20, elapsed: 18 }), "2 days left");
  assert.equal(slaSummary({ total: 20, elapsed: 21 }), "1 day overdue");
});

test("the unit is caller-supplied, because RTS Acts are written in working days", () => {
  assert.equal(slaSummary({ total: 15, elapsed: 10 }, "working day"), "5 working days left");
  assert.equal(slaSummary({ total: 48, elapsed: 47 }, "hour"), "1 hour left");
});

test("aria-valuetext gives a screen reader everything the ring shows visually", () => {
  // Colour and arc length are the visual carriers; without this a non-sighted user would get
  // a bare percentage and lose the deadline entirely (WCAG 1.4.1).
  const text = slaValueText({ total: 21, elapsed: 16 });
  assert.equal(text, "5 days left. 16 days of 21 days used (76%).");

  const breached = slaValueText({ total: 21, elapsed: 24 });
  assert.match(breached, /3 days overdue/);
  assert.match(breached, /100%/, "a breach reports as fully consumed, not 114%");
});

test("the default thresholds are the documented ones", () => {
  assert.deepEqual(SLA_DEFAULT_THRESHOLDS, { dueSoonAt: 0.75, atRiskAt: 0.9 });
});
