import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readCensus, readBaseline, defectsByPage, totals, DEFECT_CLASSES } from "../build/figma-radius-audit.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const primitive = JSON.parse(readFileSync(`${ROOT}/src/primitive.json`, "utf8"));
const semantic = JSON.parse(readFileSync(`${ROOT}/src/semantic.json`, "utf8"));
const component = JSON.parse(readFileSync(`${ROOT}/src/component.json`, "utf8"));

const px = (v) => Number(String(v).replace(/px$/, ""));
const leaves = (node, path = []) => {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && "$value" in v) out.push([[...path, k], v]);
    else if (v && typeof v === "object") out.push(...leaves(v, [...path, k]));
  }
  return out;
};

/* ── source invariants — no Figma access needed ─────────────────────────── */

test("S1 · every shape/* aliases a radius.* primitive, never a literal", () => {
  for (const [path, tok] of leaves(semantic.shape)) {
    assert.match(
      String(tok.$value),
      /^\{radius\.[^}]+\}$/,
      `shape/${path.join("/")} = ${tok.$value} — a Tier-2 token must alias a Tier-1 primitive, not carry its own value`,
    );
    const rung = String(tok.$value).slice(8, -1);
    assert.ok(primitive.radius[rung], `shape/${path.join("/")} aliases radius.${rung}, which does not exist`);
  }
});

test("S2 · shape and radius hold the same rungs — no value without a counterpart", () => {
  const a = Object.keys(primitive.radius).filter((k) => !k.startsWith("$")).sort();
  const b = Object.keys(semantic.shape).filter((k) => !k.startsWith("$")).sort();
  assert.deepEqual(b, a, "Tier-1 radius and Tier-2 shape have diverged — every primitive rung needs a published counterpart, and vice versa");
});

test("S3 · the ladder ascends", () => {
  const vals = Object.entries(primitive.radius)
    .filter(([k]) => !k.startsWith("$"))
    .map(([k, v]) => [k, px(v.$value)]);
  for (let i = 1; i < vals.length; i++) {
    assert.ok(
      vals[i][1] > vals[i - 1][1],
      `radius.${vals[i][0]} (${vals[i][1]}) does not exceed radius.${vals[i - 1][0]} (${vals[i - 1][1]}) — the ladder must ascend in declaration order`,
    );
  }
});

test("S7 · a rung's NAME equals its resolved value", () => {
  // The invariant value-naming exists to buy, and it was impossible to write while the ladder
  // read none/xxs/xs/sm/md/lg/xl/2xl. `full` is the one exception: it is a SENTINEL meaning
  // "fully rounded", not a measurement, so it is named rather than numbered — deliberately, and
  // asserted as the ONLY exception so a second one cannot be added quietly.
  for (const [tree, label] of [[primitive.radius, "radius"], [semantic.shape, "shape"]]) {
    for (const [path, tok] of leaves(tree)) {
      const rung = path.at(-1);
      if (rung === "full") continue;
      assert.match(rung, /^\d+$/, `${label}/${rung} is not a number — the ladder is value-named, and \`full\` is the only permitted name`);
      const resolved = String(tok.$value).startsWith("{")
        ? px(primitive.radius[String(tok.$value).slice(8, -1)].$value)
        : px(tok.$value);
      assert.equal(resolved, Number(rung), `${label}/${rung} resolves to ${resolved}px — a value-name that lies is worse than a T-shirt name`);
    }
  }
  assert.equal(px(primitive.radius.full.$value), 999, "radius.full is the fully-rounded sentinel and must stay 999");
});

test("S4 · no primitive rung is orphaned", () => {
  const pointed = new Set(leaves(semantic.shape).map(([, t]) => String(t.$value).slice(8, -1)));
  for (const k of Object.keys(primitive.radius).filter((k) => !k.startsWith("$"))) {
    assert.ok(pointed.has(k), `radius.${k} has nothing pointing at it — an unreachable primitive is how a rung gets silently deleted`);
  }
});

test("S5 · ONLY shape/* may alias a Tier-1 radius primitive", () => {
  // The defect this exists to catch: control/radius, cmp/button/radius and
  // cmp/card/radius each aliased {radius.md} — a PUBLISHED token reaching past
  // the Tier-2 layer into a HIDDEN primitive. Figma mirrored it faithfully, so
  // three published variables pointed at a variable designers cannot even see.
  const offenders = [];
  const scan = (tree, label, skip) => {
    for (const [path, tok] of leaves(tree)) {
      if (skip && path[0] === skip) continue;
      if (/^\{radius\./.test(String(tok.$value))) offenders.push(`${label}/${path.join("/")} = ${tok.$value}`);
    }
  };
  scan(semantic, "semantic", "shape");
  scan(component, "component", null);
  assert.deepEqual(
    offenders,
    [],
    `these alias Tier-1 radius directly; point them at the matching shape.* instead:\n  ${offenders.join("\n  ")}`,
  );
});

test("S6 · DTCG conformance on the radius and shape trees", () => {
  for (const [tree, label] of [[primitive.radius, "radius"], [semantic.shape, "shape"]]) {
    assert.equal(tree.$type, "dimension", `${label} must declare $type — the space families were missing it and it was invisible until checked`);
    for (const [path, tok] of leaves(tree)) {
      const name = path.join(".");
      assert.ok(!/[{}.]/.test(path.at(-1)), `${label}.${name} — a token name may not contain { } or .`);
      assert.ok(!path.at(-1).startsWith("$"), `${label}.${name} — a token name may not begin with $`);
      assert.equal(Object.keys(tok).filter((k) => !k.startsWith("$")).length, 0, `${label}.${name} is a leaf and must not have children`);
    }
  }
});

/* ── census invariants — read the frozen census, never Figma ─────────────── */

test("C1 · the census declares how it was captured", () => {
  const census = readCensus();
  assert.equal(
    census.method,
    "one-page-per-invocation",
    "a census captured any other way under-reports: batching pages into one use_figma call returns partial, non-deterministic trees. Refusing it here is the only thing that stops a bad census being committed.",
  );
});

test("C2 · coverage is accounted for, and the uncensused count only shrinks", () => {
  const census = readCensus();
  const baseline = readBaseline();
  const now = census.coverage.uncensused.length;
  const was = baseline.uncensusedPages.length;
  assert.ok(
    now <= was,
    `${now} pages are uncensused, up from ${was}. A page added to the library without being censused is exactly how a surface goes ungated.\n  ${census.coverage.uncensused.map((p) => p.name).join("\n  ")}`,
  );
  assert.equal(
    census.pages.length + now,
    census.coverage.libraryPages,
    "censused + uncensused does not equal the library's page count — some page is in neither list, which is worse than either",
  );
});

test("C3 · per-page radius debt does not grow, and an improvement is re-baselined", () => {
  const census = readCensus();
  const baseline = readBaseline();
  const now = defectsByPage(census);
  const grew = [];
  const shrank = [];
  for (const [id, cur] of Object.entries(now)) {
    const was = baseline.pages[id];
    assert.ok(was, `page "${cur.name}" (${id}) is censused but absent from the baseline — re-run check:radius-linkage:baseline`);
    for (const k of DEFECT_CLASSES) {
      if (cur[k] > was[k]) grew.push(`${cur.name} · ${k}: ${was[k]} → ${cur[k]}`);
      if (cur[k] < was[k]) shrank.push(`${cur.name} · ${k}: ${was[k]} → ${cur[k]}`);
    }
  }
  assert.deepEqual(grew, [], `radius debt GREW:\n  ${grew.join("\n  ")}`);
  assert.deepEqual(
    shrank,
    [],
    `radius debt IMPROVED but the baseline was not refrozen. Run:\n    npm run check:radius-linkage:baseline\n  in the SAME change, so one page's cleanup cannot pay for another's regression.\n  ${shrank.join("\n  ")}`,
  );
});

test("C4 · the headline share is reported, not silently drifting", () => {
  const census = readCensus();
  const t = totals(census);
  const all = Object.values(t).reduce((a, b) => a + b, 0);
  const share = (100 * t.t2) / all;
  const baseline = readBaseline();
  const wasAll = Object.values(baseline.totals).reduce((a, b) => a + b, 0);
  const wasShare = (100 * baseline.totals.t2) / wasAll;
  assert.ok(
    share >= wasShare - 0.001,
    `Tier-2 share fell from ${wasShare.toFixed(2)} % to ${share.toFixed(2)} % — radius moved onto worse tokens`,
  );
});
