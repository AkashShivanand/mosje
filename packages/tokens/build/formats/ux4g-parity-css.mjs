import { tierOfFile, toCssName } from "../grammar.mjs";
import { makeRetier } from "./retier.mjs";
import { brandSelector } from "../brand-modes.mjs";
// Emits the UX4G 3.0 parity layer: the full `--ux4g-*` token surface, resolved onto
// SAMAVESH's own tokens, plus the `ux4g-light` / `ux4g-dark` colour modes.
//
// WHY A SEPARATE FILE
// ───────────────────
// This is an OPT-IN stylesheet (`@mosje/design-system/ux4g.css`). The default bundle
// does not grow by a single byte. Apps that need to render UX4G-authored markup, or to
// demonstrate conformance, import it; the other 30-odd properties pay nothing.
//
// HOW TOKENS ARE MAPPED — two rules, applied by kind
// ──────────────────────────────────────────────────
// 1. STRUCTURE (spacing, radius, type sizes, line-heights, weights, borders, opacity,
//    blur, z-index, …) takes UX4G's EXACT values. Being UX4G-conformant means these
//    numbers are literally theirs. Where SAMAVESH already has a token with the identical
//    value the alias points at it (`var(--sa-…)`) so the two systems provably share one
//    number rather than drifting; where we have no such token the literal is emitted.
//
// 2. COLOUR maps by ROLE, not by value. `--ux4g-bg-primary-strong` resolves to OUR
//    primary (gov-blue #0373DF), not UX4G's violet. That is deliberate and sanctioned:
//    DBIM requires a primary colour group built from the ministry's key colour, and UX4G
//    ships Theme Craft precisely so a department can apply its own. Only the ~10 PRIMITIVE
//    ramps are remapped — UX4G's ~300 semantic colour tokens are emitted verbatim, because
//    they are themselves `var(--ux4g-color-…)` references and therefore inherit the remap
//    for free. That also makes them mode-aware: they follow `data-color-mode` like
//    everything else.
//
// To see UX4G's literal violet palette instead, switch to the `ux4g-light` / `ux4g-dark`
// colour modes emitted at the bottom of this file — that is the conformance demo, and it
// changes no default.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGACY_DS_ALIASES } from "./legacy-ds-css.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REFERENCE = join(HERE, "../../reference/ux4g-3.0.tokens.json");

const val = (t) => (t.$value !== undefined ? t.$value : t.value);

/**
 * UX4G primitive colour ramp → SAMAVESH ramp. Keys are the `<family>` in
 * `--ux4g-color-<family>-<step>`; `steps` maps UX4G's step to ours where they differ.
 * `null` target = no SAMAVESH equivalent, keep UX4G's literal value.
 */
const COLOR_RAMPS = {
  primary:   { sa: "color-primaryScale",   steps: { 950: 900 } },
  secondary: { sa: "color-secondaryScale", steps: { 950: 900 } },
  green:     { sa: "color-successScale",   steps: { 950: 900 } },
  red:       { sa: "color-dangerScale",    steps: { 950: 900 } },
  orange:    { sa: "color-warningScale",   steps: { 950: 900 } },
  cyan:      { sa: "color-infoScale",      steps: { 950: 900 } },
  // UX4G's "accent blue — links and secondary information". SAMAVESH's brand primary IS
  // that blue, so pointing it at the primary ramp keeps links on-brand.
  blue:      { sa: "color-primaryScale",   steps: { 950: 900 } },
  neutral:   { sa: "color-neutralScale",   steps: { 950: 1000, 1000: 1100 } },
  // No MoSJE counterpart — kept at UX4G's literal values and reported as unmapped.
  // `tertiary` is UX4G's soft-purple third accent; DBIM asks for ONE primary colour group,
  // not three, so MoSJE has no third brand ramp to point it at. gold/lime/pink/purple/
  // skyblue are extended hues that UX4G ships in the package but does not document on
  // ux4g.gov.in; SAMAVESH covers that ground with a purpose-built 12-colour categorical
  // chart palette (--ds-chart-cat-1…12) which is contrast-checked in every theme.
  tertiary:  { sa: null },
  yellow:    { sa: null },
  gold:      { sa: null },
  lime:      { sa: null },
  pink:      { sa: null },
  purple:    { sa: null },
  skyblue:   { sa: null },
};

/**
 * Family prefix of a `--ux4g-*` structural token → the `--sa-*` prefix its value may be
 * matched against. Matching is scoped so a 4px radius never aliases a 4px spacing token.
 */
const STRUCTURE_SCOPES = [
  { test: /^--ux4g-(space|spacing|inline|stack|padding|section|gutter)-/, saPrefix: "--sa-spacing-" },
  { test: /^--ux4g-radius-/, saPrefix: "--sa-radius-" },
  { test: /^--ux4g-(size|fs)-/, saPrefix: "--sa-font-size-" },
  { test: /^--ux4g-(line-height|lh)-/, saPrefix: "--sa-font-lineHeight-" },
  { test: /^--ux4g-(font-weight|fw)-/, saPrefix: "--sa-font-weight-" },
];

/** Normalise a CSS value for equality comparison (whitespace, case, `0`≡`0px`). */
function norm(v) {
  const s = String(v).trim().toLowerCase().replace(/\s+/g, " ");
  return s === "0" ? "0px" : s;
}

/**
 * Wrap `body` in a CSS block comment, neutralising any `*` + `/` sequence inside it.
 * Token names here are full of globs (`--ux4g-size-*`), and one `*` followed by a `/`
 * closes the comment early — after which the rest of the prose is parsed as CSS and the
 * error recovery swallows the `:root` selector that follows, silently dropping the entire
 * token block. That happened; this makes it impossible.
 */
function comment(body) {
  return `/* ${body.replace(/\*\//g, "* /")} */`;
}

export const ux4gParityCss = {
  name: "css/ux4g-parity",
  format: ({ dictionary }) => {
    const reference = JSON.parse(readFileSync(REFERENCE, "utf8"));
    const ux4g = reference.tokens;

    // ── Index SAMAVESH tokens by name and by (scope, value) ────────────────────────
    const saValue = new Map(); // "--sa-…" → resolved value
    const retier = makeRetier(dictionary.allTokens, { tierOfFile, toCssName });
    // Index by BOTH the unmarked and the marked name so existing lookups keep working.
    for (const t of dictionary.allTokens) {
      const unmarked = `--sa-${t.path.join("-")}`;
      saValue.set(unmarked, String(val(t)));
      saValue.set(retier(unmarked), String(val(t)));
    }

    /** First --sa-* token under `prefix` whose value equals `value` (shortest name wins). */
    const findSa = (prefix, value) => {
      let best = null;
      for (const [name, v] of saValue) {
        if (!name.startsWith(prefix) || norm(v) !== norm(value)) continue;
        if (best === null || name.length < best.length) best = name;
      }
      return best;
    };

    const stats = {
      total: 0,
      colorRemapped: 0,
      structureAliased: 0,
      passthroughRef: 0,
      literal: 0,
      unmappedRamps: new Set(),
    };

    // ── Resolve each UX4G token ────────────────────────────────────────────────────
    // name → emitted value. Kept as a map (not raw lines) because the colour-mode blocks
    // below have to re-emit the subset that depends on a remapped primitive.
    const emitted = new Map();
    const emit = (name, value) => emitted.set(name, value);

    for (const [name, rawValue] of Object.entries(ux4g)) {
      stats.total++;

      // 1. Primitive colour ramp → SAMAVESH ramp (drives every semantic colour token).
      const ramp = name.match(/^--ux4g-color-([a-z]+)-(\d+)$/);
      if (ramp) {
        const [, family, step] = ramp;
        const spec = COLOR_RAMPS[family];
        if (spec?.sa) {
          const mapped = spec.steps?.[step] ?? step;
          const target = retier(`--sa-${spec.sa}-${mapped}`);
          if (saValue.has(target)) {
            emit(name, `var(${target})`);
            stats.colorRemapped++;
            continue;
          }
        }
        if (!spec?.sa) stats.unmappedRamps.add(family);
        emit(name, rawValue);
        stats.literal++;
        continue;
      }

      // 2. Anything that is already a reference stays verbatim — it resolves through the
      //    remapped primitives above, which is exactly what makes the semantic layer work.
      if (String(rawValue).includes("var(")) {
        emit(name, rawValue);
        stats.passthroughRef++;
        continue;
      }

      // 3. Literal STRUCTURE value → alias to our identical token where one exists, so the
      //    two systems share one number instead of two copies that can drift apart.
      const scope = STRUCTURE_SCOPES.find((s) => s.test.test(name));
      if (scope) {
        const match = findSa(scope.saPrefix, rawValue);
        if (match) {
          emit(name, `var(${match})`);
          stats.structureAliased++;
          continue;
        }
      }

      emit(name, rawValue);
      stats.literal++;
    }

    // ── ux4g-light / ux4g-dark colour modes ────────────────────────────────────────
    // These carry UX4G's palette LITERALLY, so conformance can be demonstrated by flipping
    // one attribute rather than argued. They override the SAMAVESH brand primitives, then
    // re-assert every --ds-* alias that reads from them — without the re-assertion the
    // aliases keep the value they resolved to at :root and the subtree does not repaint
    // (same rule as the theme blocks in legacy-ds-css.mjs).
    const rampLiteral = (family, step) => ux4g[`--ux4g-color-${family}-${step}`];
    const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    const modeDecls = (dark) => {
      const out = [];
      // Primary: UX4G violet. In the dark variant the brand deepens, matching how the
      // SAMAVESH blue-dark mode relates to blue-light (darker brand, still-light surfaces).
      for (const s of STEPS) {
        const lit = rampLiteral("primary", dark ? Math.min(s + 100, 950) : s);
        if (lit) out.push([retier(`--sa-color-primaryScale-${s}`), lit]);
      }
      for (const s of STEPS) {
        const lit = rampLiteral("secondary", s);
        if (lit) out.push([retier(`--sa-color-secondaryScale-${s}`), lit]);
      }
      for (const s of [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
        const lit = rampLiteral("neutral", s);
        if (lit) out.push([retier(`--sa-color-neutralScale-${s}`), lit]);
      }
      const p = (s) => rampLiteral("primary", s);
      out.push(
        ["--sa-color-action-primary-default", p(dark ? 700 : 600)],
        ["--sa-color-action-primary-hover", p(dark ? 800 : 700)],
        ["--sa-color-action-primary-tonal", p(dark ? 200 : 100)],
        ["--sa-text-link-brand-default", p(dark ? 700 : 600)],
        ["--sa-focus-ring", "rgba(106, 78, 255, 0.48)"],
        ["--sa-color-text-default", rampLiteral("neutral", 900)],
        ["--sa-text-neutral-strong", rampLiteral("neutral", 950)],
        ["--sa-color-text-muted", rampLiteral("neutral", 700)],
        ["--sa-bg-neutral-base", rampLiteral("neutral", 0)],
        ["--sa-bg-neutral-soft", rampLiteral("neutral", 50)],
        ["--sa-border-neutral-subtle", rampLiteral("neutral", 200)],
        ["--sa-border-neutral-base", rampLiteral("neutral", 300)],
        ["--sa-color-status-success", rampLiteral("green", 800)],
        ["--sa-color-status-danger", rampLiteral("red", 800)],
        ["--sa-color-status-warning", rampLiteral("orange", 800)],
        ["--sa-color-status-info", rampLiteral("cyan", 800)],
      );
      return out.filter(([, v]) => v);
    };

    const legacyPairs = Object.entries(LEGACY_DS_ALIASES);

    // Which --ux4g-* tokens does a given set of changed --sa-* names affect? Substitution
    // happens where a property is DECLARED, so it is not enough to flip the --sa-* roots:
    // every --ux4g-* token that reads from them, and every token that reads from THOSE,
    // has to be re-declared inside the block or it keeps its :root value. Walk the
    // reference graph to a fixed point and re-emit exactly that closure.
    // NB: token paths keep their camelCase segments (`--sa-color-primaryScale-600`), so the
    // character class must allow capitals — a lowercase-only class silently truncates the
    // name and the closure comes back empty.
    const refsOf = (value) => [...String(value).matchAll(/var\((--[A-Za-z0-9-]+)/g)].map((m) => m[1]);
    const closureOver = (changedSaNames) => {
      const affected = new Set();
      let grew = true;
      while (grew) {
        grew = false;
        for (const [name, value] of emitted) {
          if (affected.has(name)) continue;
          const deps = refsOf(value);
          if (deps.some((d) => changedSaNames.has(d) || affected.has(d))) {
            affected.add(name);
            grew = true;
          }
        }
      }
      return affected;
    };

    const modeBlock = (id, dark) => {
      const decls = modeDecls(dark);
      const declared = new Set(decls.map(([n]) => n));

      const dsReassert = legacyPairs
        .filter(([, target]) => declared.has(target))
        .map(([alias, target]) => `  ${alias}: var(${target});`);

      const ux4gReassert = [...closureOver(declared)]
        .sort()
        .map((name) => `  ${name}: ${emitted.get(name)};`);

      return (
        `${brandSelector(id === "ux4g-light" ? "ux4g" : id === "ux4g-dark" ? "ux4gdeep" : id)} {\n` +
        decls.map(([n, v]) => `  ${n}: ${v};`).join("\n") +
        `\n\n  /* re-resolve the --ds-* aliases whose source changed in this block */\n` +
        dsReassert.join("\n") +
        `\n\n  /* re-resolve the --ux4g-* chain that reads from those primitives */\n` +
        ux4gReassert.join("\n") +
        `\n}`
      );
    };

    const src = reference.$source;
    const header = comment(
      `GENERATED by @mosje/tokens — do not edit. Edit packages/tokens/build/formats/ux4g-parity-css.mjs\n` +
      `   or re-run tools/ux4g-conformance/extract-ux4g-tokens.mjs.\n\n` +
      `   UX4G 3.0 PARITY LAYER — opt-in. Import AFTER tokens.css:\n` +
      `       import "@mosje/design-system/tokens.css";\n` +
      `       import "@mosje/design-system/ux4g.css";\n\n` +
      `   Gives you the full --ux4g-* token surface (${stats.total} tokens, UX4G ${src.version}).\n` +
      `   Structure carries UX4G's exact values; colour maps by ROLE onto the MoSJE palette\n` +
      `   (DBIM key colour via UX4G Theme Craft). For UX4G's literal violet palette, set\n` +
      `   data-color-mode="ux4g-light" or "ux4g-dark".\n\n` +
      `   ${stats.colorRemapped} colour tokens remapped onto SAMAVESH ramps.\n` +
      `   ${stats.structureAliased} structural tokens aliased to a SAMAVESH token with the identical value.\n` +
      `   ${stats.passthroughRef} semantic tokens pass through as var() references — they inherit the\n` +
      `     colour remap above, which is what makes the whole semantic layer follow our palette.\n` +
      `   ${stats.literal} emitted at UX4G's own literal value (no SAMAVESH equivalent).\n` +
      `   Ramps deliberately left at UX4G values: ${[...stats.unmappedRamps].sort().join(", ")}.\n\n` +
      `   WHAT AN ALIAS PROMISES — it preserves UX4G's VALUE, not our rung. --ux4g-bg-primary-subtle\n` +
      `   emits UX4G's ramp step 200, which is NOT what \`subtle\` means in the SAMAVESH ladder.\n` +
      `   So --ux4g-* names sit OUTSIDE the SAMAVESH contrast contract (spec §6.3), and the\n` +
      `   prominence-ladder test exempts them BY CONSTRUCTION, not by exception: the ladder is a\n` +
      `   property of --sa-* rungs, and a --ux4g-* name is not a rung. Nothing to allowlist.\n` +
      `   The reason is deliberate: a developer pasting UX4G markup must get UX4G's rendering.\n` +
      `   Silently re-pointing a borrowed name at our ladder is the worse failure. See spec §8.1a.\n\n` +
      `   NOTE — UX4G sizes type in rem, SAMAVESH in px. The --ux4g-size and --ux4g-line-height\n` +
      `   tokens are therefore kept in UX4G's rem so browser default-font-size scaling keeps\n` +
      `   working; they are NOT aliased to our px tokens. Reconciling the SAMAVESH fluid scale\n` +
      `   to rem is tracked as the top follow-up in the readiness audit.\n` +
      `   MoSJE does not install or ship ux4g-web-components — see docs/ux4g/UX4G-Code-Readiness-Audit.md.`
    );

    return (
      `${header}\n\n` +
      `:root {\n${[...emitted].map(([n, v]) => `  ${n}: ${v};`).join("\n")}\n}\n\n` +
      `${comment("---- UX4G's own palette, as two switchable colour modes (nothing default changes) ----")}\n` +
      `${modeBlock("ux4g-light", false)}\n\n${modeBlock("ux4g-dark", true)}\n`
    );
  },
};
