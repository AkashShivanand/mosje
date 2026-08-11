/**
 * Generate `apps/hub/.../foundations/color/color-data.ts` — the colour documentation's data.
 *
 * WHY THIS IS GENERATED
 * ---------------------
 * The colour page used to hand-copy its values. On 2026-08-12 that was measured: it printed
 * 88 hex literals, 31 distinct, and **14 of them matched no token in the system** — it showed
 * `#1f2428` beside `--sa-color-text-default`, which is `#1e2124`, and `#b8382f` beside
 * `--sa-color-status-danger`, which is `#8b1f18`. A reader copying a value off the design
 * system's own colour page got a colour with a different contrast ratio than the label claimed.
 *
 * That is the same failure `design.md` documents about itself, in a second place, and it is
 * why BOTH documentation surfaces are now pinned to one source:
 *
 *   - Figma  — every swatch is variable-BOUND, so it renders the library's own values.
 *   - Web    — every value comes from this file, which is read from dist/tokens.css.
 *
 * Neither surface can state a value the build does not produce. The one thing that can still
 * drift is STRUCTURE, so the section list is recorded here and gated by
 * scripts/check-color-docs.mjs.
 *
 * Contrast is computed with the WCAG 2.x relative-luminance formula. That is arithmetic on two
 * colours, not a conformance claim.
 */
import { readFileSync, writeFileSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url).pathname;
const css = readFileSync(here("../dist/tokens.css"), "utf8");
const payload = JSON.parse(readFileSync(here("../dist/figma.variables.json"), "utf8"));

function block(marker) {
  const i = css.indexOf(marker);
  if (i < 0) throw new Error(`generate-color-docs-data: selector ${marker} not found`);
  const j = css.indexOf("{", i);
  const k = css.indexOf("\n}", j);
  return css.slice(j, k);
}
const decls = (b) => Object.fromEntries([...b.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const ROOT = decls(block(":root {"));
const NAVY = decls(block('[data-brand="navy"],'));

function resolve(name, over = {}, depth = 0) {
  const v = over[name] ?? ROOT[name];
  if (v === undefined || depth > 16) return null;
  const m = /^var\((--[\w-]+)\)$/.exec(v.trim());
  return m ? resolve(m[1], over, depth + 1) : v.trim();
}
const srgb = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
function lum(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return 0.2126 * srgb(parseInt(n.slice(0, 2), 16)) + 0.7152 * srgb(parseInt(n.slice(2, 4), 16)) + 0.0722 * srgb(parseInt(n.slice(4, 6), 16));
}
function ratio(a, b) {
  if (!a?.startsWith("#") || !b?.startsWith("#")) return null;
  const [x, y] = [lum(a), lum(b)];
  return Math.round(((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)) * 100) / 100;
}

const WHITE = resolve("--sa-bg-neutral-base");

// ── ramps ────────────────────────────────────────────────────────────────
const RAMP_ORDER = ["primaryScale", "secondaryScale", "accentScale", "neutralScale",
  "successScale", "dangerScale", "warningScale", "infoScale"];
const ANCHOR = {
  primaryScale: { 500: "anchor · blue", 600: "anchor · navy" },
  secondaryScale: { 400: "anchor" }, accentScale: { 500: "anchor" },
  successScale: { 500: "anchor" }, dangerScale: { 400: "anchor" },
  warningScale: { 300: "anchor" }, infoScale: { 500: "anchor" }, neutralScale: {},
};
const ramps = RAMP_ORDER.map((name) => {
  const steps = Object.keys(ROOT)
    .map((n) => new RegExp(`^--sa-color-${name}-(\\d+)$`).exec(n))
    .filter(Boolean).map((m) => Number(m[1])).sort((a, b) => a - b);
  return {
    name,
    steps: steps.map((s) => {
      const token = `--sa-color-${name}-${s}`;
      const blue = resolve(token);
      const navy = resolve(token, NAVY);
      return { step: s, token, blue, navy, onWhite: ratio(blue, WHITE), anchor: ANCHOR[name][s] ?? null };
    }),
    brandVaries: steps.some((s) => resolve(`--sa-color-${name}-${s}`) !== resolve(`--sa-color-${name}-${s}`, NAVY)),
  };
});

// ── the 46 measured ink pairings ─────────────────────────────────────────
const RUNGS = ["subtler", "subtle", "base", "bold", "bolder", "boldest"];
const FAMILIES = ["neutral", "brand-primary", "brand-secondary", "brand-accent",
  "status-success", "status-error", "status-warning", "status-info"];
const pairs = FAMILIES.map((fam) => ({
  family: fam,
  label: fam.replace("brand-", "brand / ").replace("status-", "status / "),
  rungs: RUNGS.map((rung) => {
    const path = fam.replace("brand-", "brand/").replace("status-", "status/");
    const fillTok = `--sa-bg-${fam}-${rung}`.replace(`-${fam}-`, `-${fam}-`);
    const bg = `--sa-bg-${path.replace(/\//g, "-")}-${rung}`;
    const on = `--sa-on-bg-${path.replace(/\//g, "-")}-${rung}`;
    const fill = resolve(bg), ink = resolve(on);
    if (!fill || !ink) return null;
    return { rung, bgToken: `bg/${path}/${rung}`, onToken: `on/bg/${path}/${rung}`,
      fill, ink, ratio: ratio(ink, fill) };
  }).filter(Boolean),
}));
const allPairs = pairs.flatMap((f) => f.rungs);

// ── the rung-name ledger, straight from the build ────────────────────────
const ledger = payload.contrast.shortfall.map((s) => {
  const m = /^Color::(\S+)\s+—\s+([\d.]+):1\s+vs\s+≥([\d.]+):1\s+\("(\w+)"\)$/.exec(s);
  return m ? { token: m[1], measured: Number(m[2]), implied: Number(m[3]), rung: m[4] } : { token: s };
});

// ── charts ───────────────────────────────────────────────────────────────
const chart = {
  categorical: Array.from({ length: 12 }, (_, i) => {
    const t = `--sa-chart-cat-${i + 1}`; const v = resolve(t);
    return { n: i + 1, token: `chart/cat/${i + 1}`, value: v, onPage: ratio(v, WHITE) };
  }),
  sequential: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    .map((s) => ({ step: s, token: `chart/seq/${s}`, value: resolve(`--sa-chart-seq-${s}`) })),
  diverging: ["negStrong", "neg", "negSoft", "mid", "posSoft", "pos", "posStrong"]
    .map((k) => ({ key: k, token: `chart/div/${k}`, value: resolve(`--sa-chart-div-${k}`) })),
  trend: ["up", "down", "flat"].map((k) => ({ key: k, token: `chart/trend/${k}`, value: resolve(`--sa-chart-trend-${k}`) })),
  structural: ["grid", "axis", "tooltipBg", "tooltipInk", "regionEmpty", "regionStroke"]
    .map((k) => ({ key: k, token: `chart/${k}`, value: resolve(`--sa-chart-${k}`) })),
};

// ── alpha, layers, slots ─────────────────────────────────────────────────
const ALPHA_FAMILIES = ["neutral", "primary", "secondary", "accent", "success", "danger", "warning", "white"];
const alpha = ALPHA_FAMILIES.map((f) => ({
  family: f,
  steps: [8, 16, 24, 32, 40, 48].map((s) => ({ step: s, token: `color/transparent/${f}/${s}`,
    value: resolve(`--sa-color-transparent-${f}-${s}`) })).filter((x) => x.value),
})).filter((f) => f.steps.length);

const layers = [0, 1, 2, 3].map((d) => ({ depth: d, surface: resolve(`--sa-layer-${d}`), border: resolve(`--sa-layer-border-${d}`) }));

const colorCollection = payload.collections.find((c) => c.name === "Color");
const slotCounts = {};
for (const v of colorCollection.variables) {
  const head = v.name.split("/")[0];
  slotCounts[head] = (slotCounts[head] ?? 0) + 1;
}

// ── what was retired ─────────────────────────────────────────────────────
const RETIRED = [
  ["--ds-yellow", "--sa-color-brand-yellow", "Retired 2026-08-12. Measured 1.44:1 — never text at any size. For yellow emphasis use bg/status/warning/subtler behind dark ink."],
  ["--ds-saffron", "--sa-color-brand-saffron", "Retired. 2.91:1 — below even the 3:1 that WCAG 1.4.11 asks of non-text. Decorative fills only."],
  ["--ds-neutral-1000", "--sa-color-neutralScale-950", "Retired, and it was off by one rung: it held neutralScale/950 while --ds-neutral-1100 held the real 1000."],
  ["--ds-danger", "--sa-color-status-danger", "Retired. It was dangerScale/700, not the 500 its bare name suggested."],
  ["--ds-border", "--sa-border-neutral-subtle", "Retired. A hairline divider at 1.35:1, not a control boundary."],
  ["--ds-text-title-1", "--sa-type-headline-2-size", "Retired. It resolved to the HEADLINE-2 role, not Title 1 — the alias trap behind four production bugs."],
].map(([from, to, note]) => {
  const value = resolve(to);
  return { from, to, value, onWhite: value?.startsWith("#") ? ratio(value, WHITE) : null, note };
});

// ── the section list both surfaces share ─────────────────────────────────
const SECTIONS = [
  ["hero", "At a glance"],
  ["anatomy", "How to read a colour token"],
  ["tiers", "Three tiers, and the one you are allowed to type"],
  ["ramps", "The ramps"],
  ["prominence", "Six rungs, from quiet to loud"],
  ["ink-pairings", "Never choose an ink — the system already measured one"],
  ["slots", "Seven slots, and a slot means one thing only"],
  ["status", "Four meanings, and never colour alone"],
  ["states", "Interaction states, and the ring that must always be visible"],
  ["layers", "Depth without guessing a grey"],
  ["neutrals-alpha", "A grey that belongs to the brand, and six levels of translucency"],
  ["brands", "Two brands, and exactly what a swap changes"],
  ["conformance", "What this palette owes to DBIM and UX4G"],
  ["charts", "Twelve series, and the rules that keep a chart readable"],
  ["do-and-dont", "Nine mistakes this estate has actually made"],
  ["accessibility", "The floors, and how they are held"],
  ["handoff", "From this variable to that line of code"],
  ["retired", "What was retired, and what replaced it"],
  ["provenance", "Where these numbers come from"],
].map(([id, title]) => ({ id, title }));

const meta = {
  ramps: ramps.length,
  brands: 2,
  rungs: RUNGS.length,
  inkPairs: allPairs.length,
  worstInkPair: Math.min(...allPairs.map((p) => p.ratio)),
  belowAA: allPairs.filter((p) => p.ratio < 4.5).length,
  rungCaveats: ledger.length,
  brandVaryingRamps: ramps.filter((r) => r.brandVaries).map((r) => r.name),
  worstChartSeries: Math.min(...chart.categorical.map((c) => c.onPage)),
  generatedFrom: "packages/tokens/dist/tokens.css",
};

const out = `/* GENERATED by @mosje/tokens (build/generate-color-docs-data.mjs) — do not edit.

   Every value here is READ FROM dist/tokens.css, so this page cannot state a colour or a
   contrast ratio the build does not produce. It replaced 88 hand-copied hex literals, 14 of
   which had stopped matching any token in the system.

   Its counterpart in Figma is variable-BOUND for the same reason. Both surfaces are pinned to
   one source; what they cannot pin is STRUCTURE, so SECTIONS below is gated by
   scripts/check-color-docs.mjs against the Figma frame's section list.

   Regenerate: npm run build -w @mosje/tokens */

export type RampStep = { step: number; token: string; blue: string; navy: string; onWhite: number | null; anchor: string | null };
export type Ramp = { name: string; steps: RampStep[]; brandVaries: boolean };
export type InkPair = { rung: string; bgToken: string; onToken: string; fill: string; ink: string; ratio: number | null };
export type PairFamily = { family: string; label: string; rungs: InkPair[] };
export type LedgerEntry = { token: string; measured?: number; implied?: number; rung?: string };
export type Section = { id: string; title: string };

export const META = ${JSON.stringify(meta, null, 2)} as const;

export const SECTIONS: readonly Section[] = ${JSON.stringify(SECTIONS, null, 2)};

export const RAMPS: readonly Ramp[] = ${JSON.stringify(ramps, null, 2)};

export const INK_PAIRS: readonly PairFamily[] = ${JSON.stringify(pairs, null, 2)};

export const RUNG_LEDGER: readonly LedgerEntry[] = ${JSON.stringify(ledger, null, 2)};

export const CHART = ${JSON.stringify(chart, null, 2)} as const;

export const ALPHA = ${JSON.stringify(alpha, null, 2)} as const;

export const LAYERS = ${JSON.stringify(layers, null, 2)} as const;

export const SLOT_COUNTS = ${JSON.stringify(slotCounts, null, 2)} as const;

export const RETIRED = ${JSON.stringify(RETIRED, null, 2)} as const;
`;

const target = here("../../../apps/hub/src/app/design-system/foundations/color/color-data.ts");
writeFileSync(target, out);
console.log(`✓ generated color-data.ts — ${ramps.length} ramps, ${allPairs.length} ink pairs, ` +
  `${ledger.length} ledger entries, ${SECTIONS.length} sections`);
