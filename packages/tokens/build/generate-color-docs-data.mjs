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
import { ALPHA_USE } from "./usage-guidance.mjs";
import { hexToOklch, deltaE, hueDelta } from "./oklch.mjs";
import { simulateCvd, CVD_TYPES } from "./cvd.mjs";

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
const MUTED = resolve("--sa-bg-neutral-subtler");
const ok = (hex) => { if (!hex?.startsWith("#")) return null; const o = hexToOklch(hex); return { L: Math.round(o.L * 10) / 10, C: Math.round(o.C * 1000) / 1000, H: Math.round(o.H) }; };

// ── ramps ────────────────────────────────────────────────────────────────
const RAMP_ORDER = ["primaryScale", "secondaryScale", "accentScale", "neutralScale",
  "successScale", "dangerScale", "warningScale", "infoScale"];
const ANCHOR = {
  primaryScale: { 500: "anchor · blue", 600: "anchor · navy" },
  secondaryScale: { 400: "anchor" }, accentScale: { 600: "anchor" },
  successScale: { 600: "anchor" }, dangerScale: { 400: "anchor" },
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
      return { step: s, token, blue, navy, onWhite: ratio(blue, WHITE), onMuted: ratio(blue, MUTED), oklch: ok(blue), anchor: ANCHOR[name][s] ?? null };
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

// ── the alpha ladder, and every token built on it ────────────────────────
// Read from the payload rather than the CSS so the base+opacity STRUCTURE is visible: the
// stylesheet has already folded it into a color-mix() expression.
const alphaScale = payload.collections.find((c) => c.name === "Static").variables
  .filter((v) => /^alpha\//.test(v.name))
  .map((v) => ({ step: Number(v.name.split("/")[1]), css: `--sa-alpha-${v.name.split("/")[1]}`, figma: v.name,
    value: resolve(`--sa-alpha-${v.name.split("/")[1]}`), use: ALPHA_USE[v.name.split("/")[1]] ?? "" }))
  .sort((a, b) => a.step - b.step);
const translucent = [];
for (const c of payload.collections) for (const v of c.variables) {
  const first = Object.values(v.valuesByMode)[0];
  if (first?.type === "ALIAS" && first.opacity) translucent.push({ token: v.name, base: first.name, alpha: first.opacity.name, fallback: first.fallback?.value ?? null, css: `--sa-${v.path.replace(/\//g, "-")}` });
}
const translucentGroups = [
  { group: "Overlay tiers", match: (t) => /^color\/transparent\//.test(t) },
  { group: "Inverse button states", match: (t) => /^cmp\/action\/.*\/inverse\//.test(t) },
  { group: "Transparent resting fills", match: (t) => /^cmp\/action\//.test(t) && !/\/inverse\//.test(t) },
  { group: "Scrim, washes and rules", match: () => true },
].map((g) => { const rows = translucent.filter((t) => g.match(t.token)); translucent.splice(0, 0); return { group: g.group, count: rows.length, examples: rows.slice(0, 3).map((r) => ({ token: r.token, base: r.base, alpha: r.alpha })) }; });
// each token belongs to the FIRST group that matches, so re-run as a partition
{
  const seen = new Set();
  for (const g of translucentGroups) {
    const spec = [/^color\/transparent\//, /^cmp\/action\/.*\/inverse\//, /^cmp\/action\//, /./][translucentGroups.indexOf(g)];
    const rows = translucent.filter((t) => !seen.has(t.token) && spec.test(t.token));
    rows.forEach((r) => seen.add(r.token));
    g.count = rows.length;
    g.examples = rows.slice(0, 3).map((r) => ({ token: r.token, base: r.base, alpha: r.alpha, css: r.css }));
  }
}

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


// ── the status pairing matrix — every pair a component actually uses ─────
const STATUSES = ["success", "error", "warning", "info"];
const statusMatrix = STATUSES.map((st) => {
  const t = (n) => resolve(`--sa-${n}`);
  const bg = (r) => `bg-status-${st}-${r}`, tx = (r) => `text-status-${st}-${r}`, on = (r) => `on-bg-status-${st}-${r}`;
  const row = (label, use, fillTok, inkTok) => ({ label, use, fillToken: fillTok.replace(/-/g, "/"), inkToken: inkTok.replace(/-/g, "/"), fill: t(fillTok), ink: t(inkTok), ratio: ratio(t(inkTok), t(fillTok)) });
  return {
    status: st,
    pairs: [
      row("Message on the page", "Field message, inline note, table cell", "bg-neutral-subtler", tx("base")),
      row("Message on a card", "Alert body on white", "bg-neutral-base", tx("base")),
      row("Base tint + base ink", "Alert, callout, toast ground", bg("base"), tx("base")),
      row("Subtler tint + bolder ink", "Tonal badge, chip, docs status pill", bg("subtler"), tx("bolder")),
      row("Bold tint + measured ink", st === "warning" ? "Solid amber chip — amber's only solid" : "Selected row, active filter", bg("bold"), on("bold")),
      row("Bolder fill + measured ink", "Solid badge, filled banner, primary action", bg("bolder"), on("bolder")),
      row("Boldest fill + measured ink", "Maximum emphasis", bg("boldest"), on("boldest")),
    ],
    icon: { token: `icon/status/${st}/base`, value: t(`icon-status-${st}-base`), onWhite: ratio(t(`icon-status-${st}-base`), WHITE) },
    border: { token: `border/status/${st}/base`, value: t(`border-status-${st}-base`), onWhite: ratio(t(`border-status-${st}-base`), WHITE), onMuted: ratio(t(`border-status-${st}-base`), MUTED) },
  };
});

// ── colour vision — Machado 2009 at severity 1.0, the matrices Chrome and Figma use ──
const simSet = (entries) => entries.map(([label, token]) => {
  const v = resolve(token);
  return { label, token: token.replace(/^--sa-/, "").replace(/-/g, "/"), value: v, sim: Object.fromEntries(CVD_TYPES.map((t) => [t, simulateCvd(v, t)])) };
});
const worstPairs = (set) => Object.fromEntries(["none", ...CVD_TYPES].map((t) => {
  let w = { d: Infinity, a: "", b: "" };
  for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) {
    const a = t === "none" ? set[i].value : set[i].sim[t], b = t === "none" ? set[j].value : set[j].sim[t];
    const d = deltaE(a, b); if (d < w.d) w = { d: Math.round(d * 10) / 10, a: set[i].label, b: set[j].label };
  }
  return [t, w];
}));
const cvdSets = [
  { key: "inks", title: "Status text and the brand ink", entries: simSet([["success", "--sa-text-status-success-base"], ["error", "--sa-text-status-error-base"], ["warning", "--sa-text-status-warning-base"], ["info", "--sa-text-status-info-base"], ["brand", "--sa-text-brand-primary-base"]]) },
  { key: "fills", title: "Solid fills under white ink", entries: simSet([["success", "--sa-bg-status-success-bolder"], ["error", "--sa-bg-status-error-bolder"], ["warning", "--sa-bg-status-warning-bolder"], ["info", "--sa-bg-status-info-bolder"], ["primary", "--sa-bg-brand-primary-bolder"], ["secondary", "--sa-bg-brand-secondary-bolder"]]) },
  { key: "tints", title: "Tonal grounds (subtler)", entries: simSet([["success", "--sa-bg-status-success-subtler"], ["error", "--sa-bg-status-error-subtler"], ["warning", "--sa-bg-status-warning-subtler"], ["info", "--sa-bg-status-info-subtler"], ["primary", "--sa-bg-brand-primary-subtler"]]) },
  { key: "chart", title: "Categorical series 1–9", entries: simSet(Array.from({ length: 9 }, (_, i) => [`S${i + 1}`, `--sa-chart-cat-${i + 1}`])) },
  { key: "diverging", title: "Diverging scale ends", entries: simSet([["negative", "--sa-chart-div-neg"], ["positive", "--sa-chart-div-pos"], ["neg strong", "--sa-chart-div-negStrong"], ["pos strong", "--sa-chart-div-posStrong"]]) },
].map((s) => ({ ...s, worst: worstPairs(s.entries) }));

// ── every mode, measured inside its own stylesheet block ─────────────────
// The UX4G palette modes left the shipped CSS on 2026-09-04 (the parity sheet is a tool artifact now).
const ALL_CSS = css;
const modeIds = [...new Set([...ALL_CSS.matchAll(/^\[data-brand="([a-z0-9-]+)"\]/gm)].map((m) => m[1]))];
function modeDecls(id) {
  const out = {};
  for (const m of ALL_CSS.matchAll(/\[data-brand="([a-z0-9-]+)"\][^{]*\{([^}]*)\}/g)) {
    if (m[1] !== id) continue;
    for (const d of m[2].matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  }
  return out;
}
const MODE_ROLES = [
  ["text/status/success/base", "--sa-text-status-success-base", "--sa-bg-neutral-subtler", 4.5],
  ["text/status/error/base", "--sa-text-status-error-base", "--sa-bg-neutral-subtler", 4.5],
  ["text/status/warning/base", "--sa-text-status-warning-base", "--sa-bg-neutral-subtler", 4.5],
  ["text/status/info/base", "--sa-text-status-info-base", "--sa-bg-neutral-subtler", 4.5],
  ["text/brand/primary/base", "--sa-text-brand-primary-base", "--sa-bg-neutral-subtler", 4.5],
  ["text/link/brand/default", "--sa-text-link-brand-default", "--sa-bg-neutral-subtler", 4.5],
  ["border/neutral/bolder/default", "--sa-border-neutral-bolder-default", "--sa-bg-neutral-subtler", 3],
  ["focus/ring", "--sa-focus-ring", "--sa-bg-neutral-base", 3],
  ["on/bg/brand/primary/bolder", "--sa-on-bg-brand-primary-bolder", "--sa-bg-brand-primary-bolder", 4.5],
  ["on/bg/status/warning/bold", "--sa-on-bg-status-warning-bold", "--sa-bg-status-warning-bold", 4.5],
  ["text/neutral/disabled", "--sa-text-neutral-disabled", "--sa-bg-neutral-disabled", 0],
];
const modes = ["blue", ...modeIds.filter((id) => id !== "blue" && id !== "dbim")].map((id) => {
  const over = id === "blue" ? {} : modeDecls(id);
  return {
    id,
    kind: id === "blue" || id === "navy" ? "brand" : id.startsWith("dbim") ? "DBIM preview" : "UX4G mode",
    roles: MODE_ROLES.map(([token, fg, bg, floor]) => {
      const hexOr = (name) => { const v = resolve(name, over); return v?.startsWith("#") ? v : resolve(name); };
      const f = hexOr(fg), b = hexOr(bg);
      const r = ratio(f, b);
      return { token, value: f, against: bg.replace(/^--sa-/, "").replace(/-/g, "/"), ratio: r, floor, pass: floor === 0 ? null : r !== null && r >= floor };
    }),
  };
});

// ── every ink, icon and border role, against both grounds ────────────────
const roleContrast = Object.keys(ROOT)
  .filter((n) => /^--sa-(text|icon|border)-(neutral|brand|status|link)-/.test(n) && !/inverse|disabled/.test(n))
  .map((n) => { const v = resolve(n); if (!v?.startsWith("#")) return null; const role = n.startsWith("--sa-border") ? "border" : n.startsWith("--sa-icon") ? "icon" : "text"; const divider = role === "border" && /neutral\/(subtle|base)$/.test(n.replace(/^--sa-/, "").replace(/-/g, "/")); const floor = role === "text" ? 4.5 : divider ? 0 : 3; const w = ratio(v, WHITE), m = ratio(v, MUTED); const token = n.replace(/^--sa-/, "").replace(/-/g, "/"); const whiteOnly = token === "text/neutral/subtler" || token === "icon/neutral/subtler"; const judged = whiteOnly ? w : Math.min(w, m); return { token, role, value: v, onWhite: w, onMuted: m, floor, ground: whiteOnly ? "white" : "both", aaa: role === "text" && judged >= 7, pass: judged >= floor }; })
  .filter(Boolean)
  .sort((a, b) => a.token.localeCompare(b.token));

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
  ["in-use", "Three contexts, one palette"],
  ["colour-vision", "What a colour-blind reader sees"],
  ["modes", "Ten modes, one set of measurements"],
  ["alpha", "Translucency is a reference, not a hex"],
  ["provenance", "Where these numbers come from"],
].map(([id, title]) => ({ id, title }));

const meta = {
  translucentTokens: translucent.length,
  alphaSteps: alphaScale.length,
  ramps: ramps.length,
  brands: 2,
  rungs: RUNGS.length,
  inkPairs: allPairs.length,
  worstInkPair: Math.min(...allPairs.map((p) => p.ratio)),
  belowAA: allPairs.filter((p) => p.ratio < 4.5).length,
  rungCaveats: ledger.length,
  brandVaryingRamps: ramps.filter((r) => r.brandVaries).map((r) => r.name),
  worstChartSeries: Math.min(...chart.categorical.map((c) => c.onPage)),
  modesMeasured: modes.length,
  cvdSafeSeries: 9,
  worstCvdSeriesPair: Math.min(...CVD_TYPES.map((t) => cvdSets.find((s) => s.key === "chart").worst[t].d)),
  rolesMeasured: roleContrast.length,
  rolesBelowFloor: roleContrast.filter((r) => !r.pass).length,
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

export type RampStep = { step: number; token: string; blue: string; navy: string; onWhite: number | null; onMuted: number | null; oklch: { L: number; C: number; H: number } | null; anchor: string | null };
export type StatusPair = { label: string; use: string; fillToken: string; inkToken: string; fill: string; ink: string; ratio: number | null };
export type StatusRow = { status: string; pairs: StatusPair[]; icon: { token: string; value: string; onWhite: number | null }; border: { token: string; value: string; onWhite: number | null; onMuted: number | null } };
export type CvdEntry = { label: string; token: string; value: string; sim: Record<string, string> };
export type CvdSet = { key: string; title: string; entries: CvdEntry[]; worst: Record<string, { d: number; a: string; b: string }> };
export type ModeRole = { token: string; value: string | null; against: string; ratio: number | null; floor: number; pass: boolean | null };
export type Mode = { id: string; kind: string; roles: ModeRole[] };
export type RoleContrast = { token: string; role: string; value: string; onWhite: number | null; onMuted: number | null; floor: number; ground: string; aaa: boolean; pass: boolean };
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

export const ALPHA_SCALE = ${JSON.stringify(alphaScale, null, 2)} as const;

export const TRANSLUCENT = ${JSON.stringify(translucentGroups, null, 2)} as const;

export const LAYERS = ${JSON.stringify(layers, null, 2)} as const;

export const SLOT_COUNTS = ${JSON.stringify(slotCounts, null, 2)} as const;

export const RETIRED = ${JSON.stringify(RETIRED, null, 2)} as const;

export const STATUS_MATRIX: readonly StatusRow[] = ${JSON.stringify(statusMatrix, null, 2)};

export const CVD: readonly CvdSet[] = ${JSON.stringify(cvdSets, null, 2)};

export const MODES: readonly Mode[] = ${JSON.stringify(modes, null, 2)};

export const ROLE_CONTRAST: readonly RoleContrast[] = ${JSON.stringify(roleContrast, null, 2)};
`;

const target = here("../../../apps/hub/src/app/design-system/foundations/color/color-data.ts");
writeFileSync(target, out);
console.log(`✓ generated color-data.ts — ${ramps.length} ramps, ${allPairs.length} ink pairs, ` +
  `${ledger.length} ledger entries, ${SECTIONS.length} sections`);
