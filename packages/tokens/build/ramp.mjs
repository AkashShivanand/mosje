/**
 * The ramp generator — one rule for every chromatic ramp in the system.
 *
 * WHY
 * ---
 * The 2026-08-11 colour audit found the palette had been assembled from several sources
 * rather than generated: a brand colour here, a Material ramp there. The symptoms were
 * `danger/400` and `danger/500` sitting 1.8 L* apart, `success/600` and `success/700`
 * sharing chroma exactly, the Navy primary ramp dropping 27.4 L* in one step, and "500"
 * meaning something different in each of seven ramps. A designer could not predict what a
 * step would look like before trying it.
 *
 * THE MODEL — contrast-anchored, after Adobe Leonardo
 * --------------------------------------------------
 * Steps are placed by LIGHTNESS, which is what contrast is a function of, so a rung's
 * contrast becomes a property of the ladder rather than something measured afterwards and
 * hoped for. Material 3's HCT and Radix's fixed-meaning steps solve the same problem; the
 * contrast-first framing is the one that also fixes the prominence contract, because a rung
 * can be DEFINED as "the step that clears 4.5:1" instead of audited into compliance.
 *
 * Three invariants, enforced by `test/ramp-quality.test.mjs`:
 *
 *   1. L* is strictly monotonic, with every step 4..16 apart — no duplicate rungs, no cliffs.
 *   2. Hue is held to within 2 degrees across the ramp — greys and brand colours do not
 *      drift temperature as they darken.
 *   3. Chroma follows a single arc peaking at the anchor — never darker AND duller at once,
 *      which is what made `warning/500` read muddy.
 *
 * THE ANCHOR IS SACRED
 * --------------------
 * Each ramp is built around a real, externally-mandated colour that the generator must
 * reproduce EXACTLY: gov-blue #0373DF, the DBIM key colour #162F6A, and the two SAMAVESH
 * logo colours. The generator never "improves" an anchor — it builds the other nine steps
 * around it.
 */

import { hexToOklch, oklchToHex, nearestHex, hueDelta, rgbToOklab, hexToRgb } from "./oklch.mjs";

/**
 * The rung ladder, matching UX4G 3.0's chromatic ramps exactly (50..900 plus 950).
 *
 * 950 joined on 2026-08-11. UX4G ships 11 steps on every chromatic ramp and we shipped 10,
 * which left a parity gap in the one layer a whole conformance suite exists to map. 950 is
 * the near-black shade a footer or a `boldest` fill wants without falling back to pure
 * black — which is harsh, and being achromatic carries no hue, so it cannot belong to a
 * chromatic ramp at all. Pure white and pure black live on the NEUTRAL ramp only, as
 * `0` and `1000`, for exactly that reason.
 */
export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/* ------------------------------------------------------------------ lightness ladder */

/**
 * Monotone cubic Hermite (Fritsch-Carlson) through the ramp's three fixed points:
 * the lightest step, the anchor, and the darkest step.
 *
 * A plain two-segment linear ramp would put a visible kink at the anchor whenever the two
 * segments have different slopes — which is always, because an anchor is rarely at the
 * midpoint of its own range. #162F6A sits at L* 32 in a ramp running 96 -> 8, so its light
 * side has to cover 64 points and its dark side 24. Linear segments would step 12.7 above
 * the anchor and 6.1 below it, and the seam would be plainly visible in a swatch strip.
 * Monotone Hermite varies the step size gradually instead, and cannot overshoot into a
 * non-monotonic wobble the way an unconstrained spline can.
 */
function monotoneLadder(anchorIndex, lightest, anchorL, darkest) {
  const n = STEPS.length;
  const xs = [0, anchorIndex, n - 1];
  const ys = [lightest, anchorL, darkest];

  // Secant slopes, then Fritsch-Carlson limiting to guarantee monotonicity.
  const d = [];
  for (let i = 0; i < xs.length - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m = [d[0], (d[0] + d[1]) / 2, d[1]];
  for (let i = 0; i < d.length; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / d[i];
      const b = m[i + 1] / d[i];
      const s = Math.hypot(a, b);
      if (s > 3) {
        m[i] = ((3 / s) * a) * d[i];
        m[i + 1] = ((3 / s) * b) * d[i];
      }
    }
  }

  return STEPS.map((_, i) => {
    if (i === 0) return lightest;
    if (i === anchorIndex) return anchorL;
    if (i === n - 1) return darkest;
    const seg = i < anchorIndex ? 0 : 1;
    const h = xs[seg + 1] - xs[seg];
    const t = (i - xs[seg]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * ys[seg] +
      (t3 - 2 * t2 + t) * h * m[seg] +
      (-2 * t3 + 3 * t2) * ys[seg + 1] +
      (t3 - t2) * h * m[seg + 1]
    );
  });
}

/* ------------------------------------------------------------------ chroma arc */

/**
 * Chroma as a single arc peaking at the anchor and tapering to both ends.
 *
 * Tints near white and shades near black cannot hold much chroma without looking synthetic,
 * and — more importantly — a step that is both darker and duller than its neighbour reads
 * as muddy. That is precisely what `warning/500` did: 11 L* darker than 400 and 17% less
 * chromatic at the same time. A single arc makes that shape unrepresentable.
 *
 * The exponents are asymmetric because the two ends fail differently: light tints wash out
 * quickly (so chroma is held longer, 0.85), while dark shades muddy quickly (so chroma is
 * shed faster, 0.70).
 */
function chromaArc(L, anchorL, anchorC) {
  if (L >= anchorL) {
    const t = (100 - L) / (100 - anchorL);
    return anchorC * Math.pow(Math.max(0, t), 0.85);
  }
  const t = L / anchorL;
  return anchorC * Math.pow(Math.max(0, t), 0.7);
}

/* ------------------------------------------------------------------ the generator */

/**
 * Build a 50..900 ramp around an anchor.
 *
 * @param {object}  spec
 * @param {string}  spec.anchor       Hex the ramp must reproduce exactly.
 * @param {number} [spec.anchorStep]  Which rung the anchor occupies. Default 500.
 * @param {number} [spec.lightest]    L* of step 50.
 * @param {number} [spec.darkest]     L* of step 900.
 * @returns {Record<number, string>}  `{ 50: "#…", …, 900: "#…" }`
 */
export function buildRamp({ anchor, anchorStep = 500, lightest = 96.5, darkest = 20 }) {
  const anchorIndex = STEPS.indexOf(anchorStep);
  if (anchorIndex === -1) throw new Error(`anchorStep must be one of ${STEPS.join(", ")}`);

  const { L: aL, C: aC, H } = hexToOklch(anchor);
  if (!(lightest > aL && aL > darkest)) {
    throw new Error(
      `anchor ${anchor} has L* ${aL.toFixed(1)}, which is not strictly between ` +
        `darkest ${darkest} and lightest ${lightest}`,
    );
  }

  const ladder = monotoneLadder(anchorIndex, lightest, aL, darkest);

  const out = {};
  STEPS.forEach((step, i) => {
    // The anchor is reproduced verbatim — never round-tripped through the generator, so a
    // mandated brand value can never drift by a rounding step.
    out[step] = i === anchorIndex
      ? anchor.toLowerCase()
      : oklchToHex({ L: ladder[i], C: chromaArc(ladder[i], aL, aC), H });
  });
  return out;
}

/* ------------------------------------------------------------------ transcribed ramps */

/**
 * Build an 11-rung ramp through a palette somebody ELSE published, reproducing every
 * published value exactly and interpolating the gaps.
 *
 * WHY THIS IS NOT `buildRamp`
 * ---------------------------
 * `buildRamp` derives ten steps from one anchor and a shape rule. That is the right tool for
 * a ramp this estate owns. It is the WRONG tool for a conformance palette: DBIM publishes five
 * numbered shades per colour group, and re-deriving them from one anchor would quietly replace
 * four of the five with values DBIM never issued. A conformance palette that has been
 * re-derived is no longer a conformance palette — it is our palette wearing DBIM's name.
 *
 * THE SHAPE RULE DOES NOT APPLY HERE, AND THAT IS A DECISION
 * ---------------------------------------------------------
 * Measured, the two are mutually exclusive. DBIM's five shades span roughly L* 30-95 while
 * this system's ladder spans L* 19-96 in eleven steps, so pinning five fixed points inside it
 * leaves gaps that cannot all be 4-16 L* apart: every group lands somewhere between ΔL* 1.7
 * and 3.6, and chrome yellow's hue drifts 56 degrees because DBIM's own shades 1 and 5 are 8
 * degrees apart in a ramp that has to reach both. An exhaustive search over every assignment
 * of five shades to eleven rungs found NO configuration satisfying the shape rule for five of
 * the six groups.
 *
 * So the shape rule is scoped to the ramps this estate generates, and a transcription is
 * exempt by construction — recorded here rather than left as a silent difference. What is NOT
 * relaxed is accessibility: a DBIM mode is measured by the same contrast gates as any other
 * brand, and where DBIM's own palette falls short, the measurement is reported (see
 * `docs/design-system/colour-system.md`) rather than the colour being adjusted to hide it.
 *
 * @param {object} spec
 * @param {Record<number,string>} spec.pins  rung -> published hex. At least two.
 * @param {number} [spec.tipToward]   L* the extrapolated light end runs toward. Default 100.
 * @param {number} [spec.tailToward]  L* the extrapolated dark end runs toward. Default 0.
 * @returns {Record<number, string>}
 */
export function buildPublishedRamp({ pins, tipToward = 100, tailToward = 0 }) {
  const anchored = Object.keys(pins)
    .map(Number)
    .sort((a, b) => a - b)
    .map((rung) => {
      const i = STEPS.indexOf(rung);
      if (i === -1) throw new Error(`pinned rung ${rung} is not one of ${STEPS.join(", ")}`);
      return { i, hex: pins[rung].toLowerCase(), oklch: hexToOklch(pins[rung]) };
    });
  if (anchored.length < 2) throw new Error("a transcribed ramp needs at least two published shades");

  const lerp = (a, b, t) => a + (b - a) * t;
  const first = anchored[0];
  const last = anchored[anchored.length - 1];

  const out = {};
  for (const p of anchored) out[STEPS[p.i]] = p.hex;

  STEPS.forEach((step, i) => {
    if (out[step] !== undefined) return;

    // Between two published shades: straight-line interpolation in OKLCH, taking the SHORT
    // way round the hue circle so a ramp whose ends straddle 0 degrees (burgundy, cinnamon
    // red) does not sweep the entire wheel on the way.
    for (let k = 0; k < anchored.length - 1; k++) {
      const a = anchored[k];
      const b = anchored[k + 1];
      if (i > a.i && i < b.i) {
        const t = (i - a.i) / (b.i - a.i);
        out[step] = nearestHex({
          L: lerp(a.oklch.L, b.oklch.L, t),
          C: lerp(a.oklch.C, b.oklch.C, t),
          H: a.oklch.H + hueDelta(a.oklch.H, b.oklch.H) * t,
        });
        return;
      }
    }

    // Outside the published span there is nothing to interpolate BETWEEN, so these steps run
    // toward white or black shedding chroma. They are the only values on the ramp DBIM did
    // not issue, which is why `$dbimShades` records which rungs are theirs and which are ours.
    const ref = i < first.i ? first : last;
    const toward = i < first.i ? tipToward : tailToward;
    const span = i < first.i ? first.i + 1 : STEPS.length - last.i;
    const t = Math.abs(i - ref.i) / span;
    out[step] = nearestHex({
      L: lerp(ref.oklch.L, toward, t),
      C: ref.oklch.C * (1 - t * 0.8),
      H: ref.oklch.H,
    });
  });

  return Object.fromEntries(STEPS.map((s) => [s, out[s]]));
}

/* ------------------------------------------------------------------ the neutral ramp */

/**
 * The neutral ladder, thirteen steps. `0` and `1000` are pure white and pure black.
 *
 * They live here and on no chromatic ramp, because they are ACHROMATIC — they carry no hue,
 * so they cannot belong to a family that is defined by one. That is also why the neutral ramp
 * has two more rungs than the others rather than the same eleven.
 */
export const NEUTRAL_STEPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

/**
 * Build the 13-step neutral ramp: one hue, one chroma arc, an explicit lightness ladder.
 *
 * WHY THE GREYS ARE TINTED
 * ------------------------
 * They already were, and had been for years — the question was never whether to tint but
 * whether the tint was chosen. It was not: `neutral/400` measured C 0.020 at hue 256,
 * `neutral/500` C 0.017 at hue 245, and `neutral/950` C 0.014 at hue 264. Chroma DROPPED
 * between 400 and 500 while lightness fell, which is the same "darker and duller at once"
 * defect that made `warning/500` read muddy, and the hue wandered 22 degrees across the ramp.
 * Nobody picked 245 or 264; independent 8-bit rounding of a nearly-grey colour did (see
 * `nearestHex`). A brand-tinted neutral is standard practice — Material 3 derives neutral
 * from the source colour, Radix ships tinted grays, Tailwind's slate/zinc/stone are the same
 * idea. The failure mode is an INCONSISTENT tint, which is what was there.
 *
 * So: hue is locked to the brand's own primary hue for the whole ramp, and chroma follows a
 * single arc that reaches zero at both ends. The peak is deliberately low — above about 0.02
 * a grey stops reading as grey and starts reading as a colour.
 *
 * WHY THE LADDER IS AN EXPLICIT LIST
 * ----------------------------------
 * Unlike a chromatic ramp there is no anchor to derive from: nobody mandates a grey. What the
 * ladder has to fix is DISTRIBUTION. The old one put four steps inside the lightest 7.7 L*
 * and then crossed the mid-range in two jumps of 15.2 and 15.5, which is why there was exactly
 * one grey between a light surface and a mid grey, and why components kept reaching for a
 * one-off hex that the system had no name for.
 *
 * @param {object} spec
 * @param {number} spec.hue          The brand's primary hue, held constant across the ramp.
 * @param {number[]} spec.lightness  L* per step, in `NEUTRAL_STEPS` order. Must start 100, end 0.
 * @param {number} spec.peakL        L* at which chroma peaks.
 * @param {number} spec.peakC        Chroma at the peak.
 * @param {number} [spec.gamma]      Taper exponent; higher sheds chroma faster off the peak.
 * @returns {Record<number, string>}
 */
export function buildNeutralRamp({ hue, lightness, peakL, peakC, gamma = 0.8 }) {
  if (lightness.length !== NEUTRAL_STEPS.length) {
    throw new Error(`neutral ladder needs ${NEUTRAL_STEPS.length} lightnesses, got ${lightness.length}`);
  }
  if (lightness[0] !== 100 || lightness.at(-1) !== 0) {
    throw new Error("the neutral ramp must start at pure white (L* 100) and end at pure black (L* 0)");
  }

  const chroma = (L) =>
    peakC * Math.pow(Math.max(0, L >= peakL ? (100 - L) / (100 - peakL) : L / peakL), gamma);

  const out = {};
  NEUTRAL_STEPS.forEach((step, i) => {
    // The endpoints are white and black EXACTLY. Tinting them would be a contradiction: they
    // are on this ramp precisely because they have no hue to tint.
    if (i === 0) out[step] = "#ffffff";
    else if (i === NEUTRAL_STEPS.length - 1) out[step] = "#000000";
    // `nearestHex`, not `oklchToHex` — at this chroma naive rounding scrambles the hue. Where
    // the arc asks for less chroma than the 8-bit grid can express, `nearestHex` returns a true
    // grey on its own; there is no threshold here to tune.
    else out[step] = nearestHex({ L: lightness[i], C: chroma(lightness[i]), H: hue });
  });
  return out;
}

/* ------------------------------------------------------------------ reporting */

/** WCAG 2.x relative luminance, for the contrast readout below. */
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hexes. */
export function contrastRatio(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Per-step metrics for a generated ramp — used by the tests and the CLI readout. */
export function describeRamp(ramp, steps = STEPS) {
  let prev = null;
  return steps.map((step) => {
    const hex = ramp[step];
    const { L, C, H } = hexToOklch(hex);
    const row = {
      step,
      hex,
      L,
      C,
      H,
      dL: prev === null ? null : prev - L,
      onWhite: contrastRatio(hex, "#ffffff"),
      onBlack: contrastRatio(hex, "#000000"),
    };
    prev = L;
    return row;
  });
}
