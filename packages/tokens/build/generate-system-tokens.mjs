import { guidanceFor } from "./usage-guidance.mjs";
/**
 * Generate the canonical Tier-2 namespace (spec §5, §7.2) into src/system.generated.json.
 *
 * WHY THIS IS ADDITIVE, NOT A RENAME
 * ----------------------------------
 * The pre-grammar semantic tier is not role-based: `--ds-primary` is used today as a
 * background, a text colour AND a border colour. There is no single correct role to rename
 * it to, so a mechanical rename would mean guessing roles across 21 production properties —
 * the reliable way to introduce subtle visual regressions.
 *
 * Instead every token here is a pure {reference} to an EXISTING semantic token, so the
 * rendered value is provably identical (test/build-output.test.mjs compares resolved values
 * against the snapshot). The old paths stay, listed in LEGACY_TIER2_PATHS in
 * test/naming-grammar.test.mjs, and that list shrinks as call sites migrate.
 *
 * Aliases are emitted as `var(--sa-…)` chains rather than resolved literals — see
 * SYSTEM_ALIAS_FILE in build/formats/legacy-ds-css.mjs. A literal would freeze at its :root
 * value and stop responding to [data-theme] / [data-brand], which is the island bug
 * design.md §1A documents.
 */

import { writeFileSync } from "node:fs";
import { parse } from "./grammar.mjs";

const here = (p) => new URL(p, import.meta.url).pathname;

/** Ladder step → ramp step. Shared by every family so the ladder means one thing. */
/**
 * Rung → ramp step. These are the ORDINAL ladder names (2026-08-10); the previous UX4G
 * vocabulary (soft/emphasis/strong/stronger) was left here after the rename and is what made
 * this generator unrunnable — every path it built failed the grammar check below.
 */
const LADDER = { base: 50, subtler: 100, subtle: 200, bold: 300, bolder: 600, boldest: 800 };

const STATUS = { success: "successScale", error: "dangerScale", warning: "warningScale", info: "infoScale" };
/**
 * `accent` joined on 2026-08-11. Secondary and accent are the SAMAVESH logo's two
 * non-blue colours (India Saffron #FF671F, India Green #046A38) and are brand-invariant —
 * only `primary` changes with `data-brand`. Adding the key here is what generates the whole
 * bg/text/border/icon accent family across the prominence ladder.
 */
const BRAND = { primary: "primaryScale", secondary: "secondaryScale", accent: "accentScale" };

/** path → DTCG reference. Values bind to existing tokens; nothing new is invented. */
const MAP = {};
const put = (path, ref, description) => {
  MAP[path.join("/")] = { path, ref, description };
};

// ---- bg ------------------------------------------------------------------
put(["bg", "neutral", "subtle"], "{color.neutralScale.100}", "Hovered rows, quiet panels");
put(["bg", "neutral", "bold"], "{color.neutralScale.200}", "Pressed rows, dividers as fills");
put(["bg", "neutral", "inverse"], "{color.neutralScale.900}", "Inverted surface (tooltips, dark panels)");
put(["bg", "neutral", "disabled"], "{color.neutralScale.100}", "Disabled control fill — rung 100, one lighter than before, so a disabled control no longer shares its fill with border/neutral/base and loses its edge");

for (const [variant, scale] of Object.entries(BRAND)) {
  for (const [rung, step] of Object.entries(LADDER)) {
    put(["bg", "brand", variant, rung], `{color.${scale}.${step}}`, `Brand ${variant} background, ${rung}`);
  }
}
for (const [variant, scale] of Object.entries(STATUS)) {
  for (const [rung, step] of Object.entries(LADDER)) {
    // AMBER HAS NO DARK RUNG THAT IS STILL AMBER: warningScale/600 (#8b5e00, the `bolder` fill
    // under white ink) is a brown. The ladder is left uniform — `bolder` means "white ink is
    // AA on this" in every family — and a component that wants a VIVID amber fill takes the
    // `bold` rung (300, #e09c1d) with its measured DARK ink, `on/bg/status/warning/bold`
    // (6.9:1). That is how USWDS (#ffbe2e + black) treats the same problem. The solid warning
    // badge does exactly this; see badge.css.
    put(["bg", "status", variant, rung], `{color.${scale}.${step}}`, `${variant} background, ${rung}`);
  }
}

// ---- text ----------------------------------------------------------------
put(["text", "neutral", "base"], "{color.text.default}", "Body and heading text");
put(["text", "neutral", "subtle"], "{color.text.muted}", "Captions, hints, secondary text");
put(["text", "neutral", "disabled"], "{color.text.disabled}", "Disabled label");
put(["text", "neutral", "inverse"], "{color.text.onPrimary}", "Text on a solid brand or inverse surface");
put(["text", "neutral", "subtler"], "{color.neutralScale.500}", "Quietest ink that is still AA on bg/neutral/base (4.72:1) — placeholders in an unfilled input or select. It must read as 'not yet entered'; text/neutral/subtle is dark enough to look like a real value. Named for its rung, not its use, per the grammar: 'placeholder' is neither a prominence nor a state and adding it to STATE would let bg/*/placeholder parse too.");
put(["text", "brand", "primary", "base"], "{color.primaryScale.600}", "Brand-coloured text — rung 600, because TEXT owes 4.5:1 on the ground it sits on and the key colour does not pay it: #0373DF is 4.07:1 on bg/neutral/subtler, the <body> of every page. The key colour stays the ICON and FILL token; text moved on 2026-09-04.");
/**
 * The ACCESSIBLE brand ink. `text/brand/primary/base` is the brand key colour, and a key
 * colour is chosen to be recognisable, not to be readable: #0373DF measures 4.07:1 on
 * `bg/neutral/subtler` and 4.19:1 on `bg/brand/primary/base` — both fail WCAG 1.4.3 AA on the
 * tinted surfaces brand text most often sits on. The 600 rung measures 6.36 / 5.57 / 5.74.
 * Reach for this whenever brand-coloured text lands on anything other than plain white; the
 * selected tab's label is the first call site.
 */
put(["text", "brand", "primary", "bolder"], "{color.primaryScale.700}", "Brand-coloured text, bolder — rung 700 (8.6:1), for a label on a tinted brand surface");
for (const [variant] of Object.entries(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["text", "status", variant, "base"], `{color.${STATUS[variant]}.600}`, `${variant} message text — rung 600, the AA rung on the body ground (5.7–6.7:1). Was rung 700 (7.8–11.7:1), two rungs darker than text needs, which is what made every status read as brown or black-green.`);
  /** Same gap as the icon family: the ladder's 600 rung existed only for backgrounds. */
  put(["text", "status", variant, "bolder"], `{color.${STATUS[variant]}.700}`, `${variant} text, bolder — rung 700, AAA on white; for a label on a tinted status surface. Until 2026-09-04 this was rung 600 while base was 700, so "bolder" was the LIGHTER of the two.`);
}
// Link states — the estate had exactly one link token before this (--ds-link). GIGW expects
// visited links to be distinguishable on public pages.
put(["text", "link", "brand", "hover"], "{color.action.primary.hover}", "Link, hovered");
put(["text", "link", "brand", "active"], "{color.primaryScale.800}", "Link, pressed");
put(["text", "link", "brand", "disabled"], "{color.text.disabled}", "Link, disabled");
put(["text", "link", "visited", "default"], "{color.primaryScale.800}", "Visited link — required by GIGW on public pages");
put(["text", "link", "neutral", "default"], "{color.text.muted}", "Link in quiet chrome (footers, breadcrumbs)");

// ---- icon (entirely new — the estate had ZERO icon tokens) ----------------
put(["icon", "neutral", "base"], "{color.text.default}", "Default icon");
put(["icon", "neutral", "subtle"], "{color.text.muted}", "Quiet icon");
put(["icon", "neutral", "disabled"], "{color.text.disabled}", "Disabled icon");
put(["icon", "neutral", "inverse"], "{color.text.onPrimary}", "Icon on a solid brand surface");
put(["icon", "brand", "primary", "base"], "{color.action.primary.default}", "Brand-coloured icon");
/** Pairs with `text/brand/primary/bolder` so a label and its leading glyph never disagree. */
put(["icon", "brand", "primary", "bolder"], "{color.primaryScale.600}", "Brand-coloured icon that must pass AA on a tinted surface");
/**
 * The quiet ICON rung, and the twin of `text/neutral/subtler` — added 2026-08-26 because the
 * library had no such thing and 14 glyphs had reached past the icon family into the raw stroke
 * ramp to find one. The worst were the Date-Time Picker's prev/next chevrons at `stroke/300`:
 * #ADB1B7 measures 2.0:1 on white, and those are ACTIVE controls, so 1.4.11 wants 3:1. This
 * rung is 4.6:1 — quiet enough to read as secondary, contrasty enough to be a control.
 */
put(["icon", "neutral", "subtler"], "{color.neutralScale.500}", "Quietest glyph that still clears 1.4.11 on bg/neutral/base (4.6:1) — a secondary control's icon, a stepper chevron. Not for a DISABLED glyph: that is icon/neutral/disabled, which is allowed to fail because WCAG exempts inactive controls.");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["icon", "status", variant, "base"], `{color.${STATUS[variant]}.600}`, `${variant} icon — rung 600, matching the message text`);
  /**
   * The 600 rung of each status ramp, as an ICON. The bg family has had `bolder` since the
   * ladder landed; text, icon and border never got it, so a status glyph that needed the
   * darker step bound `ref/color/<status>/source` directly — 112 of them across the library.
   */
  put(["icon", "status", variant, "bolder"], `{color.${STATUS[variant]}.700}`, `${variant} icon, bolder — rung 700, for a glyph on a tinted status surface where the base rung would not carry`);
}

// ---- border --------------------------------------------------------------
put(["border", "neutral", "bolder", "hover"], "{color.border.controlHover}", "Form control border, hovered");
put(["border", "brand", "primary", "base"], "{color.action.primary.default}", "Brand-coloured border");
/**
 * NO `border/neutral/bold` — and the reason is worth keeping, because it was attempted.
 *
 * The neutral border ramp runs subtle(100) · base(200) · bolder(400) with a hole at 300, and 35
 * rules in the library were filling that hole from `ref/color/stroke/300`. Minting the rung
 * under the ladder's own word for that step looked obvious. The contrast gate refused it:
 * neutralScale/300 measures **2.15:1**, and the name `bold` promises a ≥3:1 class, so the token
 * would have been lying about itself in its own name.
 *
 * That is the gate working. A rung name here is a CONTRAST PROMISE, not a position on a ramp,
 * and 300 cannot keep this one. The 35 rules are therefore not a ramp gap: either they are
 * decoration, in which case `border/neutral/base` is the honest home, or they are a real
 * division, in which case they need `bolder/default` (400) to be perceivable at all. That is a
 * decision about those rules, and it is recorded rather than papered over with a token.
 */
/** Pairs with `text|icon/brand/primary/bolder`, so an outlined control and its label agree. */
put(["border", "brand", "primary", "bolder"], "{color.primaryScale.600}", "Brand border that must pass 1.4.11 on a tinted surface — the outlined counterpart of text/brand/primary/bolder");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["border", "status", variant, "base"], `{color.${STATUS[variant]}.600}`, `${variant} border — rung 600 (≥5.7:1, well past the 3:1 of 1.4.11)`);
  put(["border", "status", variant, "bolder"], `{color.${STATUS[variant]}.700}`, `${variant} border, bolder — rung 700, for an outline on a tinted status surface`);
}

// ---- focus / overlay -----------------------------------------------------

// ---- non-colour groups promoted to the top level -------------------------
// The grammar has `inline`/`stack`/`padding`/`section` as first-class groups; they were
// nested under `spacing`, which made them read as a sub-kind of the raw scale rather than
// as the intent-stating layer they are.
// NOTE: inline/stack/padding/section are no longer generated here. They were RENAMED in
// src/semantic.json (spacing.inline.m -> inline/m) rather than aliased, so they are real
// authored tokens now. Generating an alias on top would have produced two names for one
// value — the duplication this pass exists to remove.

// NOTE — these paths were left on the RETIRED rung names (`text/neutral/primary`,
// `border/neutral/strong/hover`) when the ordinal ladder landed. The generator validates every
// path and exits(1) before writing, so it had become UNRUNNABLE: src/system.generated.json said
// "GENERATED — do not edit" while in fact being hand-maintained. Fixed 2026-08-10; the
// round-trip test below is what stops it drifting out of sync again.

// ---- build ---------------------------------------------------------------
const out = { $description: "GENERATED by build/generate-system-tokens.mjs — do not edit." };
// The per-token strings above are terse LABELS ("error background, subtle"). The shared
// guidance vocabulary says when to reach for the token instead, in one reviewed voice — so it
// wins, and the label survives only where guidance has nothing to say.
const errors = [];

for (const { path, ref, description } of Object.values(MAP)) {
  const check = parse(path, "sys");
  if (!check.ok) {
    errors.push(`${path.join("/")} — ${check.error}`);
    continue;
  }
  let node = out;
  for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
  node[path.at(-1)] = { $value: ref, $description: guidanceFor(path, "sys", parse) ?? description };
}

if (errors.length) {
  console.error(`✗ ${errors.length} path(s) fail the grammar:`);
  for (const e of errors) console.error("   " + e);
  process.exit(1);
}

writeFileSync(here("../src/system.generated.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`✓ generated ${Object.keys(MAP).length} Tier-2 tokens → src/system.generated.json`);
