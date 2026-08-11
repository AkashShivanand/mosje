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

import { buildRamp, buildNeutralRamp, describeRamp, STEPS, NEUTRAL_STEPS } from "./ramp.mjs";
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
  /**
   * DBIM's OWN Blue primary palette — not a ramp generated from one anchor.
   *
   * DBIM publishes five numbered shades per colour group (1 = darkest = the key colour,
   * 5 = lightest), read from `docs/source-brd/MoSJE DBIM Audit.pdf` p.14, which reproduces
   * Figure 1 of DBIM section 2.1 'Primary palette':
   *
   *     1 #162F6A   2 #214AAB   3 #5279D7   4 #A3BBF3   5 #D2DFFF
   *
   * All five are reproduced EXACTLY, pinned at the rung their lightness actually lands on
   * (800, 600, 400, 200, 100). The other six steps are interpolated between them so the ramp
   * fills our 11-rung ladder without inventing a DBIM value that DBIM did not publish —
   * `$dbimShades` below records which is which.
   *
   * DBIM rules that come with the palette, also from the audit:
   *   - text must use shade 1 or 2 (p.20, section 4.4)
   *   - icons and the footer must use the key colour, i.e. shade 1 (checkpoints 3 and 5.6)
   *
   * CODE-ONLY, BY STANDING INSTRUCTION (2026-08-11). This brand is never pushed to the Figma
   * library unless explicitly asked — the Palette collection stays [Blue, Navy]. The exporter
   * enforces that by construction: its modes are a hardcoded pair and it reads only
   * `colorModes.navy`, so a third brand cannot reach Figma by accident.
   */
  "primaryRamp.dbim": {
    shades: {
      50: "#eef4ff",
      100: "#d2dfff",
      200: "#a3bbf3",
      300: "#7a9ae6",
      400: "#5279d7",
      500: "#3962c1",
      600: "#214aab",
      700: "#1c3c8a",
      800: "#162f6a",
      900: "#0c1e4a",
      950: "#041132",
    },
    /** Which rungs are DBIM's published values rather than interpolation. */
    dbimShades: { 100: 5, 200: 4, 400: 3, 600: 2, 800: 1 },
    note: "DBIM Blue primary palette, verbatim where DBIM publishes a value.",
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

  /* ---------------------------------------------------------------- functional ramps
   *
   * These three were left alone by the 2026-08-11 rebuild, which was scoped to the brand
   * ramps, so they still carried every defect the audit had measured: `danger/400` and
   * `danger/500` 1.8 L* apart (one colour wearing two names), `warning/500` darker AND duller
   * than 400, `info/400` and `info/500` another near-duplicate pair, and 5-13 degrees of hue
   * drift apiece. Two of them also owned the last two AA shortfalls in the whole system.
   *
   * There is no external mandate behind a status colour the way there is behind gov-blue or
   * India Saffron, so the anchor here is the ramp's OWN existing Figma value — moved to the
   * rung its lightness actually says, which is the rule the saffron and navy anchors already
   * follow and the one that closes the accessibility gap.
   */

  dangerRamp: {
    anchor: "#ec5042",
    anchorStep: 400,
    lightest: 94,
    darkest: 19.5,
    note:
      "The estate's error red, unchanged as a colour and re-laddered around. ANCHORED AT 400, " +
      "NOT 500, and that is what closes the AA gap: #ec5042 is L* 64, which sits INSIDE the " +
      "dead zone (roughly L* 59-66) where a fill is too dark for dark ink and too light for " +
      "white, so neither ink reaches 4.5:1. At 500 the rung below it — 600, the `bolder` fill " +
      "that carries white text — landed at 4.40:1, which is the shortfall this ramp had. At " +
      "400 the same rung measures 6.68:1 and rung 300 keeps 5.5:1 against the dark ink. " +
      "`lightest` is 94 rather than the 95-97 the brand ramps use for one measured reason: it " +
      "holds dE 4.3 from India Saffron at the `subtler` rung, so the error|secondary entry on " +
      "the separation ledger does not get WORSE while this ramp is being fixed.",
  },

  warningRamp: {
    // #e9952f rotated onto its own ramp's light-end hue, at identical L* and chroma.
    anchor: "#e09c1d",
    anchorStep: 300,
    lightest: 96.5,
    darkest: 22,
    note:
      "The estate's warning amber. THE ANCHOR MOVED IN HUE, which no other ramp's did, because " +
      "this ramp disagreed with itself: steps 50-200 sat at hue 75-76 and steps 300-950 at hue " +
      "63-67, a 13-degree drift, and a ramp cannot have two hues. 75.9 wins over 65.9 for three " +
      "reasons. It is the hue of the rungs people actually see most (the pale status " +
      "backgrounds), it is what `amber` means rather than orange, and — decisively — 65.9 is " +
      "only 25 degrees from India Saffron, which puts `secondary|warning` UNDER the " +
      "hue-separation gate's 30-degree threshold. Locking the old dark-end hue would have " +
      "traded one defect for a harder one. #e09c1d is #e9952f at the same L* and chroma, " +
      "rotated to 75.9. Anchored at 300 because it is L* 76, a tint. Rung 600 goes from " +
      "4.46:1 to 5.68:1, closing the system's other AA shortfall.",
  },

  infoRamp: {
    anchor: "#1a73e8",
    anchorStep: 500,
    lightest: 96.5,
    darkest: 18,
    note:
      "The info blue, unchanged as a colour and re-laddered around. L* 57 is a mid-tone and 500 " +
      "is where it belongs — the only ramp here whose anchor did not have to move rung. It had " +
      "no AA shortfall; what it had was `info/400` and `info/500` 2.3 L* apart, a duplicate " +
      "pair. Stays in the blue family on purpose: `info|primary` is a recorded INTENTIONAL " +
      "UNION (Carbon and Spectrum do the same), and moving it would break that gate rather " +
      "than satisfy it.",
  },
};

/**
 * The neutral ramp, per brand. Hue is the brand's OWN primary hue; everything else is shared,
 * so the two brands' greys differ in temperature and in nothing else.
 *
 * The ladder is the same for both, which is what makes a brand swap unable to change the
 * lightness of a surface — only its temperature. See `buildNeutralRamp` for why the greys are
 * tinted at all and why the old ramp's 22 degrees of wander was not a tint but a rounding
 * artefact.
 */
export const NEUTRAL_ANCHORS = {
  // `neutral` is the Blue brand's ramp; `neutralDark` is Navy's, and is shared with dbim.
  // The name is a fossil of a retired mode name — neither is a dark theme, and the estate has
  // no appearance axis at all. Renaming it is a separate change with its own migration.
  neutral: { hue: 255.2, note: "gov-blue's hue (#0373DF)." },
  neutralDark: { hue: 264.0, note: "the navy/dbim hue (#003366 measures 253.9, #162F6A 264.0)." },
};

/**
 * Shared shape of both neutral ramps.
 *
 * WHY 800 SITS AT L* 24.5 SPECIFICALLY
 * ------------------------------------
 * Everything else about this ladder is a distribution decision; that one number is a hard
 * constraint, because `text.default` — the estate's body ink — IS neutral/800, and the tightest
 * pairing in the system is that ink on the Navy brand's `bg/brand/primary/bold` (#708caf).
 * That fill is fixed: primaryRamp.navy is already generated, shipped and in Figma. It measured
 * exactly 4.50:1 against the old #1f2428, i.e. AA with nothing to spare, so an ink even one L*
 * lighter drops it below. A first cut of this ladder put 800 at L* 29.5 and did exactly that,
 * failing three previously-passing pairings (accent/success `bold` at 4.33, navy primary
 * `bold` at 3.99). At L* 24.5 the same pairing measures 4.65:1 — a slight improvement on what
 * was there, rather than a regression bought to buy an even ramp.
 */
export const NEUTRAL_SHAPE = {
  // 12 gaps from white to black, none under 4.5 or over 11.5, widening smoothly through the
  // mid-range and narrowing again at the ends. The old ladder ran 1.3 to 15.9: four steps
  // inside the lightest 7.7 L* and then two jumps of 15.2 and 15.5 across the middle, which is
  // why there was exactly ONE grey between a light surface and a mid grey.
  // 950 stops at L* 11 rather than reaching further toward black, because below about L* 10
  // sRGB runs out of colours: the whole range is spanned by channel values 0-3, greys sit ~3
  // L* apart, and the nearest representable colour to a faint tint can be six times too
  // chromatic at an arbitrary hue. A step placed there does not get the hue it was given. The
  // 11 -> 0 gap is the largest on the ramp at 11, still inside the shape rule, and it lands
  // where it should: on pure black, which is a defined endpoint rather than an approximation.
  // 500 sits at L* 56 for a second hard reason: it paints `border/neutral/bolder/hover`,
  // which the prominence ladder holds to ≥4.5:1 against the page. L* 58 measures 4.28:1 and
  // put a NEW entry on the shortfall ledger — a ledger that may only shrink. 56 measures
  // 4.65:1, against the old ramp's 4.69:1.
  lightness: [100, 95.5, 90, 83.5, 76, 66.5, 56, 46, 36, 24.5, 17.5, 11, 0],
  // Chroma peaks in the mid-tones and tapers to nothing at both ends. 0.016 is deliberately
  // near the top of what still reads as GREY — much above 0.02 and a neutral starts reading as
  // a colour, which is a different token's job.
  peakL: 64,
  peakC: 0.015,
  gamma: 0.9,
};

/**
 * Build every ramp declared above. Returns `{ [name]: { 50: "#…", … } }`.
 *
 * Two spec shapes, because two kinds of source:
 *   - `{ anchor, … }` — one mandated colour, the other ten steps DERIVED by `ramp.mjs`.
 *   - `{ shades }`    — a palette someone else already published in full, reproduced as
 *                       given. DBIM is the only one: it publishes five numbered shades, and
 *                       re-deriving them from an anchor would quietly replace four of the
 *                       five with values DBIM never issued. A conformance palette is
 *                       transcribed, not regenerated.
 */
export function generateAll() {
  return Object.fromEntries(
    Object.entries(ANCHORS).map(([name, spec]) => [
      name,
      spec.shades ? { ...spec.shades } : buildRamp(spec),
    ]),
  );
}

/** The two neutral ramps, `{ neutral: {...}, neutralDark: {...} }`. */
export function generateNeutrals() {
  return Object.fromEntries(
    Object.entries(NEUTRAL_ANCHORS).map(([name, { hue }]) => [
      name,
      buildNeutralRamp({ hue, ...NEUTRAL_SHAPE }),
    ]),
  );
}

/** A ramp as DTCG `{ "50": { "$value": "#…" }, … }`. */
function toDtcg(ramp, steps = STEPS) {
  return Object.fromEntries(steps.map((s) => [String(s), { $value: ramp[s] }]));
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

  /* ---- the functional and neutral ramps, which live in primitive.json ----
   *
   * They are written from here, not hand-maintained there, for the reason every other value
   * in this file is: `green` was regenerated on 2026-08-11 and then COPIED into primitive.json
   * by hand, with a comment telling the next person to do the same. Four ramps went unrebuilt
   * partly because that step was manual. A generated file should be generated. */
  const primitivePath = here("../src/primitive.json");
  const primitive = JSON.parse(readFileSync(primitivePath, "utf8"));
  const neutrals = generateNeutrals();

  // `green` is here too, and produces byte-identical values: it was already regenerated on
  // 2026-08-11, then copied across by hand under a comment telling the next person to repeat
  // the copy. Wiring it up removes the last manual step rather than changing any colour.
  const FUNCTIONAL = {
    green: "accentRamp", red: "dangerRamp", amber: "warningRamp", info: "infoRamp",
  };
  for (const [family, rampName] of Object.entries(FUNCTIONAL)) {
    primitive.color[family] = {
      $description: `${primitive.color[family].$description.split(" GENERATED by")[0].trim()} ` +
        `GENERATED by build/brand-ramps.mjs from the ${rampName} anchor; do not hand-edit steps.`,
      ...toDtcg(ramps[rampName]),
    };
  }
  for (const [family, ramp] of Object.entries(neutrals)) {
    primitive.color[family] = {
      $description: `${primitive.color[family].$description.split(" GENERATED by")[0].trim()} ` +
        `GENERATED by build/brand-ramps.mjs; do not hand-edit steps.`,
      ...toDtcg(ramp, NEUTRAL_STEPS),
    };
  }
  writeFileSync(primitivePath, `${JSON.stringify(primitive, null, 2)}\n`);

  // The alpha tiers live in semantic.json but are derived from the same anchors, so they are
  // rewritten here — one command regenerates every colour this file is the source of.
  const semanticPath = here("../src/semantic.json");
  const semantic = JSON.parse(readFileSync(semanticPath, "utf8"));
  semantic.color.transparent = buildAlphaTiers(ramps, primitive);

  // `text.disabled` is the body ink at 48%. It was written out as a literal rgba() computed
  // from whatever neutral/800 happened to be, which is exactly the shape of thing the alpha
  // tiers turned out to be: a derived value with no reference to break, still carrying a
  // retired colour long after the source moved. Derived here so it cannot rot again.
  const disabled = semantic.color.text.disabled;
  disabled.$value = rgba(neutrals.neutral[800], 48);
  for (const mode of ["navy", "dbim"]) {
    disabled.$extensions.mosje.colorModes[mode] = rgba(neutrals.neutralDark[800], 48);
  }

  writeFileSync(semanticPath, `${JSON.stringify(semantic, null, 2)}\n`);

  for (const [name, ramp] of Object.entries({ ...ramps, ...neutrals })) {
    const steps = neutrals[name] ? NEUTRAL_STEPS : STEPS;
    const rows = describeRamp(ramp, steps);
    const dl = rows.slice(1).map((r) => r.dL);
    const spec = ANCHORS[name];
    const source = !spec
      ? `hue ${NEUTRAL_ANCHORS[name].hue}`
      : spec.anchor
        ? `anchor ${spec.anchor}`
        : `${Object.keys(spec.dbimShades ?? {}).length} published shades`;
    process.stdout.write(
      `${name.padEnd(20)} ${source.padEnd(18)} ` +
        `dL ${Math.min(...dl).toFixed(1)}-${Math.max(...dl).toFixed(1)}  ` +
        `600 ${rows.find((r) => r.step === 600).onWhite.toFixed(2)}:1  ` +
        `800 ${rows.find((r) => r.step === 800).onWhite.toFixed(2)}:1\n`,
    );
  }
  process.stdout.write(`\n✓ wrote ${path}\n✓ wrote ${primitivePath}\n✓ wrote ${semanticPath}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
