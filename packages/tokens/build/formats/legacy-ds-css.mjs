import { cssNameFor, tierOfFile, toCssName } from "../grammar.mjs";
import { makeRetier } from "./retier.mjs";
import { brandSelector } from "../brand-modes.mjs";
// Emits :root { --sa-*: <value>; ... } plus a hardcoded legacy --ds-* alias block.
// The legacy block maps each old name to the new token it now derives from, so values
// stay identical while the source of truth becomes the DTCG tokens.
//
// Two-surface fluid type: font.role.* tokens carry $extensions.mosje.type.{website,portal}
// with {min,max} bounds. The formatter emits --ds-type-{role}-{size|lh} as clamp(min@360px,
// fluid, max@1280px) — the Website scale in :root (default) and the Portal scale under
// [data-surface="portal"]. No @media breakpoints.

/** Expand a UX4G semantic-spacing family into --ds-<family>-<step> → --sa-ref-space-<family>-<step>. */
const spacingRole = (family, steps) =>
  // The semantic spacing roles were RENAMED (spacing.inline.m -> inline/m), so the target is
  // now the canonical top-level group, not a nested path under the raw scale.
  Object.fromEntries(steps.map((s) => [`--ds-${family}-${s}`, `--sa-${family}-${s}`]));

export const LEGACY_DS_ALIASES = {
  "--ds-primary":       "--sa-color-action-primary-default",
  "--ds-primary-tonal": "--sa-color-action-primary-tonal",
  "--ds-primary-dark":  "--sa-color-action-primary-hover",
  "--ds-primary-hover": "--sa-color-action-primary-hover",
  "--ds-link":          "--sa-text-link-brand-default",
  "--ds-primary-ring":  "--sa-focus-ring",
  "--ds-primary-50":    "--sa-color-primaryScale-50",
  "--ds-primary-100":   "--sa-color-primaryScale-100",
  "--ds-primary-200":   "--sa-color-primaryScale-200",
  "--ds-primary-300":   "--sa-color-primaryScale-300",
  "--ds-primary-400":   "--sa-color-primaryScale-400",
  "--ds-primary-500":   "--sa-color-primaryScale-500",
  "--ds-primary-600":   "--sa-color-primaryScale-600",
  "--ds-primary-700":   "--sa-color-primaryScale-700",
  "--ds-primary-800":   "--sa-color-primaryScale-800",
  "--ds-primary-900":   "--sa-color-primaryScale-900",
  // ── Full colour ramps synced from SAMAVESH Figma (mode-aware via [data-color-mode]) ──
  "--ds-secondary-50":  "--sa-color-secondaryScale-50",
  "--ds-secondary-100": "--sa-color-secondaryScale-100",
  "--ds-secondary-200": "--sa-color-secondaryScale-200",
  "--ds-secondary-300": "--sa-color-secondaryScale-300",
  "--ds-secondary-400": "--sa-color-secondaryScale-400",
  "--ds-secondary-500": "--sa-color-secondaryScale-500",
  "--ds-secondary-600": "--sa-color-secondaryScale-600",
  "--ds-secondary-700": "--sa-color-secondaryScale-700",
  "--ds-secondary-800": "--sa-color-secondaryScale-800",
  "--ds-secondary-900": "--sa-color-secondaryScale-900",
  "--ds-neutral-0":     "--sa-color-neutralScale-0",
  "--ds-neutral-50":    "--sa-color-neutralScale-50",
  "--ds-neutral-100":   "--sa-color-neutralScale-100",
  "--ds-neutral-200":   "--sa-color-neutralScale-200",
  "--ds-neutral-300":   "--sa-color-neutralScale-300",
  "--ds-neutral-400":   "--sa-color-neutralScale-400",
  "--ds-neutral-500":   "--sa-color-neutralScale-500",
  "--ds-neutral-600":   "--sa-color-neutralScale-600",
  "--ds-neutral-700":   "--sa-color-neutralScale-700",
  "--ds-neutral-800":   "--sa-color-neutralScale-800",
  "--ds-neutral-900":   "--sa-color-neutralScale-900",
  // RETARGETED 2026-08-11, value-preserving. The canonical neutral endpoints renumbered to
  // match UX4G (old 1000 -> 950, old 1100 -> 1000), so these two legacy names now point one
  // rung lower to keep rendering exactly what they always did: #0a0d13 and #000000. Keeping
  // the legacy spelling while the canonical name moves is precisely this layer's job.
  "--ds-neutral-1000":  "--sa-color-neutralScale-950",
  "--ds-neutral-1100":  "--sa-color-neutralScale-1000",
  "--ds-success-50":    "--sa-color-successScale-50",
  "--ds-success-100":   "--sa-color-successScale-100",
  "--ds-success-200":   "--sa-color-successScale-200",
  "--ds-success-300":   "--sa-color-successScale-300",
  "--ds-success-400":   "--sa-color-successScale-400",
  "--ds-success-500":   "--sa-color-successScale-500",
  "--ds-success-600":   "--sa-color-successScale-600",
  "--ds-success-700":   "--sa-color-successScale-700",
  "--ds-success-800":   "--sa-color-successScale-800",
  "--ds-success-900":   "--sa-color-successScale-900",
  "--ds-danger-50":     "--sa-color-dangerScale-50",
  "--ds-danger-100":    "--sa-color-dangerScale-100",
  "--ds-danger-200":    "--sa-color-dangerScale-200",
  "--ds-danger-300":    "--sa-color-dangerScale-300",
  "--ds-danger-400":    "--sa-color-dangerScale-400",
  "--ds-danger-500":    "--sa-color-dangerScale-500",
  "--ds-danger-600":    "--sa-color-dangerScale-600",
  "--ds-danger-700":    "--sa-color-dangerScale-700",
  "--ds-danger-800":    "--sa-color-dangerScale-800",
  "--ds-danger-900":    "--sa-color-dangerScale-900",
  "--ds-warning-50":    "--sa-color-warningScale-50",
  "--ds-warning-100":   "--sa-color-warningScale-100",
  "--ds-warning-200":   "--sa-color-warningScale-200",
  "--ds-warning-300":   "--sa-color-warningScale-300",
  "--ds-warning-400":   "--sa-color-warningScale-400",
  "--ds-warning-500":   "--sa-color-warningScale-500",
  "--ds-warning-600":   "--sa-color-warningScale-600",
  "--ds-warning-700":   "--sa-color-warningScale-700",
  "--ds-warning-800":   "--sa-color-warningScale-800",
  "--ds-warning-900":   "--sa-color-warningScale-900",
  "--ds-info-50":       "--sa-color-infoScale-50",
  "--ds-info-100":      "--sa-color-infoScale-100",
  "--ds-info-200":      "--sa-color-infoScale-200",
  "--ds-info-300":      "--sa-color-infoScale-300",
  "--ds-info-400":      "--sa-color-infoScale-400",
  "--ds-info-500":      "--sa-color-infoScale-500",
  "--ds-info-600":      "--sa-color-infoScale-600",
  "--ds-info-700":      "--sa-color-infoScale-700",
  "--ds-info-800":      "--sa-color-infoScale-800",
  "--ds-info-900":      "--sa-color-infoScale-900",
  "--ds-success":       "--sa-color-status-success",
  "--ds-success-tonal": "--sa-color-status-successTonal",
  "--ds-danger":        "--sa-color-status-danger",
  "--ds-danger-tonal":  "--sa-color-status-dangerTonal",
  "--ds-warning":       "--sa-color-status-warning",
  "--ds-warning-tonal": "--sa-color-status-warningTonal",
  "--ds-info":          "--sa-color-status-info",
  "--ds-info-tonal":    "--sa-color-status-infoTonal",
  "--ds-overlay":       "--sa-overlay-neutral-boldest",
  "--ds-ink":           "--sa-color-text-default",
  "--ds-ink-strong":    "--sa-text-neutral-bolder",
  "--ds-ink-muted":     "--sa-color-text-muted",
  "--ds-ink-info":      "--sa-color-text-info",
  "--ds-on-primary":    "--sa-color-text-onPrimary",
  "--ds-surface":       "--sa-bg-neutral-base",
  "--ds-surface-muted": "--sa-bg-neutral-subtler",
  "--ds-border":        "--sa-border-neutral-subtle",
  "--ds-border-strong": "--sa-border-neutral-base",
  "--ds-saffron":       "--sa-color-brand-saffron",
  "--ds-saffron-light": "--sa-color-brand-saffronLight",
  "--ds-saffron-dark":  "--sa-color-brand-saffronDark",
  "--ds-navy":          "--sa-color-brand-navy",
  "--ds-yellow":        "--sa-color-brand-yellow",
  "--ds-spacing-none":  "--sa-ref-space-none",
  "--ds-spacing-xxs":   "--sa-ref-space-xxs",
  "--ds-spacing-xs":    "--sa-ref-space-xs",
  "--ds-spacing-sm":    "--sa-ref-space-sm",
  "--ds-spacing-md":    "--sa-ref-space-md",
  "--ds-spacing-lg":    "--sa-ref-space-lg",
  "--ds-spacing-xl":    "--sa-ref-space-xl",
  "--ds-spacing-2xl":   "--sa-ref-space-2xl",
  "--ds-spacing-3xl":   "--sa-ref-space-3xl",
  "--ds-spacing-4xl":   "--sa-ref-space-4xl",
  "--ds-spacing-5xl":   "--sa-ref-space-5xl",
  "--ds-spacing-6xl":   "--sa-ref-space-6xl",
  "--ds-spacing-7xl":   "--sa-ref-space-7xl",
  "--ds-spacing-8xl":   "--sa-ref-space-8xl",
  "--ds-spacing-9xl":   "--sa-ref-space-9xl",
  "--ds-radius-none":   "--sa-radius-none",
  "--ds-radius-xxs":    "--sa-radius-xxs",
  "--ds-radius-xs":     "--sa-radius-xs",
  "--ds-radius-sm":     "--sa-radius-sm",
  "--ds-radius-md":     "--sa-radius-md",
  "--ds-radius-lg":     "--sa-radius-lg",
  "--ds-radius-xl":     "--sa-radius-xl",
  "--ds-radius-2xl":    "--sa-radius-2xl",
  "--ds-radius-3xl":    "--sa-radius-3xl",
  "--ds-radius-4xl":    "--sa-radius-4xl",
  "--ds-radius-5xl":    "--sa-radius-5xl",
  "--ds-radius-full":   "--sa-radius-full",
  "--ds-spacing-10xl":  "--sa-ref-space-10xl",
  "--ds-spacing-11xl":  "--sa-ref-space-11xl",

  // ── UX4G 3.0 semantic spacing roles (adopted verbatim; values match --ux4g-* 1:1) ──
  // Prefer these over the raw t-shirt scale: they state intent, not just a number.
  ...spacingRole("inline",  ["none", "2xs", "xs", "s", "m", "l", "xl"]),
  ...spacingRole("stack",   ["none", "2xs", "xs", "s", "m", "l", "xl"]),
  ...spacingRole("padding", ["none", "3xs", "2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"]),
  ...spacingRole("section", ["none", "xs", "s", "m", "l", "xl", "2xl"]),

  "--ds-control-height":"--sa-density-control-height",
  "--ds-font-sans":     "--sa-font-family-latin",
  "--ds-font-display":  "--sa-font-family-display",
  "--ds-font-mono":     "--sa-font-family-mono",
  "--ds-duration-fast": "--sa-motion-duration-fast",
  "--ds-duration-base": "--sa-motion-duration-base",
  "--ds-duration-slow": "--sa-motion-duration-slow",
  "--ds-easing-out":    "--sa-motion-easing-out",
  "--ds-easing-in":     "--sa-motion-easing-in",
  "--ds-easing-in-out": "--sa-motion-easing-inOut",
  "--ds-shadow-none":   "--sa-shadow-none",
  "--ds-shadow-xs":     "--sa-shadow-xs",
  "--ds-shadow-sm":     "--sa-shadow-sm",
  "--ds-shadow-md":     "--sa-shadow-md",
  "--ds-shadow-lg":     "--sa-shadow-lg",
  "--ds-shadow-xl":     "--sa-shadow-xl",

  // ── Data-visualisation palette (see color.chart in semantic.json) ───────────
  "--ds-chart-cat-1":   "--sa-chart-cat-1",
  "--ds-chart-cat-2":   "--sa-chart-cat-2",
  "--ds-chart-cat-3":   "--sa-chart-cat-3",
  "--ds-chart-cat-4":   "--sa-chart-cat-4",
  "--ds-chart-cat-5":   "--sa-chart-cat-5",
  "--ds-chart-cat-6":   "--sa-chart-cat-6",
  "--ds-chart-cat-7":   "--sa-chart-cat-7",
  "--ds-chart-cat-8":   "--sa-chart-cat-8",
  "--ds-chart-cat-9":   "--sa-chart-cat-9",
  "--ds-chart-cat-10":  "--sa-chart-cat-10",
  "--ds-chart-cat-11":  "--sa-chart-cat-11",
  "--ds-chart-cat-12":  "--sa-chart-cat-12",
  "--ds-chart-seq-50":  "--sa-chart-seq-50",
  "--ds-chart-seq-100": "--sa-chart-seq-100",
  "--ds-chart-seq-200": "--sa-chart-seq-200",
  "--ds-chart-seq-300": "--sa-chart-seq-300",
  "--ds-chart-seq-400": "--sa-chart-seq-400",
  "--ds-chart-seq-500": "--sa-chart-seq-500",
  "--ds-chart-seq-600": "--sa-chart-seq-600",
  "--ds-chart-seq-700": "--sa-chart-seq-700",
  "--ds-chart-seq-800": "--sa-chart-seq-800",
  "--ds-chart-seq-900": "--sa-chart-seq-900",
  "--ds-chart-div-neg-strong": "--sa-chart-div-negStrong",
  "--ds-chart-div-neg":        "--sa-chart-div-neg",
  "--ds-chart-div-neg-soft":   "--sa-chart-div-negSoft",
  "--ds-chart-div-mid":        "--sa-chart-div-mid",
  "--ds-chart-div-pos-soft":   "--sa-chart-div-posSoft",
  "--ds-chart-div-pos":        "--sa-chart-div-pos",
  "--ds-chart-div-pos-strong": "--sa-chart-div-posStrong",
  "--ds-chart-trend-up":    "--sa-chart-trend-up",
  "--ds-chart-trend-down":  "--sa-chart-trend-down",
  "--ds-chart-trend-flat":  "--sa-chart-trend-flat",
  "--ds-chart-grid":          "--sa-chart-grid",
  "--ds-chart-axis":          "--sa-chart-axis",
  "--ds-chart-tooltip-bg":    "--sa-chart-tooltipBg",
  "--ds-chart-tooltip-ink":   "--sa-chart-tooltipInk",
  "--ds-chart-region-empty":  "--sa-chart-regionEmpty",
  "--ds-chart-region-stroke": "--sa-chart-regionStroke",

  // ── Type scale: backed by fluid --ds-type-* clamp() variables ───────────────
  // --ds-type-* is defined in :root as the Website surface and overridden under
  // [data-surface="portal"]; both are fluid clamp() (no @media).
  //
  // ⚠ THE NAMES IN THIS BLOCK DO NOT MATCH design.md's ROLE TABLE. That is
  // deliberate, and it is not a bug — do not "fix" it.
  //
  // Two generations of names coexist:
  //
  //   1. This block — the HYPHENATED legacy family (--ds-text-title-1, …). These
  //      predate the Portal-DS scale. Each is mapped to whichever canonical role
  //      REPRODUCES ITS HISTORICAL RENDERED VALUE, not to the role that shares its
  //      spelling. So --ds-text-title-1 → headline-2 (24→32px), because that is
  //      what "title 1" measured in the old scale. Every value here is frozen in
  //      test/legacy-snapshot.json and asserted by test/build-output.test.mjs;
  //      re-pointing any of them at its same-named role silently resizes every
  //      legacy callsite in the estate.
  //
  //   2. The block below — the UNHYPHENATED canonical family (--ds-text-title1, …),
  //      which IS 1:1 with the roles and matches design.md. Prefer the canonical
  //      --ds-type-<role>-size / -lh tokens in new code; use these only to keep an
  //      old callsite compiling.
  //
  // Both invariants are locked by test/type-alias-parity.test.mjs. If you came
  // here because an alias "looks one step too large", read its resolved value and
  // the snapshot before changing anything — that mismatch is the whole point.
  "--ds-text-display":   "--ds-type-display-1-size",
  "--ds-leading-display":"--ds-type-display-1-lh",
  "--ds-text-headline":  "--ds-type-headline-1-size",
  "--ds-leading-headline":"--ds-type-headline-1-lh",
  "--ds-text-title-1":   "--ds-type-headline-2-size",
  "--ds-leading-title-1":"--ds-type-headline-2-lh",
  "--ds-text-title-2":   "--ds-type-title-1-size",
  "--ds-leading-title-2":"--ds-type-title-1-lh",
  "--ds-text-body-1":    "--ds-type-body-1-size",
  "--ds-leading-body-1": "--ds-type-body-1-lh",
  "--ds-text-body-2":    "--ds-type-body-2-size",
  "--ds-leading-body-2": "--ds-type-body-2-lh",
  "--ds-text-body-3":    "--ds-type-body-3-size",
  "--ds-leading-body-3": "--ds-type-body-3-lh",
  "--ds-text-label-1":   "--ds-type-label-1-size",
  "--ds-leading-label-1":"--ds-type-label-1-lh",
  "--ds-text-label-3":   "--ds-type-label-3-size",
  "--ds-leading-label-3":"--ds-type-label-3-lh",

  // Full responsive role set (new canonical names for all 21 roles)
  "--ds-text-display1":   "--ds-type-display-1-size",
  "--ds-text-display2":   "--ds-type-display-2-size",
  "--ds-text-display3":   "--ds-type-display-3-size",
  "--ds-text-display4":   "--ds-type-display-4-size",
  "--ds-text-display5":   "--ds-type-display-5-size",
  "--ds-text-display6":   "--ds-type-display-6-size",
  "--ds-text-headline1":  "--ds-type-headline-1-size",
  "--ds-text-headline2":  "--ds-type-headline-2-size",
  "--ds-text-headline3":  "--ds-type-headline-3-size",
  "--ds-text-headline4":  "--ds-type-headline-4-size",
  "--ds-text-headline5":  "--ds-type-headline-5-size",
  "--ds-text-headline6":  "--ds-type-headline-6-size",
  "--ds-text-title1":     "--ds-type-title-1-size",
  "--ds-text-title2":     "--ds-type-title-2-size",
  "--ds-text-title3":     "--ds-type-title-3-size",
  "--ds-text-body1":      "--ds-type-body-1-size",
  "--ds-text-body2":      "--ds-type-body-2-size",
  "--ds-text-body3":      "--ds-type-body-3-size",
  "--ds-text-label1":     "--ds-type-label-1-size",
  "--ds-text-label2":     "--ds-type-label-2-size",
  "--ds-text-label3":     "--ds-type-label-3-size",
  "--ds-leading-display1":  "--ds-type-display-1-lh",
  "--ds-leading-display2":  "--ds-type-display-2-lh",
  "--ds-leading-display3":  "--ds-type-display-3-lh",
  "--ds-leading-headline1": "--ds-type-headline-1-lh",
  "--ds-leading-headline2": "--ds-type-headline-2-lh",
  "--ds-leading-headline3": "--ds-type-headline-3-lh",
  "--ds-leading-title1":    "--ds-type-title-1-lh",
  "--ds-leading-title2":    "--ds-type-title-2-lh",
  "--ds-leading-body1":     "--ds-type-body-1-lh",
  "--ds-leading-body2":     "--ds-type-body-2-lh",
  "--ds-leading-label1":    "--ds-type-label-1-lh",
  "--ds-leading-label2":    "--ds-type-label-2-lh",
};

const val = (t) => (t.$value !== undefined ? t.$value : t.value);

// Fluid type: clamp() between a min (@360px viewport) and max (@1280px), Utopia-style.
/**
 * The viewport anchors `clamp()` interpolates between. Read from the TOKEN, not restated:
 * these were literals here and in figma-variables.mjs, so the estate had three copies of
 * 360/1280 and no way to notice if one drifted. `breakpoint/*` is now the single source.
 */
const bpPx = (dict, step) => {
  const t = dict.allTokens.find((x) => x.path.join(".") === `breakpoint.${step}`);
  if (!t) throw new Error(`legacy-ds-css: breakpoint/${step} is missing — the fluid type scale ` +
    `cannot be built without its anchors.`);
  return parseFloat(t.$value ?? t.value);
};

// Type is emitted in REM, not px. GIGW 3.0 and WCAG 1.4.4 are satisfied by browser zoom
// either way, but a reader who raises their browser's DEFAULT FONT SIZE without zooming —
// common among low-vision and older users, and the exact audience these services carry —
// gets nothing from a px scale. rem tracks that preference. UX4G 3.0 sizes type in rem for
// this reason and, until this change, was ahead of SAMAVESH on it.
//
// The viewport term stays in vw: that is the fluid half of the scale and is meant to track
// the screen, not the reader. So the expression is
//     clamp(minRem, calc(interceptRem + slopeVw), maxRem)
// which is Utopia's standard form and renders IDENTICALLY to the old px output at the 16px
// default root size — the conversion is value-preserving, and a test asserts it.
//
// Deliberately NOT converted: the hard `font-size: 16px` floor on mobile text-entry controls
// in components/forms/forms.css. iOS Safari's zoom-on-focus threshold is an absolute 16px,
// not a preference-relative one, so that literal is correct as px.
const REM_BASE = 16;
const round = (n, dp = 4) => Math.round(n * 10 ** dp) / 10 ** dp;
const rem = (px) => `${round(px / REM_BASE)}rem`;

/** Return a clamp() string (or a static rem value when min === max). */
function clampExpr(minPx, maxPx, wmin, wmax) {
  const min = parseFloat(minPx);
  const max = parseFloat(maxPx);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return maxPx ?? minPx;
  if (min === max) return min === 0 ? "0px" : rem(min);
  const range = wmax - wmin;
  const slopeVw = ((max - min) / range) * 100; // vw coefficient
  const yInt = min - ((max - min) / range) * wmin; // intercept, in px before conversion
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const s = round(slopeVw, 3);
  // Avoid "+ -Nvw" (valid but fragile) — emit "- Nvw" for negative slopes.
  const vwTerm = s < 0 ? `- ${Math.abs(s)}vw` : `+ ${s}vw`;
  return `clamp(${rem(lo)}, calc(${rem(yInt)} ${vwTerm}), ${rem(hi)})`;
}

/**
 * Build two-surface responsive --ds-type-* blocks from font.role.* tokens.
 * Website scale → :root (default surface); Portal scale → [data-surface="portal"].
 */
function buildResponsiveType(dictionary) {
  const WMIN = bpPx(dictionary, "mobile");
  const WMAX = bpPx(dictionary, "desktop");
  // font.role.<role>.{size|lh|para}  and  font.tracking.<key>  (letter-spacing)
  const roleTokens = dictionary.allTokens.filter(
    (t) => t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking")
  );
  if (!roleTokens.length) return { website: [], portal: [] };

  const website = [];
  const portal = [];

  for (const t of roleTokens) {
    // Paths were split on the hyphen (font/role/display/1/size) so no segment carries a
    // delimiter — RULE 1. The role family and its number rejoin here, which is the only
    // place that mapping lives.
    //
    // The canonical name is `--sa-type-*`. Typography was the LAST family still shipping on
    // the deprecated `--ds-` prefix — 201 tokens, the largest single group, invisible because
    // it is generated by this separate code path rather than from the token tree. `--ds-type-*`
    // is still emitted as an alias so the 21 properties consuming it keep working.
    const suffix =
      t.path[1] === "role"
        ? `${t.path.slice(2, -1).join("-")}-${t.path.at(-1)}`
        : `${t.path.slice(2).join("-")}-tracking`;
    const cssVar = `--sa-type-${suffix}`;
    const legacyVar = `--ds-type-${suffix}`;

    const ty = t.original?.$extensions?.mosje?.type;
    const webExpr = ty?.website ? clampExpr(ty.website.min, ty.website.max, WMIN, WMAX) : val(t);
    const portalExpr = ty?.portal ? clampExpr(ty.portal.min, ty.portal.max, WMIN, WMAX) : webExpr;

    website.push(`  ${cssVar}: ${webExpr};`);
    website.push(`  ${legacyVar}: var(${cssVar});`);
    if (portalExpr !== webExpr) {
      portal.push(`  ${cssVar}: ${portalExpr};`);
      // The alias must be re-asserted here too: a custom property substitutes var() at the
      // element where it is DECLARED, so without this every portal would render the website
      // scale through the legacy name — the exact bug design.md §1A documents.
      portal.push(`  ${legacyVar}: var(${cssVar});`);
    }
  }
  return { website, portal };
}

/**
 * Tier markers (spec §4.1). A token's tier comes from the file it is authored in, so the
 * DTCG path stays identical to the Figma variable path — the tier becomes the collection
 * and the CSS marker. Tier 2 carries no marker, so the most-typed token is the shortest.
 */
export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    // Exclude font.role.* from the --sa-* emission; they feed --ds-type-* instead.
    const regularTokens = dictionary.allTokens.filter(
      (t) => !(t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking"))
    );
    // Path → tier, so a {reference} can be resolved to the referent's MARKED name.
    const tierByPath = new Map(
      dictionary.allTokens.map((t) => [t.path.join("."), tierOfFile(t.filePath)])
    );

    /** Resolve a `{a.b.c}` reference to the referent's tier-marked CSS name. */
    const refToVar = (ref) => {
      const path = ref.slice(1, -1).split(".");
      return toCssName(path, tierByPath.get(path.join(".")) ?? "sys");
    };

    /**
     * The canonical Tier-2 AND Tier-3 namespaces are emitted as var() CHAINS, not resolved
     * literals.
     *
     * Style Dictionary resolves `{color.text.default}` to a hex by default. If we emitted
     * that hex, `--sa-text-neutral` would freeze at whatever :root computed and would stop
     * responding to [data-brand] — a custom property substitutes var() at the element where
     * it is DECLARED (design.md §1A). Keeping the chain, and re-asserting it in any block
     * that redeclares the target, is what makes brand islands work.
     *
     * Tier 3 was excluded until 2026-08-10, and the consequence was silent: all 296
     * `--sa-cmp-*` shipped as frozen hexes, so the ENTIRE component layer ignored the brand
     * axis. `--sa-cmp-action-brand-primary-default-bg` was `#025fb8` under Blue and `#025fb8`
     * under Navy — the primary button never changed brand. Figma had the same tokens as
     * ALIASES, where 85 of them did repaint, so the two sides disagreed about the layer that
     * describes buttons and nothing detected it. The source was never the problem: Tier 3 is
     * 196 references and zero literals. Only the emit flattened it.
     */
    const ALIAS_EMIT_FILE = /(system|component)\.generated\.json$|component\.json$/;
    const systemAliasPairs = [];
    const lines = regularTokens.map((t) => {
      const name = cssNameFor(t);
      const orig = t.original?.$value ?? t.original?.value;
      if (ALIAS_EMIT_FILE.test(t.filePath ?? "") && typeof orig === "string" && orig.startsWith("{")) {
        const target = refToVar(orig);
        systemAliasPairs.push([name, target]);
        return `  ${name}: var(${target});`;
      }
      return `  ${name}: ${val(t)};`;
    });

    // Two-surface responsive type variables (website = default, portal = [data-surface])
    const { website: typeRootLines, portal: typePortalLines } = buildResponsiveType(dictionary);

    const retier = makeRetier(dictionary.allTokens, { tierOfFile, toCssName });
    const legacyPairs = Object.entries(LEGACY_DS_ALIASES).map(([o, n]) => [o, retier(n)]);
    const legacy = legacyPairs.map(([oldName, newVar]) => `  ${oldName}: var(${newVar});`);

    // Resolve a {reference} to a var(--sa-*) chain, honouring the referent's tier marker.
    // Without the lookup a Tier-2 token pointing at a Tier-1 primitive would emit an
    // unmarked name that no longer exists.
    const resolveRef = (v) =>
      typeof v === "string" && v.startsWith("{") ? `var(${refToVar(v)})` : v;

    // Each block records BOTH its declaration lines and the set of custom-property
    // names it declares. The name set drives targeted alias re-assertion below.
    const mkBlock = () => ({ lines: [], vars: new Set() });
    const push = (block, name, value) => {
      block.lines.push(`  ${name}: ${value};`);
      block.vars.add(name);
    };

    const themeMap = { light: mkBlock(), dark: mkBlock(), hc: mkBlock(), compact: mkBlock() };
    const colorModeMap = {};
    for (const t of dictionary.allTokens) {
      const ext = t.original?.$extensions?.mosje;
      const name = cssNameFor(t);
      if (ext?.themes) {
        // `dark` and `hc` are deliberately NOT emitted. The UX4G accessibility widget is the
        // single canonical high-contrast / dark mechanism for the estate — it applies its own
        // `.dark-mode` class to <html> and never reads `data-theme`, so this axis was a second,
        // parallel mechanism nothing consumed. `compact` is the density axis and is unrelated.
        // The source overrides are kept so the axis can be revived deliberately if it is ever
        // wanted; only the emission is switched off. See
        // docs/superpowers/records/2026-08-10-figma-theme-dark-hc-removed.md
        for (const [theme, v] of Object.entries(ext.themes)) {
          if (theme === "dark" || theme === "hc") continue;
          if (themeMap[theme]) push(themeMap[theme], name, resolveRef(v));
        }
      }
      if (ext?.colorModes) {
        for (const [mode, v] of Object.entries(ext.colorModes)) {
          push((colorModeMap[mode] ??= mkBlock()), name, resolveRef(v));
        }
      }
    }

    // A custom property substitutes var() at the element where it is DECLARED, then
    // descendants inherit the ALREADY-RESOLVED value. So `--ds-primary: var(--sa-…)`
    // declared once at :root resolves against :root's primitives; an island that flips
    // those primitives for its subtree does NOT change --ds-primary unless the alias is
    // re-declared inside the island. Every block that redeclares a token therefore has
    // to re-declare the aliases pointing at it.
    //
    // Re-assertion is TARGETED: only aliases whose target this block actually redeclares.
    // Re-asserting the rest is a provable no-op (the target is inherited unchanged), and
    // blanket re-assertion was emitting the whole ~290-entry alias table into all four
    // theme blocks — mostly spacing/radius/shadow/type aliases that no theme can vary.
    // Re-assertion is TRANSITIVE, and has to be. An alias re-declared inside a block becomes
    // a changed source for anything pointing at IT, so one pass only reaches depth 1. That
    // was invisible while Tier 3 emitted literals: with `--sa-cmp-*` now chaining through
    // Tier 2, `cmp/action/... -> bg/brand/primary/bolder -> color/primaryScale/600` is three
    // deep, and a single pass would re-assert the middle link while leaving the component
    // token resolving against :root — brand-blind in exactly the way this change exists to
    // fix. Iterating to a fixpoint costs one small loop and removes the depth limit entirely.
    const reassert = (block) => {
      const pairs = [...legacyPairs, ...systemAliasPairs];
      const changed = new Set(block.vars);
      const emitted = new Map();
      for (let pass = 0; pass < 16; pass++) {
        let grew = false;
        for (const [name, target] of pairs) {
          if (emitted.has(name) || !changed.has(target)) continue;
          emitted.set(name, target);
          changed.add(name);
          grew = true;
        }
        if (!grew) break;
      }
      const lines = [...emitted].map(([oldName, target]) => `  ${oldName}: var(${target});`);
      return lines.length
        ? `\n\n  /* re-resolve every alias whose source changed in this block */\n${lines.join("\n")}`
        : "";
    };

    const colorModeBlocks = Object.entries(colorModeMap)
      .map(([mode, b]) => `${brandSelector(mode)} {\n${b.lines.join("\n")}${reassert(b)}\n}`)
      .join("\n\n");
    const themeBlocks = [
      colorModeBlocks,
      themeMap.light.lines.length  ? `[data-theme="light"] {\n${themeMap.light.lines.join("\n")}${reassert(themeMap.light)}\n}` : "",
      themeMap.compact.lines.length? `[data-density="compact"] {\n${themeMap.compact.lines.join("\n")}${reassert(themeMap.compact)}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    // Portal surface: override the fluid --ds-type-* scale under [data-surface="portal"].
    // This block needs the same alias re-assertion as the theme blocks — without it the
    // --ds-text-*/--ds-leading-* aliases keep the value they resolved to at :root, i.e.
    // the WEBSITE scale, and every portal that mounts on a wrapper div (all six of them —
    // data-surface sits on a <div>, not <html>) renders website type. Verified in-browser
    // before the fix: --ds-type-display-1-size flipped to the portal clamp (max 56px)
    // while --ds-text-display stayed on the website clamp (max 80px).
    const surfaceVars = new Set(
      typePortalLines.map((l) => l.slice(0, l.indexOf(":")).trim())
    );
    const surfaceBlock = typePortalLines.length
      ? `[data-surface="portal"] {\n${typePortalLines.join("\n")}${reassert({ vars: surfaceVars })}\n}`
      : "";

    return (
      `/* GENERATED by @mosje/tokens — do not edit. Edit packages/tokens/src/*.json. */\n` +
      `:root {\n${lines.join("\n")}\n\n` +
      `  /* ---- fluid type scale (Website surface, default): --ds-type-ROLE-size/lh = clamp(...) ---- */\n${typeRootLines.join("\n")}\n\n` +
      `  /* ---- legacy --ds-* contract (back-compat) ---- */\n${legacy.join("\n")}\n}\n\n` +
      `${themeBlocks}\n\n` +
      `/* ---- Portal surface type scale override ---- */\n${surfaceBlock}\n`
    );
  },
};
