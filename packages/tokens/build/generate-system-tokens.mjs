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
put(["bg", "neutral", "disabled"], "{color.neutralScale.200}", "Disabled control fill");

for (const [variant, scale] of Object.entries(BRAND)) {
  for (const [rung, step] of Object.entries(LADDER)) {
    put(["bg", "brand", variant, rung], `{color.${scale}.${step}}`, `Brand ${variant} background, ${rung}`);
  }
}
for (const [variant, scale] of Object.entries(STATUS)) {
  for (const [rung, step] of Object.entries(LADDER)) {
    put(["bg", "status", variant, rung], `{color.${scale}.${step}}`, `${variant} background, ${rung}`);
  }
}

// ---- text ----------------------------------------------------------------
put(["text", "neutral", "base"], "{color.text.default}", "Body and heading text");
put(["text", "neutral", "subtle"], "{color.text.muted}", "Captions, hints, secondary text");
put(["text", "neutral", "disabled"], "{color.text.disabled}", "Disabled label");
put(["text", "neutral", "inverse"], "{color.text.onPrimary}", "Text on a solid brand or inverse surface");
put(["text", "neutral", "subtler"], "{color.neutralScale.500}", "Quietest ink that is still AA on bg/neutral/base (4.72:1) — placeholders in an unfilled input or select. It must read as 'not yet entered'; text/neutral/subtle is dark enough to look like a real value. Named for its rung, not its use, per the grammar: 'placeholder' is neither a prominence nor a state and adding it to STATE would let bg/*/placeholder parse too.");
put(["text", "brand", "primary", "base"], "{color.action.primary.default}", "Brand-coloured text");
for (const [variant] of Object.entries(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["text", "status", variant, "base"], `{color.status.${src}}`, `${variant} message text`);
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
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["icon", "status", variant, "base"], `{color.status.${src}}`, `${variant} icon`);
}

// ---- border --------------------------------------------------------------
put(["border", "neutral", "bolder", "hover"], "{color.border.controlHover}", "Form control border, hovered");
put(["border", "brand", "primary", "base"], "{color.action.primary.default}", "Brand-coloured border");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["border", "status", variant, "base"], `{color.status.${src}}`, `${variant} border`);
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
