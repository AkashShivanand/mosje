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
 * IT ESCAPED ANYWAY, ON 2026-09-16. The paragraph above was true about the METHOD and
 * wrong about one constant: `EDGE_OF.outlined` named `--_color`, so when the component
 * was rebound to paint its border from `--_line` the file went on measuring the label ink
 * at 10:1 and reporting a pass over a rendered border of 3.06:1. "Reads whatever they
 * actually bind" is only true if the property NAME is read from the component too, which
 * is what `resolveEdge` now does. And see PAGE_SURFACES: the ground was a constant for
 * the same reason, and white is not the ground this estate's buttons stand on.
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

/**
 * Which local custom property each appearance paints its outer edge with.
 *
 * `outlined` WAS `--_color`, and that stopped being true on 2026-09-16 without this file
 * noticing. `.ds-btn--outlined` now paints `border-color: var(--_c-line)`, which resolves
 * `--sa-btn-edge` -> `--_line` -> `--_color`; every variant block sets `--_line` from
 * `cmp/action/<intent>/secondary/default/border`, so `--_color` is the LABEL and `--_line`
 * is the edge. Measuring `--_color` measured a 10:1 ink and reported a pass while the
 * rendered border was three rungs lighter.
 *
 * That is this file's own opening warning turned on itself — "the audit measured a token;
 * the citizen sees a component" — and the defence is the same one: read what the variant
 * block actually binds. `resolveEdge` below walks the real fallback chain rather than
 * assuming one property, so the next rebinding cannot hide here either.
 */
const EDGE_OF = {
  filled: ["--_fill"],
  outlined: ["--_line", "--_color"],
};

/** First property in the chain that the variant block actually declares — the CSS fallback. */
function resolveEdge(decls, chain) {
  for (const prop of chain) {
    const raw = decls.get(prop);
    if (raw) return { prop, raw };
  }
  return null;
}

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

/**
 * Every page ground a NON-inverse button is allowed to stand on.
 *
 * White was the only one measured until 2026-09-16, and white is not where the estate's
 * buttons live: `.sa-app-shell` — the shell every portal screen renders inside — paints
 * `bg/neutral/subtler`, and `ScreenBody` puts an outlined Button straight onto it in its
 * `error` (retry) and `filtered` (clear filters) states, with `EmptyState` painting no
 * surface of its own. Rung 400 measured 3.36:1 on white and 2.94:1 there.
 *
 * `semantic.json` had already recorded the identical finding for the form-control border
 * on 2026-09-04 — 3.06:1 on white, 2.68:1 on the muted ground, moved 400 -> 500. The
 * reasoning simply never reached this file, which is why the ground is now a loop and not
 * a constant.
 */
const PAGE_SURFACES = [
  ["white page", "--sa-bg-neutral-base"],
  ["portal shell ground", "--sa-bg-neutral-subtler"],
];

test("every Button edge is findable against every page it sits on (1.4.11, 3:1)", () => {
  for (const brand of BRANDS) {
    CURRENT = brand.decls;

    const failures = [];
    let checked = 0;

    for (const [groundLabel, groundToken] of PAGE_SURFACES) {
      const groundValue = resolve(groundToken);
      assert.ok(groundValue, `${brand.name}: ${groundToken} must resolve`);
      const surface = parseColor(groundValue);

      for (const variant of VARIANTS) {
        const decls = declsIn(variant);
        assert.ok(
          decls.size > 0,
          `button.css has no .ds-btn--${variant} block — this test has drifted from the component`,
        );
        for (const [appearance, chain] of Object.entries(EDGE_OF)) {
          const edge = resolveEdge(decls, chain);
          if (!edge) continue;
          const tokenName = edge.raw.match(/^var\((--[A-Za-z0-9-]+)\)$/)?.[1];
          if (!tokenName) continue;
          const value = resolve(tokenName);
          if (!value) continue;
          const ratio = contrastOf(over(parseColor(value), surface), surface);
          checked++;
          const key = `${variant}/${appearance}`;
          if (ratio < AA_NONTEXT && !EXEMPT.has(key)) {
            failures.push(
              `${key} on ${groundLabel}: ${edge.prop} -> ${tokenName} = ${value} ` +
                `on ${groundValue} = ${ratio.toFixed(2)}:1`,
            );
          }
        }
      }
    }

    // 4 variants x 2 appearances x 2 grounds. It was 8 while white was the only ground and
    // 12 while `tonal` existed; if this number drops, a ground, a variant or an appearance
    // has gone missing rather than been retired on purpose.
    assert.ok(
      checked >= 16,
      `${brand.name}: expected every variant x appearance x ground, only resolved ${checked}`,
    );
    assert.deepEqual(
      failures,
      [],
      `\n  [${brand.name}] edges a sighted user cannot find against the page:\n  ` +
        `${failures.join("\n  ")}\n\n  Darken the token. Do NOT add to EXEMPT, and do ` +
        `NOT fix only the ground that failed — the rung moves for every variant together.`,
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

test("the outlined border is the secondary token, and every variant declares it", () => {
  // THIS TEST USED TO ASSERT THE OPPOSITE, and that is the point of keeping it.
  //
  // Until 2026-09-16 it read: "the neutral outlined border is NOT the 2.15:1 the audit
  // reported", pinned `--_color` to the tertiary TEXT token, and warned that a rebinding
  // to `cmp/action/neutral/secondary/default/border` "would be a real failure" because
  // that token then resolved to #adb1b7.
  //
  // The rebinding happened — `.ds-btn--outlined` paints `--_c-line`, fed by each variant's
  // `--_line` — and this file did not notice, because it was still measuring `--_color`.
  // The warning was right; the guard was in the wrong place. The token has since moved to
  // rung 500, so the binding is now correct AND findable, and what needs pinning is no
  // longer "the border is not that token" but "the border IS that token, on every variant".
  CURRENT = BRANDS[0].decls;
  for (const variant of VARIANTS) {
    const raw = declsIn(variant).get("--_line");
    assert.ok(
      raw,
      `.ds-btn--${variant} declares no --_line, so its outlined border silently falls back ` +
        `to --_color (the label ink) and the 1.4.11 sweep above measures the wrong colour`,
    );
    const tokenName = raw.match(/^var\((--[A-Za-z0-9-]+)\)$/)?.[1];
    assert.equal(
      tokenName,
      `--sa-cmp-action-${INTENT_OF[variant]}-secondary-default-border`,
      `.ds-btn--${variant} binds its outlined border to ${tokenName}, not the secondary ` +
        `border token — re-measure before trusting this file`,
    );
  }
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
