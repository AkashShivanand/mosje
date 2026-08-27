import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { relLum } from "./lib/contrast.mjs";

/**
 * WCAG 2.2 §1.4.11 Non-text Contrast (AA) for the Button.
 *
 * `action-contrast.test.mjs` already checks the OTHER half — a label against its own
 * fill, 1.4.3 at 4.5:1. This file checks the boundary a sighted user needs in order to
 * find the control at all: the fill or the border against the page behind it, 3:1.
 *
 * WHY IT PARSES `button.css` INSTEAD OF LISTING TOKENS
 * ---------------------------------------------------
 * The 2026-08-25 audit reported five 1.4.11 failures, one of them "neutral outlined,
 * 2.15:1, border is neutralScale/300". Measuring it showed that is not what the
 * component renders: `.ds-btn--neutral` sets `--_color` from
 * `cmp/action/neutral/tertiary/default/text`, and `.ds-btn--outlined` paints its border
 * with `--_color`, so the rendered border is #1e2124 at 16.18:1. The 2.15:1 value
 * belongs to `cmp/action/neutral/secondary/default/border`, a token `button.css` does
 * not bind. The audit measured a token; the citizen sees a component.
 *
 * That is the same error class as the "~400 button backgrounds on raw primary" claim
 * corrected in `docs/design-system/figma-ref-tier-cleanup.md`, and the defence against
 * it is structural: this test reads the variant blocks out of `button.css` and measures
 * whatever they actually bind. A rebinding cannot silently escape it, and no list here
 * can go stale.
 *
 * There are four real failures, not five, and all four are `tonal`.
 */

const root = new URL("..", import.meta.url).pathname;
const tokensCss = readFileSync(root + "dist/tokens.css", "utf8");
const buttonCss = readFileSync(
  new URL("../../design-system/components/actions/button.css", import.meta.url).pathname,
  "utf8",
);

const AA_NONTEXT = 3.0;

/**
 * The four `tonal` boundaries, declared rather than hidden.
 *
 * `tonal` paints a pale wash and gives it a border of the SAME colour, so the control's
 * edge against a white page is whatever the wash is — 1.21:1 to 1.52:1. It cannot be
 * fixed by darkening the border without becoming a different appearance, and it has two
 * consumers out of 494. The decision (2026-08-27) is to retire it; these entries go with
 * it and the list is asserted to only ever SHRINK.
 */
const EXEMPT = new Set([
  "primary/tonal",
  "success/tonal",
  "danger/tonal",
  "neutral/tonal",
]);

function declsIn(selector) {
  const body = buttonCss.match(
    new RegExp(`\\.ds-btn--${selector}\\s*\\{([^}]*)\\}`),
  );
  if (!body) return new Map();
  const out = new Map();
  for (const m of body[1].matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

function blockFor(match) {
  const d = new Map();
  const stripped = tokensCss.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of stripped.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1].trim();
    if (sel !== ":root" && !(match && sel.includes(match))) continue;
    for (const x of m[2].matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) d.set(x[1], x[2].trim());
  }
  return d;
}

const BRANDS = [
  { name: "blue", decls: blockFor(null) },
  { name: "navy", decls: blockFor('data-brand="navy"') },
];
let CURRENT = BRANDS[0].decls;

function resolve(name, depth = 0) {
  if (depth > 12) return null;
  const v = CURRENT.get(name);
  if (v === undefined) return null;
  const ref = v.match(/^var\((--[A-Za-z0-9-]+)\)$/);
  return ref ? resolve(ref[1], depth + 1) : v;
}

function parseColor(v) {
  v = (v || "").trim();
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

const over = ([r, g, b, a], [R, G, B]) => [
  r * a + R * (1 - a),
  g * a + G * (1 - a),
  b * a + B * (1 - a),
  1,
];

function contrastOf(fg, bg) {
  const [l1, l2] = [relLum(fg), relLum(bg)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Which local custom property each appearance paints its outer edge with. */
const EDGE_OF = {
  filled: "--_fill",
  outlined: "--_color",
  tonal: "--_tonal-bg",
};

const VARIANTS = ["primary", "success", "danger", "neutral"];

test("every Button edge is findable against the page it sits on (1.4.11, 3:1)", () => {
  for (const brand of BRANDS) {
    CURRENT = brand.decls;
    const surface = parseColor(resolve("--sa-bg-neutral-base"));
    assert.ok(surface, `${brand.name}: --sa-bg-neutral-base must resolve`);

    const failures = [];
    let checked = 0;

    for (const variant of VARIANTS) {
      const decls = declsIn(variant);
      assert.ok(
        decls.size > 0,
        `button.css has no .ds-btn--${variant} block — this test has drifted from the component`,
      );
      for (const [appearance, prop] of Object.entries(EDGE_OF)) {
        const raw = decls.get(prop);
        if (!raw) continue;
        const tokenName = raw.match(/^var\((--[A-Za-z0-9-]+)\)$/)?.[1];
        if (!tokenName) continue;
        const value = resolve(tokenName);
        if (!value) continue;
        const ratio = contrastOf(over(parseColor(value), surface), surface);
        checked++;
        const key = `${variant}/${appearance}`;
        if (ratio < AA_NONTEXT && !EXEMPT.has(key)) {
          failures.push(`${key}: ${tokenName} = ${value} on surface = ${ratio.toFixed(2)}:1`);
        }
      }
    }

    assert.ok(
      checked >= 12,
      `${brand.name}: expected every variant x appearance edge, only resolved ${checked}`,
    );
    assert.deepEqual(
      failures,
      [],
      `\n  [${brand.name}] edges a sighted user cannot find against the page:\n  ` +
        `${failures.join("\n  ")}\n\n  Darken the token. Do NOT add to EXEMPT.`,
    );
  }
  CURRENT = BRANDS[0].decls;
});

test("the 1.4.11 exemption list only ever shrinks", () => {
  // Every exemption is a known failure shipping to citizens, so the list is capped at the
  // four it was created with. Retiring `tonal` empties it; nothing may ever be added.
  assert.ok(
    EXEMPT.size <= 4,
    `the 1.4.11 exemption list grew to ${EXEMPT.size}. It may only shrink.`,
  );
  for (const key of EXEMPT) {
    assert.ok(
      key.endsWith("/tonal"),
      `${key} is exempt but is not a tonal boundary. Only tonal was ever agreed.`,
    );
  }
});

test("the neutral outlined border is NOT the 2.15:1 the audit reported", () => {
  // Pins the correction itself, so the wrong number cannot quietly come back. If the
  // component is ever rebound to cmp/action/neutral/secondary/default/border, this fails
  // and the 1.4.11 sweep above fails with it — which is the correct outcome, because that
  // token resolves to #adb1b7 and would be a real failure.
  CURRENT = BRANDS[0].decls;
  const surface = parseColor(resolve("--sa-bg-neutral-base"));
  const bound = declsIn("neutral").get("--_color");
  const tokenName = bound?.match(/^var\((--[A-Za-z0-9-]+)\)$/)?.[1];
  assert.equal(
    tokenName,
    "--sa-cmp-action-neutral-tertiary-default-text",
    "neutral's --_color moved; re-measure the outlined border before trusting this file",
  );
  const ratio = contrastOf(over(parseColor(resolve(tokenName)), surface), surface);
  assert.ok(
    ratio > 10,
    `the rendered neutral outlined border measures ${ratio.toFixed(2)}:1, not the >10 expected`,
  );
});
