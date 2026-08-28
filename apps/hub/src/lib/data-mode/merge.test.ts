// The merge is the load-bearing part of the prototype's data story, so its
// tests are the four REAL cases from the PM-AJAY feeds plus the arithmetic
// failure the whole design exists to prevent.
//
// A check nobody has watched fail cannot be trusted, so several of these assert
// the WRONG answer is not produced, not merely that some answer is.
//
// Run: npm test --prefix apps/hub

import { test } from "node:test";
import assert from "node:assert/strict";

import { mergeData, provenanceOf } from "./merge.ts";
import type { Descriptor } from "./types.ts";

// ── The case the whole design exists to prevent ──────────────────────────────

type Split = "total" | "a" | "b" | "c";
const SPLIT: Descriptor<Split> = {
  id: "split",
  fields: {
    total: { label: "Total", zero: "missing" },
    a: { label: "A", zero: "corroborated" },
    b: { label: "B", zero: "corroborated" },
    c: { label: "C", zero: "corroborated" },
  },
  invariants: [{ kind: "sum", total: "total", parts: ["a", "b", "c"] }],
};
const SPLIT_MOCK = { total: 100, a: 20, b: 30, c: 50 };

test("a missing part of a known sum is DERIVED, never mocked", () => {
  const r = mergeData(SPLIT, { total: 100, a: 40, b: 30, c: null }, SPLIT_MOCK, "hybrid");
  // The mock says 50. Taking it would make the parts sum to 120 against a
  // stated total of 100 — the exact defect this module exists to make
  // impossible. Arithmetic says 30.
  assert.equal(r.values.c, 30);
  assert.equal(r.provenance.c, "derived");
  assert.equal(r.values.a + r.values.b + r.values.c, r.values.total);
});

test("two missing parts share the remainder in the MOCK's proportions, summing exactly", () => {
  const r = mergeData(SPLIT, { total: 100, a: 40, b: null, c: null }, SPLIT_MOCK, "hybrid");
  // Remainder 60, split 30:50 → 22.5 / 37.5. Rounding must not break the sum.
  assert.equal(r.values.a + r.values.b + r.values.c, 100);
  assert.equal(r.provenance.b, "mock");
  assert.equal(r.provenance.c, "mock");
  assert.ok(r.values.c > r.values.b, "the snapshot's shape survives the scaling");
});

test("a total absent from the feed is derived UP from its live parts", () => {
  const r = mergeData(SPLIT, { total: null, a: 10, b: 20, c: 30 }, SPLIT_MOCK, "hybrid");
  assert.equal(r.values.total, 60);
  assert.equal(r.provenance.total, "derived");
});

// ── Zero: real, or a gap? The four cases the live feeds actually present ─────

test("gender: every field zero and the total zero is an UNPOPULATED feed", () => {
  const r = mergeData(SPLIT, { total: 0, a: 0, b: 0, c: 0 }, SPLIT_MOCK, "hybrid");
  assert.equal(r.allMock, true, "nothing here corroborates any of the zeros");
  assert.deepEqual(r.values, SPLIT_MOCK);
});

test("special tutoring: a zero inside a group that HAS figures is a real zero", () => {
  const r = mergeData(SPLIT, { total: 8772, a: 4182, b: 1008, c: 0 }, SPLIT_MOCK, "hybrid");
  assert.equal(r.values.c, 0, "0 of 8,772 is a reading, not a gap");
  assert.equal(r.provenance.c, "live");
  assert.equal(r.allLive, true);
});

test("`zero: real` is believed on its own, with no sibling to corroborate it", () => {
  type P = "totalProjects" | "inProgress";
  const d: Descriptor<P> = {
    id: "physical",
    fields: {
      totalProjects: { label: "Projects", zero: "missing" },
      inProgress: { label: "In progress", zero: "real" },
    },
    invariants: [{ kind: "subset", part: "inProgress", of: "totalProjects" }],
  };
  const r = mergeData(d, { totalProjects: 436, inProgress: 0 }, { totalProjects: 400, inProgress: 12 }, "hybrid");
  assert.equal(r.values.inProgress, 0, "a quiet year genuinely has none in progress");
  assert.equal(r.provenance.inProgress, "live");
});

test("hostels: grouping is by INVARIANT, so a lone zero is not corroborated by unrelated figures", () => {
  type H = "completed" | "covered" | "occupied";
  const d: Descriptor<H> = {
    id: "hostel",
    fields: {
      // Counts buildings. Nothing links it to the two below, which count
      // people — so it is its own group and cannot borrow their corroboration.
      completed: { label: "Completed hostels", zero: "corroborated" },
      covered: { label: "Covered", zero: "missing" },
      occupied: { label: "Occupied", zero: "corroborated" },
    },
    invariants: [{ kind: "subset", part: "occupied", of: "covered" }],
  };
  const r = mergeData(
    d,
    { completed: 0, covered: 230977, occupied: 125485 },
    { completed: 1840, covered: 200000, occupied: 110000 },
    "hybrid",
  );
  assert.equal(r.provenance.covered, "live");
  assert.equal(r.provenance.occupied, "live");
  assert.equal(
    r.provenance.completed,
    "mock",
    "grouped by payload object this zero would wrongly read as real",
  );
});

// ── Invariants are never violated by what we return ──────────────────────────

test("a mocked subset is scaled to the live whole, never taken at face value", () => {
  type H = "covered" | "occupied";
  const d: Descriptor<H> = {
    id: "occupancy",
    fields: {
      covered: { label: "Covered", zero: "missing" },
      occupied: { label: "Occupied", zero: "missing" },
    },
    invariants: [{ kind: "subset", part: "occupied", of: "covered" }],
  };
  // The snapshot's absolute occupied (900) exceeds the live covered (500).
  const r = mergeData(d, { covered: 500, occupied: null }, { covered: 1000, occupied: 900 }, "hybrid");
  assert.equal(r.values.occupied, 450, "90% of the live whole, not the snapshot's 900");
  assert.ok(r.values.occupied <= r.values.covered);
});

test("a funnel never widens", () => {
  type F = "selected" | "planned" | "declared";
  const d: Descriptor<F> = {
    id: "funnel",
    fields: {
      selected: { label: "Selected", zero: "missing" },
      planned: { label: "Planned", zero: "missing" },
      declared: { label: "Declared", zero: "missing" },
    },
    invariants: [{ kind: "monotone", series: ["selected", "planned", "declared"] }],
  };
  const r = mergeData(d, { selected: 100, planned: null, declared: null }, { selected: 9000, planned: 8000, declared: 7000 }, "hybrid");
  assert.ok(r.values.planned <= r.values.selected);
  assert.ok(r.values.declared <= r.values.planned);
});

// ── The three modes ──────────────────────────────────────────────────────────

test("live mode invents nothing, even where the feed is empty", () => {
  const r = mergeData(SPLIT, { total: 0, a: 0, b: 0, c: 0 }, SPLIT_MOCK, "live");
  assert.deepEqual(r.values, { total: 0, a: 0, b: 0, c: 0 });
  assert.equal(r.allLive, true, "an empty card is the honest rendering here");
});

test("mock mode ignores a live feed entirely", () => {
  const r = mergeData(SPLIT, { total: 8772, a: 4182, b: 1008, c: 3 }, SPLIT_MOCK, "mock");
  assert.deepEqual(r.values, SPLIT_MOCK);
  assert.equal(r.allMock, true);
});

// ── Provenance is pessimistic, because a card is judged as one thing ─────────

test("one mocked figure makes a whole card mixed", () => {
  const r = mergeData(SPLIT, { total: 100, a: 40, b: null, c: null }, SPLIT_MOCK, "hybrid");
  assert.equal(provenanceOf(r, ["total", "a"]), "live");
  assert.equal(provenanceOf(r, ["total", "a", "b"]), "mixed");
  assert.equal(provenanceOf(r, ["b", "c"]), "mock");
});

test("a derived figure is not mock, and does not make a card mixed", () => {
  const r = mergeData(SPLIT, { total: 100, a: 40, b: 30, c: null }, SPLIT_MOCK, "hybrid");
  assert.equal(provenanceOf(r, ["total", "a", "b", "c"]), "live");
});

// ── The Adarsh Gram funnel: two lessons the live feed taught, the hard way ───

type AG = "villages" | "initiated" | "completed" | "planned" | "declared";
const AG: Descriptor<AG> = {
  id: "ag",
  fields: {
    villages: { label: "Villages selected", zero: "missing" },
    initiated: { label: "Assessment initiated", zero: "corroborated" },
    completed: { label: "Assessment completed", zero: "corroborated" },
    planned: { label: "Plans drawn", zero: "corroborated" },
    declared: { label: "Declared", zero: "corroborated" },
  },
  invariants: [
    { kind: "monotone", series: ["villages", "initiated", "completed", "planned", "declared"] },
  ],
};
const AG_MOCK = { villages: 47265, initiated: 40000, completed: 35000, planned: 25189, declared: 17946 };

test("an invariant VETOES a zero that corroboration would have accepted", () => {
  // The real feed: 0 assessments initiated, alongside 25,189 plans drawn. The
  // group has figures, so corroboration alone calls those zeros real — but a
  // plan cannot exist for a village whose assessment never started, so the
  // funnel proves them unpopulated.
  const r = mergeData(
    AG,
    { villages: 47265, initiated: 0, completed: 0, planned: 25189, declared: 17990 },
    AG_MOCK,
    "hybrid",
  );
  assert.equal(r.provenance.initiated, "mock");
  assert.ok(r.values.initiated > 0, "an impossible zero must not survive into the funnel");
  assert.equal(r.values.declared, 17990, "and the live outcome is untouched");
});

test("the clamp never overwrites a LIVE figure, even one that breaks its invariant", () => {
  // Blanket clamping propagated the source's zero forward and rendered the
  // page's headline as 0. Our job is to keep OUR figures coherent, not to
  // silently delete the department's outcome.
  const r = mergeData(
    AG,
    { villages: 47265, initiated: 0, completed: 0, planned: 25189, declared: 17990 },
    AG_MOCK,
    "live",
  );
  assert.equal(r.values.initiated, 0, "live mode invents nothing");
  assert.equal(r.values.declared, 17990, "and does not zero the outcome to satisfy a rule");
});

// ── Only a SUM sibling corroborates a zero ───────────────────────────────────

test("a container does NOT corroborate a zero in its subset", () => {
  // The real feed: 0 works completed against 3,79,392 identified, on a scheme
  // that has already declared 17,990 villages Adarsh Gram — a status requiring
  // a score of 70 out of 100. The zero is an unpopulated column, and reading
  // "some non-zero in the group" as corroboration published 0%.
  type W = "identified" | "completed";
  const d: Descriptor<W> = {
    id: "works",
    fields: {
      identified: { label: "Works identified", zero: "missing" },
      completed: { label: "Works completed", zero: "corroborated" },
    },
    invariants: [{ kind: "subset", part: "completed", of: "identified" }],
  };
  const r = mergeData(d, { identified: 379392, completed: 0 }, { identified: 391317, completed: 47367 }, "hybrid");
  assert.equal(r.provenance.completed, "mock", "nothing here vouches for that zero");
  assert.ok(r.values.completed > 0);
});

test("but a sum sibling DOES — a total aggregates its parts", () => {
  // Special Tutoring at 0 inside a group whose total is 8,772 is a reading: the
  // total proves the collection ran and the parts were populated.
  const r = mergeData(SPLIT, { total: 8772, a: 4182, b: 4590, c: 0 }, SPLIT_MOCK, "hybrid");
  assert.equal(r.provenance.c, "live");
  assert.equal(r.values.c, 0);
});
