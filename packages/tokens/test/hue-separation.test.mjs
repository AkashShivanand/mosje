import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { hexToOklch, hueDelta, deltaE } from "../build/oklch.mjs";

/**
 * THE HUE-SEPARATION GATE.
 *
 * Two colour families that mean different things must LOOK different, in every brand, at
 * every rung. Nothing checked that, and the 2026-08-11 audit found what got through:
 *
 *   Navy's `bg/brand/secondary/bold` (#66c99b) and `bg/status/success/bold` (#81c784) were
 *   0.3 L* and 16 degrees apart — a contrast ratio between them of 1.00:1. A secondary-action
 *   chip and a saved-state chip were the same object on screen. The Blue brand was fine; the
 *   defect appeared only when the brand axis rotated secondary's hue by 100 degrees into
 *   territory the success semantic already owned.
 *
 * That is the class of bug this gate exists to make unshippable. It is deliberately a
 * CROSS-BRAND sweep, because the failure did not exist in the default brand at all.
 *
 * WHY THE RULE IS "HUE **OR** DELTA-E", NOT HUE ALONE
 * ---------------------------------------------------
 * Hue distance on its own would be both too weak and too strong.
 *
 *   Too weak: two colours can share a hue and still be unmistakable if they differ enough in
 *   lightness — which is exactly how the Blue and Navy brands are told apart, being only 9
 *   degrees apart.
 *
 *   Too strong: red and orange are ADJACENT on the hue circle and can never be pulled far
 *   apart in H. Demanding it would ask for something the colour wheel cannot give, and the
 *   only way to pass would be to abandon one of the two — including India Saffron, which is
 *   not ours to move.
 *
 * So a pair passes if it is separated by hue OR by overall perceptual distance. Both are
 * measured in OKLab, where a unit of lightness means the same thing at every hue.
 *
 * Comparisons are at MATCHED RUNGS. Comparing a `subtle` tint against a `boldest` fill would
 * pass trivially and prove nothing — the question is whether two families collide where a
 * user would actually see them side by side, which is at the same prominence.
 */

const MIN_HUE_DEGREES = 30;
const MIN_DELTA_E = 12;

const root = new URL("..", import.meta.url).pathname;
const css = readFileSync(`${root}dist/tokens.css`, "utf8");

/** Declarations of a selector block, or of `:root` when `selector` is null. */
function blockOf(selector) {
  const start = selector ? css.indexOf(selector) : css.indexOf(":root {");
  if (start === -1) return null;
  const open = css.indexOf("{", start);
  const body = css.slice(open, css.indexOf("\n}", open));
  return new Map(
    [...body.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1], m[2].trim()]),
  );
}

const ROOT = blockOf(null);
/**
 * EVERY brand the stylesheet emits — discovered, not listed.
 *
 * `dbim` was added on 2026-08-11 and this gate kept sweeping only blue and navy, so a third
 * of the product went unchecked while the suite reported green. That is the failure mode a
 * hardcoded list always has, so the list is now derived from the sheet: add a brand and it is
 * covered automatically, and the assertion below fails if the discovery ever finds nothing.
 */
const BRANDS = [
  ["blue", ROOT],
  // The character class must allow HYPHENS. It did not, and the six `dbim-*` conformance
  // brands added on 2026-08-11 were therefore invisible to a gate whose own comment is about
  // exactly this failure: it reported green while a third of the product went unchecked, then
  // three quarters of it. A discovery pattern that silently matches nothing is worse than a
  // hardcoded list, because a hardcoded list is at least obviously incomplete.
  ...[...css.matchAll(/^\[data-brand="([a-z0-9-]+)"\]/gm)]
    .map((m) => m[1])
    .filter((id, i, a) => a.indexOf(id) === i)
    .map((id) => [id, new Map([...ROOT, ...(blockOf(`[data-brand="${id}"]`) ?? [])])]),
];

/** Resolve a custom property to its literal, following var() chains within a brand. */
function resolver(map) {
  return function resolve(name, depth = 0) {
    if (depth > 8) return null;
    const value = map.get(name) ?? ROOT.get(name) ?? null;
    if (value === null) return null;
    const ref = value.match(/^var\((--[A-Za-z0-9-]+)\)$/);
    return ref ? resolve(ref[1], depth + 1) : value;
  };
}

/** The colour families that carry MEANING. Neutral is excluded — it is achromatic by design. */
const FAMILIES = {
  primary: "bg-brand-primary",
  secondary: "bg-brand-secondary",
  accent: "bg-brand-accent",
  success: "bg-status-success",
  error: "bg-status-error",
  warning: "bg-status-warning",
  info: "bg-status-info",
};

const RUNGS = ["subtler", "subtle", "bold", "bolder", "boldest"];

/**
 * Pairs that are the SAME colour on purpose. Each is a design decision, not an oversight,
 * and each states what it would take to undo it.
 *
 * This list is NOT a place to silence an inconvenient measurement. An entry means "these two
 * families are one colour and we accept that a user cannot tell them apart" — which is only
 * ever right when telling them apart does not matter.
 */
const INTENTIONAL_UNIONS = new Map([
  [
    "accent|success",
    "One green, on purpose (2026-08-11). India Green #046A38 from the SAMAVESH logo is both " +
      "the brand accent and the success status. Two greens nine degrees apart is a defect " +
      "whichever token owns them, and a citizen seeing the ministry's own green on a success " +
      "state is better brand than the leftover Material green this replaced. To undo: give " +
      "success its own anchor at least 30 degrees off 154.",
  ],
  [
    // Keys are the pair names sorted alphabetically — see `key()` below.
    "info|primary",
    "Info IS the blue family, as in IBM Carbon and Adobe Spectrum. They measured 3 degrees " +
      "apart BEFORE this gate existed, so this records a pre-existing decision rather than " +
      "blessing a new one. It is defensible — an informational callout reading as brand-blue " +
      "is conventional — but it does mean `bg/status/info/*` carries no signal `bg/brand/" +
      "primary/*` does not. Worth revisiting: moving info to cyan (~200 degrees) would " +
      "separate it and cost nothing, since no other family sits there.",
  ],
]);

/**
 * Pairs that fail the threshold and are KNOWN. May only shrink; the stale-entry test below
 * fails once a pair is fixed and its line is not deleted.
 */
const SEPARATION_LEDGER = new Map([
  [
    "error|secondary",
    "India Saffron (hue 41) against the danger red (hue 29): 12 degrees and dE 4.3 at the " +
      "`subtler` rung. Red and orange are adjacent hues, so this cannot be fixed by moving " +
      "saffron — which is mandated by the logo and not ours to move.\n\n" +
      "This entry used to say the fix was the DANGER ramp, re-anchored deeper and redder. When " +
      "that ramp WAS regenerated on 2026-08-11 the claim was tested by sweeping the whole " +
      "parameter space — every anchor from #ec5042 to #b3261e, every rung, every lightness " +
      "range — and the best separation reachable at the `subtler` rung was dE 11.3, still short " +
      "of the threshold of 12, and only by starting the ramp at L* 90, which makes the error " +
      "banner background a saturated pink unlike any other family's. So the old note was " +
      "wrong: at the pale end of two adjacent hues there is no ramp shape that pulls them " +
      "apart, because both rungs are nearly white and nearly white is one colour.\n\n" +
      "What the rebuild did do is not make it worse: `lightest` is 94 rather than the 95-97 " +
      "used elsewhere precisely to hold dE at 4.3, against 4.0 before. A real fix has to change " +
      "what one of the two families IS — the candidate is moving danger toward a true crimson " +
      "(hue ~15) — and that is a decision about the estate's error colour, not a ramp shape.",
  ],

  /* ---- DBIM conformance previews (2026-08-11). Brand-scoped; see the note above. ---- */
  [
    "dbim-cinnamon-red::error|primary",
    "2 degrees and dE 0.9 at the `subtle` rung (#faaaaa against #fea7a5). This is the most " +
      "consequential finding the DBIM preview produced: a department that selects Cinnamon Red " +
      "as its primary group has a brand colour its users cannot tell apart from its ERROR " +
      "colour, at every rung. Both halves are DBIM's own — the group is Figure 1's, the error " +
      "is Coral Red #DC3545 from Table 1 — so DBIM's palette collides with itself for this one " +
      "selection. Nothing here can fix it: the remedy is to choose a different group, which is " +
      "exactly the decision this preview exists to inform.",
  ],
  [
    "dbim-cinnamon-red::primary|secondary",
    "24 degrees and dE 2.8 at the `subtler` rung (#fcdada against #ffd4c4). The same adjacency " +
      "the estate's own error|secondary entry above describes — India Saffron against a red — " +
      "except here it is the BRAND primary that has moved into saffron's neighbourhood rather " +
      "than the error status. A department on Cinnamon Red would find its primary and secondary " +
      "actions hard to tell apart at the pale rungs, on top of the error collision above.",
  ],
  [
    "dbim-chrome-yellow::primary|warning",
    "10 degrees and dE 2.0 at the `bolder` rung (#916100 against #886600) — the filled brand " +
      "button and the filled warning chip, side by side, the same colour. Chrome Yellow's key " +
      "colour sits at hue 77 and DBIM's own Mustard Yellow warning at hue 85. Same shape as the " +
      "Cinnamon Red finding and the same remedy: this is what selecting that group costs.",
  ],
]);

/*
 * DBIM CONFORMANCE FINDINGS — brand-scoped, and that scoping is the point.
 *
 * The six `dbim-*` brands are a demo-only preview of DBIM's published palette (see
 * `build/brand-ramps.mjs`). DBIM's rule is that an organisation picks ONE primary group; these
 * modes exist so the consequences of each choice can be seen rather than argued about, and
 * three of those consequences are collisions that DBIM's own accessibility rule 4 would care
 * about. They are recorded here with their measurements instead of being designed away,
 * because designing them away would mean altering DBIM's colours — at which point the preview
 * stops previewing anything.
 *
 * Every entry is scoped `<brand>::<pair>`. An unscoped `<pair>` key silences that pair in
 * EVERY brand, which is right for a defect in the shared palette and badly wrong for one that
 * only exists in a conformance demo: an unscoped `error|primary` entry would have hidden a
 * genuine C-02 regression in the shipping Blue and Navy brands behind a DBIM finding.
 */
const key = (a, b) => [a, b].sort().join("|");
const scopedKey = (brand, a, b) => `${brand}::${key(a, b)}`;

/** Every family pair, at every rung, in every brand, with its worst separation. */
function measure() {
  const names = Object.keys(FAMILIES);
  const out = [];
  for (const [brand, map] of BRANDS) {
    const resolve = resolver(map);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        let worst = null;
        for (const rung of RUNGS) {
          const a = resolve(`--sa-${FAMILIES[names[i]]}-${rung}`);
          const b = resolve(`--sa-${FAMILIES[names[j]]}-${rung}`);
          if (!a || !b || !a.startsWith("#") || !b.startsWith("#")) continue;
          const dE = deltaE(a, b);
          const dH = Math.abs(hueDelta(hexToOklch(a).H, hexToOklch(b).H));
          const separated = dH >= MIN_HUE_DEGREES || dE >= MIN_DELTA_E;
          if (!worst || dE < worst.dE) worst = { brand, rung, a, b, dE, dH, separated };
        }
        if (worst) out.push({ ...worst, pair: key(names[i], names[j]) });
      }
    }
  }
  return out;
}

const measured = measure();

test("the gate can see the palette at all", () => {
  assert.ok(
    measured.length >= 40,
    `expected every family pair in both brands, measured ${measured.length}. A near-empty ` +
      `sweep means the selectors moved and this gate is silently proving nothing.`,
  );
});

test("no two colour families collide, in any brand, at any matched rung", () => {
  const failures = measured
    .filter((m) => !m.separated)
    .filter(
      (m) =>
        !INTENTIONAL_UNIONS.has(m.pair) &&
        !SEPARATION_LEDGER.has(m.pair) &&
        !SEPARATION_LEDGER.has(`${m.brand}::${m.pair}`),
    )
    .map(
      (m) =>
        `[${m.brand}] ${m.pair.replace("|", " vs ")} @ ${m.rung}: ${m.a} / ${m.b} — ` +
        `${m.dH.toFixed(0)}deg apart, dE ${m.dE.toFixed(1)} ` +
        `(need >=${MIN_HUE_DEGREES}deg OR dE >=${MIN_DELTA_E})`,
    );

  assert.deepEqual(
    failures,
    [],
    `${failures.length} colour families are indistinguishable from each other. This is the ` +
      `C-02 class of defect: a user cannot tell what a colour MEANS. Fix the ramp — do not ` +
      `add to SEPARATION_LEDGER, which may only shrink, and do not add to INTENTIONAL_UNIONS ` +
      `unless the two families genuinely should be one colour.`,
  );
});

test("every intentional union is still actually a union", () => {
  const notUnions = [...INTENTIONAL_UNIONS.keys()].filter((pair) => {
    const rows = measured.filter((m) => m.pair === pair);
    return rows.length > 0 && rows.every((m) => m.separated);
  });
  assert.deepEqual(
    notUnions,
    [],
    `these pairs are declared as deliberately-identical but now measure as SEPARATED. Either ` +
      `the union was undone on purpose — delete the entry — or a ramp moved by accident.`,
  );
});

test("the separation ledger has no stale entries", () => {
  const fixed = [...SEPARATION_LEDGER.keys()].filter((entry) => {
    // A scoped entry is checked only against the brand it names, so fixing the pair in one
    // brand cannot prune a finding that still reproduces in another.
    const [brand, pair] = entry.includes("::") ? entry.split("::") : [null, entry];
    const rows = measured.filter((m) => m.pair === pair && (!brand || m.brand === brand));
    return rows.length > 0 && rows.every((m) => m.separated);
  });
  assert.deepEqual(
    fixed,
    [],
    `these pairs now clear the threshold — delete their lines. A ledger that outlives its ` +
      `defects stops being read.`,
  );
});

test("the ledger and the union list are disjoint", () => {
  const both = [...SEPARATION_LEDGER.keys()].filter((k) => INTENTIONAL_UNIONS.has(k));
  assert.deepEqual(
    both,
    [],
    `a pair cannot be both a deliberate union and a known defect — decide which it is.`,
  );
});

test("C-02 stays fixed: the brand axis cannot rotate a brand family onto a status family", () => {
  // The specific regression, pinned by name rather than left to the general sweep. Secondary
  // and accent are brand-INVARIANT now, so their values must be byte-identical across brands.
  for (const family of ["secondary", "accent"]) {
    const values = BRANDS.map(([brand, map]) => {
      const resolve = resolver(map);
      return [brand, RUNGS.map((r) => resolve(`--sa-${FAMILIES[family]}-${r}`)).join(",")];
    });
    assert.equal(
      values[0][1],
      values[1][1],
      `bg/brand/${family}/* differs between the Blue and Navy brands. Both are SAMAVESH logo ` +
        `colours and are brand-invariant by design — a brand swap that changes them is how ` +
        `C-02 happened, with Navy's secondary landing 1.00:1 from the success colour.`,
    );
  }
});
