// Emits :root { --sa-*: <value>; ... } plus a hardcoded legacy --ds-* alias block.
// The legacy block maps each old name to the new token it now derives from, so values
// stay identical while the source of truth becomes the DTCG tokens.
//
// Two-surface fluid type: font.role.* tokens carry $extensions.mosje.type.{website,portal}
// with {min,max} bounds. The formatter emits --ds-type-{role}-{size|lh} as clamp(min@360px,
// fluid, max@1280px) — the Website scale in :root (default) and the Portal scale under
// [data-surface="portal"]. No @media breakpoints.

export const LEGACY_DS_ALIASES = {
  "--ds-primary":       "--sa-color-action-primary-default",
  "--ds-primary-tonal": "--sa-color-action-primary-tonal",
  "--ds-primary-dark":  "--sa-color-action-primary-hover",
  "--ds-primary-hover": "--sa-color-action-primary-hover",
  "--ds-link":          "--sa-color-action-link",
  "--ds-primary-ring":  "--sa-color-focus-ring",
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
  "--ds-neutral-1000":  "--sa-color-neutralScale-1000",
  "--ds-neutral-1100":  "--sa-color-neutralScale-1100",
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
  "--ds-overlay":       "--sa-color-overlay-scrim",
  "--ds-ink":           "--sa-color-text-default",
  "--ds-ink-strong":    "--sa-color-text-strong",
  "--ds-ink-muted":     "--sa-color-text-muted",
  "--ds-ink-info":      "--sa-color-text-info",
  "--ds-on-primary":    "--sa-color-text-onPrimary",
  "--ds-surface":       "--sa-color-bg-surface",
  "--ds-surface-muted": "--sa-color-bg-muted",
  "--ds-border":        "--sa-color-border-subtle",
  "--ds-border-strong": "--sa-color-border-strong",
  "--ds-saffron":       "--sa-color-brand-saffron",
  "--ds-saffron-light": "--sa-color-brand-saffronLight",
  "--ds-saffron-dark":  "--sa-color-brand-saffronDark",
  "--ds-gov-navy":      "--sa-color-brand-navy",
  "--ds-gov-yellow":    "--sa-color-brand-yellow",
  "--ds-spacing-none":  "--sa-spacing-none",
  "--ds-spacing-xxs":   "--sa-spacing-xxs",
  "--ds-spacing-xs":    "--sa-spacing-xs",
  "--ds-spacing-sm":    "--sa-spacing-sm",
  "--ds-spacing-md":    "--sa-spacing-md",
  "--ds-spacing-lg":    "--sa-spacing-lg",
  "--ds-spacing-xl":    "--sa-spacing-xl",
  "--ds-spacing-2xl":   "--sa-spacing-2xl",
  "--ds-spacing-3xl":   "--sa-spacing-3xl",
  "--ds-spacing-4xl":   "--sa-spacing-4xl",
  "--ds-spacing-5xl":   "--sa-spacing-5xl",
  "--ds-spacing-6xl":   "--sa-spacing-6xl",
  "--ds-spacing-7xl":   "--sa-spacing-7xl",
  "--ds-spacing-8xl":   "--sa-spacing-8xl",
  "--ds-spacing-9xl":   "--sa-spacing-9xl",
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
  "--ds-control-height":"--sa-density-control-height",
  "--ds-font-sans":     "--sa-font-family-latin",
  "--ds-font-mono":     "--sa-font-family-mono",
  "--ds-duration-fast": "--sa-motion-duration-fast",
  "--ds-duration-base": "--sa-motion-duration-base",
  "--ds-duration-slow": "--sa-motion-duration-slow",
  "--ds-easing-out":    "--sa-motion-easing-out",
  "--ds-easing-in":     "--sa-motion-easing-in",
  "--ds-easing-in-out": "--sa-motion-easing-inOut",
  "--ds-shadow-xs":     "--sa-shadow-xs",
  "--ds-shadow-lg":     "--sa-shadow-lg",
  "--ds-shadow-xl":     "--sa-shadow-xl",

  // ── Data-visualisation palette (see color.chart in semantic.json) ───────────
  "--ds-chart-cat-1":   "--sa-color-chart-cat-1",
  "--ds-chart-cat-2":   "--sa-color-chart-cat-2",
  "--ds-chart-cat-3":   "--sa-color-chart-cat-3",
  "--ds-chart-cat-4":   "--sa-color-chart-cat-4",
  "--ds-chart-cat-5":   "--sa-color-chart-cat-5",
  "--ds-chart-cat-6":   "--sa-color-chart-cat-6",
  "--ds-chart-cat-7":   "--sa-color-chart-cat-7",
  "--ds-chart-cat-8":   "--sa-color-chart-cat-8",
  "--ds-chart-cat-9":   "--sa-color-chart-cat-9",
  "--ds-chart-cat-10":  "--sa-color-chart-cat-10",
  "--ds-chart-cat-11":  "--sa-color-chart-cat-11",
  "--ds-chart-cat-12":  "--sa-color-chart-cat-12",
  "--ds-chart-seq-50":  "--sa-color-chart-seq-50",
  "--ds-chart-seq-100": "--sa-color-chart-seq-100",
  "--ds-chart-seq-200": "--sa-color-chart-seq-200",
  "--ds-chart-seq-300": "--sa-color-chart-seq-300",
  "--ds-chart-seq-400": "--sa-color-chart-seq-400",
  "--ds-chart-seq-500": "--sa-color-chart-seq-500",
  "--ds-chart-seq-600": "--sa-color-chart-seq-600",
  "--ds-chart-seq-700": "--sa-color-chart-seq-700",
  "--ds-chart-seq-800": "--sa-color-chart-seq-800",
  "--ds-chart-seq-900": "--sa-color-chart-seq-900",
  "--ds-chart-div-neg-strong": "--sa-color-chart-div-negStrong",
  "--ds-chart-div-neg":        "--sa-color-chart-div-neg",
  "--ds-chart-div-neg-soft":   "--sa-color-chart-div-negSoft",
  "--ds-chart-div-mid":        "--sa-color-chart-div-mid",
  "--ds-chart-div-pos-soft":   "--sa-color-chart-div-posSoft",
  "--ds-chart-div-pos":        "--sa-color-chart-div-pos",
  "--ds-chart-div-pos-strong": "--sa-color-chart-div-posStrong",
  "--ds-chart-trend-up":    "--sa-color-chart-trend-up",
  "--ds-chart-trend-down":  "--sa-color-chart-trend-down",
  "--ds-chart-trend-flat":  "--sa-color-chart-trend-flat",
  "--ds-chart-grid":          "--sa-color-chart-grid",
  "--ds-chart-axis":          "--sa-color-chart-axis",
  "--ds-chart-tooltip-bg":    "--sa-color-chart-tooltipBg",
  "--ds-chart-tooltip-ink":   "--sa-color-chart-tooltipInk",
  "--ds-chart-region-empty":  "--sa-color-chart-regionEmpty",
  "--ds-chart-region-stroke": "--sa-color-chart-regionStroke",

  // ── Type scale: backed by fluid --ds-type-* clamp() variables ───────────────
  // These preserve all existing --ds-text-* / --ds-leading-* callsites. --ds-type-*
  // is defined in :root as the Website surface and overridden under
  // [data-surface="portal"]; both are fluid clamp() (no @media).
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
const CLAMP_WMIN = 360;
const CLAMP_WMAX = 1280;
/** Return a clamp() string (or a static px value when min === max). */
function clampExpr(minPx, maxPx) {
  const min = parseFloat(minPx);
  const max = parseFloat(maxPx);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return maxPx ?? minPx;
  if (min === max) return `${min}px`;
  const range = CLAMP_WMAX - CLAMP_WMIN;
  const slopeVw = ((max - min) / range) * 100; // vw coefficient
  const yInt = min - ((max - min) / range) * CLAMP_WMIN; // px intercept
  const r = (n) => Math.round(n * 1000) / 1000;
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const s = r(slopeVw);
  // Avoid "+ -Nvw" (valid but fragile) — emit "- Nvw" for negative slopes.
  const vwTerm = s < 0 ? `- ${Math.abs(s)}vw` : `+ ${s}vw`;
  return `clamp(${lo}px, calc(${r(yInt)}px ${vwTerm}), ${hi}px)`;
}

/**
 * Build two-surface responsive --ds-type-* blocks from font.role.* tokens.
 * Website scale → :root (default surface); Portal scale → [data-surface="portal"].
 */
function buildResponsiveType(dictionary) {
  // font.role.<role>.{size|lh|para}  and  font.tracking.<key>  (letter-spacing)
  const roleTokens = dictionary.allTokens.filter(
    (t) => t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking")
  );
  if (!roleTokens.length) return { website: [], portal: [] };

  const website = [];
  const portal = [];

  for (const t of roleTokens) {
    // role: --ds-type-<role>-<size|lh|para>  ·  tracking: --ds-type-<key>-tracking
    const cssVar =
      t.path[1] === "role"
        ? `--ds-type-${t.path[2]}-${t.path[3]}`
        : `--ds-type-${t.path[2]}-tracking`;
    const ty = t.original?.$extensions?.mosje?.type;
    const webExpr = ty?.website ? clampExpr(ty.website.min, ty.website.max) : val(t);
    const portalExpr = ty?.portal ? clampExpr(ty.portal.min, ty.portal.max) : webExpr;

    website.push(`  ${cssVar}: ${webExpr};`);
    if (portalExpr !== webExpr) portal.push(`  ${cssVar}: ${portalExpr};`);
  }
  return { website, portal };
}

export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    // Exclude font.role.* from the --sa-* emission; they feed --ds-type-* instead.
    const regularTokens = dictionary.allTokens.filter(
      (t) => !(t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking"))
    );
    const lines = regularTokens.map(
      (t) => `  --sa-${t.path.join("-")}: ${val(t)};`
    );

    // Two-surface responsive type variables (website = default, portal = [data-surface])
    const { website: typeRootLines, portal: typePortalLines } = buildResponsiveType(dictionary);

    const legacy = Object.entries(LEGACY_DS_ALIASES).map(
      ([oldName, newVar]) => `  ${oldName}: var(${newVar});`
    );

    // Resolve a {ref} string to a var(--sa-*) chain; pass literals through.
    const resolveRef = (v) =>
      typeof v === "string" && v.startsWith("{")
        ? `var(--sa-${v.slice(1, -1).split(".").join("-")})`
        : v;

    const themeMap = { light: [], dark: [], hc: [], compact: [] };
    const colorModeMap = {};
    for (const t of dictionary.allTokens) {
      const ext = t.original?.$extensions?.mosje;
      if (ext?.themes) {
        for (const [theme, v] of Object.entries(ext.themes)) {
          if (themeMap[theme]) themeMap[theme].push(`  --sa-${t.path.join("-")}: ${resolveRef(v)};`);
        }
        if (ext.themes.dark || ext.themes.hc) {
          themeMap.light.push(`  --sa-${t.path.join("-")}: ${val(t)};`);
        }
      }
      if (ext?.colorModes) {
        for (const [mode, v] of Object.entries(ext.colorModes)) {
          (colorModeMap[mode] ??= []).push(`  --sa-${t.path.join("-")}: ${resolveRef(v)};`);
        }
      }
    }

    const legacyReassert = `\n\n  /* re-resolve --ds-* aliases for nested theme islands */\n${legacy.join("\n")}`;

    // The --ds-* aliases must be re-asserted here for the same reason the
    // [data-theme="…"] blocks below do it: a custom property substitutes var()
    // at the element where it is DECLARED. --ds-primary is declared once at
    // :root, so it resolves against :root's --sa-* and is then inherited as an
    // already-resolved colour. A nested [data-color-mode="blue-dark"] island
    // flips the --sa-* primitives for its subtree, but without re-declaring the
    // aliases the components below keep :root's value. This only ever worked
    // when data-color-mode sat on <html> (where :root's declarations resolve) —
    // it broke the moment portals mounted natively and the attribute moved to a
    // wrapper div.
    const colorModeBlocks = Object.entries(colorModeMap)
      .map(([mode, decls]) => `[data-color-mode="${mode}"] {\n${decls.join("\n")}${legacyReassert}\n}`)
      .join("\n\n");
    const themeBlocks = [
      colorModeBlocks,
      themeMap.light.length  ? `[data-theme="light"] {\n${themeMap.light.join("\n")}${legacyReassert}\n}` : "",
      themeMap.dark.length   ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}${legacyReassert}\n}` : "",
      themeMap.hc.length     ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}${legacyReassert}\n}` : "",
      themeMap.compact.length? `[data-density="compact"] {\n${themeMap.compact.join("\n")}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    // Portal surface: override the fluid --ds-type-* scale under [data-surface="portal"].
    const surfaceBlock = typePortalLines.length
      ? `[data-surface="portal"] {\n${typePortalLines.join("\n")}\n}`
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
