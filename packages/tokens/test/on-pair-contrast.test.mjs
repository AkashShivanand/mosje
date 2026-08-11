import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrast } from "../build/wcag.mjs";

/**
 * Spec §9.3 — every `--sa-on-*` is readable on the fill it names.
 *
 * The spec has specified this test since the architecture was written; it had never been
 * written, because until now the `on/*` namespace it checks did not exist either. Both landed
 * together, which is the only order that makes sense: a gate for a namespace nobody built is
 * worse than no gate, since it reads as coverage.
 *
 * Measured across the ACTUAL BRAND PRODUCT (R2), not one brand at a time. A pairing that
 * clears AA on gov-blue and fails on gov-navy is a failing pairing — the estate ships both,
 * and a reader gets whichever their portal is themed with.
 */

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const blocks = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));

function context(match) {
  const map = new Map();
  for (const b of blocks) {
    if (b.sel !== ":root" && !(match && b.sel.includes(match))) continue;
    for (const d of b.body.matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) map.set(d[1], d[2].trim());
  }
  const resolve = (v, depth = 0) => {
    if (depth > 20) return v;
    const m = /^var\((--[A-Za-z0-9-]+)(?:\s*,\s*([^)]*))?\)$/.exec(String(v).trim());
    if (!m) return String(v).trim();
    const t = map.get(m[1]);
    return t !== undefined ? resolve(t, depth + 1) : m[2] ? resolve(m[2], depth + 1) : v;
  };
  return { map, resolve };
}

const BRANDS = [
  { name: "blue", ctx: context(null) },
  { name: "navy", ctx: context('data-brand="navy"') },
];

const HEX = /^#[0-9a-f]{6}$/i;
const AA = 4.5;

/** `--sa-on-bg-status-error-bolder` → the fill it is the foreground FOR. */
const fillFor = (onName) => onName.replace("--sa-on-bg-", "--sa-bg-");

function pairs() {
  const out = [];
  for (const name of BRANDS[0].ctx.map.keys()) {
    if (!name.startsWith("--sa-on-bg-")) continue;
    out.push({ on: name, fill: fillFor(name) });
  }
  return out;
}

/**
 * Pairings that do not reach AA, pinned so the list can only shrink.
 *
 * Both are the SAME tokens already on the prominence shortfall ledger, reached from the
 * other direction: a `bolder` fill that measures below its own rung is also a fill no ink can
 * sit on legibly. That the two measurements agree independently is the useful part — if this
 * list and that one ever diverge, one of them is wrong.
 *
 * The remedy is the fill, not the ink: there is no foreground that rescues a 4.4:1 surface.
 *
 * `--sa-on-bg-brand-secondary-bolder` LEFT this list on 2026-08-11: the regenerated saffron
 * ramp puts its `bolder` rung at 4.62:1, up from 3.94:1. That is what the ratchet is for.
 */
const KNOWN_BELOW_AA = new Set([
  "--sa-on-bg-status-error-bolder",
  "--sa-on-bg-status-warning-bolder",
]);

test("EVERY fill that carries content has a foreground — no floor, an invariant", () => {
  // This assertion used to be `found.length >= 40`, a FLOOR. It passed while six
  // `bg/brand/accent/*` fills had no pairing at all: a third brand colour was added, wired as
  // far as the palette, and stopped. A count cannot notice that — only a comparison against
  // the fills themselves can. The gate now derives the expected set instead of trusting a
  // number somebody typed when the number happened to be right.
  const fills = [...BRANDS[0].ctx.map.keys()].filter(
    (n) => /^--sa-bg-/.test(n) && !/-inverse|-disabled/.test(n),
  );
  const paired = new Set(pairs().map((p) => p.fill));
  const unpaired = fills.filter((f) => !paired.has(f)).sort();
  assert.deepEqual(
    unpaired,
    [],
    `${unpaired.length} fill(s) carry content with no guaranteed foreground:\n  ` +
      `${unpaired.join("\n  ")}\n\nAdd an on/* pairing CHOSEN BY MEASUREMENT — the ink that ` +
      `clears AA on that fill in the worst brand. Do not raise a threshold to make this pass.`,
  );

  // And nothing points at a fill that does not exist, which is the same invariant reversed.
  for (const { on, fill } of pairs()) {
    assert.ok(BRANDS[0].ctx.map.has(fill), `${on} names a fill that does not exist: ${fill}`);
  }
});

test("every --sa-on-* is AA-readable on its own fill, in every brand", () => {
  const failures = [];
  let checked = 0;
  for (const brand of BRANDS) {
    for (const { on, fill } of pairs()) {
      const fg = brand.ctx.resolve(brand.ctx.map.get(on));
      const bg = brand.ctx.resolve(brand.ctx.map.get(fill));
      if (!HEX.test(fg) || !HEX.test(bg)) continue;
      checked++;
      const ratio = contrast(fg, bg);
      if (ratio + 0.005 < AA && !KNOWN_BELOW_AA.has(on)) {
        failures.push(`[${brand.name}] ${on} on ${fill} = ${ratio.toFixed(2)}:1`);
      }
    }
  }
  assert.ok(checked >= 70, `expected both brands measured, only resolved ${checked} pairings`);
  assert.deepEqual(
    failures,
    [],
    `${failures.length} foreground(s) are not readable on the fill they name:\n  ` +
      `${failures.join("\n  ")}\n\nFix the FILL — no ink rescues a surface this close to its ` +
      `own background. Do NOT add to KNOWN_BELOW_AA, which may only shrink.`,
  );
});

test("the known-below-AA list has no stale entries", () => {
  const stale = [];
  for (const on of KNOWN_BELOW_AA) {
    const worst = Math.min(
      ...BRANDS.map((b) => {
        const fg = b.ctx.resolve(b.ctx.map.get(on));
        const bg = b.ctx.resolve(b.ctx.map.get(fillFor(on)));
        return HEX.test(fg) && HEX.test(bg) ? contrast(fg, bg) : 0;
      }),
    );
    if (worst + 0.005 >= AA) stale.push(`${on} now measures ${worst.toFixed(2)}:1 — remove it`);
  }
  assert.deepEqual(stale, [], `${stale.length} entry(s) are fixed and must leave the list`);
});

test("the on/* shortfalls are the SAME tokens as the prominence shortfalls", () => {
  // Two independent measurements of the same defect. If they ever disagree, one of the two
  // resolvers is wrong and both ledgers become untrustworthy — so the agreement is asserted
  // rather than assumed.
  const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));
  const prominence = new Set(
    payload.contrast.shortfall
      .map((s) => s.split("::")[1].split(" ")[0])
      .filter((p) => p.startsWith("bg/")),
  );
  for (const on of KNOWN_BELOW_AA) {
    const path = on.replace("--sa-on-", "").replace(/-/g, "/");
    assert.ok(
      prominence.has(path),
      `${on} fails AA but ${path} is not on the prominence shortfall ledger — the two ` +
        `measurements disagree`,
    );
  }
});
