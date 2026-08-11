/**
 * The brand ramps, as anchors plus a rule — run with `node build/brand-ramps.mjs`.
 *
 * WHY THIS FILE IS THE SOURCE AND brand.json IS THE OUTPUT
 * -------------------------------------------------------
 * Before this, every one of the 40 brand ramp values was hand-picked, and the 2026-08-11
 * colour audit measured what that cost: the Navy ramp fell 27.4 L* in one step and then
 * crammed four rungs into a 15-point band, so its hover and active states were three L*
 * apart and effectively invisible. Nobody chose that; it is what happens when ten values
 * are chosen one at a time.
 *
 * Here the only authored numbers are the ANCHORS — each a colour someone outside this
 * repository mandated — and the two ends of each lightness range. The other nine steps are
 * derived by `ramp.mjs`. Re-running is idempotent, and changing a ramp means changing one
 * anchor, not ten hexes.
 *
 * WHERE THE ANCHORS COME FROM
 * ---------------------------
 * - `#0373DF`  gov-blue, already the estate's primary and unchanged here.
 * - `#003366`  the estate's long-standing navy, unchanged.
 * - `#162F6A`  the DBIM key colour, carried as a SEPARATE third brand (`dbim`) rather than
 *              replacing navy, so the two can be compared live. `Documents/MoSJE DBIM Audit.pdf`
 *              fails the current build twice on it: checkpoint 3 (icons "#F97316 instead of
 *              #162F6A") and checkpoint 4 ("footer background colour (#0373DF) is not key
 *              colour (darkest shade) ... required to select #162F6A"). It measures deltaE 1.9
 *              from #003366 — the same colour to the eye.
 * - `#FF671F`  India Saffron, read from the SAMAVESH logo (identical in the Figma handoff
 *              file and `Assets/SAMAVESH Logo.svg`).
 * - `#046A38`  India Green, same source.
 *
 * WHY SECONDARY AND ACCENT ARE BRAND-INVARIANT
 * --------------------------------------------
 * Both are in the logo, so both are constants of the identity rather than variants of it.
 * Only PRIMARY changes between the Blue and Navy brands. This is what closes audit finding
 * C-02: the Navy brand used to swap its secondary from saffron to green, landing it 0.3 L*
 * and 16 degrees from the success colour — a 1.00:1 contrast between a brand fill and a
 * status fill, so a secondary-action chip and a saved-state chip were the same object.
 *
 * WHY THE LIGHTNESS RANGES DIFFER PER RAMP
 * ----------------------------------------
 * Blue and the two navies are only ~9 degrees apart in hue, so lightness is the ONLY thing
 * that tells them apart. A shared ladder would have made them near-identical at every rung.
 * The navies therefore run darker by design, and their anchors sit at 600 — the rung that
 * paints the primary button — because L* 32 is a SHADE and forcing it to 500 breaks the
 * `bold` rung's ink contrast.
 */

import { readFileSync, writeFileSync } from "node:fs";

import { buildRamp, describeRamp, STEPS } from "./ramp.mjs";
import { hexToRgb } from "./oklch.mjs";

const here = (p) => new URL(p, import.meta.url).pathname;

/**
 * @typedef {{anchor: string, lightest: number, darkest: number, note: string}} Anchor
 */

/** The authored numbers. Everything else in the brand pack's ramps is derived from these. */
export const ANCHORS = {
  "primaryRamp.blue": {
    anchor: "#0373DF",
    lightest: 96.5,
    darkest: 21,
    note: "gov-blue. Unchanged anchor; the ramp around it is re-spaced so 600 clears 4.5:1 and 700 clears 7:1 on white.",
  },
  "primaryRamp.navy": {
    anchor: "#003366",
    anchorStep: 600,
    lightest: 98.5,
    darkest: 12,
    note:
      "The estate's long-standing navy. Anchored at 600, not 500: L* 32 is a SHADE, and " +
      "forcing it to 500 leaves rungs 50-400 spanning 64 L* points, which pushes `bold` " +
      "(rung 300) into mid-tone territory where the dark ink the ladder pairs with it falls " +
      "below AA. 600 is also the rung that paints the primary button.",
  },
  "primaryRamp.dbim": {
    anchor: "#162F6A",
    anchorStep: 600,
    lightest: 98.5,
    darkest: 12,
    note:
      "The DBIM key colour, as a THIRD brand for evaluation in dev. The DBIM Compliance Audit " +
      "fails the estate on it twice - checkpoint 3 (icons must be the key colour) and 5.6 " +
      "(footer must be its darkest shade). It measures deltaE 1.9 from #003366, i.e. the same " +
      "colour to the eye, which is exactly why it is worth seeing side by side before " +
      "choosing. DELIBERATELY NOT EXPORTED TO FIGMA: the Palette collection's modes are a " +
      "hardcoded [Blue, Navy] list in build/formats/figma-variables.mjs and the exporter reads " +
      "only colorModes.navy, so a third brand is ignored there by construction. The library " +
      "keeps two modes; dev gets three.",
  },
  secondaryRamp: {
    anchor: "#FF671F",
    anchorStep: 400,
    lightest: 97,
    darkest: 29,
    note:
      "India Saffron from the SAMAVESH logo. Brand-INVARIANT. ANCHORED AT 400, NOT 500, for " +
      "the same reason #162F6A sits at 600: an anchor belongs at the rung its LIGHTNESS says. " +
      "#FF671F is L* 70. Forced to 500, rung 600 lands at L* 62.6 — inside the dead zone " +
      "(roughly L* 59-66) where a fill is too dark for dark ink and too light for white, so " +
      "NEITHER of the two inks reaches 4.5:1 and the `bolder` rung cannot be made accessible " +
      "at all. At 400 the ramp is near-perfectly even (dL 6.7-6.9) and 600 clears 4.97:1. " +
      "White text on bright saffron is a known trap that Material, Carbon and USWDS all avoid " +
      "the same way — the filled rung is a deeper burnt orange, and the identity colour stays " +
      "exactly #FF671F, reachable at secondaryScale/400 and via --ds-saffron.",
  },
  accentRamp: {
    anchor: "#046A38",
    lightest: 96,
    darkest: 18,
    note: "India Green from the SAMAVESH logo. Brand-INVARIANT. Deliberately the SAME green as the success status: two greens nine degrees apart is a defect whichever token owns it, and a citizen seeing the ministry's own green on a success state is better brand than a leftover Material green.",
  },
};

/** Build every ramp declared above. Returns `{ [name]: { 50: "#…", … } }`. */
export function generateAll() {
  return Object.fromEntries(
    Object.entries(ANCHORS).map(([name, spec]) => [name, buildRamp(spec)]),
  );
}

/** A ramp as DTCG `{ "50": { "$value": "#…" }, … }`. */
function toDtcg(ramp) {
  return Object.fromEntries(STEPS.map((s) => [String(s), { $value: ramp[s] }]));
}

/* ------------------------------------------------------------------ alpha tiers */

/** The overlay percentages, unchanged since the tiers were introduced. */
const ALPHA_STEPS = [8, 16, 24, 32, 40, 48];

/** `#rrggbb` + percent -> `rgba(r, g, b, 0.pp)`, in the exact spelling the tokens already use. */
function rgba(hex, pct) {
  const [r, g, b] = hexToRgb(hex).map((c) => Math.round(c * 255));
  return `rgba(${r}, ${g}, ${b}, ${(pct / 100).toFixed(2)})`;
}

/**
 * The alpha overlay tiers, DERIVED from the ramps rather than written out.
 *
 * They used to be 42 hand-written rgba() literals, and they rotted exactly as you would
 * expect: after the 2026-08-11 ramp rebuild they still carried `rgba(249, 115, 22, …)`
 * (the retired saffron), `rgba(46, 125, 50, …)` (the retired Material green) and
 * `rgba(0, 51, 102, …)` (the retired navy). Nothing caught it, because a literal has no
 * reference to break. Deriving them means a base colour can only ever be one thing.
 *
 * @param {Record<string, Record<number,string>>} ramps  output of `generateAll()`
 * @param {object} primitive  parsed src/primitive.json, for the status + neutral bases
 */
export function buildAlphaTiers(ramps, primitive) {
  const hex = (fam, step) => primitive.color[fam][String(step)].$value;

  // family -> { blue, navy }. Where the two are equal the family is brand-invariant, which
  // for `secondary` and `accent` is the whole point — they are logo colours, not variants.
  const BASE = {
    primary: { blue: ramps["primaryRamp.blue"][500], navy: ramps["primaryRamp.navy"][600] },
    secondary: { blue: ramps.secondaryRamp[400], navy: ramps.secondaryRamp[400] },
    accent: { blue: ramps.accentRamp[500], navy: ramps.accentRamp[500] },
    neutral: { blue: hex("neutral", 800), navy: hex("neutralDark", 800) },
    success: { blue: hex("green", 500), navy: hex("green", 500) },
    danger: { blue: hex("red", 500), navy: hex("red", 500) },
    warning: { blue: hex("amber", 500), navy: hex("amber", 500) },
    white: { blue: "#ffffff", navy: "#ffffff" },
  };

  const out = {
    $description:
      `Alpha overlay tiers (${ALPHA_STEPS.join("/")}%). GENERATED by build/brand-ramps.mjs ` +
      `from each family's base colour — never hand-written, because 42 rgba() literals is ` +
      `exactly the shape of thing that silently keeps a retired colour alive. ` +
      `primary and neutral vary by brand; secondary and accent do NOT (both are SAMAVESH ` +
      `logo colours); the status tiers and white are brand-invariant. ` +
      `Consume via --sa-color-transparent-<family>-<step>.`,
  };

  for (const [family, base] of Object.entries(BASE)) {
    const tier = {};
    for (const step of ALPHA_STEPS) {
      const entry = { $value: rgba(base.blue, step) };
      if (base.navy !== base.blue) {
        entry.$extensions = { mosje: { colorModes: { navy: rgba(base.navy, step) } } };
      }
      tier[String(step)] = entry;
    }
    out[family] = tier;
  }
  return out;
}

function main() {
  const path = here("../brands/mosje/brand.json");
  const brand = JSON.parse(readFileSync(path, "utf8"));
  const ramps = generateAll();

  brand.color.primaryRamp = {
    $description:
      "Mode-aware PRIMARY brand ramp — the only ramp that changes with `data-brand`. " +
      "GENERATED by build/brand-ramps.mjs from the anchors documented there; do not hand-edit steps.",
    blue: toDtcg(ramps["primaryRamp.blue"]),
    navy: toDtcg(ramps["primaryRamp.navy"]),
    dbim: toDtcg(ramps["primaryRamp.dbim"]),
  };

  // Both brands get the SAME secondary. The `blue`/`navy` keys are kept so semantic.json's
  // existing colorModes override still resolves — the values are simply identical now, which
  // is what makes the brand swap unable to change what secondary MEANS.
  brand.color.secondaryRamp = {
    $description:
      "SECONDARY brand ramp — India Saffron #FF671F from the SAMAVESH logo. BRAND-INVARIANT: " +
      "`blue` and `navy` hold identical values on purpose. Navy used to swap this ramp to green, " +
      "which put it 0.3 L* from the success colour (audit C-02). GENERATED by build/brand-ramps.mjs.",
    blue: toDtcg(ramps.secondaryRamp),
    navy: toDtcg(ramps.secondaryRamp),
  };

  brand.color.accentRamp = {
    $description:
      "ACCENT brand ramp — India Green #046A38 from the SAMAVESH logo. BRAND-INVARIANT, and " +
      "deliberately the same green the success status uses. GENERATED by build/brand-ramps.mjs.",
    blue: toDtcg(ramps.accentRamp),
    navy: toDtcg(ramps.accentRamp),
  };

  // The three-step `--ds-saffron` legacy aliases track the generated ramp so brand code and
  // the palette can never disagree about what saffron is.
  brand.color.saffron = {
    $description:
      "Legacy 3-step saffron alias (`--ds-saffron*`). Tracks secondaryRamp; prefer color.secondaryScale.*.",
    // 400, not 500 — that is where the saffron anchor sits, so `--ds-saffron` IS the logo
    // colour rather than a step near it.
    50: { $value: ramps.secondaryRamp[50] },
    500: { $value: ramps.secondaryRamp[400] },
    700: { $value: ramps.secondaryRamp[700] },
  };

  brand.color.navy = {
    $description:
      "Legacy `--ds-gov-navy` alias. Now the DBIM key colour #162F6A that DBIM 5.6 requires for " +
      "the footer's darkest shade; was #003366.",
    // Rung 600, not 500 — that is where the navy ramp's anchor sits, so this alias IS the
    // DBIM key colour rather than a step near it.
    700: { $value: ramps["primaryRamp.navy"][600] },
  };

  writeFileSync(path, `${JSON.stringify(brand, null, 2)}\n`);

  // The alpha tiers live in semantic.json but are derived from the same anchors, so they are
  // rewritten here — one command regenerates every colour this file is the source of.
  const semanticPath = here("../src/semantic.json");
  const primitive = JSON.parse(readFileSync(here("../src/primitive.json"), "utf8"));
  const semantic = JSON.parse(readFileSync(semanticPath, "utf8"));
  semantic.color.transparent = buildAlphaTiers(ramps, primitive);
  writeFileSync(semanticPath, `${JSON.stringify(semantic, null, 2)}\n`);

  for (const [name, ramp] of Object.entries(ramps)) {
    const rows = describeRamp(ramp);
    const dl = rows.slice(1).map((r) => r.dL);
    process.stdout.write(
      `${name.padEnd(20)} anchor ${ANCHORS[name].anchor}  ` +
        `dL ${Math.min(...dl).toFixed(1)}-${Math.max(...dl).toFixed(1)}  ` +
        `600 ${rows.find((r) => r.step === 600).onWhite.toFixed(2)}:1  ` +
        `800 ${rows.find((r) => r.step === 800).onWhite.toFixed(2)}:1\n`,
    );
  }
  process.stdout.write(`\n✓ wrote ${path}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
