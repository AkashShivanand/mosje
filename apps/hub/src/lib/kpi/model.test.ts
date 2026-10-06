// The illustrative model's whole claim is that its figures add up. These pin it:
// states sum to All India, districts to their state, funnels are monotone, and a
// share is computed from the counts shown beside it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { apportion, readPortal, covers } from "./model.ts";
import { SMILE_AREAS } from "./geography.ts";
import { PORTAL_DASHBOARDS, PROGRAMMES, kpisFor } from "./register.ts";
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
  // Every stage the programme's page maps or a later stage is capped by — the All-India figure
  // above the State/UT map must be the map's own sum (one request, one answer).
  for (const kpi of ["identified", "mobilised", "rehabilitated", "children"].map((m) => `smile-beggary.${m}`)) {
    const india = num(readPortal("smile-beggary")[kpi]);
    let states = 0;
    for (const s of SMILE_AREAS) {
      const state = num(readPortal("smile-beggary", { state: s.name })[kpi]);
      states += state;
      const districts = (s.children ?? []).reduce(
        (t, d) => t + num(readPortal("smile-beggary", { state: s.name, district: d.name })[kpi]),
        0,
      );
      if (s.children?.length) assert.equal(districts, state, `${kpi}, ${s.name}: districts sum to the state`);
    }
    assert.equal(states, india, `${kpi}: states sum to All India`);
  }
});

test("a citizen's view of every programme holds only its Public (Pre-Login) KPIs", () => {
  // Mirrors the gate in the proposed dashboard's `readAll`: what `kpisFor(p, "public")` allows
  // is all a citizen's page may read, and it must never include an Office (Post-Login) KPI.
  for (const p of PROGRAMMES) {
    const allowed = new Set(kpisFor(p, "public").map((k) => k.id));
    for (const k of p.kpis) if (k.audience === "officer") assert.ok(!allowed.has(k.id), `${k.id} is Post-Login`);
    for (const k of p.kpis) if (k.audience === "public") assert.ok(allowed.has(k.id), `${k.id} is Pre-Login and must be shown`);
  }
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

/** KPIs only a feed can supply: their State/UT breakdown is never modelled (6 Oct 2026). */
const FEED_ONLY = new Set(["nmba.outreach-by-state"]);

test("every register KPI has a reading at All India, and no reading lacks a KPI", () => {
  for (const p of PORTAL_DASHBOARDS) {
    const reading = readPortal(p.id);
    const ids = new Set(p.kpis.map((k) => k.id));
    for (const k of p.kpis) if (!FEED_ONLY.has(k.id)) assert.ok(reading[k.id], `${k.id} has an All India reading`);
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
import { STATE_NAMES } from "./geography.ts";

const m = (people: number) => ({ people, women: Math.round(people * 0.3), youth: Math.round(people * 0.4), pledges: Math.round(people / 100), mitras: Math.round(people / 2000) });
const fullFeed: PortalFeed = {
  portal: "nmba",
  feed: { national: m(348_074_513), byState: Object.fromEntries(STATE_NAMES.map((s) => [s, m(1_000_000)])), readAt: "2026-10-05" },
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

test("the state map is never half live and never invented: one missing State/UT and there is no map", () => {
  const partial: PortalFeed = { portal: "nmba", feed: { ...fullFeed.feed, byState: { ...fullFeed.feed.byState, Goa: { ...m(0), people: null } } } };
  assert.equal(resolveReading("nmba", {}, "hybrid", partial)["nmba.outreach-by-state"], undefined);
  assert.equal(resolveReading("nmba", {}, "mock", fullFeed)["nmba.outreach-by-state"], undefined);
});

test("a State/UT's NMBA figures come from the feed or not at all", () => {
  assert.deepEqual(resolveReading("nmba", { state: "Goa" }, "mock", fullFeed), {});
  assert.equal(resolveReading("nmba", { state: "Goa" }, "hybrid", fullFeed)["nmba.outreach"]?.origin, "live");
});

test("Illustrative mode ignores the feed and shows the mirrored snapshot", () => {
  assert.equal(resolveReading("nmba", {}, "mock", fullFeed)["nmba.outreach"]?.origin, "snapshot");
});

test("Senior Citizens: every KPI on the SCW-internal tab has a reading, and every reading a KPI", () => {
  const scw = PROGRAMMES.find((p) => p.id === "senior-citizens")!;
  const reading = readPortal("senior-citizens");
  assert.equal(scw.kpis.length, 28);
  for (const k of scw.kpis) assert.ok(reading[k.id], `${k.id} has no reading`);
  for (const id of Object.keys(reading)) assert.ok(scw.kpis.some((k) => k.id === id), `${id} is not in the register`);
});

test("Senior Citizens: Financial Progress is expenditure over budget, from the two figures beside it", () => {
  const r = readPortal("senior-citizens");
  const fig = (id: string) => {
    const v = r[id]!.value;
    return v.kind === "figure" ? v.value : v.kind === "areas" ? v.total : NaN;
  };
  for (const c of ["ipsrc", "sapsrc", "rvy", "pm-special", "elderline"]) {
    const expected = Math.round((fig(`senior-citizens.${c}.expenditure`) / fig(`senior-citizens.${c}.budget`)) * 1000) / 10;
    assert.equal(fig(`senior-citizens.${c}.progress`), expected, c);
  }
});

test("Senior Citizens: no figure is split across States/UTs the Department has not supplied", () => {
  for (const r of Object.values(readPortal("senior-citizens"))) assert.notEqual(r?.value.kind, "areas");
});

test("every API coverage the register carries is one of the three the portals use", () => {
  for (const p of PROGRAMMES) for (const k of p.kpis) if (k.api) assert.ok(["available", "partial", "none"].includes(k.api.coverage), k.id);
});
