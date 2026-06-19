// Emits :root { --sa-*: <value>; ... } plus a hardcoded legacy --ds-* alias block.
// The legacy block maps each old name to the new token it now derives from, so values
// stay identical while the source of truth becomes the DTCG tokens.
//
// Responsive type: font.role.* tokens in primitive.json carry $extensions.responsive
// with md (768px) and lg (1024px) breakpoint overrides. The formatter emits these as
// --ds-type-{role}-{size|lh} variables in :root (mobile-first) with @media overrides.

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
  "--ds-surface-alt":   "--sa-color-bg-alt",
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

  // ── Type scale: now backed by responsive --ds-type-* variables ──────────────
  // These preserve all existing --ds-text-* / --ds-leading-* callsites while
  // making them responsive. --ds-type-* is defined below in :root (mobile base)
  // and overridden in the @media blocks.
  "--ds-text-display":   "--ds-type-display1-size",
  "--ds-leading-display":"--ds-type-display1-lh",
  "--ds-text-headline":  "--ds-type-headline1-size",
  "--ds-leading-headline":"--ds-type-headline1-lh",
  "--ds-text-title-1":   "--ds-type-headline2-size",
  "--ds-leading-title-1":"--ds-type-headline2-lh",
  "--ds-text-title-2":   "--ds-type-title1-size",
  "--ds-leading-title-2":"--ds-type-title1-lh",
  "--ds-text-body-1":    "--ds-type-body1-size",
  "--ds-leading-body-1": "--ds-type-body1-lh",
  "--ds-text-body-2":    "--ds-type-body2-size",
  "--ds-leading-body-2": "--ds-type-body2-lh",
  "--ds-text-body-3":    "--ds-type-body3-size",
  "--ds-leading-body-3": "--ds-type-body3-lh",
  "--ds-text-label-1":   "--ds-type-label1-size",
  "--ds-leading-label-1":"--ds-type-label1-lh",
  "--ds-text-label-3":   "--ds-type-label3-size",
  "--ds-leading-label-3":"--ds-type-label3-lh",

  // Full responsive role set (new canonical names for all 21 roles)
  "--ds-text-display1":   "--ds-type-display1-size",
  "--ds-text-display2":   "--ds-type-display2-size",
  "--ds-text-display3":   "--ds-type-display3-size",
  "--ds-text-display4":   "--ds-type-display4-size",
  "--ds-text-display5":   "--ds-type-display5-size",
  "--ds-text-display6":   "--ds-type-display6-size",
  "--ds-text-headline1":  "--ds-type-headline1-size",
  "--ds-text-headline2":  "--ds-type-headline2-size",
  "--ds-text-headline3":  "--ds-type-headline3-size",
  "--ds-text-headline4":  "--ds-type-headline4-size",
  "--ds-text-headline5":  "--ds-type-headline5-size",
  "--ds-text-headline6":  "--ds-type-headline6-size",
  "--ds-text-title1":     "--ds-type-title1-size",
  "--ds-text-title2":     "--ds-type-title2-size",
  "--ds-text-title3":     "--ds-type-title3-size",
  "--ds-text-body1":      "--ds-type-body1-size",
  "--ds-text-body2":      "--ds-type-body2-size",
  "--ds-text-body3":      "--ds-type-body3-size",
  "--ds-text-label1":     "--ds-type-label1-size",
  "--ds-text-label2":     "--ds-type-label2-size",
  "--ds-text-label3":     "--ds-type-label3-size",
  "--ds-leading-display1":  "--ds-type-display1-lh",
  "--ds-leading-display2":  "--ds-type-display2-lh",
  "--ds-leading-display3":  "--ds-type-display3-lh",
  "--ds-leading-headline1": "--ds-type-headline1-lh",
  "--ds-leading-headline2": "--ds-type-headline2-lh",
  "--ds-leading-headline3": "--ds-type-headline3-lh",
  "--ds-leading-title1":    "--ds-type-title1-lh",
  "--ds-leading-title2":    "--ds-type-title2-lh",
  "--ds-leading-body1":     "--ds-type-body1-lh",
  "--ds-leading-body2":     "--ds-type-body2-lh",
  "--ds-leading-label1":    "--ds-type-label1-lh",
  "--ds-leading-label2":    "--ds-type-label2-lh",
};

const val = (t) => (t.$value !== undefined ? t.$value : t.value);

/** Build responsive --ds-type-* blocks from font.role.* tokens. */
function buildResponsiveType(dictionary) {
  const roleTokens = dictionary.allTokens.filter(
    (t) => t.path[0] === "font" && t.path[1] === "role"
  );
  if (!roleTokens.length) return { rootLines: [], tablet: [], desktop: [] };

  const rootLines = [];
  const tablet = [];
  const desktop = [];

  for (const t of roleTokens) {
    const [, , role, prop] = t.path; // font.role.display1.size
    const cssVar = `--ds-type-${role}-${prop}`;
    const mobile = val(t);
    const ext = t.original?.$extensions?.responsive;
    const md = ext?.md;
    const lg = ext?.lg;

    rootLines.push(`  ${cssVar}: ${mobile};`);
    if (md && md !== mobile) tablet.push(`    ${cssVar}: ${md};`);
    if (lg && lg !== mobile) desktop.push(`    ${cssVar}: ${lg};`);
  }
  return { rootLines, tablet, desktop };
}

export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    // Exclude font.role.* from the --sa-* emission; they feed --ds-type-* instead.
    const regularTokens = dictionary.allTokens.filter(
      (t) => !(t.path[0] === "font" && t.path[1] === "role")
    );
    const lines = regularTokens.map(
      (t) => `  --sa-${t.path.join("-")}: ${val(t)};`
    );

    // Responsive type variables
    const { rootLines: typeRootLines, tablet, desktop } = buildResponsiveType(dictionary);

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

    const colorModeBlocks = Object.entries(colorModeMap)
      .map(([mode, decls]) => `[data-color-mode="${mode}"] {\n${decls.join("\n")}\n}`)
      .join("\n\n");

    const legacyReassert = `\n\n  /* re-resolve --ds-* aliases for nested theme islands */\n${legacy.join("\n")}`;
    const themeBlocks = [
      colorModeBlocks,
      themeMap.light.length  ? `[data-theme="light"] {\n${themeMap.light.join("\n")}${legacyReassert}\n}` : "",
      themeMap.dark.length   ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}${legacyReassert}\n}` : "",
      themeMap.hc.length     ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}${legacyReassert}\n}` : "",
      themeMap.compact.length? `[data-density="compact"] {\n${themeMap.compact.join("\n")}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const responsiveTypeBlocks = [
      tablet.length  ? `@media (min-width: 768px) {\n  :root {\n${tablet.join("\n")}\n  }\n}` : "",
      desktop.length ? `@media (min-width: 1024px) {\n  :root {\n${desktop.join("\n")}\n  }\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    return (
      `/* GENERATED by @mosje/tokens — do not edit. Edit packages/tokens/src/*.json. */\n` +
      `:root {\n${lines.join("\n")}\n\n` +
      `  /* ---- responsive type scale (mobile-first: --ds-type-ROLE-size/lh) ---- */\n${typeRootLines.join("\n")}\n\n` +
      `  /* ---- legacy --ds-* contract (back-compat) ---- */\n${legacy.join("\n")}\n}\n\n` +
      `${themeBlocks}\n\n` +
      `/* ---- responsive type breakpoint overrides ---- */\n${responsiveTypeBlocks}\n`
    );
  },
};
