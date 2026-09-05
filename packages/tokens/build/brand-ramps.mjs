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

import {
  buildRamp,
  buildNeutralRamp,
  buildPublishedRamp,
  describeRamp,
  STEPS,
  NEUTRAL_STEPS,
} from "./ramp.mjs";
import { hexToRgb, hexToOklch, oklchToHex } from "./oklch.mjs";

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
    anchorStep: 600,
    lightest: 96.5,
    darkest: 18,
    note:
      "India Green #046A38 from the SAMAVESH logo. Brand-INVARIANT. Deliberately the SAME green " +
      "as the success status: two greens nine degrees apart is a defect whichever token owns it, " +
      "and a citizen seeing the ministry's own green on a success state is better brand than a " +
      "leftover Material green. ANCHORED AT 600, NOT 500, since 2026-09-04 — the rule every other " +
      "anchor already follows: #046A38 is L* 46, which is where rung 600 sits on every other ramp " +
      "(primary 49, danger 49, info 49). Pinned at 500 it dragged the whole ladder down a rung, so " +
      "success/600 — the fill under white text everywhere — was L* 39 and 9.1:1, two rungs darker " +
      "than the AA it needed, and success/700, the message ink, was a near-black L* 33 at 11.7:1. " +
      "That over-darkness is what read as dull: a dark colour has little chroma to give. At 600 the " +
      "ladder is uniform with its siblings, 500 is a live mid-green (L* 54, 4.8:1), and the tints " +
      "hold real chroma. The anchor hex is unchanged.",
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
    // #ec5042 rotated from hue 28.7 to 24 at identical L* and chroma.
    anchor: "#ec4e4f",
    anchorStep: 400,
    lightest: 94,
    darkest: 19.5,
    note:
      "The estate's error red, re-laddered around its own lightness. THE HUE MOVED 4.7 DEGREES " +
      "TOWARD CRIMSON on 2026-09-04 (28.7 -> 24), at identical L* and chroma, for the reason the " +
      "separation ledger has carried since it existed: at hue 29 the red is a coral, 12 degrees " +
      "from India Saffron (41), and the two families' tints measured dE 3.4 at rung 50. Carbon " +
      "(25.9), Primer (24.5) and Material (28.7 -> 24 here) all sit on this side of orange; the " +
      "estate's red now does too, and reads as an error rather than a second brand orange. " +
      "Rotation is the same operation the warning ramp already had. ANCHORED AT 400, " +
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
    // The old #1a73e8 (hue 258) at the same L*, moved to hue 220 and the chroma the gamut allows there.
    anchor: "#0b86a2",
    anchorStep: 500,
    lightest: 96.5,
    darkest: 18,
    note:
      "The info colour is CYAN-TEAL since 2026-09-04, hue 220, not the brand's blue. It used to be " +
      "#1a73e8 at hue 258 — three degrees and dE 0.5 from gov-blue — and the union was recorded as " +
      "intentional. In use it meant an information banner, an info badge and a primary button were " +
      "one colour, the toast's info variant was literally painted with primaryScale/50, and on a " +
      "dashboard a citizen could not tell 'this is a notice' from 'this is the action'. USWDS " +
      "(#00bde3) and GOV.UK's inset text both keep notice and action apart the same way. Hue 220 " +
      "is 35 degrees from primary, 39 from the chart's teal (cat/3) and 66 from success; it holds " +
      "under protanopia and deuteranopia (dE 10+ from primary at the filled rung) and is the " +
      "weakest under tritanopia (dE 2.2), which is why an info surface always carries its icon. " +
      "Chroma is lower than the brand's on purpose (0.10 vs 0.19 at 500): a notice is quieter " +
      "than a call to action. L* 57 keeps 500 at the mid-tone rung; the ink is 600 (5.96:1).",
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

/* ---------------------------------------------------------------- the DBIM conformance modes
 *
 * CODE-ONLY, BY STANDING INSTRUCTION. None of this reaches the Figma library: the exporter's
 * Palette modes are a hardcoded ["Blue", "Navy"] pair and it reads only `colorModes.navy`, so
 * a DBIM brand cannot leak into Figma by accident. It exists so DBIM conformance can be
 * DEMONSTRATED in the running app rather than argued about.
 *
 * SIX GROUPS, NOT ONE. DBIM's rule is that an organisation selects exactly one primary group,
 * the one that "best represents the organisation's primary functions". Seeing each of the six
 * live is the whole point of a conformance preview — MoSJE's selection is Blue, and Blue is
 * what the estate ships.
 *
 * FULL CONFORMANCE, NOT PRIMARY-ONLY. A mode that repainted only the primary ramp would be
 * mislabelled: DBIM's functional palette differs from this estate's on every status colour
 * (Liberty Green vs our India Green, Mustard Yellow vs our amber, Coral Red vs our red, DBIM
 * Blue vs our info), its greys are PURE neutrals rather than brand-tinted, and its body text
 * is Deep Earthy Brown rather than a neutral step. All of that moves with the mode.
 *
 * WHAT DBIM'S OWN PALETTE COSTS, MEASURED RATHER THAN SMOOTHED OVER
 * ----------------------------------------------------------------
 * DBIM's own rule 4 is "colour usage must ensure accessibility of digital platform". Its
 * published palette does not always meet that, and these modes report it rather than correct
 * it — a conformance palette that has been quietly fixed no longer demonstrates anything:
 *
 *   - GREEN group, shade 2 (#2D8686) occupies rung 600 — the `bolder` fill that carries white
 *     text — at 4.32:1, BELOW WCAG AA. No remedy exists here that is not a rewrite of DBIM's
 *     own colour, so it is recorded and surfaced instead.
 *   - The functional statuses are marginal by construction: Liberty Green 4.53:1, Coral Red
 *     4.53:1 and DBIM Blue 4.50:1 on white all sit within 0.03 of the AA floor.
 *   - MUSTARD YELLOW #FFC107 is 1.63:1 on white — it cannot carry white text AT ITS PUBLISHED
 *     VALUE. That is why it is anchored at rung 200, a subtle fill that takes dark ink, rather
 *     than at 500 by convention; the `bolder` rung two-thirds of the way down the ramp is a
 *     deep mustard that clears 5.32:1 with white in the ordinary way. Same rule as saffron:
 *     the identity colour stays reachable at the rung its lightness says, and the filled rung
 *     is a deeper version of it.
 */

/** DBIM's six primary groups. Keys are token paths; `brand` is the `data-brand` id. */
export const DBIM_GROUPS = {
  dbimBlue: { group: "blue", brand: "dbim-blue", label: "Blue" },
  dbimBurgundy: { group: "burgundy", brand: "dbim-burgundy", label: "Burgundy" },
  dbimPurple: { group: "purple", brand: "dbim-purple", label: "Purple" },
  dbimGreen: { group: "green", brand: "dbim-green", label: "Green" },
  dbimChromeYellow: { group: "chromeYellow", brand: "dbim-chrome-yellow", label: "Chrome Yellow" },
  dbimCinnamonRed: { group: "cinnamonRed", brand: "dbim-cinnamon-red", label: "Cinnamon Red" },
};

/**
 * Which rung each published shade occupies. Shade 1 is the group's KEY COLOUR.
 *
 * Uniform across all six groups rather than fitted per group, and that is deliberate: DBIM
 * numbers its shades 1-5 with fixed meanings ("shade 1 is the key colour", "text uses shade 1
 * or 2"), so a designer holding the DBIM chapter must find shade 2 at the same rung whichever
 * group is active. Fitting each group to its own lightness would put shade 2 on rung 600 in
 * one group and 700 in another, and DBIM's rules would stop being expressible as a token
 * reference at all.
 */
export const DBIM_SHADE_RUNGS = { 100: "5", 200: "4", 400: "3", 600: "2", 800: "1" };

/**
 * DBIM's functional palette (Table 1) — group-INDEPENDENT, so all six modes share it.
 *
 * Each is a single published colour rather than a ramp, so unlike the primary groups there is
 * no published ladder to contradict: the value is pinned at the rung its lightness says and
 * the rest is derived, which is the ordinary `buildRamp` treatment.
 */
export const DBIM_FUNCTIONAL = {
  greenDbim: {
    anchor: "#198754", anchorStep: 500, lightest: 96, darkest: 19,
    note: "Liberty Green — DBIM's SUCCESS status.",
  },
  amberDbim: {
    anchor: "#FFC107", anchorStep: 200, lightest: 97.5, darkest: 20,
    note:
      "Mustard Yellow — DBIM's WARNING status. ANCHORED AT 200, NOT 500: L* 84 is a TINT, and " +
      "the rule this system keeps re-learning is that an anchor belongs at the rung its " +
      "lightness says. It is also the one DBIM status that cannot carry white text anywhere " +
      "near its published value (1.63:1), which is why its `bolder` fill takes dark ink.",
  },
  redDbim: {
    anchor: "#DC3545", anchorStep: 500, lightest: 96, darkest: 19,
    note:
      "Coral Red — DBIM's ERROR status. Anchored at 500 (L* 59) — the same rung our own " +
      "#ec5042 used to occupy, and 4.53:1 is the same reason it had to leave.",
  },
  infoDbim: {
    anchor: "#0D6EFD", anchorStep: 500, lightest: 96.5, darkest: 18,
    note:
      "DBIM Blue — the INFORMATION status, and DBIM's hyperlink colour alongside the selected " +
      "group's key colour. Anchored at 500 (L* 58), where gov-blue sits at L* 56.",
  },
};

/**
 * DBIM's greys, pinned. PURE neutrals — R=G=B, chroma exactly 0.
 *
 * This is the one place a DBIM mode must NOT inherit this estate's treatment. Blue and navy
 * tint their greys with the brand's own hue on purpose (see `buildNeutralRamp`); DBIM
 * publishes three flat greys plus a flat Linen, and tinting those would be inventing a colour
 * DBIM did not issue in the part of the palette where it shows most.
 */
export const DBIM_NEUTRAL_PINS = {
  0: "#ffffff",     // Inclusive white — DBIM's primary page background
  100: "#ebeaea",   // Linen — highlight backgrounds, quote blocks, component outlines
  200: "#c6c6c6",   // Functional grey 1
  400: "#8e8e8e",   // Functional grey 2
  600: "#606060",   // Functional grey 3
  1000: "#000000",  // State Emblem on a light background
};

/**
 * Deep Earthy Brown — DBIM's body text colour on a light background.
 *
 * NOT black (#000000 is reserved for the State Emblem) and NOT a neutral step. 20.16:1 on
 * white. Deep Blue #1D0A69 is deliberately absent from this entire file: DBIM reserves it for
 * the Gov.In root site and it must not appear in a departmental palette.
 */
export const DBIM_INK = "#150202";

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

/**
 * Every DBIM ramp: six transcribed primary groups, four derived functional ramps, and one
 * pure-grey neutral. Returns `{ primary: {...}, functional: {...}, neutral: {...} }`.
 */
export function generateDbim() {
  const groups = JSON.parse(readFileSync(here("../reference/dbim-palette.json"), "utf8"));
  const published = groups.primaryPalette.groups;

  const primary = {};
  for (const [path, { group }] of Object.entries(DBIM_GROUPS)) {
    const shades = published[group];
    if (!shades) throw new Error(`dbim-palette.json has no primary group "${group}"`);
    primary[path] = buildPublishedRamp({
      pins: Object.fromEntries(
        Object.entries(DBIM_SHADE_RUNGS).map(([rung, shade]) => [rung, shades[shade]]),
      ),
    });
  }

  const functional = Object.fromEntries(
    Object.entries(DBIM_FUNCTIONAL).map(([name, spec]) => [name, buildRamp(spec)]),
  );

  // The neutral is pinned rather than derived — DBIM published these greys, and it is a
  // 13-rung ladder, so it interpolates lightness between pins at chroma exactly 0.
  const pinnedRungs = Object.keys(DBIM_NEUTRAL_PINS).map(Number).sort((a, b) => a - b);
  const pinL = Object.fromEntries(
    pinnedRungs.map((r) => [r, hexToOklch(DBIM_NEUTRAL_PINS[r]).L]),
  );
  const neutral = {};
  NEUTRAL_STEPS.forEach((step, i) => {
    if (DBIM_NEUTRAL_PINS[step]) {
      neutral[step] = DBIM_NEUTRAL_PINS[step];
      return;
    }
    const lo = [...pinnedRungs].reverse().find((r) => NEUTRAL_STEPS.indexOf(r) < i);
    const hi = pinnedRungs.find((r) => NEUTRAL_STEPS.indexOf(r) > i);
    const li = NEUTRAL_STEPS.indexOf(lo);
    const hi_i = NEUTRAL_STEPS.indexOf(hi);
    const t = (i - li) / (hi_i - li);
    const L = pinL[lo] + (pinL[hi] - pinL[lo]) * t;
    neutral[step] = oklchToHex({ L, C: 0, H: 0 });
  });

  return { primary, functional, neutral };
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
 * Retint every `rgba(r, g, b, a)` in a value onto a new base, preserving alpha and everything
 * around it.
 *
 * Used for the shadow ramp and the modal scrim, whose values are composite CSS — geometry plus
 * colour in one string — so they cannot alias a colour token the way a flat fill can. The
 * GEOMETRY (offset, blur, spread) is a design decision and stays authored; only the ink is
 * derived, which is the half that had gone stale.
 */
function retintRgba(value, hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => Math.round(c * 255));
  return String(value).replace(
    /rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/g,
    (_, alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`,
  );
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
export function buildAlphaTiers() {
  // family -> the Tier-2 scale rung the wash is cut from. A REFERENCE, never a hex: the wash
  // follows its base through Blue, Navy and every DBIM mode by construction, so the
  // `colorModes.navy` copies this function used to write are gone (they existed only because
  // an rgba() literal cannot follow a brand). `primary` reads the 500 rung, which is the key
  // colour in Blue (#0373DF) and navy 500 in Navy — the hand-picked navy 600 it carried before
  // differs from that by less than 1 dE at the 8–48% the tiers are used at. `secondary` and
  // `accent` are SAMAVESH logo colours and do not vary by brand; `accent` reads rung 600
  // because that is where India Green itself sits since 2026-09-04.
  const BASE = {
    primary: "{color.primaryScale.500}",
    secondary: "{color.secondaryScale.400}",
    accent: "{color.accentScale.600}",
    neutral: "{color.neutralScale.800}",
    success: "{color.successScale.600}",
    danger: "{color.dangerScale.500}",
    warning: "{color.warningScale.500}",
    white: "{color.neutralScale.0}",
  };
  const out = {
    $description:
      `Alpha overlay tiers (${ALPHA_STEPS.join("/")}%). GENERATED by build/brand-ramps.mjs. ` +
      `Each tier is a colour REFERENCE plus an alpha/N REFERENCE — never an rgba() literal, ` +
      `because 48 literals is exactly the shape of thing that silently keeps a retired colour ` +
      `alive, and because a literal cannot follow a brand. In CSS a tier resolves as ` +
      `color-mix(in srgb, var(base) calc(var(--sa-alpha-N) * 100%), transparent); in Figma it is ` +
      `an alias to the base variable with its opacity bound to alpha/N. ` +
      `Consume via --sa-color-transparent-<family>-<step>.`,
  };
  for (const [family, base] of Object.entries(BASE)) {
    const tier = {};
    for (const step of ALPHA_STEPS) {
      tier[String(step)] = { $value: base, $extensions: { mosje: { alpha: `{alpha.${step}}` } } };
    }
    out[family] = tier;
  }
  return out;
}

function main() {
  const path = here("../brands/mosje/brand.json");
  const brand = JSON.parse(readFileSync(path, "utf8"));
  const ramps = generateAll();

  const dbim = generateDbim();

  brand.color.primaryRamp = {
    $description:
      "Mode-aware PRIMARY brand ramp — the only ramp that changes with `data-brand`. " +
      "GENERATED by build/brand-ramps.mjs from the anchors documented there; do not hand-edit steps.",
    blue: toDtcg(ramps["primaryRamp.blue"]),
    navy: toDtcg(ramps["primaryRamp.navy"]),
    // Kept for the brand-pack contract (a re-skin may define its own DBIM-equivalent ramp),
    // but the DBIM conformance MODES no longer read it — they read `color.dbimPrimary.*` in
    // primitive.json, because DBIM's palette is DBIM's whichever brand this estate wears.
    dbim: toDtcg(dbim.primary.dbimBlue),
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

  // DBIM's functional palette and its pure greys. CODE-ONLY — the Figma exporter reads only
  // `colorModes.navy`, so nothing here can reach the library.
  for (const [family, ramp] of Object.entries(dbim.functional)) {
    primitive.color[family] = {
      $description:
        `${DBIM_FUNCTIONAL[family].note} DBIM functional palette (Table 1), group-independent ` +
        `— shared by all six DBIM conformance modes. CODE-ONLY. GENERATED by ` +
        `build/brand-ramps.mjs; do not hand-edit steps.`,
      ...toDtcg(ramp),
    };
  }
  primitive.color.neutralDbim = {
    $description:
      "DBIM's greys — PURE neutrals, R=G=B, chroma exactly 0, pinned at Linen #EBEAEA and the " +
      "three published functional greys. Deliberately NOT tinted the way the blue and navy " +
      "neutrals are: DBIM publishes flat greys, and tinting them would invent a colour DBIM " +
      "never issued. CODE-ONLY. GENERATED by build/brand-ramps.mjs; do not hand-edit steps.",
    ...toDtcg(dbim.neutral, NEUTRAL_STEPS),
  };
  // The six DBIM primary groups live in the PRIMITIVE layer, not in a brand pack, because
  // DBIM's palette is DBIM's whichever brand this estate wears — a re-skin does not get its
  // own Burgundy. It also means a brand pack that has never heard of DBIM (`brands/_starter`)
  // still resolves every DBIM mode instead of failing the build on 75 missing references.
  primitive.color.dbimPrimary = {
    $description:
      "DBIM's six primary colour groups, TRANSCRIBED from the DBIM ToolKit 'Colours' chapter " +
      "(see reference/dbim-palette.json). Each group's five published shades appear VERBATIM at " +
      "rungs 100/200/400/600/800 — shade 1 is the group's key colour — and the remaining six " +
      "rungs are interpolated. Never re-derive these from an anchor: a conformance palette that " +
      "has been re-derived is no longer a conformance palette. CODE-ONLY — the Figma exporter " +
      "reads only `colorModes.navy`, so none of this can reach the library. GENERATED by " +
      "build/brand-ramps.mjs; do not hand-edit steps.",
    ...Object.fromEntries(
      Object.entries(DBIM_GROUPS).map(([path, { group }]) => [group, toDtcg(dbim.primary[path])]),
    ),
  };

  primitive.color.dbimInk = {
    $description:
      "Deep Earthy Brown — DBIM's body-text colour on a light background (Table 1). NOT black " +
      "(#000000 is reserved for the State Emblem) and NOT a neutral step. 20.16:1 on white. " +
      "CODE-ONLY. GENERATED by build/brand-ramps.mjs.",
    $value: DBIM_INK,
  };

  /**
   * Each brand's BODY INK, which is what every alpha value below is tinted toward. Navy takes
   * its own neutral; all six DBIM modes take Deep Earthy Brown, because that is what
   * `text.default` resolves to there — a DBIM shadow tinted toward a blue-grey would be
   * tinted toward a colour that mode does not contain.
   */
  const brandInk = {
    navy: neutrals.neutralDark[800],
    ...Object.fromEntries(Object.values(DBIM_GROUPS).map(({ brand }) => [brand, DBIM_INK])),
  };

  /* ---- the shadow ramp's INK, derived from the body ink it claims to be tinted toward ----
   *
   * The ramp's own description says it "keeps the SAMAVESH convention of tinting toward ink
   * rather than UX4G's flat black". It was not: the five rungs carried `rgba(31, 36, 40, ·)`,
   * hand-written from a neutral/800 that the 2026-08-11 rebuild moved to #1e2124. So the
   * shadows were tinted toward a colour the system no longer contains — the same defect the
   * alpha tiers and `text.disabled` had, in the one place nobody looks, because it is
   * invisible: composited over white, the old ink and the new differ by dE 0.14 to 0.54
   * across the ramp's alphas, all of it under the ~1.0 just-noticeable threshold.
   *
   * Which is exactly why it needed deriving rather than correcting by hand. A wrong value you
   * can see gets fixed the first time somebody looks at it; a wrong value you cannot see
   * survives every review and is still wrong.
   *
   * BRAND-INVARIANT, unlike the two flat alpha values below, and the split is structural
   * rather than a matter of taste.
   *
   * Measured first, because a first pass here got it wrong in both directions. Composited over
   * white at the alphas this ramp uses, Blue and Navy are dE 0.00 apart — not close, identical
   * — so brand-awareness buys the two SHIPPING brands nothing at all. DBIM is not identical:
   * its ink is Deep Earthy Brown #150202, not a grey, and it runs 0.25 at the lightest rung to
   * 1.63 at `xl`. (An earlier note here claimed "at most 0.60" by comparing against DBIM's
   * pure grey #2c2c2c instead of its actual body ink. Wrong colour, wrong number.)
   *
   * So the case for per-brand shadows rests entirely on one rung being marginally over the
   * just-noticeable threshold in six demo-only conformance previews. Against that: a shadow is
   * COMPOSITE, and the semantic layer above it (`elevation/*`) inlines the resolved value
   * rather than emitting `var(--sa-ref-shadow-lg)`. Overriding the primitive per brand
   * therefore repaints `--ds-shadow-*` and leaves `--sa-elevation-*` on the default — two
   * names for one shadow, disagreeing by brand. A uniform sub-threshold difference is a better
   * thing to ship than a visible inconsistency between two tokens that are supposed to be the
   * same shadow. Revisit if `elevation/*` ever aliases instead of inlining.
   */
  for (const rung of Object.keys(primitive.shadow)) {
    if (rung.startsWith("$")) continue;
    const t = primitive.shadow[rung];
    // DTCG composite form since 2026-09-04: an array of layers, each with its own colour.
    if (Array.isArray(t.$value)) {
      for (const layer of t.$value) {
        if (typeof layer.color === "string" && layer.color.includes("rgba(")) {
          layer.color = retintRgba(layer.color, neutrals.neutral[800]);
        }
      }
    } else {
      if (typeof t.$value !== "string" || !t.$value.includes("rgba(")) continue;
      t.$value = retintRgba(t.$value, neutrals.neutral[800]);
    }
    // Clear any per-brand override a previous run wrote — see the note above.
    if (t.$extensions?.mosje?.colorModes) delete t.$extensions.mosje.colorModes;
  }
  primitive.shadow.$description =
    `${primitive.shadow.$description.split(" The ink is")[0].trim()} ` +
    `The ink is GENERATED by build/brand-ramps.mjs from neutral/800 — the body ink these are ` +
    `tinted toward — so it cannot drift from it again. Geometry stays authored here; only the ` +
    `rgb is derived.`;

  writeFileSync(primitivePath, `${JSON.stringify(primitive, null, 2)}\n`);

  // The alpha tiers live in semantic.json but are derived from the same anchors, so they are
  // rewritten here — one command regenerates every colour this file is the source of.
  const semanticPath = here("../src/semantic.json");
  const semantic = JSON.parse(readFileSync(semanticPath, "utf8"));
  semantic.color.transparent = buildAlphaTiers();

  /* ---- the two composite ALPHA values, per brand ----
   *
   * `overlay.neutral.boldest` is the modal scrim at 50% (and `text.disabled` WAS the body ink at
   * 48%, until 2026-09-04). Such values are rgba() literals rather than references, because neither can alias a colour
   * token — one is consumed as a flat colour with baked-in alpha, the other sits inside a
   * composite. That is precisely what made them rot: a derived value with no reference to
   * break, still carrying a retired colour long after its source moved.
   *
   * They are keyed by REAL brand ids, and that matters. `dbim-brand-modes.mjs` synthesises the
   * DBIM modes by remapping token REFERENCES, so a literal is invisible to it — and it deletes
   * the old `dbim` key on the way past. `text.disabled` therefore fell back to the blue-grey in
   * all six DBIM modes while `text.default` correctly resolved to Deep Earthy Brown: enabled
   * text brown, disabled text blue-grey, in a mode whose whole claim is conformance. Writing
   * the brand ids out here fixes that, and the preprocessor leaves them alone because it only
   * ever touches refs.
   */
  // `text.disabled` is no longer written here. Since 2026-09-04 it is an OPAQUE reference,
  // `{color.neutralScale.400}`, authored in semantic.json: the 48% wash composited to 1.83:1 on
  // the disabled fill, so a disabled button's label could not be read. A reference follows the
  // brand's neutral hue — and DBIM's pure greys — through the ordinary colorModes machinery,
  // which is exactly what the literal below could not do.

  /*
   * The modal scrim, at 50% the heaviest alpha in the system — and the one place the DBIM ink
   * genuinely shows: composited over white it is dE 4.38 from the Blue scrim, well past the
   * just-noticeable threshold.
   *
   * DBIM MODES ONLY, with NO navy override, and the reason is worth keeping. Blue and Navy
   * composite to dE 0.00 here — identical — so a navy override changes nothing a user could
   * see. It does change the Figma library: `formats/figma-variables.mjs` promotes any token
   * carrying `colorModes.navy` out of the single-mode Color collection into the two-mode
   * Palette, so adding one CREATED a new Palette variable and turned the Color entry into an
   * alias. That is a structural change to a shared library, bought for a difference of zero.
   * The DBIM keys cost nothing there by construction — the exporter reads only `colorModes.navy`.
   */
  const scrim = semantic.overlay.neutral.boldest;
  scrim.$value = retintRgba(scrim.$value, neutrals.neutral[800]);
  const scrimExt = ((scrim.$extensions ??= {}).mosje ??= {});
  scrimExt.colorModes = Object.fromEntries(
    Object.values(DBIM_GROUPS).map(({ brand }) => [brand, retintRgba(scrim.$value, DBIM_INK)]),
  );

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
