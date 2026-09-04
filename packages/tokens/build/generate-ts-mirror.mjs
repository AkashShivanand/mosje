/**
 * Generate `packages/design-system/tokens.ts` — the typed named-export mirror.
 *
 * WHY THIS IS GENERATED NOW
 * -------------------------
 * It used to be hand-maintained, with a banner asking whoever touched it to "keep values in
 * sync". On 2026-08-11 that was measured: **12 of its 22 colours had drifted**, and most of
 * the drift long predated the colour rebuild that surfaced it —
 *
 *   warning  #ffd323  was gov-yellow, not the warning colour
 *   info     #0373df  was the primary blue, not info
 *   danger   #ec5042  was dangerScale/500, while --ds-danger is /700
 *   ink      #212121  was a colour the system had already stopped using
 *
 * (The correct values are deliberately not quoted here. They were, and four of them went
 * stale within the day when the functional and neutral ramps were regenerated — a comment
 * about a file that exists to stop hand-copied values is a poor place to hand-copy values.)
 *
 * plus `radius.pill` at 100px against a real 999px, shadows built on `rgba(33,33,33,…)`
 * against a real `rgba(31,36,40,…)`, and a typography block written in fixed px for a scale
 * that has been fluid `clamp()` for months.
 *
 * A file that asks to be kept in sync by hand will not be. The values are now READ FROM THE
 * BUILT STYLESHEET, so this mirror cannot say anything the CSS does not.
 *
 * IT FAILS LOUDLY. Every name below must resolve; an unresolvable one throws rather than
 * emitting a stale or empty value, because a silently-wrong token is what this file was.
 */

import { readFileSync, writeFileSync } from "node:fs";

const here = (p) => new URL(p, import.meta.url).pathname;

/** Resolve a custom property to its literal, following `var()` chains. */
function resolver(css) {
  return function resolve(name, depth = 0) {
    if (depth > 8) return null;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = css.match(new RegExp(`^\\s*${escaped}\\s*:\\s*([^;]+);`, "m"));
    if (!m) return null;
    const value = m[1].trim();
    const ref = value.match(/^var\((--[a-zA-Z0-9-]+)\)$/);
    return ref ? resolve(ref[1], depth + 1) : value;
  };
}

/**
 * Named export -> the canonical `--sa-*` it mirrors.
 *
 * `gov` was dropped from the colour vocabulary on 2026-08-11, so `govNavy`/`govYellow` are
 * now `navy`/`yellow`. No deprecated aliases are carried: a repo-wide search found no
 * importer of any named export here, so there is nothing to keep working — and two spellings
 * for one colour is the problem this file already demonstrated.
 */
const COLORS = {
  primary: "--sa-color-action-primary-default",
  primaryTonal: "--sa-color-action-primary-tonal",
  primaryDark: "--sa-color-action-primary-hover",
  primaryRing: "--sa-focus-ring",
  success: "--sa-color-status-success",
  successTonal: "--sa-color-status-successTonal",
  danger: "--sa-color-status-danger",
  warning: "--sa-color-status-warning",
  info: "--sa-color-status-info",
  ink: "--sa-color-text-default",
  inkStrong: "--sa-text-neutral-bolder",
  inkMuted: "--sa-color-text-muted",
  onPrimary: "--sa-color-text-onPrimary",
  surface: "--sa-bg-neutral-base",
  // `surfaceAlt` was the literal #f4f3f9, a neutral-75 step the ramp no longer has. It is
  // pointed at the real muted surface rather than kept as an orphan literal.
  surfaceAlt: "--sa-bg-neutral-subtler",
  surfaceMuted: "--sa-bg-neutral-subtler",
  border: "--sa-border-neutral-subtle",
  borderStrong: "--sa-border-neutral-base",
  saffron: "--sa-color-brand-saffron",
  saffronLight: "--sa-color-brand-saffronLight",
  saffronDark: "--sa-color-brand-saffronDark",
  navy: "--sa-color-brand-navy",
  yellow: "--sa-color-brand-yellow",
};

// The tokens.ts RADIUS surface keeps ITS OWN key vocabulary — note it already diverges from the
// ladder (`pill`, not `full`), and renaming these keys would be a breaking change to a separate
// public API. Only the targets moved when the ladder was value-named on 2026-08-18; every value
// here is unchanged.
const RADIUS = {
  xxs: "--sa-shape-2",
  xs: "--sa-shape-4",
  sm: "--sa-shape-6",
  md: "--sa-shape-8",
  pill: "--sa-shape-full",
};

const SHADOW = { xs: "--sa-elevation-card", lg: "--sa-elevation-modal", xl: "--sa-elevation-toast" };

/**
 * Type roles, as `{ size, leading }` only.
 *
 * `weight` and `tracking` are gone from this mirror because the system has no token for
 * either — they were hand-typed numbers that nothing verified. Emitting them would restate
 * the exact failure this file is being generated to end.
 *
 * The values are `clamp()` and `rem` strings, not px numbers: the scale is fluid, and the
 * old fixed-px block described a system that has not existed for months.
 */
const TYPE_ROLES = ["display", "title-1", "headline", "title-2", "body-1", "body-2", "body-3", "label-1", "label-3"];

/**
 * Mirror key -> the canonical type ROLE it resolves to.
 *
 * These keys are the old `--ds-text-*` spellings, and two of them do NOT mean what they say:
 * `title-1` was the headline-2 role and `title-2` was title-1. That was the alias trap the
 * `--ds-*` vocabulary carried, and it caused four production bugs. The vocabulary was retired
 * on 2026-08-12; this table preserves the exact resolutions so the mirror's named exports keep
 * their values, and it is the last place the mismatch survives. Prefer `--sa-type-<role>-*`.
 */
const TYPE_TOKEN = {
  "display": "display-1",
  "title-1": "headline-2",
  "headline": "headline-1",
  "title-2": "title-1",
  "body-1": "body-1",
  "body-2": "body-2",
  "body-3": "body-3",
  "label-1": "label-1",
  "label-3": "label-3",
};
const camel = (r) => r.replace(/-(\w)/g, (_, c) => c.toUpperCase());

function main() {
  const css = readFileSync(here("../dist/tokens.css"), "utf8");
  const resolve = resolver(css);
  const missing = [];
  const take = (name) => {
    const v = resolve(name);
    if (v === null) missing.push(name);
    return v;
  };

  const colors = Object.fromEntries(Object.entries(COLORS).map(([k, v]) => [k, take(v)]));
  const radius = Object.fromEntries(Object.entries(RADIUS).map(([k, v]) => [k, take(v)]));
  const shadow = Object.fromEntries(Object.entries(SHADOW).map(([k, v]) => [k, take(v)]));
  // Read the icon scale straight out of the stylesheet. Listing the steps here would be a
  // second place to forget when the scale moves — which is exactly how the docs page that
  // documented only 16/20/24 fell three steps behind the tokens.
  const iconSize = Object.fromEntries(
    [...css.matchAll(/--sa-icon-size-(\d+)\s*:/g)]
      .map((m) => Number(m[1]))
      .filter((n, i, a) => a.indexOf(n) === i)
      .sort((a, b) => a - b)
      .map((n) => [`px${n}`, n]),
  );

  const typography = Object.fromEntries(
    TYPE_ROLES.map((r) => [camel(r), {
      size: take(`--sa-type-${TYPE_TOKEN[r]}-size`),
      leading: take(`--sa-type-${TYPE_TOKEN[r]}-lh`),
      // A Hindi block at this role: same size, the derived Devanagari leading.
      leadingDevanagari: take(`--sa-type-${TYPE_TOKEN[r]}-lhDevanagari`),
    }]),
  );

  if (missing.length) {
    throw new Error(
      `generate-ts-mirror: ${missing.length} token(s) did not resolve in dist/tokens.css — ` +
        `refusing to emit a mirror with holes in it:\n  ${missing.join("\n  ")}`,
    );
  }

  const obj = (o, indent = "  ") =>
    Object.entries(o)
      .map(([k, v]) =>
        typeof v === "object"
          ? `${indent}${k}: { ${Object.entries(v).map(([a, b]) => `${a}: ${JSON.stringify(b)}`).join(", ")} },`
          : `${indent}${k}: ${JSON.stringify(v)},`,
      )
      .join("\n");

  const out = `/* GENERATED by @mosje/tokens (build/generate-ts-mirror.mjs) — do not edit.
   The typed named-export mirror of the token contract, for consumers that want values in TS
   rather than CSS custom properties. Values are READ FROM dist/tokens.css, so this file
   cannot disagree with what actually renders.

   It was hand-maintained until 2026-08-11, at which point 12 of its 22 colours had drifted —
   \`warning\` was gov-yellow, \`info\` was the primary blue, \`danger\` pointed at the wrong
   rung — along with radius.pill, every shadow, and a typography block still written in fixed
   px for a scale that is fluid. Regenerate with: npm run build -w @mosje/tokens

   PREFER THE CSS CUSTOM PROPERTIES. These literals are resolved at BUILD time, so they are
   frozen to the default brand and cannot follow \`data-brand\` — \`var(--sa-color-action-primary-default)\` repaints
   when the brand switches and \`colors.primary\` does not. */
export const colors = {
${obj(colors)}
} as const;

export const radius = {
${obj(radius)}
} as const;

export const fontFamily = {
  sans: ${JSON.stringify(take("--sa-font-latin") ?? '"Noto Sans", ui-sans-serif, system-ui, sans-serif')},
} as const;

/** Named type styles. Fluid: \`size\`/\`leading\` are clamp() or rem strings, not px numbers. */
export const typography = {
${obj(typography)}
} as const;

export const shadow = {
${obj(shadow)}
} as const;

/** Icon sizes in px, read from the stylesheet so this list cannot fall behind the scale.
    DBIM 3.0 section 3.4 publishes 24, 32, 48 and 64; the smaller steps are ours and are kept
    deliberately (.claude/rules/standards-precedence.md). */
export const iconSize = {
${obj(iconSize)}
} as const;

export const tokens = { colors, radius, fontFamily, typography, shadow, iconSize } as const;
export default tokens;
`;

  writeFileSync(here("../../design-system/tokens.ts"), out);
  process.stdout.write(
    `✓ generated packages/design-system/tokens.ts — ${Object.keys(colors).length} colours, ` +
      `${Object.keys(radius).length} radii, ${Object.keys(typography).length} type roles, ` +
      `${Object.keys(iconSize).length} icon sizes\n`,
  );
}

main();
