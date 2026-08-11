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
 * Named export -> the `--ds-*` it mirrors.
 *
 * `gov` was dropped from the colour vocabulary on 2026-08-11, so `govNavy`/`govYellow` are
 * now `navy`/`yellow`. No deprecated aliases are carried: a repo-wide search found no
 * importer of any named export here, so there is nothing to keep working — and two spellings
 * for one colour is the problem this file already demonstrated.
 */
const COLORS = {
  primary: "--ds-primary",
  primaryTonal: "--ds-primary-tonal",
  primaryDark: "--ds-primary-dark",
  primaryRing: "--ds-primary-ring",
  success: "--ds-success",
  successTonal: "--ds-success-tonal",
  danger: "--ds-danger",
  warning: "--ds-warning",
  info: "--ds-info",
  ink: "--ds-ink",
  inkStrong: "--ds-ink-strong",
  inkMuted: "--ds-ink-muted",
  onPrimary: "--ds-on-primary",
  surface: "--ds-surface",
  // `surfaceAlt` was the literal #f4f3f9, a neutral-75 step the ramp no longer has. It is
  // pointed at the real muted surface rather than kept as an orphan literal.
  surfaceAlt: "--ds-surface-muted",
  surfaceMuted: "--ds-surface-muted",
  border: "--ds-border",
  borderStrong: "--ds-border-strong",
  saffron: "--ds-saffron",
  saffronLight: "--ds-saffron-light",
  saffronDark: "--ds-saffron-dark",
  navy: "--ds-navy",
  yellow: "--ds-yellow",
};

const RADIUS = {
  xxs: "--ds-radius-xxs",
  xs: "--ds-radius-xs",
  sm: "--ds-radius-sm",
  md: "--ds-radius-md",
  pill: "--ds-radius-full",
};

const SHADOW = { xs: "--ds-shadow-xs", lg: "--ds-shadow-lg", xl: "--ds-shadow-xl" };

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
  const typography = Object.fromEntries(
    TYPE_ROLES.map((r) => [camel(r), { size: take(`--ds-text-${r}`), leading: take(`--ds-leading-${r}`) }]),
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
   frozen to the default brand and cannot follow \`data-brand\` — \`var(--ds-primary)\` repaints
   when the brand switches and \`colors.primary\` does not. */
export const colors = {
${obj(colors)}
} as const;

export const radius = {
${obj(radius)}
} as const;

export const fontFamily = {
  sans: ${JSON.stringify(take("--ds-font-sans") ?? '"Noto Sans", ui-sans-serif, system-ui, sans-serif')},
} as const;

/** Named type styles. Fluid: \`size\`/\`leading\` are clamp() or rem strings, not px numbers. */
export const typography = {
${obj(typography)}
} as const;

export const shadow = {
${obj(shadow)}
} as const;

export const tokens = { colors, radius, fontFamily, typography, shadow } as const;
export default tokens;
`;

  writeFileSync(here("../../design-system/tokens.ts"), out);
  process.stdout.write(
    `✓ generated packages/design-system/tokens.ts — ${Object.keys(colors).length} colours, ` +
      `${Object.keys(radius).length} radii, ${Object.keys(typography).length} type roles\n`,
  );
}

main();
