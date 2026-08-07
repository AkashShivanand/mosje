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
const LADDER = { subtlest: 50, subtler: 100, subtle: 200, bold: 300, bolder: 600, boldest: 800 };

const STATUS = { success: "successScale", error: "dangerScale", warning: "warningScale", info: "infoScale" };
const BRAND = { primary: "primaryScale", secondary: "secondaryScale" };

/** path → DTCG reference. Values bind to existing tokens; nothing new is invented. */
const MAP = {};
const put = (path, ref, description) => {
  MAP[path.join("/")] = { path, ref, description };
};

// ---- bg ------------------------------------------------------------------
put(["bg", "neutral", "default"], "{color.bg.surface}", "Page and card background");
put(["bg", "neutral", "subtler"], "{color.bg.muted}", "Inputs, code blocks, quiet fills");
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
put(["text", "neutral", "default"], "{color.text.default}", "Body and heading text");
put(["text", "neutral", "subtle"], "{color.text.muted}", "Captions, hints, secondary text");
put(["text", "neutral", "bolder"], "{color.text.strong}", "Maximum-contrast headings");
put(["text", "neutral", "disabled"], "{color.text.disabled}", "Disabled label");
put(["text", "neutral", "inverse"], "{color.text.onPrimary}", "Text on a solid brand or inverse surface");
put(["text", "brand", "primary", "default"], "{color.action.primary.default}", "Brand-coloured text");
for (const [variant] of Object.entries(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["text", "status", variant, "default"], `{color.status.${src}}`, `${variant} message text`);
}
// Link states — the estate had exactly one link token before this (--ds-link). GIGW expects
// visited links to be distinguishable on public pages.
put(["text", "link", "brand", "default"], "{color.action.link}", "Link at rest");
put(["text", "link", "brand", "hover"], "{color.action.primary.hover}", "Link, hovered");
put(["text", "link", "brand", "active"], "{color.primaryScale.800}", "Link, pressed");
put(["text", "link", "brand", "disabled"], "{color.text.disabled}", "Link, disabled");
put(["text", "link", "visited", "default"], "{color.primaryScale.800}", "Visited link — required by GIGW on public pages");
put(["text", "link", "neutral", "default"], "{color.text.muted}", "Link in quiet chrome (footers, breadcrumbs)");

// ---- icon (entirely new — the estate had ZERO icon tokens) ----------------
put(["icon", "neutral", "default"], "{color.text.default}", "Default icon");
put(["icon", "neutral", "subtle"], "{color.text.muted}", "Quiet icon");
put(["icon", "neutral", "disabled"], "{color.text.disabled}", "Disabled icon");
put(["icon", "neutral", "inverse"], "{color.text.onPrimary}", "Icon on a solid brand surface");
put(["icon", "brand", "primary", "default"], "{color.action.primary.default}", "Brand-coloured icon");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["icon", "status", variant, "default"], `{color.status.${src}}`, `${variant} icon`);
}

// ---- border --------------------------------------------------------------
put(["border", "neutral", "subtle"], "{color.border.subtle}", "Quiet divider");
put(["border", "neutral", "default"], "{color.border.strong}", "Default border, table header rule");
put(["border", "neutral", "bold"], "{color.border.control}", "Form control border");
put(["border", "neutral", "bold", "hover"], "{color.border.controlHover}", "Form control border, hovered");
put(["border", "brand", "primary", "default"], "{color.action.primary.default}", "Brand-coloured border");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["border", "status", variant, "default"], `{color.status.${src}}`, `${variant} border`);
}

// ---- focus / overlay -----------------------------------------------------
put(["focus", "ring"], "{color.focus.ring}", "Keyboard focus ring — WCAG 2.4.7");
put(["overlay", "neutral", "bolder"], "{color.overlay.scrim}", "Modal / drawer scrim");

// ---- non-colour groups promoted to the top level -------------------------
// The grammar has `inline`/`stack`/`padding`/`section` as first-class groups; they were
// nested under `spacing`, which made them read as a sub-kind of the raw scale rather than
// as the intent-stating layer they are.
const SPACING_ROLES = {
  inline: ["none", "2xs", "xs", "s", "m", "l", "xl"],
  stack: ["none", "2xs", "xs", "s", "m", "l", "xl"],
  padding: ["none", "3xs", "2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"],
  section: ["none", "xs", "s", "m", "l", "xl", "2xl"],
};
for (const [group, steps] of Object.entries(SPACING_ROLES)) {
  for (const step of steps) {
    put([group, step], `{spacing.${group}.${step}}`, `${group} spacing, ${step}`);
  }
}

// ---- build ---------------------------------------------------------------
const out = { $description: "GENERATED by build/generate-system-tokens.mjs — do not edit." };
const errors = [];

for (const { path, ref, description } of Object.values(MAP)) {
  const check = parse(path, "sys");
  if (!check.ok) {
    errors.push(`${path.join("/")} — ${check.error}`);
    continue;
  }
  let node = out;
  for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
  node[path.at(-1)] = { $value: ref, $description: description };
}

if (errors.length) {
  console.error(`✗ ${errors.length} path(s) fail the grammar:`);
  for (const e of errors) console.error("   " + e);
  process.exit(1);
}

writeFileSync(here("../src/system.generated.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`✓ generated ${Object.keys(MAP).length} Tier-2 tokens → src/system.generated.json`);
