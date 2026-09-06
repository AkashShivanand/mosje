import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrast, PAIRINGS } from "./lib/contrast.mjs";

/**
 * The six DBIM conformance brands, swept through the SAME pairings every other
 * brand is already gated on.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * `mode-contrast.test.mjs` sweeps Blue and Navy. `brand-contrast.test.mjs`
 * sweeps `:root`. `on-pair-contrast.test.mjs` sweeps Blue and Navy. Between
 * them they cover every brand this estate ships — and none of them had ever
 * read a `[data-brand="dbim-*"]` block. Six brands, reachable from the demo
 * dock's Colour tab on every surface of the estate, were outside every contrast
 * gate the token system has.
 *
 * That is how the two failures below shipped, and neither is a transcription
 * error: `reference/dbim-palette.json` reproduces all thirty primary hexes and
 * all twelve functional hexes of DBIM 3.0 §2 exactly. DBIM publishes SWATCHES
 * and one obligation — §2.1.iv, "colour usage should ensure the accessibility
 * of digital platform" — and no pairing table at all. Which shade carries a
 * button fill, and which ink sits on it, are OUR decisions. So is every rung
 * between DBIM's five published shades, because DBIM publishes five and this
 * estate's ramps have eleven.
 *
 * THE ROOT CAUSE OF THE `on/*` HALF
 * ---------------------------------
 * `on/bg/brand/primary/bolder` is `{text.neutral.inverse}` — white — declared
 * once at `:root` and inherited by every brand. NO brand block re-declares an
 * `on/*` token, navy included. That is safe exactly while every brand's fills
 * sit in the same lightness band, which Blue and Navy do and DBIM Green and
 * Chrome Yellow do not: their shade 2 and shade 3 are light enough that white
 * fails on them. `dbim-brand-modes.mjs` cannot catch it either, because its
 * `dbimValueFor` only remaps `color.*` refs and `{text.neutral.inverse}` is a
 * semantic one.
 *
 * THE FIX, WRITTEN DOWN RATHER THAN GUESSED AT
 * --------------------------------------------
 * `addDbimBrandModes` should emit a per-group `on/bg/brand/primary/*` override
 * chosen by MEASURING the group's resolved rung — white where it clears AA,
 * `{color.dbimInk}` (Deep Earthy Brown #150202) where it does not. The
 * precedent is already in `DBIM_FUNCTIONAL`: Mustard Yellow's `bolder` fill
 * takes dark ink for exactly this reason. Doing it means rebuilding
 * `dist/tokens.css` and the Figma exports, so it is deliberately NOT bundled
 * with an unrelated UI change — see the baseline below.
 *
 * The baseline is a RATCHET in the estate's usual shape: it may shrink, never
 * grow, and a fix that is not recorded here fails too. It is not an exemption
 * list — every entry is a real AA failure that a reader can reach today.
 */

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * Declarations for a brand, matched against the selector LIST rather than a
 * single needle. `dbim-blue` and `navy` are emitted grouped with their
 * deprecated aliases (`[data-brand="dbim-blue"],\n[data-brand="dbim"] {`), so a
 * `css.indexOf('[data-brand="dbim-blue"] {')` finds nothing and silently
 * reports the brand as unmeasured. That is not hypothetical — it is what the
 * first run of this sweep did, and it made dbim-blue look clean.
 */
const blocks = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((m) => ({
  sels: m[1].split(",").map((s) => s.trim()),
  body: m[2],
}));

function declsOf(pred) {
  const map = new Map();
  for (const b of blocks) {
    if (!b.sels.some(pred)) continue;
    for (const d of b.body.matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) map.set(d[1], d[2].trim());
  }
  return map;
}

const ROOT = declsOf((s) => s === ":root");

/** Resolve as a browser would inside `overrides`, falling back to `:root`. */
function makeResolver(overrides) {
  return function resolve(name, depth = 0) {
    if (depth > 8) return null;
    const value = overrides.get(name) ?? ROOT.get(name) ?? null;
    if (value === null) return null;
    const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
    return ref ? resolve(ref[1], depth + 1) : value;
  };
}

const BRANDS = [
  "dbim-blue",
  "dbim-burgundy",
  "dbim-purple",
  "dbim-green",
  "dbim-chrome-yellow",
  "dbim-cinnamon-red",
];

/**
 * Known AA failures, frozen. `<brand> :: <pairing label>`.
 *
 * Both are consequences of rung assignment on values DBIM never published:
 *
 *  - `button label on primary` — white on the INTERPOLATED rung 500, which for
 *    Green is #53a1a1 (3.01:1) and for Chrome Yellow #b78320 (3.34:1). Blue's
 *    own rung 500 is #0373DF at 4.66:1, which is why the default brand passes
 *    and these two do not.
 *  - `success badge text on success tonal` — 4.42:1 in ALL SIX, because DBIM's
 *    success is one published colour (Liberty Green #198754, pinned at rung
 *    500) and rungs 700 and 200 are both derived from it. Group-independent, so
 *    identical in every group.
 */
const BASELINE = new Set([
  "dbim-green :: button label on primary",
  "dbim-chrome-yellow :: button label on primary",
  "dbim-blue :: success badge text on success tonal",
  "dbim-burgundy :: success badge text on success tonal",
  "dbim-purple :: success badge text on success tonal",
  "dbim-green :: success badge text on success tonal",
  "dbim-chrome-yellow :: success badge text on success tonal",
  "dbim-cinnamon-red :: success badge text on success tonal",
]);

test("every DBIM conformance brand is MEASURED, and its failures are the declared ones", () => {
  const seen = new Set();
  const details = [];

  for (const brand of BRANDS) {
    const overrides = declsOf((s) => s === `[data-brand="${brand}"]`);
    assert.ok(
      overrides.size > 0,
      `no [data-brand="${brand}"] block in dist/tokens.css — the brand is unreachable from ` +
        `this gate, which is the state that let its failures ship. Check the selector list.`,
    );

    const resolve = makeResolver(overrides);
    let measured = 0;

    for (const p of PAIRINGS) {
      const fg = resolve(p.fg);
      const bg = resolve(p.bg);
      // Only hex pairs are assertable; alpha depends on what is behind them.
      if (!fg || !bg || !/^#/.test(fg) || !/^#/.test(bg)) continue;
      measured++;
      const ratio = contrast(fg, bg);
      if (ratio >= p.min) continue;
      const key = `${brand} :: ${p.label}`;
      seen.add(key);
      details.push(`${key} — ${fg} on ${bg} = ${ratio.toFixed(2)}:1 < ${p.min}:1`);
    }

    assert.ok(
      measured >= 8,
      `${brand}: only ${measured} pairings resolved to hex. A brand that stops resolving ` +
        `reports clean for the wrong reason.`,
    );
  }

  const appeared = [...seen].filter((k) => !BASELINE.has(k));
  assert.deepEqual(
    appeared,
    [],
    "\nNEW DBIM contrast failure(s) — a brand mode has regressed:\n" +
      details.filter((d) => appeared.some((a) => d.startsWith(a))).join("\n"),
  );

  const fixed = [...BASELINE].filter((k) => !seen.has(k));
  assert.deepEqual(
    fixed,
    [],
    "\nThese DBIM pairings now PASS. Delete them from BASELINE in this same change, so the " +
      "gain cannot be given back:\n  " + fixed.join("\n  "),
  );
});

test("the DBIM palette is TRANSCRIBED, never re-derived — every published hex is still exact", async () => {
  const { default: palette } = await import("../reference/dbim-palette.json", {
    with: { type: "json" },
  });

  // DBIM 3.0 §2.1, Figure 1 — six groups, five shades. Read from
  // docs/guidelines/DBIM-3.0/DBIM_3.0.md, which transcribes the source PDF.
  const FIGURE_1 = {
    burgundy: ["#6C1340", "#A32966", "#DB70A6", "#EBADCC", "#FAEBF2"],
    purple: ["#29136C", "#4729A3", "#8B70DB", "#BDADEB", "#EEEBFA"],
    blue: ["#162F6A", "#214AAB", "#5279D7", "#A3BBF3", "#D2DFFF"],
    green: ["#0F5757", "#2D8686", "#75BDBD", "#A6D9D9", "#D9F2F2"],
    chromeYellow: ["#5D3E00", "#916100", "#DDA73A", "#F4D390", "#FFEECC"],
    cinnamonRed: ["#771D1D", "#A72626", "#D75151", "#FAAAAA", "#FCDADA"],
  };

  // DBIM 3.0 §2.2.1, Table 1 — the functional palette.
  const TABLE_1 = {
    linen: "#EBEAEA",
    inclusive: "#FFFFFF",
    deepEarthyBrown: "#150202",
    black: "#000000",
    deepBlue: "#1D0A69",
    libertyGreen: "#198754",
    mustardYellow: "#FFC107",
    coralRed: "#DC3545",
    blue: "#0D6EFD",
    grey01: "#C6C6C6",
    grey02: "#8E8E8E",
    grey03: "#606060",
  };

  for (const [group, shades] of Object.entries(FIGURE_1)) {
    const got = palette.primaryPalette.groups[group];
    assert.ok(got, `dbim-palette.json is missing primary group "${group}"`);
    shades.forEach((hex, i) => {
      assert.equal(
        got[String(i + 1)],
        hex,
        `${group} shade ${i + 1} drifted from DBIM 3.0 Figure 1. A conformance palette that ` +
          `has been re-derived is no longer a conformance palette.`,
      );
    });
  }

  for (const [name, hex] of Object.entries(TABLE_1)) {
    assert.equal(
      palette.functionalPalette[name]?.hex,
      hex,
      `functional colour "${name}" drifted from DBIM 3.0 Table 1.`,
    );
  }

  // §2.2.1 — Deep Blue is the Gov.In root site's identity and must never appear
  // in a departmental palette. It is transcribed so the rule can be stated; it
  // must not be wired into a brand.
  assert.ok(
    !css.includes("#1d0a69") && !css.includes("#1D0A69"),
    "Deep Blue #1D0A69 has reached tokens.css. DBIM 3.0 §2.2.1 reserves it for the Gov.In " +
      "root website; a departmental platform must not use it.",
  );
});
