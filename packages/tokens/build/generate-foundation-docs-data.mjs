/**
 * Generate `apps/hub/src/lib/design-system/foundations-data.generated.ts` — every
 * non-colour foundation's token table, read from what the build actually emitted.
 *
 * WHY THIS EXISTS. On 2026-09-04 the Elevation page documented THREE of the six elevation
 * roles, printed shadow values with an ink (`rgba(33,33,33,…)`) the tokens had not carried
 * since August, labelled `--sa-elevation-card` "Extra small — interactive elements on press"
 * and `--sa-elevation-modal` "dropdowns, popovers, tooltips". The Motion page listed the five
 * pairs correctly and then hard-coded the same numbers into its own demo CSS. Both were
 * hand-typed tables, and a hand-typed table is a table that has not drifted YET.
 *
 * The colour and typography pages were already generated (`generate-color-docs-data.mjs`,
 * `generate-typography-docs-data.mjs`). This closes the gap for the other eleven
 * foundations: one file, one shape, read from `dist/tokens.css` (the resolved value) and
 * `dist/figma.variables.json` (the Figma name), with the description taken from the source
 * `$description` or derived by `usage-guidance.mjs` — the same sentence Figma shows.
 *
 * A page imports `FOUNDATIONS.motion.tokens` and renders it. It cannot type a value.
 * `scripts/check-docs-data.mjs` regenerates this file and fails CI if it is stale.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { parse, tierOfFile, toCssName } from "./grammar.mjs";
import { guidanceFor } from "./usage-guidance.mjs";
import { SOURCES } from "./token-index.mjs";

const here = (p) => new URL(p, import.meta.url).pathname;

const css = readFileSync(here("../dist/tokens.css"), "utf8");
const figma = JSON.parse(readFileSync(here("../dist/figma.variables.json"), "utf8"));

/* ── resolve a custom property to its literal, following var() chains in :root ── */
const rootBlock = css.slice(css.indexOf(":root {"), css.indexOf("\n}\n", css.indexOf(":root {")));
const decl = new Map();
for (const line of rootBlock.split("\n")) {
  const m = /^\s*(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/.exec(line);
  if (m) decl.set(m[1], m[2].trim());
}
function resolve(name, depth = 0) {
  const v = decl.get(name);
  if (v === undefined || depth > 12) return null;
  const ref = /^var\((--[a-zA-Z0-9-]+)\)$/.exec(v);
  return ref ? resolve(ref[1], depth + 1) : v;
}

/* ── Figma name per path ── */
const figmaByPath = new Map();
for (const c of figma.collections) for (const v of c.variables) figmaByPath.set(v.path, { collection: c.name, name: v.name, scopes: v.scopes });
const unmappedReason = new Map(figma.unmapped.map((u) => { const i = u.indexOf(" ("); return [u.slice(0, i), u.slice(i + 2, -1)]; }));

/* ── walk every authored token ── */
const rows = [];
for (const rel of SOURCES) {
  const json = JSON.parse(readFileSync(here("../" + rel), "utf8"));
  const tier = tierOfFile(rel);
  (function walk(node, path, inhType) {
    const type = node.$type ?? inhType;
    for (const k of Object.keys(node)) {
      if (k.startsWith("$")) continue;
      const v = node[k];
      if (!v || typeof v !== "object") continue;
      const p = path.concat(k);
      if ("$value" in v) {
        const cssName = toCssName(p, tier);
        const fig = figmaByPath.get(p.join("/"));
        rows.push({
          path: p.join("/"),
          tier,
          type: v.$type ?? type ?? "",
          css: cssName,
          value: resolve(cssName),
          raw: typeof v.$value === "string" ? v.$value : JSON.stringify(v.$value),
          figma: fig ? `${fig.collection} · ${fig.name}` : null,
          figmaScopes: fig ? fig.scopes : [],
          excluded: fig ? null : (unmappedReason.get(p.join("/")) ?? null),
          description: v.$description ?? guidanceFor(p, tier, parse) ?? "",
        });
      } else walk(v, p, type);
    }
  })(json, [], null);
}

/* ── the families, in the order the nav presents them ── */
const FAMILIES = {
  spacing:     (p) => p[0] === "space" || ["inline", "stack", "padding", "section"].includes(p[0]),
  sizing:      (p) => p[0] === "size" || (p[0] === "icon" && p[1] === "size") || p[0] === "target",
  shape:       (p) => p[0] === "radius" || p[0] === "shape" || (p[0] === "control" && p[1] === "radius") || (p[0] === "cmp" && p.at(-1) === "radius"),
  stroke:      (p) => (p[0] === "border" && p[1] === "width") || p[0] === "stroke" || (p[0] === "control" && p[1] === "border"),
  elevation:   (p) => p[0] === "shadow" || p[0] === "elevation",
  layering:    (p) => p[0] === "z",
  opacity:     (p) => p[0] === "opacity" || p[0] === "alpha" || p[0] === "blur",
  motion:      (p) => p[0] === "motion",
  breakpoints: (p) => p[0] === "breakpoint" || p[0] === "container" || p[0] === "grid",
  density:     (p) => p[0] === "density",
  states:      (p) => p[0] === "focus" || p[0] === "overlay" || (p[0] === "alpha" && ["disabled", "muted"].includes(p[1])),
  layout:      (p) => p[0] === "layout",
};

const out = {};
for (const [family, test] of Object.entries(FAMILIES)) {
  const tokens = rows.filter((r) => test(r.path.split("/"))).map(({ figmaScopes, ...r }) => r);
  const tiers = { ref: 0, sys: 0, cmp: 0 };
  for (const t of tokens) tiers[t.tier]++;
  out[family] = {
    tokens,
    stats: {
      total: tokens.length,
      ...tiers,
      figma: tokens.filter((t) => t.figma).length,
      codeOnly: tokens.filter((t) => !t.figma).length,
      described: tokens.filter((t) => t.description).length,
    },
  };
}

/* ── reduced-motion facts, so the motion page states what the CSS does rather than what it hopes ── */
const rm = css.match(/@media \(prefers-reduced-motion: reduce\) \{\n  :root \{\n([\s\S]*?)\n  \}\n\}/);
const reducedMotion = rm ? rm[1].split("\n").map((l) => l.trim().split(":")[0]).filter(Boolean) : [];

const banner = `/* GENERATED by @mosje/tokens (build/generate-foundation-docs-data.mjs) — do not edit.
   Every non-colour foundation's token table, read from dist/tokens.css (resolved values) and
   dist/figma.variables.json (Figma names). Descriptions are the source $description or the
   sentence usage-guidance.mjs derives — the same one Figma shows. A page renders these rows;
   it never types a value. Regenerate: npm run build -w @mosje/tokens · gate: npm run check:docs-data */

export type FoundationTier = "ref" | "sys" | "cmp";

export interface FoundationTokenRow {
  /** DTCG path, slash-joined — also the Figma variable name for Tier 2. */
  path: string;
  tier: FoundationTier;
  type: string;
  /** The CSS custom property a developer writes. */
  css: string;
  /** The literal the property resolves to in :root, or null if it is not emitted there. */
  value: string | null;
  /** The authored $value — a reference like {space.8} for an alias. */
  raw: string;
  /** "Collection · name" in the SAMAVESH library, or null when the token is code-only. */
  figma: string | null;
  /** Why it is not in Figma, when it is not. */
  excluded: string | null;
  description: string;
}

export interface FoundationFamily {
  tokens: FoundationTokenRow[];
  stats: { total: number; ref: number; sys: number; cmp: number; figma: number; codeOnly: number; described: number };
}

export type FoundationKey = ${Object.keys(FAMILIES).map((k) => JSON.stringify(k)).join(" | ")};

`;

const body =
  `export const FOUNDATIONS: Record<FoundationKey, FoundationFamily> = ${JSON.stringify(out, null, 2)};\n\n` +
  `/** The custom properties tokens.css collapses to 0.01ms under prefers-reduced-motion. */\n` +
  `export const REDUCED_MOTION_COLLAPSES: readonly string[] = ${JSON.stringify(reducedMotion, null, 2)};\n`;

const target = here("../../../apps/hub/src/lib/design-system/foundations-data.generated.ts");
writeFileSync(target, banner + body);
process.stdout.write(
  `✓ generated foundations-data.generated.ts — ${Object.entries(out).map(([k, v]) => `${k} ${v.stats.total}`).join(", ")}\n`,
);
