import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { relLum } from "./lib/contrast.mjs";

/**
 * Every enabled Action-matrix combination must put a readable label on its own fill.
 *
 * This is the gate the old Button could not have: `button.css` computed hover and active
 * with `filter: brightness(0.95)`, so those colours existed only at paint time — nothing
 * could assert them. Naming each state as a token makes all 48 base combinations (plus the
 * inverse set) checkable, and it immediately found two real AA failures on the danger ramp
 * that had been shipping.
 *
 * Spec §7.3, §9.3.
 */

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8");

/**
 * Declarations visible in a given brand context: `:root`, then the brand block layered over
 * it. Until 2026-08-10 this file read `:root` ONLY — i.e. it checked the Blue brand and
 * called that coverage. That was safe while the component tier shipped as frozen literals,
 * because Navy rendered identically (which was itself the bug). Now that 101 component
 * tokens genuinely repaint under Navy, resolving only `:root` would leave every one of those
 * values unverified — a gate that goes green on colours nobody measured.
 */
function blockFor(match) {
  const decls = new Map();
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of stripped.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1].trim();
    if (sel !== ":root" && !(match && sel.includes(match))) continue;
    for (const d of m[2].matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) decls.set(d[1], d[2].trim());
  }
  return decls;
}

/** The brands this estate ships. Each is checked independently and in full. */
const BRANDS = [
  { name: "blue", decls: blockFor(null) },
  { name: "navy", decls: blockFor('data-brand="navy"') },
];
let CURRENT = BRANDS[0].decls;

/** Resolve a var() chain in the current brand context to a literal. */
function resolve(name, depth = 0) {
  if (depth > 10) return null;
  const v = CURRENT.get(name);
  if (v === undefined) return null;
  const ref = v.match(/^var\((--[A-Za-z0-9-]+)\)$/);
  return ref ? resolve(ref[1], depth + 1) : v;
}

/** Parse #rgb / #rrggbb / #rrggbbaa / rgb() / rgba() into [r,g,b,a]. */
function parseColor(v) {
  v = v.trim();
  if (v.startsWith("#")) {
    let h = v.slice(1);
    if (h.length === 3) h = [...h].map((c) => c + c).join("");
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((x) => parseFloat(x.trim()));
  return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
}

/** Composite a possibly-translucent colour over an opaque one. */
function over([r, g, b, a], [R, G, B]) {
  return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1];
}

function contrastOf(fg, bg) {
  const [l1, l2] = [relLum(fg), relLum(bg)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const INTENTS = ["brand", "success", "destructive", "neutral"];
const VARIANTS = ["primary", "secondary", "tertiary", "tonal"];
const ENABLED = ["default", "hover", "active"];
const AA_TEXT = 4.5;

const surfaceOf = () => parseColor(resolve("--sa-bg-neutral-base"));
const inverseSurfaceOf = () => parseColor(resolve("--sa-color-brand-navy"));

function check(prefix, base) {
  const failures = [];
  let checked = 0;
  for (const intent of INTENTS) {
    for (const variant of VARIANTS) {
      for (const state of ENABLED) {
        const bgRaw = resolve(`${prefix}-${intent}-${variant}-${state}-bg`);
        const fgRaw = resolve(`${prefix}-${intent}-${variant}-${state}-text`);
        if (!bgRaw || !fgRaw) continue;
        const bg = over(parseColor(bgRaw), base);
        const fg = over(parseColor(fgRaw), bg);
        const ratio = contrastOf(fg, bg);
        checked++;
        if (ratio < AA_TEXT) {
          failures.push(
            `${intent}/${variant}/${state}: ${fgRaw} on ${bgRaw} = ${ratio.toFixed(2)}:1`,
          );
        }
      }
    }
  }
  return { checked, failures };
}

test("every enabled Action combination puts an AA-readable label on its own fill", () => {
  // Per brand, in full. A label that is readable on the primary blue is not thereby
  // readable on navy: the two ramps differ at every step, and the component tier follows them.
  for (const brand of BRANDS) {
    CURRENT = brand.decls;
    const { checked, failures } = check("--sa-cmp-action", surfaceOf());
    assert.ok(checked >= 40, `${brand.name}: expected the full matrix, only resolved ${checked}`);
    assert.deepEqual(
      failures,
      [],
      `\n  [${brand.name}]\n  ${failures.join("\n  ")}\n\nFix by adding a per-intent step ` +
        `override in src/component-matrix.json — do NOT lower this threshold.`,
    );
  }
  CURRENT = BRANDS[0].decls;
});

test("inverse actions stay AA-readable on a solid brand surface", () => {
  // The inverse qualifier exists for buttons on a solid brand header. Its values are
  // white-alpha so they work on any brand colour; navy is the darkest surface in the
  // estate and therefore the binding case for the translucent steps.
  const INVERSE_SURFACE = inverseSurfaceOf();
  assert.ok(INVERSE_SURFACE, "--sa-color-brand-navy must resolve for this test to mean anything");
  const failures = [];
  let checked = 0;
  for (const intent of INTENTS) {
    for (const variant of ["primary", "secondary"]) {
      for (const state of ENABLED) {
        const bgRaw = resolve(`--sa-cmp-action-${intent}-${variant}-inverse-${state}-bg`);
        const fgRaw = resolve(`--sa-cmp-action-${intent}-${variant}-inverse-${state}-text`);
        if (!bgRaw || !fgRaw) continue;
        const bg = over(parseColor(bgRaw), INVERSE_SURFACE);
        const fg = over(parseColor(fgRaw), bg);
        const ratio = contrastOf(fg, bg);
        checked++;
        if (ratio < AA_TEXT) {
          failures.push(
            `${intent}/${variant}/inverse/${state}: ${fgRaw} on ${bgRaw} over navy = ${ratio.toFixed(2)}:1`,
          );
        }
      }
    }
  }
  assert.ok(checked >= 20, `expected the inverse matrix, only resolved ${checked}`);
  assert.deepEqual(failures, [], `\n  ${failures.join("\n  ")}\n`);
});

test("disabled fills are neutral, not a washed-out intent colour", () => {
  // A faded red still reads as an error affordance. The matrix routes every disabled fill
  // to the neutral ramp for exactly this reason; assert it rather than trusting the JSON.
  const neutral200 = resolve("--sa-color-neutralScale-200");
  for (const intent of INTENTS) {
    for (const variant of ["primary", "tonal"]) {
      const bg = resolve(`--sa-cmp-action-${intent}-${variant}-disabled-bg`);
      assert.equal(
        bg,
        neutral200,
        `${intent}/${variant}/disabled/bg should be the neutral fill, got ${bg}`,
      );
    }
  }
});
