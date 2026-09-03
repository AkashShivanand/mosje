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
 * There were four real failures, not five, and all four were `tonal` — retired 2026-08-27.
 *
 * THE AUDIT ALSO MISSED ONE, FOR THE MIRROR-IMAGE REASON.
 * ------------------------------------------------------
 * It measured every boundary against a WHITE page. But `inverse` exists precisely
 * because the button is NOT on a white page — it is on a solid brand surface. Measured
 * where it actually lives, `inverse`/`outlined` fails: its border is a flat
 * `rgba(255,255,255,0.4)` for every intent, which is 2.25:1 on the ticker bar
 * (`primaryScale/600`, `#005eb9`) and 1.91:1 on gov-blue. It clears 3:1 on navy alone,
 * which is the one brand surface anybody checked.
 *
 * So the surface a control sits on is part of the measurement, and this file names the
 * surfaces rather than assuming one.
 */

const root = new URL("..", import.meta.url).pathname;
const tokensCss = readFileSync(root + "dist/tokens.css", "utf8");
const buttonCss = readFileSync(
  new URL("../../design-system/components/actions/button.css", import.meta.url).pathname,
  "utf8",
);

const AA_NONTEXT = 3.0;

/**
 * EMPTY, AND THAT IS THE POINT.
 *
 * This held the four `tonal` boundaries — 1.21:1 to 1.52:1 against a 3:1 requirement.
 * `tonal` painted a pale wash and gave it a border of the SAME colour, so the control had
 * no edge against a white page at all, and darkening the border would simply have made it
 * `outlined`. It had two consumers in 494 buttons, so it was retired on 2026-08-27 rather
 * than repaired, and the four entries left with it.
 *
 * The list may only ever shrink. Nothing goes back in.
 */
const EXEMPT = new Set([]);

/**
 * COMMENTS ARE STRIPPED FIRST, AND THAT IS NOT A TIDINESS MEASURE.
 *
 * This matched the FIRST `.ds-btn--<variant> {` in the raw file, comments included. When
 * button.css documented its new theming hooks with the obvious example —
 * `[data-portal="nmba"] .ds-btn--primary { --sa-btn-fill: ... }` — inside a comment, this
 * function read that example as the primary variant's whole declaration block. It then
 * reported that primary declares no `--_fill` and no `--_inv-edge`, which is to say: a
 * WCAG 1.4.11 contrast gate was silently redirected onto a code sample by a documentation
 * change. Stripping comments is what makes the gate measure the stylesheet.
 */
const buttonCssCode = buttonCss.replace(/\/\*[\s\S]*?\*\//g, "");

function declsIn(selector) {
  const body = buttonCssCode.match(
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
};

const VARIANTS = ["primary", "success", "danger", "neutral"];

/** variant word in button.css -> intent word in the token matrix. */
const INTENT_OF = {
  primary: "brand",
  success: "success",
  danger: "destructive",
  neutral: "neutral",
};

/**
 * Every solid surface an `inverse` button is allowed to sit on. `inverse` is documented
 * as working on ANY solid brand colour, so the gate holds it to all of them rather than
 * to the single darkest one — the failure below was invisible for exactly as long as
 * navy was the only surface anyone measured.
 */
const BRAND_SURFACES = [
  ["ticker bar / brand bolder", "--sa-color-primaryScale-600"],
  ["navy", "--sa-color-brand-navy"],
];

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

    // 4 variants x 2 appearances. It was 12 while `tonal` existed; if this number drops
    // again, an appearance has gone missing rather than been retired on purpose.
    assert.ok(
      checked >= 8,
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
  assert.equal(
    EXEMPT.size,
    0,
    `the 1.4.11 exemption list has ${EXEMPT.size} entr(y|ies). It emptied when tonal was ` +
      `retired and may only shrink — every entry is a known failure shipping to citizens.`,
  );
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

test("an inverse button's edge is findable on every brand surface it may sit on", () => {
  // The audit measured against white and therefore never looked at this. `inverse` is
  // never on white; that is what the word means.
  const failures = [];
  let checked = 0;

  // Both brands. Navy repaints the whole component tier, so a border measured only in
  // Blue is a border nobody has checked in half the estate.
  for (const brand of BRANDS) {
    CURRENT = brand.decls;
    for (const variant of VARIANTS) {
    const intent = INTENT_OF[variant];
    for (const [surfaceLabel, surfaceToken] of BRAND_SURFACES) {
      const surfaceValue = resolve(surfaceToken);
      if (!surfaceValue) continue;
      const surface = parseColor(surfaceValue);

      const edgeToken = `--sa-cmp-action-${intent}-secondary-inverse-default-border`;
      const edge = resolve(edgeToken);
      if (!edge) continue;
      const ratio = contrastOf(over(parseColor(edge), surface), surface);
      checked++;
      if (ratio < AA_NONTEXT) {
        failures.push(
          `[${brand.name}] ${variant}/inverse-outlined on ${surfaceLabel} ` +
            `(${surfaceValue}): ${edge} = ${ratio.toFixed(2)}:1`,
        );
      }
    }
    }
  }
  CURRENT = BRANDS[0].decls;

  assert.ok(
    checked >= 16,
    `expected every brand x variant x surface, only resolved ${checked}`,
  );
  assert.deepEqual(
    failures,
    [],
    `\n  an inverse button with no findable edge:\n  ${failures.join("\n  ")}\n\n` +
      `  Fix the value in src/component-matrix.json under \`inverse\`.`,
  );
});

test("inverse carries the intent, so danger does not read as brand", () => {
  // Finding #8 in button.md: inverseOutlined rendered identically for all four variants,
  // so `danger` silently lost its signal. That was a TOKEN fact, not just a CSS one —
  // every intent resolved the same white-alpha border. Distinctness is the assertion;
  // the contrast test above is what stops "distinct" being bought with an unreadable edge.
  CURRENT = BRANDS[0].decls;
  const seen = new Map();
  for (const variant of VARIANTS) {
    const intent = INTENT_OF[variant];
    const edge = resolve(`--sa-cmp-action-${intent}-secondary-inverse-default-border`);
    assert.ok(edge, `${intent} has no inverse secondary border token`);
    if (seen.has(edge)) {
      assert.fail(
        `${variant} and ${seen.get(edge)} both paint their inverse outlined border ${edge}. ` +
          `An intent that cannot be told apart is not an intent.`,
      );
    }
    seen.set(edge, variant);
  }
});

test("the component actually BINDS the inverse tokens", () => {
  // The tokens existed and were fully modelled long before anything read them:
  // `.ds-btn--inverseOutlined` hard-coded `--sa-color-transparent-white-40`, so fixing
  // the matrix alone would have changed nothing on screen. Assert the wiring, not just
  // the values.
  for (const variant of VARIANTS) {
    const decls = declsIn(variant);
    const edge = decls.get("--_inv-edge");
    assert.ok(
      edge,
      `.ds-btn--${variant} declares no --_inv-edge, so the inverse appearance cannot ` +
        `carry this variant's intent`,
    );
    const intent = INTENT_OF[variant];
    assert.match(
      edge,
      new RegExp(`--sa-cmp-action-${intent}-secondary-inverse-default-border`),
      `.ds-btn--${variant} binds ${edge} for its inverse edge, not its own intent's token`,
    );
  }
});
