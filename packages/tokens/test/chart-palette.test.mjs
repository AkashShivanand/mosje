import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { hexToOklch, hueDelta, deltaE } from "../build/oklch.mjs";
import { contrast } from "../build/wcag.mjs";
import { simulateCvd, CVD_TYPES } from "../build/cvd.mjs";

/**
 * THE CHART-PALETTE GATE.
 *
 * The 38 `--sa-chart-*` tokens were the only colour family in the estate with no
 * perceptual gate. `naming-grammar` checked their NAMES and `visual-contract`
 * checked their existence; nothing had measured them against each other, against
 * the surfaces they are drawn on, or through a colour-vision deficiency.
 *
 * That gap mattered more here than anywhere else, because on a chart colour IS
 * the data. Two indistinguishable buttons are ugly; two indistinguishable series
 * are wrong, and the reader has no way to know they are being misled.
 *
 * WHAT THE FIRST RUN FOUND — three things, none of them guesses:
 *
 *   1. `--sa-chart-cat-3` and `--sa-chart-trend-up` are the SAME HEX, #046a38.
 *      Categorical slot 3 IS the success green, so a three-series chart paints
 *      its third series in the colour the estate uses for "above target".
 *
 *   2. The ramp holds for FIVE slots, not twelve and not the eight this repo had
 *      been asserting. Collision starts at slot 6 (cat-2 #e1560f against cat-6
 *      #b45309 — two oranges, 8 degrees and dE 8.8 apart). That is not a defect
 *      in these particular colours: all twelve sit at near-constant lightness
 *      (L 44-63), so they are separated by hue alone, and twelve hues at one
 *      lightness cannot all be far apart. Any 12-colour ramp built this way has
 *      the same ceiling.
 *
 *   3. The ramp fails colour-vision deficiency at EVERY slot count, including
 *      three. There is no cap at which it becomes CVD-safe.
 *
 * WHY THE GATE IS GREEN ANYWAY. Findings 2 and 3 are not repairable by a test.
 * They need the categorical ramp regenerated against CVD and lightness as well
 * as hue — a design change that has to travel to the Figma library in the same
 * pass, and one that repaints live surfaces. So the measured state is recorded
 * in ratchets below: the numbers are visible, they may only improve, and the
 * gate fails the moment anything gets worse or a published cap outruns what the
 * palette can actually support.
 *
 * THE MITIGATION ALREADY EXISTS and is the reason finding 3 is not an emergency:
 * the system's standing rule is that colour is never the only encoding. Direct
 * labelling, distinct markers, pattern fills and the screen-reader table all
 * carry the same information. The palette failing CVD means the colour layer
 * alone is insufficient, which the design system already assumes.
 *
 * Spec: docs/superpowers/specs/2026-08-27-data-visualisation-system-design.md §04.
 */

/* ── Thresholds ─────────────────────────────────────────────────────────── */

/** Two categorical series must differ in hue OR in overall distance. Same
 *  constants as `hue-separation`, deliberately — one rule for the estate. */
const MIN_HUE_DEGREES = 30;
const MIN_DELTA_E = 12;

/**
 * A categorical slot may sit in the same hue FAMILY as a semantic ink — greens
 * exist and charts need them. What it may not be is CONFUSABLE with one, which
 * is a much tighter question than "looks unrelated", so it gets its own pair of
 * constants rather than reusing the separation rule above. Both must be breached
 * to fail: near in distance AND near in hue.
 */
const MAX_SEMANTIC_CONFUSION_DELTA_E = 6;
const MAX_SEMANTIC_CONFUSION_HUE = 15;

/** WCAG 2.2 SC 1.4.11 non-text contrast: a meaningful graphic against its ground. */
const MIN_SURFACE_CONTRAST = 3;

/**
 * How many slots the system may claim are mutually distinguishable.
 *
 * MEASURED, not chosen: pairs 1-5 are clean and cat-2/cat-6 collides. If the
 * ramp is regenerated this number goes up and the ratchet below enforces that
 * the claim and the palette move together. Consumers that need more series must
 * bucket the remainder rather than reach for slot 6.
 */
const CATEGORICAL_SAFE_COUNT = 9;

/* ── Reading the built CSS ──────────────────────────────────────────────── */

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(`${root}dist/tokens.css`, "utf8");

/** Declarations visible in a brand context: `:root`, then the brand block over it. */
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

/** Follow `var(--x)` chains to a literal hex. */
function resolver(decls) {
  return function resolve(name, depth = 0) {
    if (depth > 12) return null;
    const raw = decls.get(name);
    if (!raw) return null;
    const v = raw.trim();
    if (v.startsWith("#")) return v.toLowerCase();
    const ref = v.match(/^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/);
    return ref ? resolve(ref[1], depth + 1) : null;
  };
}

/**
 * The categorical ramp is brand-INVARIANT — only `:root` declares cat-1..12, and
 * neither Navy nor the DBIM previews override any of them. The semantic and
 * structural chart tokens ARE brand-scoped (DBIM overrides sixteen), so the
 * semantic sweep runs per brand and the categorical sweep runs once. There is no
 * dark theme yet; when one lands, `SURFACES` grows and every rule re-runs
 * against it with no other change here.
 */
const BRANDS = [
  ["blue", blockFor(null)],
  ["navy", blockFor('data-brand="navy"')],
  ["dbim", blockFor('data-brand="dbim"')],
];

const SURFACES = ["--sa-bg-neutral-base", "--sa-bg-neutral-subtler"];
const SEMANTIC_INKS = ["--sa-chart-trend-up", "--sa-chart-trend-down", "--sa-chart-trend-flat"];
const SEQ_RUNGS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const rootResolve = resolver(blockFor(null));
const CATEGORICAL = Array.from({ length: 12 }, (_, i) => ({
  slot: i + 1,
  hex: rootResolve(`--sa-chart-cat-${i + 1}`),
}));

/** Separated by hue OR by perceptual distance — the estate's standing rule. */
function separated(a, b) {
  const dE = deltaE(a, b);
  const dH = Math.abs(hueDelta(hexToOklch(a).H, hexToOklch(b).H));
  return { dE, dH, ok: dH >= MIN_HUE_DEGREES || dE >= MIN_DELTA_E };
}

/* ── Ratchets ───────────────────────────────────────────────────────────── */

/**
 * Measured state of a palette that cannot be repaired by a test. Each number may
 * only improve. A run that beats a baseline fails too, and says so — that is the
 * prompt to tighten the number rather than bank the improvement silently.
 */
/*
 * 2026-09-04, the colour-system redesign's data-visualisation pass. The categorical ramp was
 * re-cut by simulated annealing over all twelve slots at once (docs/audit/2026-09-04-colour-
 * system-audit-and-redesign.md, the data-visualisation section), and four ratchets tightened:
 * CVD worst pair 8.0 -> 8.2; slots outside the lightness band 4 -> 2; slots below the chroma
 * floor 4 -> 0; ordinary-vision worst pair 11.7 -> 13.4; full-ramp CVD worst pair 1.5 -> 3.8 (the
 * three extension slots re-picked so the tail does not give back what the head gained). The two slots still below the band
 * are the measured price of nine colour-blind-safe slots: inside the band no nine-slot set
 * reaches dE 8 on every pair (best found 7.5 over several thousand annealed candidates).
 */
const RATCHETS = {
  /**
   * Colliding pairs across the full twelve, at the estate separation rule.
   * Zero since the ramp was regenerated. It used to be four — cat-1/cat-8,
   * cat-2/cat-6, cat-3/cat-9 and cat-7/cat-10, each a hue family appearing
   * twice because twelve slots at one lightness must reuse the wheel.
   */
  fullRampCollisions: 0,

  /**
   * Worst perceptual distance between any two of the first nine slots once a
   * dichromacy is applied. 8.0 clears the threshold with nothing to spare,
   * which is the point: the ramp was solved to this bound, not past it. The
   * old ramp managed 5.7 across only five slots and 1.0 across twelve.
   */
  cvdWorstDeltaEInSafeRange: 8.2,

  /**
   * Worst across all twelve. Slots 10-12 are EXTENSION colours: mutually
   * distinct in full colour, deliberately not CVD-guaranteed, and reached only
   * by a consumer that has already ignored the cap. The number is low by design
   * and is ratcheted so it cannot quietly get lower still.
   */
  cvdWorstDeltaEFullRamp: 3.8,

  /*
   * ── THREE PROPERTIES THIS GATE DID NOT MEASURE ──────────────────────────
   *
   * Found 2026-09-02 by running the ramp through the industry six-check
   * procedure. The estate's CVD gate above is rigorous and correct — it is
   * strictly BETTER than the standard on the dimension it covers, because it
   * checks all pairs across nine slots rather than adjacent pairs across eight.
   * But it measures one dimension, and a palette solved hard against one
   * constraint drifts on the others. All three of these are real today.
   *
   * The deepest one is `normalWorstDeltaEInSafeRange`. The ramp was solved so
   * far for colour-blind separation that cat-8 (#323ca8) and cat-9 (#5a406e)
   * ended up 11.7 apart in UNSIMULATED vision, against a floor of 15 — two
   * series a full-colour-vision reader struggles to tell apart, produced by
   * optimising for readers who cannot see colour. Nobody measured the ordinary
   * case, so nobody saw it.
   *
   * These are ratcheted, not fixed, deliberately. A replacement palette was
   * derived and validated against the standard's six checks and then REJECTED
   * by the three tests above: it painted two slots green (which on this estate
   * means "above target", so an arbitrary series on a caste-category breakdown
   * reads as a good result), left five slots under 3:1 on a secondary chart
   * ground, and regressed CVD separation to 5.7. That failure is the useful
   * result: the next solve must satisfy all six of this file's constraints AT
   * ONCE, and the constraints are now all written down. See
   * docs/audit/ds-world-class-audit.md §F11.
   */

  /** OKLCH L, 0-100. Outside 43-77 a mark is too dark or too pale to sit on either ground. */
  slotsOutsideLightnessBand: 2,

  /** OKLCH C. Below 0.10 a hue reads as grey, so the series loses its identity. */
  slotsBelowChromaFloor: 0,

  /*
   * NAMED AS DEBT, NOT AS CONFORMANCE. These three tests are ratchets over a
   * deficit that is real today: four slots outside the band, four below the
   * chroma floor, and a worst ordinary-vision pair at 11.7 against a floor of
   * 15. An earlier draft named them "every categorical slot sits inside the
   * lightness band" and so on — three green ticks beside three untrue
   * sentences, which is exactly the defect the A11yChecklist rebuild was for.
   * A test name is read far more often than its baseline.
   */
  /** Worst UNSIMULATED separation in the safe range. Floor is 15; this is the gap. */
  normalWorstDeltaEInSafeRange: 13.4,
};

/** OKLCH lightness band a categorical mark must sit inside, on a light ground. */
const LIGHTNESS_BAND = [43, 77];
/** OKLCH chroma below which a hue reads as grey rather than as an identity. */
const CHROMA_FLOOR = 0.1;

/** Ratchet direction: bigger is better for dE, smaller is better for a count. */
function assertRatchet(name, measured, baseline, betterIsHigher) {
  const worse = betterIsHigher ? measured < baseline : measured > baseline;
  const better = betterIsHigher ? measured > baseline : measured < baseline;
  assert.ok(
    !worse,
    `${name} regressed: ${measured} against a baseline of ${baseline}. The chart palette got ` +
      `perceptually worse. Fix the change, or — if this is a deliberate trade — move the ` +
      `baseline in RATCHETS and say why in the same commit.`,
  );
  assert.ok(
    !better,
    `${name} IMPROVED: ${measured} against a baseline of ${baseline}. Tighten the baseline in ` +
      `RATCHETS so the gain cannot be given back. A ratchet that is not re-tightened stops ` +
      `being a ratchet.`,
  );
}

/* ── The ledger ─────────────────────────────────────────────────────────── */

/**
 * Failures that are KNOWN and individually named. May only shrink; the stale
 * test at the bottom fails once an entry is fixed and its line is not deleted.
 */
const PALETTE_LEDGER = new Map([]);

const hit = new Set();
const ledgered = (brand, rule, detail) => {
  const a = `${rule}::${detail}`;
  const b = `${brand}::${rule}::${detail}`;
  if (PALETTE_LEDGER.has(a)) hit.add(a);
  if (PALETTE_LEDGER.has(b)) hit.add(b);
  return PALETTE_LEDGER.has(a) || PALETTE_LEDGER.has(b);
};

/* ── Tests ──────────────────────────────────────────────────────────────── */

test("the gate can see the chart palette at all", () => {
  const missing = CATEGORICAL.filter((c) => !c.hex).map((c) => `cat-${c.slot}`);
  assert.deepEqual(
    missing,
    [],
    `${missing.length} categorical slots did not resolve to a hex. A gate that cannot read the ` +
      `palette proves nothing while reporting green.`,
  );
  for (const s of SURFACES) {
    assert.ok(rootResolve(s), `surface ${s} did not resolve — the contrast rules below are void.`);
  }
  for (const ink of SEMANTIC_INKS) {
    assert.ok(rootResolve(ink), `semantic ink ${ink} did not resolve.`);
  }
});

test("the slots the system claims are distinguishable actually are", () => {
  const failures = [];
  for (let i = 0; i < CATEGORICAL_SAFE_COUNT; i++) {
    for (let j = i + 1; j < CATEGORICAL_SAFE_COUNT; j++) {
      const a = CATEGORICAL[i];
      const b = CATEGORICAL[j];
      const m = separated(a.hex, b.hex);
      if (m.ok) continue;
      failures.push(
        `cat-${a.slot} vs cat-${b.slot}: ${a.hex} / ${b.hex} — ${m.dH.toFixed(0)}deg apart, ` +
          `dE ${m.dE.toFixed(1)} (need >=${MIN_HUE_DEGREES}deg OR dE >=${MIN_DELTA_E})`,
      );
    }
  }
  assert.deepEqual(
    failures,
    [],
    `the published safe count of ${CATEGORICAL_SAFE_COUNT} is a promise the palette no longer ` +
      `keeps. Either the ramp changed, or the count was raised without regenerating it:\n  ` +
      failures.join("\n  "),
  );
});

test("the full ramp does not collide more than it already does", () => {
  const collisions = [];
  for (let i = 0; i < CATEGORICAL.length; i++) {
    for (let j = i + 1; j < CATEGORICAL.length; j++) {
      if (!separated(CATEGORICAL[i].hex, CATEGORICAL[j].hex).ok) {
        collisions.push(`cat-${CATEGORICAL[i].slot}/cat-${CATEGORICAL[j].slot}`);
      }
    }
  }
  assertRatchet(
    `colliding pairs across the full ramp (${collisions.join(", ") || "none"})`,
    collisions.length,
    RATCHETS.fullRampCollisions,
    false,
  );
});

test("no categorical slot is confusable with a semantic ink, in any brand", () => {
  const failures = [];
  for (const [brand, decls] of BRANDS) {
    const resolve = resolver(decls);
    for (const ink of SEMANTIC_INKS) {
      const inkHex = resolve(ink);
      if (!inkHex) continue;
      const inkName = ink.replace("--sa-chart-", "");
      for (const c of CATEGORICAL) {
        const dE = deltaE(c.hex, inkHex);
        const dH = Math.abs(hueDelta(hexToOklch(c.hex).H, hexToOklch(inkHex).H));
        const confusable =
          dE < MAX_SEMANTIC_CONFUSION_DELTA_E && dH < MAX_SEMANTIC_CONFUSION_HUE;
        if (!confusable) continue;
        const detail = `cat-${c.slot}|${inkName}`;
        if (ledgered(brand, "categorical-vs-semantic", detail)) continue;
        failures.push(
          `[${brand}] cat-${c.slot} vs ${inkName}: ${c.hex} / ${inkHex} — ` +
            `${dH.toFixed(0)}deg apart, dE ${dE.toFixed(1)}`,
        );
      }
    }
  }
  assert.deepEqual(
    failures,
    [],
    `${failures.length} categorical slots carry a meaning they should not. Green means 'above ` +
      `target' on this estate, so an arbitrary series painted in it reads as a good result — ` +
      `which on a caste-category or religion breakdown is not a cosmetic problem:\n  ` +
      failures.join("\n  "),
  );
});

test("every categorical slot holds 3:1 against every surface it is drawn on", () => {
  const failures = [];
  for (const s of SURFACES) {
    const ground = rootResolve(s);
    for (const c of CATEGORICAL) {
      const ratio = contrast(c.hex, ground);
      if (ratio >= MIN_SURFACE_CONTRAST) continue;
      failures.push(
        `cat-${c.slot} (${c.hex}) on ${s} (${ground}): ${ratio.toFixed(2)}:1 ` +
          `(need >=${MIN_SURFACE_CONTRAST}:1)`,
      );
    }
  }
  assert.deepEqual(
    failures,
    [],
    `${failures.length} series colours are too faint against the chart ground — WCAG 2.2 SC ` +
      `1.4.11:\n  ${failures.join("\n  ")}`,
  );
});

test("colour-vision separation does not get worse", () => {
  const worstOf = (n) => {
    let worst = Infinity;
    let who = "";
    for (const type of CVD_TYPES) {
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = deltaE(simulateCvd(CATEGORICAL[i].hex, type), simulateCvd(CATEGORICAL[j].hex, type));
          if (d < worst) {
            worst = d;
            who = `${type} cat-${i + 1}/cat-${j + 1}`;
          }
        }
      }
    }
    return { worst: Math.round(worst * 10) / 10, who };
  };

  const safe = worstOf(CATEGORICAL_SAFE_COUNT);
  const full = worstOf(CATEGORICAL.length);

  assertRatchet(
    `worst CVD separation within the first ${CATEGORICAL_SAFE_COUNT} slots (${safe.who})`,
    safe.worst,
    RATCHETS.cvdWorstDeltaEInSafeRange,
    true,
  );
  assertRatchet(
    `worst CVD separation across the full ramp (${full.who})`,
    full.worst,
    RATCHETS.cvdWorstDeltaEFullRamp,
    true,
  );
});

test("the sequential ramp moves monotonically in perceived lightness", () => {
  const steps = SEQ_RUNGS.map((r) => ({ rung: r, hex: rootResolve(`--sa-chart-seq-${r}`) })).filter(
    (s) => s.hex,
  );
  assert.ok(steps.length >= 8, `only ${steps.length} sequential rungs resolved; expected 10.`);

  const breaks = [];
  for (let i = 1; i < steps.length; i++) {
    const prev = hexToOklch(steps[i - 1].hex).L;
    const cur = hexToOklch(steps[i].hex).L;
    if (cur < prev) continue;
    breaks.push(
      `seq-${steps[i - 1].rung} (L ${prev.toFixed(1)}) -> seq-${steps[i].rung} (L ${cur.toFixed(1)}) does not darken`,
    );
  }
  assert.deepEqual(
    breaks,
    [],
    `the sequential ramp reverses direction, so a larger value renders lighter than a smaller ` +
      `one and the reader reads the map backwards:\n  ${breaks.join("\n  ")}`,
  );
});

test("the diverging ramp separates its ends and its midpoint", () => {
  const pick = (n) => rootResolve(`--sa-chart-div-${n}`);
  const negStrong = pick("negStrong");
  const posStrong = pick("posStrong");
  const mid = pick("mid");
  assert.ok(negStrong && posStrong && mid, "the diverging ramp did not resolve.");

  const ends = separated(negStrong, posStrong);
  assert.ok(
    ends.ok,
    `the ends of the diverging ramp are indistinguishable (${negStrong} / ${posStrong} — ` +
      `${ends.dH.toFixed(0)}deg, dE ${ends.dE.toFixed(1)}). A diverging scale whose extremes ` +
      `look alike cannot show direction.`,
  );

  for (const [name, hex] of [["negStrong", negStrong], ["posStrong", posStrong]]) {
    const d = deltaE(hex, mid);
    assert.ok(
      d >= MIN_DELTA_E,
      `div-${name} (${hex}) is only dE ${d.toFixed(1)} from div-mid (${mid}); a deviation at ` +
        `the extreme would be invisible against no deviation at all.`,
    );
  }
});

test("no ledger entry outlives the defect it records", () => {
  const stale = [...PALETTE_LEDGER.keys()].filter((k) => !hit.has(k));
  assert.deepEqual(
    stale,
    [],
    `${stale.length} ledger entries no longer match a real failure. The defect was fixed and ` +
      `the entry was not deleted, so this gate is now silencing a rule nothing is breaking:\n  ` +
      stale.join("\n  "),
  );
});

test("the lightness-band deficit does not grow", () => {
  /*
   * A mark outside the band is either too dark to read against the dark ground
   * or too pale against the light one. It is not a contrast failure — the
   * contrast test above passes — it is a legibility one: the mark is there, and
   * the eye has to work to place it among its neighbours.
   */
  const outside = CATEGORICAL.filter((c) => {
    const { L } = hexToOklch(c.hex);
    return L < LIGHTNESS_BAND[0] || L > LIGHTNESS_BAND[1];
  });

  assertRatchet(
    `categorical slots outside the OKLCH lightness band ${LIGHTNESS_BAND.join("-")} ` +
      `(${outside.map((c) => c.name).join(", ") || "none"})`,
    outside.length,
    RATCHETS.slotsOutsideLightnessBand,
    false,
  );
});

test("the chroma-floor deficit does not grow", () => {
  /*
   * Chroma is what makes a series identifiable at a glance across a legend and
   * a plot. Below the floor the mark still has a hue, but a reader scanning a
   * twelve-series chart cannot use it — the slot has stopped carrying identity
   * and is doing the job of a gridline.
   */
  const flat = CATEGORICAL.filter((c) => hexToOklch(c.hex).C < CHROMA_FLOOR);

  assertRatchet(
    `categorical slots below the OKLCH chroma floor of ${CHROMA_FLOOR} ` +
      `(${flat.map((c) => c.name).join(", ") || "none"})`,
    flat.length,
    RATCHETS.slotsBelowChromaFloor,
    false,
  );
});

test("the ordinary-vision separation gap does not widen", () => {
  /*
   * The complement of the CVD test, and the one that was missing.
   *
   * Optimising a ramp for dichromacy pushes hues toward the blue-yellow axis,
   * where protan and deutan separation survives. Do it hard enough and two
   * slots that a dichromat can tell apart become nearly the same colour to
   * everyone else. That is what happened here: cat-8 and cat-9 are 11.7 apart
   * unsimulated, against a floor of 15.
   *
   * So both directions are now measured. A palette has to clear the floor for
   * readers who see colour AND for readers who do not; clearing one at the
   * expense of the other is not an accessible palette, it is a traded defect.
   */
  let worst = Infinity;
  let who = "";
  for (let i = 0; i < CATEGORICAL_SAFE_COUNT; i++) {
    for (let j = i + 1; j < CATEGORICAL_SAFE_COUNT; j++) {
      const d = deltaE(CATEGORICAL[i].hex, CATEGORICAL[j].hex);
      if (d < worst) {
        worst = d;
        who = `cat-${i + 1}/cat-${j + 1}`;
      }
    }
  }

  assertRatchet(
    `worst UNSIMULATED separation within the first ${CATEGORICAL_SAFE_COUNT} slots (${who}); ` +
      `the industry floor is 15`,
    Math.round(worst * 10) / 10,
    RATCHETS.normalWorstDeltaEInSafeRange,
    true,
  );
});
