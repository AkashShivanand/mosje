import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

/**
 * The type scale's SHAPE, asserted — the four tests the 2026-09-04 typography audit found
 * missing. Every other token family had a contract test; type had a parity test (does Figma
 * agree?) and nothing that asked whether the values were any good.
 *
 *   1. Nothing renders below 12px. UX4G 3.0 §2 calls 12 the minimum usable size; the estate's
 *      own contract said 11 and shipped 9 and 10.
 *   2. Every size is on the ramp. The 13px and 15px stops that crept into the Portal surface
 *      are the sizes design.md tells authors never to type.
 *   3. Leading is on the 4px grid and its ratio is monotonic within a tier — a smaller role
 *      never sits tighter than the larger one above it. DBIM §4's 1.2–1.5 band is asserted
 *      for headline, title, body and label; display is the documented exception (see
 *      docs/audit/typography-deviation-register.md) and is held to ≥ 1.10 instead.
 *   4. The loaded weights are the only weights. 800 and 900 are browser-synthesised bold and
 *      may not exist as tokens.
 */

const root = new URL("..", import.meta.url).pathname;
const prim = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
const sem = JSON.parse(readFileSync(root + "src/semantic.json", "utf8"));

const RAMP = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80];
const FLOOR = 12;
const px = (v) => parseFloat(String(v).replace("px", ""));

function bounds(node, surface) {
  const b = node.$extensions.mosje.type[surface];
  return [px(b.min), px(b.max)];
}

const roles = [];
for (const [tier, steps] of Object.entries(prim.font.role)) {
  if (tier.startsWith("$")) continue;
  for (const [n, node] of Object.entries(steps)) {
    if (n.startsWith("$")) continue;
    roles.push({ tier, n: Number(n), node });
  }
}

test("21 roles, five tiers", () => {
  assert.equal(roles.length, 21);
});

test("no role renders below the 12px floor on either surface", () => {
  for (const r of roles) for (const s of ["website", "portal"]) {
    const [min] = bounds(r.node.size, s);
    assert.ok(min >= FLOOR, `${r.tier}-${r.n} ${s} min ${min}px is below ${FLOOR}px`);
  }
});

test("every size bound is on the 15-step ramp", () => {
  for (const r of roles) for (const s of ["website", "portal"]) {
    for (const v of bounds(r.node.size, s)) {
      assert.ok(RAMP.includes(v), `${r.tier}-${r.n} ${s} size ${v}px is not on the ramp ${RAMP.join("·")}`);
    }
  }
});

test("every line height is on the 4px grid and never tighter than 1.10", () => {
  for (const r of roles) for (const s of ["website", "portal"]) {
    const [smin, smax] = bounds(r.node.size, s);
    const [lmin, lmax] = bounds(r.node.lh, s);
    for (const v of [lmin, lmax]) assert.equal(v % 4, 0, `${r.tier}-${r.n} ${s} lh ${v}px is off the 4px grid`);
    for (const [size, lh] of [[smin, lmin], [smax, lmax]]) {
      assert.ok(lh / size >= 1.1 - 1e-9, `${r.tier}-${r.n} ${s} ${size}/${lh} = ${(lh / size).toFixed(2)} is tighter than 1.10`);
    }
  }
});

test("headline, title, body and label leading sits in DBIM's 1.2–1.5 band at desktop", () => {
  for (const r of roles) {
    if (r.tier === "display") continue;
    for (const s of ["website", "portal"]) {
      const [, size] = bounds(r.node.size, s);
      const [, lh] = bounds(r.node.lh, s);
      const ratio = lh / size;
      assert.ok(ratio >= 1.2 - 1e-9 && ratio <= 1.5 + 1e-9, `${r.tier}-${r.n} ${s} ${size}/${lh} = ${ratio.toFixed(2)} is outside 1.2–1.5`);
    }
  }
});

test("within a tier, leading ratio never falls by more than a grid step as size falls", () => {
  // On a 4px grid a smaller size cannot always hold the ratio of the size above it —
  // 18px × 1.40 is 25.2, which is neither 24 nor 28 — so the assertion is a bound on the
  // DIP, not strict monotonicity. 0.1 is one grid step at the small end of the scale; the
  // defect it guards against was headline-3 at 1.14 beside headline-2 at 1.25.
  for (const tier of ["display", "headline", "title", "body", "label"]) {
    for (const s of ["website", "portal"]) {
      const ordered = roles.filter((r) => r.tier === tier).sort((a, b) => a.n - b.n);
      let prev = 0;
      for (const r of ordered) {
        const [, size] = bounds(r.node.size, s);
        const [, lh] = bounds(r.node.lh, s);
        const ratio = lh / size;
        assert.ok(ratio >= prev - 0.1 - 1e-9, `${tier}-${r.n} ${s} ratio ${ratio.toFixed(2)} is more than a grid step tighter than ${tier}-${r.n - 1}'s ${prev.toFixed(2)}`);
        prev = ratio;
      }
    }
  }
});

test("body is 1.5 on both surfaces", () => {
  for (const s of ["website", "portal"]) {
    const b1 = roles.find((r) => r.tier === "body" && r.n === 1);
    const [, size] = bounds(b1.node.size, s);
    const [, lh] = bounds(b1.node.lh, s);
    assert.equal(lh / size, 1.5, `body-1 ${s} is ${size}/${lh}`);
  }
});

test("title, body and label are identical on both surfaces — the productive core is shared", () => {
  for (const r of roles) {
    if (!["title", "body", "label"].includes(r.tier)) continue;
    for (const prop of ["size", "lh"]) {
      assert.deepEqual(bounds(r.node[prop], "website"), bounds(r.node[prop], "portal"), `${r.tier}-${r.n} ${prop} differs by surface`);
    }
  }
});

test("only the loaded weights exist: 300 (icon), 400, 500, 600, 700", () => {
  const allowed = new Set([300, 400, 500, 600, 700]);
  for (const [k, v] of Object.entries(sem.font.weight)) {
    if (k.startsWith("$")) continue;
    assert.ok(allowed.has(v.$value), `font.weight.${k} = ${v.$value} is not a loaded weight`);
  }
});

test("display tracking is negative on both surfaces and caps tracking is the only positive one", () => {
  const t = prim.font.tracking;
  for (const n of ["1", "2", "3", "4", "5"]) {
    for (const s of ["website", "portal"]) {
      const b = t.display[n].$extensions.mosje.type[s];
      assert.ok(px(b.max) < 0, `display-${n} ${s} tracking ${b.max} is not negative`);
    }
  }
  assert.ok(px(t.caps.$extensions.mosje.type.website.max) > 0, "caps tracking must be positive");
  for (const k of ["heading", "title", "body", "label"]) assert.equal(px(t[k].$value), 0, `${k} tracking is not zero`);
});

/* ───────────────────────── Devanagari leading — derived, per role ───────────────────────── */

import { devanagariLeading } from "../build/devanagari-leading.mjs";

/**
 * Until 2026-09-04 Hindi had ONE line height, a unitless 1.7 on every role, which undid the
 * scale (a 40px headline at 68px leading) and which Figma read as 1.7px. It is now derived per
 * role — Latin leading + offset × size, rounded UP to the 4px grid — by the build, from
 * `font.lineHeight.devanagariOffset`. These assert the rule's outcomes and that the build
 * actually emitted them; the rule itself lives in one function both sides import.
 */
const OFFSET = Number(prim.font.lineHeight.devanagariOffset.$value);
const built = JSON.parse(readFileSync(root + "dist/figma.tokens.json", "utf8"));
const css = readFileSync(root + "dist/tokens.css", "utf8");

test("the Devanagari offset is a fraction of the size, and only that", () => {
  assert.ok(OFFSET > 0 && OFFSET < 1, `offset ${OFFSET} is not a fraction`);
  assert.equal(prim.font.lineHeight.devanagariOffset.$type ?? prim.font.lineHeight.$type, "number");
  // Nothing else may be authored under font.lineHeight — leading belongs to a role.
  const keys = Object.keys(prim.font.lineHeight).filter((k) => !k.startsWith("$"));
  assert.deepEqual(keys, ["devanagariOffset"]);
});

test("no role authors its own lhDevanagari — it is derived", () => {
  for (const r of roles) assert.equal(r.node.lhDevanagari, undefined, `${r.tier}-${r.n} authors lhDevanagari`);
});

test("every role's Devanagari leading is on the 4px grid, above its Latin leading, and inside 1.25–1.80", () => {
  for (const r of roles) for (const s of ["website", "portal"]) {
    const [smin, smax] = bounds(r.node.size, s);
    const [lmin, lmax] = bounds(r.node.lh, s);
    for (const [size, lh] of [[smin, lmin], [smax, lmax]]) {
      const hi = devanagariLeading(size, lh, OFFSET);
      assert.equal(hi % 4, 0, `${r.tier}-${r.n} ${s} Devanagari ${hi} is off the 4px grid`);
      assert.ok(hi > lh, `${r.tier}-${r.n} ${s} Devanagari ${hi} is not above Latin ${lh}`);
      const ratio = hi / size;
      assert.ok(ratio >= 1.25 && ratio <= 1.8, `${r.tier}-${r.n} ${s} Devanagari ${size}/${hi} = ${ratio.toFixed(2)} is outside 1.25–1.80`);
    }
  }
});

test("Devanagari leading keeps the scale's rhythm — a smaller role never sits tighter than the larger one above it", () => {
  for (const tier of ["display", "headline", "title", "body", "label"]) {
    const steps = roles.filter((r) => r.tier === tier).sort((a, b) => a.n - b.n);
    for (const s of ["website", "portal"]) {
      let prev = 0;
      for (const r of steps) {
        const [size] = bounds(r.node.size, s), [lh] = bounds(r.node.lh, s);
        const ratio = devanagariLeading(size, lh, OFFSET) / size;
        assert.ok(ratio + 0.1 >= prev, `${tier}-${r.n} ${s} Devanagari ratio ${ratio.toFixed(2)} dips below ${prev.toFixed(2)}`);
        prev = ratio;
      }
    }
  }
});

test("the build emitted lhDevanagari for all 21 roles, at the rule's value, and the semantic alias reads body-1", () => {
  let count = 0;
  for (const r of roles) {
    const leaf = built.font.role[r.tier][String(r.n)].lhDevanagari;
    assert.ok(leaf, `${r.tier}-${r.n} has no built lhDevanagari`);
    const expected = devanagariLeading(r.node.size.$value, r.node.lh.$value, OFFSET);
    assert.equal(px(leaf), expected, `${r.tier}-${r.n} built ${leaf}, rule says ${expected}px`);
    assert.match(css, new RegExp(`--sa-type-${r.tier}-${r.n}-lhDevanagari:`), `${r.tier}-${r.n} lhDevanagari missing from tokens.css`);
    count += 1;
  }
  assert.equal(count, 21);
  assert.equal(px(built.leading.devanagari), px(built.font.role.body["1"].lhDevanagari));
  // Body-1's Devanagari leading is where the retired flat 1.7 was aiming: 16 / 28.
  assert.equal(px(built.font.role.body["1"].lhDevanagari), 28);
});
