import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolveAxisCombinations, resolveContract } from "./lib/css-resolve.mjs";

/**
 * THE VISUAL CONTRACT.
 *
 * Token names are allowed to move. Rendered pixels are not. This test pins the
 * fully-resolved literal value of every custom property, in every selector context,
 * against a committed fixture.
 *
 * When you rename a token, the test does not just go quiet — you must declare the
 * rename in RENAMES below, and the test then asserts the OLD name's old value equals
 * the NEW name's new value. A rename that changes what renders cannot pass.
 *
 * Regenerate the fixture deliberately, never from inside the test:
 *   node test/lib/write-visual-contract.mjs
 */

const cssPath = new URL("../dist/tokens.css", import.meta.url);
const fixturePath = new URL("./visual-contract.fixture.json", import.meta.url);

const cssText = readFileSync(cssPath, "utf8");
const expected = JSON.parse(readFileSync(fixturePath, "utf8"));
const actual = resolveContract(cssText);

/**
 * old canonical name -> new canonical name.
 *
 * Entries here are claims that a rename was value-preserving. Each one is checked,
 * not trusted: the test asserts the old name's OLD value equals the new name's NEW value.
 *
 * 2026-08-10 — resolving the `default` ambiguity. `default` occupied three slot
 * dictionaries at once (prominence, state, link variant), so `text/link/visited/default`
 * bound its last segment to prominence and never reached the state slot. The prominence
 * canonical became `base` and the link variant became `brand`; `default` is now a state
 * and nothing else. Consumer-facing `--ds-*` and `--ux4g-*` names are deliberately absent
 * from this list — the compat layer was retargeted, not renamed.
 */
const RENAMES = {
  // 2026-08-18 — THE RADIUS LADDER WAS VALUE-NAMED, matching the spacing ladder renamed the
  // same day. `shape/md` -> `shape/8`, and the hidden Tier-1 `ref/radius/*` with it.
  //
  // The reasoning differs from spacing's and is worth stating, because the FIRST review of this
  // rename reached the opposite conclusion and was wrong. Radius has no label COLLISION —
  // there is one semantic family, so `shape/md` was never ambiguous. The argument for keeping
  // T-shirt names was that they carry a ROLE (`sm` = input, `md` = button) that a number does
  // not. That argument fails on inspection: the role layer ALREADY EXISTS at Tier 3, as
  // `control/radius` and `cmp/*/radius`. A button binds `cmp/button/radius`, never `shape/md`.
  // So role-naming was never Tier 2's job, and value-naming Tier 2 costs nothing while buying
  // the same expandability spacing gained — plus one mental model across both ladders instead
  // of two.
  //
  // `full` is deliberately NOT renamed. It is a sentinel meaning "fully rounded", not a
  // measurement, so `shape/999` would assert a precision that does not exist. S7 in
  // radius-linkage.test.mjs asserts it is the ONLY permitted non-numeric rung, so a second
  // exception cannot be added quietly.
  //
  // The 22 entries were PROVEN value-preserving against the un-regenerated fixture — all nine
  // assertions passed with the OLD fixture still in place — and only then was it rebaselined.
  // Per the note at the top of this block they are deleted rather than left to outlive the
  // move; `git show` this commit to see them.

  // 2026-08-18 — THE SPACING LADDER WAS VALUE-NAMED. `padding/m` -> `padding/16`, and 16px in
  // every other family too. Two measured reasons, both structural rather than cosmetic.
  //
  // (1) COLLISION. Each Tier-2 family mapped the SAME label to a DIFFERENT value: `l` was 16 in
  // inline, 24 in stack, 20 in padding and 56 in section — 7 of 11 labels collided, and the
  // inverse was as bad (24px answered to four different names). That is inherited verbatim from
  // UX4G 3.0, whose own published contract has --ux4g-inline-l=16 and --ux4g-stack-l=24.
  // standards-precedence.md puts UX4G at authority tier 4: where a standard forces a worse
  // interface, quality wins and the divergence is recorded. This is that.
  //
  // (2) EXPANDABILITY. A T-shirt ramp has no slot between adjacent rungs, so every insertion
  // renames everything above it. That happened TWICE on 2026-08-17 — inline gained 24, and
  // padding needed a 6 it could not have. A numeric ladder absorbs any step for free.
  //
  // UX4G conformance is untouched: the --ux4g-* layer is emitted independently and never reads
  // these names, so ux4g-parity.test.mjs asserts the same contract before and after.
  //
  // Every entry below is value-preserving, which is the point of declaring them here BEFORE the
  // fixture is rebaselined — the old fixture is the evidence.
  // The 50 entries were PROVEN value-preserving against the un-regenerated fixture, then the
  // fixture was rebaselined — so per the note at the top of this block they are deleted rather
  // than left to outlive the move. `git show` this commit to see them.
  // 2026-08-17 — `inline` gained a 24 step, the only spacing family that lacked one
  // (`stack/l` and `padding/xl` both have it), so every 24px horizontal gap had been
  // reaching past the semantic layer to `ref/space/2xl`. A t-shirt ramp has no slot between
  // `l` and `xl`, so inserting a step pushes the ones above it up a name: the old
  // `inline/xl` (32) became `inline/2xl`. It was PROVEN value-preserving here first — the
  // old name's old value equalled the new name's new value in all 24 selector contexts —
  // and only then baselined, so per the note above its entry is deleted rather than left to
  // outlive the move. The proof is in this commit, not in a list that would only grow.
  //
  // The matching 28 step for `padding` was attempted the same day and ABANDONED — that
  // family already uses all eleven canonical rungs and `space` has no 28. See the note on
  // `padding/2xl` in semantic.json. It is not listed here because it did not happen.

  // 2026-08-12 — icon-size md/lg were renamed to their pixel value (24/32). They were PROVEN
  // value-preserving here before the fixture was rebaselined, so per the note above their
  // entries are deleted rather than left to outlive the move.

  // 2026-08-11 — `gov-` dropped from every colour name (gov-blue/gov-blue-dark/gov-blue-tonal/
  // gov-navy/gov-yellow -> primary/primary-dark/primary-tonal/navy/yellow, 330 call sites).
  // A colour is named for what it DOES in the system, not for who owns the system, and the
  // prefix carried no information: every colour here is a government colour. `gov-blue` and
  // `primary` were already the same value, so that pair was a merge, not a remap. The two
  // --ds-* renames were PROVEN value-preserving here before being baselined, so their
  // entries are deleted per the note above.

  // 2026-08-11 — the neutral endpoints renumbered to match UX4G 3.0 (pure white at `0`, pure
  // black at `1000`, near-black shade at `950`); we had them one slot high. All six were
  // PROVEN value-preserving here first — old name's old value === new name's new value, in
  // every selector context — and only then baselined, so their entries are deleted per the
  // note above. The proof is in this commit, not in a list that would otherwise only grow.

  // NOTE — the 2026-08-10 value-naming of the type primitives (`font/size/400` -> `font/size/16`)
  // is deliberately NOT listed here, because it was a rename AND a unit change: the steps now
  // alias the new `size/*` scale, which carries UX4G's rem values. RENAMES asserts the old and
  // new resolve identically, and `16px` -> `1rem` does not, so claiming it here would be false.
  //
  // The fixture was re-baselined instead. Safe, and an improvement: nothing renders from these
  // (zero `var(--sa-ref-font-size-*)` call sites), and their one consumer is the UX4G parity
  // layer — where `--ux4g-line-height-16` IS `1rem` in UX4G's own contract, so binding a rem
  // makes conformance more exact than binding a px did.

  // Otherwise empty, and that is the healthy state. Every rename this file has carried —
  // `spacing/*`→`space/*`, the brand ramps' `light|dark`→`blue|navy`, `color/chart/*`→`chart/*`,
  // and the ordinal ladder — was PROVEN here first (old name's old value === new name's new
  // value, in every selector context) and only then baselined into the fixture. The proof
  // lives in the commits and the changelog, not in a list that would otherwise only grow.
  //
  // Add an entry only for a rename that has not yet been baselined, and delete it once it has:
  // the stale-entry test below will tell you when.
  //
  // NOT a place for a VALUE change. A token that renders differently must move the fixture
  // with a written reason, never be laundered through here as if it had only been renamed.
};

/**
 * Tokens DELETED on purpose, with the reason.
 *
 * A rename and a deletion are different claims and were being treated the same: the only way
 * to retire a token was to quietly re-baseline the fixture, which is indistinguishable from
 * losing one by accident. Listing them makes the removal reviewable, and the stale-entry test
 * below stops the list outliving the tokens.
 *
 * The bar for an entry is EVIDENCE OF ZERO CONSUMERS, not "we think nobody uses it".
 */
/*
 * VALUE RECONCILED ON MERGE — 2026-08-19.
 *
 * `cmp/accessibilityBar/hoverBg` moves 12% -> 8% white in every selector context, and the
 * fixture is rebaselined to match. This is a MERGE RESOLUTION, not a new design decision.
 *
 * Two branches disagreed about the same wash. main's 33cbb4f corrected it from 12% to 8%,
 * against the published Figma variable (`overlay/on-brand/hover`, #ffffff14) and the
 * component's own States documentation. This branch, working from a base that predated that
 * commit, re-created the wash at 12% while introducing the Tier-2 `overlay/brand/*` family
 * and recorded "the component has always rendered 0.12" — true of its base, not of main.
 *
 * main's corrected value stands; this branch's Tier-2 family stands. `hoverBg` now aliases
 * `overlay/brand/hover` at 8%, so the value lives in one place instead of two.
 */
const REMOVED = {
  // 2026-08-18 — the AccessibilityBar adopted the shared `Divider` component, which was
  // built the same day. Figma had instanced a `Divider` master inside the bar from the
  // start; the code hand-rolled a styled <span> because no Divider existed in the design
  // system at all. With the real component in place, a rule's thickness and colour are
  // Divider's business, so the bar's three private divider tokens are retired.
  //
  // ZERO CONSUMERS, verified before deletion: a grep across packages/ and apps/ for
  // `accessibilityBar-divider` returned only stale .next build artefacts, no source. The
  // three matching Figma variables were deleted in the same pass (all UNPUBLISHED, created
  // earlier the same day and never bound).
  //
  // The VALUES did not disappear — they moved to where they belong:
  //   dividerWidth  -> cmp/divider/width (aliases ref/border-width/hairline, same 1px)
  //   dividerHeight -> the consumer's business; the bar passes length={20}, which is what
  //                    Figma draws, and Divider stretches by default everywhere else
  //   dividerColor  -> border/neutral/inverse/subtle, now a real Tier-2 token in code
  //                    instead of a hand-rolled white rgba
  "--sa-cmp-accessibilityBar-dividerWidth": "retired; the bar renders <Divider>, whose thickness is --sa-cmp-divider-width (same 1px hairline)",
  "--sa-cmp-accessibilityBar-dividerHeight": "retired; length is the consumer's call — the bar passes length={20}, Divider stretches by default",
  "--sa-cmp-accessibilityBar-dividerColor": "retired; the tone is --sa-border-neutral-inverse-subtle, the same white @ 40%, now a Tier-2 token",

  // 2026-08-12 — the icon scale was renamed from t-shirt letters to pixel values, so these
  // three NAMES are gone. Their VALUES are not: 16, 20 and 40 ship as --sa-icon-size-16/20/40.
  // An earlier pass deleted those values outright, reading DBIM 3.7.i as exclusive; that was
  // withdrawn the same day. DBIM 3.4 publishes an asset bank in four sizes, it does not forbid
  // a 16px inline glyph — and 16px beside 14px body text is 358 of 713 call sites because it
  // is the right size there. A standard's list is a floor, not a ceiling.
  // See .claude/rules/standards-precedence.md.
  "--sa-icon-size-xs": "renamed to --sa-icon-size-16; the value ships unchanged",
  "--sa-icon-size-sm": "renamed to --sa-icon-size-20; the value ships unchanged",
  "--sa-icon-size-xl": "renamed to --sa-icon-size-40; the value ships unchanged",

  // The legacy `--ds-*` vocabulary, retired 2026-08-12. All 341 names are gone from every
  // generated artifact. This was not a rename: each name was a pure alias, and all 3,561
  // call sites were migrated to the canonical `--sa-*` token each one already resolved to
  // (tools/token-migration/migrate.py, mapping at tools/token-migration/mapping.json), so
  // nothing rendered differently. They are declared here rather than in RENAMES because the
  // names do not MOVE — the vocabulary ceases to exist.
  ...Object.fromEntries(
    [
      "--ds-border",
      "--ds-border-strong",
      "--ds-chart-axis",
      "--ds-chart-cat-1",
      "--ds-chart-cat-10",
      "--ds-chart-cat-11",
      "--ds-chart-cat-12",
      "--ds-chart-cat-2",
      "--ds-chart-cat-3",
      "--ds-chart-cat-4",
      "--ds-chart-cat-5",
      "--ds-chart-cat-6",
      "--ds-chart-cat-7",
      "--ds-chart-cat-8",
      "--ds-chart-cat-9",
      "--ds-chart-div-mid",
      "--ds-chart-div-neg",
      "--ds-chart-div-neg-soft",
      "--ds-chart-div-neg-strong",
      "--ds-chart-div-pos",
      "--ds-chart-div-pos-soft",
      "--ds-chart-div-pos-strong",
      "--ds-chart-grid",
      "--ds-chart-region-empty",
      "--ds-chart-region-stroke",
      "--ds-chart-seq-100",
      "--ds-chart-seq-200",
      "--ds-chart-seq-300",
      "--ds-chart-seq-400",
      "--ds-chart-seq-50",
      "--ds-chart-seq-500",
      "--ds-chart-seq-600",
      "--ds-chart-seq-700",
      "--ds-chart-seq-800",
      "--ds-chart-seq-900",
      "--ds-chart-tooltip-bg",
      "--ds-chart-tooltip-ink",
      "--ds-chart-trend-down",
      "--ds-chart-trend-flat",
      "--ds-chart-trend-up",
      "--ds-control-height",
      "--ds-danger",
      "--ds-danger-100",
      "--ds-danger-200",
      "--ds-danger-300",
      "--ds-danger-400",
      "--ds-danger-50",
      "--ds-danger-500",
      "--ds-danger-600",
      "--ds-danger-700",
      "--ds-danger-800",
      "--ds-danger-900",
      "--ds-danger-tonal",
      "--ds-duration-base",
      "--ds-duration-fast",
      "--ds-duration-slow",
      "--ds-easing-in",
      "--ds-easing-in-out",
      "--ds-easing-out",
      "--ds-font-display",
      "--ds-font-mono",
      "--ds-font-sans",
      "--ds-info",
      "--ds-info-100",
      "--ds-info-200",
      "--ds-info-300",
      "--ds-info-400",
      "--ds-info-50",
      "--ds-info-500",
      "--ds-info-600",
      "--ds-info-700",
      "--ds-info-800",
      "--ds-info-900",
      "--ds-info-tonal",
      "--ds-ink",
      "--ds-ink-info",
      "--ds-ink-muted",
      "--ds-ink-strong",
      "--ds-inline-2xs",
      "--ds-inline-l",
      "--ds-inline-m",
      "--ds-inline-none",
      "--ds-inline-s",
      "--ds-inline-xl",
      "--ds-inline-xs",
      "--ds-leading-body-1",
      "--ds-leading-body-2",
      "--ds-leading-body-3",
      "--ds-leading-body1",
      "--ds-leading-body2",
      "--ds-leading-display",
      "--ds-leading-display1",
      "--ds-leading-display2",
      "--ds-leading-display3",
      "--ds-leading-headline",
      "--ds-leading-headline1",
      "--ds-leading-headline2",
      "--ds-leading-headline3",
      "--ds-leading-label-1",
      "--ds-leading-label-3",
      "--ds-leading-label1",
      "--ds-leading-label2",
      "--ds-leading-title-1",
      "--ds-leading-title-2",
      "--ds-leading-title1",
      "--ds-leading-title2",
      "--ds-link",
      "--ds-navy",
      "--ds-neutral-0",
      "--ds-neutral-100",
      "--ds-neutral-1000",
      "--ds-neutral-1100",
      "--ds-neutral-200",
      "--ds-neutral-300",
      "--ds-neutral-400",
      "--ds-neutral-50",
      "--ds-neutral-500",
      "--ds-neutral-600",
      "--ds-neutral-700",
      "--ds-neutral-800",
      "--ds-neutral-900",
      "--ds-on-primary",
      "--ds-overlay",
      "--ds-padding-2xl",
      "--ds-padding-2xs",
      "--ds-padding-3xl",
      "--ds-padding-3xs",
      "--ds-padding-4xl",
      "--ds-padding-l",
      "--ds-padding-m",
      "--ds-padding-none",
      "--ds-padding-s",
      "--ds-padding-xl",
      "--ds-padding-xs",
      "--ds-primary",
      "--ds-primary-100",
      "--ds-primary-200",
      "--ds-primary-300",
      "--ds-primary-400",
      "--ds-primary-50",
      "--ds-primary-500",
      "--ds-primary-600",
      "--ds-primary-700",
      "--ds-primary-800",
      "--ds-primary-900",
      "--ds-primary-dark",
      "--ds-primary-hover",
      "--ds-primary-ring",
      "--ds-primary-tonal",
      "--ds-radius-2xl",
      "--ds-radius-3xl",
      "--ds-radius-4xl",
      "--ds-radius-5xl",
      "--ds-radius-full",
      "--ds-radius-lg",
      "--ds-radius-md",
      "--ds-radius-none",
      "--ds-radius-sm",
      "--ds-radius-xl",
      "--ds-radius-xs",
      "--ds-radius-xxs",
      "--ds-saffron",
      "--ds-saffron-dark",
      "--ds-saffron-light",
      "--ds-secondary-100",
      "--ds-secondary-200",
      "--ds-secondary-300",
      "--ds-secondary-400",
      "--ds-secondary-50",
      "--ds-secondary-500",
      "--ds-secondary-600",
      "--ds-secondary-700",
      "--ds-secondary-800",
      "--ds-secondary-900",
      "--ds-section-2xl",
      "--ds-section-l",
      "--ds-section-m",
      "--ds-section-none",
      "--ds-section-s",
      "--ds-section-xl",
      "--ds-section-xs",
      "--ds-shadow-lg",
      "--ds-shadow-md",
      "--ds-shadow-none",
      "--ds-shadow-sm",
      "--ds-shadow-xl",
      "--ds-shadow-xs",
      "--ds-spacing-10xl",
      "--ds-spacing-11xl",
      "--ds-spacing-2xl",
      "--ds-spacing-3xl",
      "--ds-spacing-4xl",
      "--ds-spacing-5xl",
      "--ds-spacing-6xl",
      "--ds-spacing-7xl",
      "--ds-spacing-8xl",
      "--ds-spacing-9xl",
      "--ds-spacing-lg",
      "--ds-spacing-md",
      "--ds-spacing-none",
      "--ds-spacing-sm",
      "--ds-spacing-xl",
      "--ds-spacing-xs",
      "--ds-spacing-xxs",
      "--ds-stack-2xs",
      "--ds-stack-l",
      "--ds-stack-m",
      "--ds-stack-none",
      "--ds-stack-s",
      "--ds-stack-xl",
      "--ds-stack-xs",
      "--ds-success",
      "--ds-success-100",
      "--ds-success-200",
      "--ds-success-300",
      "--ds-success-400",
      "--ds-success-50",
      "--ds-success-500",
      "--ds-success-600",
      "--ds-success-700",
      "--ds-success-800",
      "--ds-success-900",
      "--ds-success-tonal",
      "--ds-surface",
      "--ds-surface-muted",
      "--ds-text-body-1",
      "--ds-text-body-2",
      "--ds-text-body-3",
      "--ds-text-body1",
      "--ds-text-body2",
      "--ds-text-body3",
      "--ds-text-display",
      "--ds-text-display1",
      "--ds-text-display2",
      "--ds-text-display3",
      "--ds-text-display4",
      "--ds-text-display5",
      "--ds-text-display6",
      "--ds-text-headline",
      "--ds-text-headline1",
      "--ds-text-headline2",
      "--ds-text-headline3",
      "--ds-text-headline4",
      "--ds-text-headline5",
      "--ds-text-headline6",
      "--ds-text-label-1",
      "--ds-text-label-3",
      "--ds-text-label1",
      "--ds-text-label2",
      "--ds-text-label3",
      "--ds-text-title-1",
      "--ds-text-title-2",
      "--ds-text-title1",
      "--ds-text-title2",
      "--ds-text-title3",
      "--ds-type-body-1-lh",
      "--ds-type-body-1-para",
      "--ds-type-body-1-size",
      "--ds-type-body-2-lh",
      "--ds-type-body-2-para",
      "--ds-type-body-2-size",
      "--ds-type-body-3-lh",
      "--ds-type-body-3-para",
      "--ds-type-body-3-size",
      "--ds-type-body-tracking",
      "--ds-type-display-1-lh",
      "--ds-type-display-1-para",
      "--ds-type-display-1-size",
      "--ds-type-display-1-tracking",
      "--ds-type-display-2-lh",
      "--ds-type-display-2-para",
      "--ds-type-display-2-size",
      "--ds-type-display-2-tracking",
      "--ds-type-display-3-lh",
      "--ds-type-display-3-para",
      "--ds-type-display-3-size",
      "--ds-type-display-3-tracking",
      "--ds-type-display-4-lh",
      "--ds-type-display-4-para",
      "--ds-type-display-4-size",
      "--ds-type-display-4-tracking",
      "--ds-type-display-5-lh",
      "--ds-type-display-5-para",
      "--ds-type-display-5-size",
      "--ds-type-display-5-tracking",
      "--ds-type-display-6-lh",
      "--ds-type-display-6-para",
      "--ds-type-display-6-size",
      "--ds-type-display-6-tracking",
      "--ds-type-heading-tracking",
      "--ds-type-headline-1-lh",
      "--ds-type-headline-1-para",
      "--ds-type-headline-1-size",
      "--ds-type-headline-2-lh",
      "--ds-type-headline-2-para",
      "--ds-type-headline-2-size",
      "--ds-type-headline-3-lh",
      "--ds-type-headline-3-para",
      "--ds-type-headline-3-size",
      "--ds-type-headline-4-lh",
      "--ds-type-headline-4-para",
      "--ds-type-headline-4-size",
      "--ds-type-headline-5-lh",
      "--ds-type-headline-5-para",
      "--ds-type-headline-5-size",
      "--ds-type-headline-6-lh",
      "--ds-type-headline-6-para",
      "--ds-type-headline-6-size",
      "--ds-type-label-1-lh",
      "--ds-type-label-1-para",
      "--ds-type-label-1-size",
      "--ds-type-label-2-lh",
      "--ds-type-label-2-para",
      "--ds-type-label-2-size",
      "--ds-type-label-3-lh",
      "--ds-type-label-3-para",
      "--ds-type-label-3-size",
      "--ds-type-label-tracking",
      "--ds-type-title-1-lh",
      "--ds-type-title-1-para",
      "--ds-type-title-1-size",
      "--ds-type-title-2-lh",
      "--ds-type-title-2-para",
      "--ds-type-title-2-size",
      "--ds-type-title-3-lh",
      "--ds-type-title-3-para",
      "--ds-type-title-3-size",
      "--ds-type-title-tracking",
      "--ds-warning",
      "--ds-warning-100",
      "--ds-warning-200",
      "--ds-warning-300",
      "--ds-warning-400",
      "--ds-warning-50",
      "--ds-warning-500",
      "--ds-warning-600",
      "--ds-warning-700",
      "--ds-warning-800",
      "--ds-warning-900",
      "--ds-warning-tonal",
      "--ds-yellow"
    ].map((n) => [n, "legacy --ds-* vocabulary retired 2026-08-12; use the canonical --sa-* token"]),
  ),
  // The fixed 5-role type scale. It shadowed the fluid 21-role scale under a friendlier name
  // (`--sa-type-display-size` beside `--sa-type-display-1-size`), aliased the RAW size steps so
  // it could never respond to surface or breakpoint, and had zero consumers — verified with an
  // exact-match grep for `var(--sa-type-<role>-<prop>)` across packages/ and apps/, including
  // the generated sheet itself. Anything reaching for type by name now gets the responsive one.
  ...Object.fromEntries(
    ["display", "title1", "headline", "body1", "body2"].flatMap((role) =>
      ["size", "leading", "weight"].map((prop) => [
        `--sa-type-${role}-${prop}`,
        "dead fixed type scale, 0 consumers — superseded by the fluid --sa-type-<role>-<n>-* roles",
      ]),
    ),
  ),
};

/** Cap the noise when a whole namespace shifts at once. */
function summarise(problems) {
  const shown = problems.slice(0, 15).join("\n  ");
  const rest = problems.length > 15 ? `\n  …and ${problems.length - 15} more` : "";
  return `\n  ${shown}${rest}`;
}

test("every selector context in the fixture is still emitted", () => {
  const missing = Object.keys(expected).filter((sel) => !(sel in actual));
  assert.deepEqual(
    missing,
    [],
    `these selector blocks vanished, so anything they themed reverts to :root:${summarise(missing)}`,
  );
});

test("no token changes what it renders, in any selector context", () => {
  const drifted = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) continue; // reported by the selector test above

    for (const [name, wasValue] of Object.entries(props)) {
      const nowName = RENAMES[name] ?? name;
      const nowValue = current[nowName];

      if (nowValue === undefined) continue; // reported by the disappearance test below
      if (nowValue !== wasValue) {
        drifted.push(
          `${selector} ${name}${nowName === name ? "" : ` -> ${nowName}`}: ${wasValue} -> ${nowValue}`,
        );
      }
    }
  }

  assert.deepEqual(drifted, [], `these tokens resolve to a different value than before:${summarise(drifted)}`);
});

test("no token disappears without a declared rename", () => {
  const dropped = [];

  for (const [selector, props] of Object.entries(expected)) {
    const current = actual[selector];
    if (!current) continue;

    for (const name of Object.keys(props)) {
      const nowName = RENAMES[name] ?? name;
      if (current[nowName] !== undefined) continue;
      if (REMOVED[name]) continue;
      dropped.push(
        nowName === name
          ? `${selector} ${name}`
          : `${selector} ${name} -> ${nowName} (declared rename, but the new name is not emitted)`,
      );
    }
  }

  assert.deepEqual(
    dropped,
    [],
    `these tokens are gone. Add an entry to RENAMES if one MOVED, or to REMOVED — with ` +
      `evidence of zero consumers — if one was retired:${summarise(dropped)}`,
  );
});

test("every declared removal is actually gone — REMOVED has no stale entries", () => {
  // Symmetrical with the rename ratchet. A token listed as removed that still ships means the
  // list has stopped describing the system, and the next real deletion hides inside it.
  const stillHere = Object.keys(REMOVED).filter((name) =>
    Object.values(actual).some((props) => props[name] !== undefined),
  );
  assert.deepEqual(
    stillHere,
    [],
    `${stillHere.length} token(s) are listed in REMOVED but still emitted — delete the entries`,
  );
});

test("every declared rename actually corresponds to a token that moved", () => {
  const stale = Object.keys(RENAMES).filter((name) =>
    Object.values(expected).every((props) => props[name] === undefined),
  );

  assert.deepEqual(stale, [], `RENAMES lists names that were never in the contract:${summarise(stale)}`);
});

test("theming axes layer cleanly when a page sets more than one at once", () => {
  // A portal renders data-brand AND data-theme AND data-surface together. 41 properties
  // in this sheet are declared by both the brand axis and the theme axis, so each has an
  // opinion about them, and the single-axis contexts above cannot say who wins.
  //
  // The invariant: a combined context's value always equals the value from one of its own
  // active axes. That holds today, which is why combinations are not pinned separately.
  // If it ever breaks, some pair of axes has started INTERACTING — producing a colour
  // nobody declared — and that is a real visual bug that no single-axis test can see.
  const singles = actual;
  const surprises = [];

  for (const { key, active, resolved } of resolveAxisCombinations(cssText)) {
    for (const [prop, value] of Object.entries(resolved)) {
      const explained =
        value === singles[":root"]?.[prop] || active.some((sel) => singles[sel]?.[prop] === value);
      if (!explained) {
        surprises.push(`${key} ${prop}: ${value} — matches neither :root nor any active axis`);
      }
    }
  }

  assert.deepEqual(
    surprises,
    [],
    `combining theming axes produced values no single axis explains:${summarise(surprises)}`,
  );
});

test("the Tailwind v4 @theme points at tokens that actually exist", () => {
  // dist/tokens-tailwind.css is a public export (@mosje/tokens/tailwind-v4). It once
  // hand-rolled its target names as `--sa-${path}`, which dropped the tier marker, so 111
  // entries aliased `--sa-color-*` while the sheet declares `--sa-ref-color-*`. Every
  // Tailwind colour utility built on those resolved to nothing, and no test noticed
  // because nothing in the estate imports this file yet.
  const twCss = readFileSync(new URL("../dist/tokens-tailwind.css", import.meta.url), "utf8");
  const declared = new Set([...cssText.matchAll(/^\s*(--[a-zA-Z0-9-]+)\s*:/gm)].map((m) => m[1]));
  const dangling = [
    ...new Set([...twCss.matchAll(/var\((--sa-[a-zA-Z0-9-]+)/g)].map((m) => m[1])),
  ].filter((name) => !declared.has(name));

  assert.deepEqual(
    dangling,
    [],
    `the @theme block aliases custom properties tokens.css never declares, so these ` +
      `utilities resolve to nothing. Build the target name with toCssName/tierOfFile, ` +
      `never by hand:${summarise(dangling)}`,
  );
});

test("the sheet stays flat, so the resolver cannot silently mis-parse it", () => {
  // resolveContract() matches `selector { decls }` with a regex that assumes no nesting.
  // An @media / @supports / CSS-nesting block would not blow up — it would parse into
  // something subtly wrong, and this whole contract would go quietly green on garbage.
  // Cheaper to forbid the shape than to make the parser clever: if the generator ever
  // needs an at-rule, that is the moment to reach for a real CSS parser here.
  const atRules = [...cssText.matchAll(/^\s*@[a-z-]+/gim)].map((m) => m[0].trim());

  assert.deepEqual(
    atRules,
    [],
    `dist/tokens.css now contains at-rules (${atRules.join(", ")}). test/lib/css-resolve.mjs ` +
      `parses flat blocks only — teach it to nest before allowing these, or the visual contract ` +
      `silently stops meaning anything.`,
  );
});

test("no var() chain dead-ends or loops in any context", () => {
  const broken = [];

  for (const [selector, props] of Object.entries(actual)) {
    for (const [name, value] of Object.entries(props)) {
      if (value.includes("<unresolved:") || value.includes("<cycle:")) {
        broken.push(`${selector} ${name}: ${value}`);
      }
    }
  }

  assert.deepEqual(broken, [], `these tokens do not resolve to a literal:${summarise(broken)}`);
});
