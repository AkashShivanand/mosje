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
const LADDER = { base: 50, soft: 100, subtle: 200, emphasis: 300, strong: 600, stronger: 800 };

const STATUS = { success: "successScale", error: "dangerScale", warning: "warningScale", info: "infoScale" };
const BRAND = { primary: "primaryScale", secondary: "secondaryScale" };

/** path → DTCG reference. Values bind to existing tokens; nothing new is invented. */
const MAP = {};
const put = (path, ref, description) => {
  MAP[path.join("/")] = { path, ref, description };
};

// ---- bg ------------------------------------------------------------------
put(["bg", "neutral", "subtle"], "{color.neutralScale.100}", "Hovered rows, quiet panels");
put(["bg", "neutral", "emphasis"], "{color.neutralScale.200}", "Pressed rows, dividers as fills");
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
put(["text", "neutral", "primary"], "{color.text.default}", "Body and heading text");
put(["text", "neutral", "secondary"], "{color.text.muted}", "Captions, hints, secondary text");
put(["text", "neutral", "disabled"], "{color.text.disabled}", "Disabled label");
put(["text", "neutral", "inverse"], "{color.text.onPrimary}", "Text on a solid brand or inverse surface");
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
put(["icon", "neutral", "primary"], "{color.text.default}", "Default icon");
put(["icon", "neutral", "secondary"], "{color.text.muted}", "Quiet icon");
put(["icon", "neutral", "disabled"], "{color.text.disabled}", "Disabled icon");
put(["icon", "neutral", "inverse"], "{color.text.onPrimary}", "Icon on a solid brand surface");
put(["icon", "brand", "primary", "base"], "{color.action.primary.default}", "Brand-coloured icon");
for (const variant of Object.keys(STATUS)) {
  const src = variant === "error" ? "danger" : variant;
  put(["icon", "status", variant, "base"], `{color.status.${src}}`, `${variant} icon`);
}

// ---- border --------------------------------------------------------------
put(["border", "neutral", "strong", "hover"], "{color.border.controlHover}", "Form control border, hovered");
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
