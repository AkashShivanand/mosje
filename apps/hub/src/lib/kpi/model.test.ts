// The illustrative model's whole claim is that its figures add up. These pin it:
// states sum to All India, districts to their state, funnels are monotone, and a
// share is computed from the counts shown beside it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { apportion, readPortal, covers } from "./model.ts";
import { SMILE_AREAS } from "./geography.ts";
import { PORTAL_DASHBOARDS } from "./register.ts";
import { clampArea, roleById } from "./access.ts";
import { PORTAL_SLUGS } from "./slugs.ts";
import type { KpiReading } from "./types.ts";

const num = (r: KpiReading | undefined): number => {
  assert.ok(r, "reading present");
  assert.equal(r.value.kind, "figure");
  return r.value.kind === "figure" ? r.value.value : NaN;
};

test("apportion sums exactly and keeps proportion", () => {
  const out = apportion(101, [1, 1, 1]);
  assert.equal(out.reduce((a, b) => a + b, 0), 101);
  assert.deepEqual(apportion(0, [3, 2]), [0, 0]);
});

test("SMILE – Beggary: states sum to All India, districts to their state", () => {
  const india = num(readPortal("smile-beggary")["smile-beggary.identified"]);
  let states = 0;
  for (const s of SMILE_AREAS) {
    const state = num(readPortal("smile-beggary", { state: s.name })["smile-beggary.identified"]);
    states += state;
    const districts = (s.children ?? []).reduce(
      (t, d) => t + num(readPortal("smile-beggary", { state: s.name, district: d.name })["smile-beggary.identified"]),
      0,
    );
    assert.equal(districts, state, `${s.name}: districts sum to the state`);
  }
  assert.equal(states, india);
});

test("SMILE – Beggary: the funnel never widens, in any area", () => {
  for (const scope of [{}, ...SMILE_AREAS.map((s) => ({ state: s.name }))]) {
    const r = readPortal("smile-beggary", scope);
    const identified = num(r["smile-beggary.identified"]);
    const mobilised = num(r["smile-beggary.mobilised"]);
    const rehabilitated = num(r["smile-beggary.rehabilitated"]);
    assert.ok(identified >= mobilised && mobilised >= rehabilitated, JSON.stringify(scope));
    const pipeline = r["smile-beggary.pipeline"]!.value;
    assert.equal(pipeline.kind, "breakdown");
    if (pipeline.kind === "breakdown") {
      const active = pipeline.items.filter((i) => i.label !== "Cancelled").reduce((t, i) => t + i.value, 0);
      assert.equal(active, identified, "every identified person is in exactly one stage");
      assert.ok(pipeline.items.every((i) => i.value >= 0));
    }
  }
});

test("SMILE – Beggary: the Aadhaar share and the Aadhaar gap describe the same people", () => {
  const r = readPortal("smile-beggary", { state: "Gujarat" });
  const identified = num(r["smile-beggary.identified"]);
  const share = num(r["smile-beggary.aadhaar"]);
  const gap = num(r["smile-beggary.aadhaar-gap"]);
  assert.equal(gap, identified - Math.round((identified * share) / 100));
});

test("an area the portal does not work in reads as nothing, not as zeroes", () => {
  assert.equal(covers("smile-beggary", { state: "Goa" }), false);
  assert.deepEqual(readPortal("smile-beggary", { state: "Goa" }), {});
});

test("every register KPI has a reading at All India, and no reading lacks a KPI", () => {
  for (const p of PORTAL_DASHBOARDS) {
    const reading = readPortal(p.id);
    const ids = new Set(p.kpis.map((k) => k.id));
    for (const k of p.kpis) assert.ok(reading[k.id], `${k.id} has an All India reading`);
    for (const id of Object.keys(reading)) assert.ok(ids.has(id), `${id} is in the register`);
  }
});

test("a role's area is a ceiling, never widened", () => {
  const state = roleById("state-maharashtra")!;
  assert.deepEqual(clampArea(state, {}), { state: "Maharashtra", district: undefined });
  assert.deepEqual(clampArea(state, { state: "Gujarat" }), { state: "Maharashtra", district: undefined });
  assert.deepEqual(clampArea(state, { state: "Maharashtra", district: "Pune" }), { state: "Maharashtra", district: "Pune" });
  const district = roleById("district-mumbai")!;
  assert.deepEqual(clampArea(district, {}), { state: "Maharashtra", district: "Mumbai" });
});

test("the slug list the demo rail reads matches the register", () => {
  assert.deepEqual([...PORTAL_SLUGS], PORTAL_DASHBOARDS.map((p) => p.slug));
});

/* ── Live feed + model (NMBA) ─────────────────────────────────────────────── */
import { resolveReading, type PortalFeed } from "./live.ts";
import { ALL_STATES } from "./geography.ts";

const m = (people: number) => ({ people, women: Math.round(people * 0.3), youth: Math.round(people * 0.4), pledges: Math.round(people / 100), mitras: Math.round(people / 2000) });
const fullFeed: PortalFeed = {
  portal: "nmba",
  feed: { national: m(348_074_513), byState: Object.fromEntries(ALL_STATES.map((s) => [s.name, m(1_000_000)])), readAt: "2026-10-05" },
};

test("Live mode draws the feed only: no modelled figure, no helpline calls", () => {
  const r = resolveReading("nmba", {}, "live", fullFeed);
  assert.equal(r["nmba.outreach"]?.origin, "live");
  assert.equal(r["nmba.calls"], undefined);
  assert.ok(Object.values(r).every((v) => v?.origin === "live"));
});

test("a portal with no feed reads as nothing in Live mode", () => {
  assert.deepEqual(resolveReading("smile-beggary", {}, "live", null), {});
});

test("Live + illustrative: a modelled gap is scaled to the LIVE total beside it", () => {
  const r = resolveReading("nmba", {}, "hybrid", fullFeed);
  assert.equal(num(r["nmba.outreach"]), 348_074_513);
  assert.equal(r["nmba.calls"]?.origin, "modelled");
  assert.equal(num(r["nmba.calls"]), Math.round(348_074_513 * 0.002));
});

test("the state map is never half live: one missing State/UT and the whole map is modelled, to the live total", () => {
  const partial: PortalFeed = { portal: "nmba", feed: { ...fullFeed.feed, byState: { ...fullFeed.feed.byState, Goa: { ...m(0), people: null } } } };
  const map = resolveReading("nmba", {}, "hybrid", partial)["nmba.outreach-by-state"]!;
  assert.equal(map.origin, "modelled");
  assert.equal(map.value.kind === "areas" ? map.value.rows.reduce((t, r) => t + r.value, 0) : 0, 348_074_513);
});

test("Illustrative mode ignores the feed and shows the mirrored snapshot", () => {
  assert.equal(resolveReading("nmba", {}, "mock", fullFeed)["nmba.outreach"]?.origin, "snapshot");
});
