// Emits :root { --sa-*: <value>; ... } plus a hardcoded legacy --ds-* alias block.
// The legacy block maps each old name to the new token it now derives from, so values
// stay identical while the source of truth becomes the DTCG tokens.
//
// Names are built from token.path joined with "-" (camelCase segments preserved), so the
// --sa-* names here MUST match the alias targets below exactly.

export const LEGACY_DS_ALIASES = {
  "--ds-primary": "--sa-color-action-primary-default",
  "--ds-primary-tonal": "--sa-color-action-primary-tonal",
  "--ds-primary-dark": "--sa-color-action-primary-hover",
  "--ds-primary-hover": "--sa-color-action-primary-hover",
  "--ds-link": "--sa-color-action-link",
  "--ds-primary-ring": "--sa-color-focus-ring",
  "--ds-primary-50": "--sa-color-primaryScale-50",
  "--ds-primary-100": "--sa-color-primaryScale-100",
  "--ds-primary-200": "--sa-color-primaryScale-200",
  "--ds-primary-300": "--sa-color-primaryScale-300",
  "--ds-primary-400": "--sa-color-primaryScale-400",
  "--ds-primary-500": "--sa-color-primaryScale-500",
  "--ds-primary-600": "--sa-color-primaryScale-600",
  "--ds-primary-700": "--sa-color-primaryScale-700",
  "--ds-primary-800": "--sa-color-primaryScale-800",
  "--ds-primary-900": "--sa-color-primaryScale-900",
  "--ds-success": "--sa-color-status-success",
  "--ds-success-tonal": "--sa-color-status-successTonal",
  "--ds-danger": "--sa-color-status-danger",
  "--ds-danger-tonal": "--sa-color-status-dangerTonal",
  "--ds-warning": "--sa-color-status-warning",
  "--ds-warning-tonal": "--sa-color-status-warningTonal",
  "--ds-info": "--sa-color-status-info",
  "--ds-overlay": "--sa-color-overlay-scrim",
  "--ds-ink": "--sa-color-text-default",
  "--ds-ink-strong": "--sa-color-text-strong",
  "--ds-ink-muted": "--sa-color-text-muted",
  "--ds-on-primary": "--sa-color-text-onPrimary",
  "--ds-surface": "--sa-color-bg-surface",
  "--ds-surface-muted": "--sa-color-bg-muted",
  "--ds-surface-alt": "--sa-color-bg-alt",
  "--ds-border": "--sa-color-border-subtle",
  "--ds-border-strong": "--sa-color-border-strong",
  "--ds-saffron": "--sa-color-brand-saffron",
  "--ds-saffron-light": "--sa-color-brand-saffronLight",
  "--ds-saffron-dark": "--sa-color-brand-saffronDark",
  "--ds-gov-navy": "--sa-color-brand-navy",
  "--ds-gov-yellow": "--sa-color-brand-yellow",
  "--ds-space-0": "--sa-space-0",
  "--ds-space-1": "--sa-space-1",
  "--ds-space-2": "--sa-space-2",
  "--ds-space-3": "--sa-space-3",
  "--ds-space-4": "--sa-space-4",
  "--ds-space-5": "--sa-space-5",
  "--ds-space-6": "--sa-space-6",
  "--ds-space-8": "--sa-space-8",
  "--ds-space-10": "--sa-space-10",
  "--ds-space-12": "--sa-space-12",
  "--ds-space-14": "--sa-space-14",
  "--ds-radius-xxs": "--sa-radius-xxs",
  "--ds-radius-xs": "--sa-radius-xs",
  "--ds-radius-sm": "--sa-radius-sm",
  "--ds-radius-md": "--sa-radius-md",
  "--ds-radius-pill": "--sa-radius-pill",
  "--ds-control-height": "--sa-density-control-height",
  "--ds-font-sans": "--sa-font-family-latin",
  "--ds-font-mono": "--sa-font-family-mono",
  "--ds-duration-fast": "--sa-motion-duration-fast",
  "--ds-duration-base": "--sa-motion-duration-base",
  "--ds-duration-slow": "--sa-motion-duration-slow",
  "--ds-easing-out": "--sa-motion-easing-out",
  "--ds-easing-in": "--sa-motion-easing-in",
  "--ds-easing-in-out": "--sa-motion-easing-inOut",
  "--ds-text-display": "--sa-type-display-size",
  "--ds-leading-display": "--sa-type-display-leading",
  "--ds-text-title-1": "--sa-type-title1-size",
  "--ds-leading-title-1": "--sa-type-title1-leading",
  "--ds-text-headline": "--sa-type-headline-size",
  "--ds-leading-headline": "--sa-type-headline-leading",
  "--ds-text-title-2": "--sa-font-size-400",
  "--ds-leading-title-2": "--sa-font-lineHeight-300",
  "--ds-text-body-1": "--sa-type-body1-size",
  "--ds-leading-body-1": "--sa-type-body1-leading",
  "--ds-text-body-2": "--sa-type-body2-size",
  "--ds-leading-body-2": "--sa-type-body2-leading",
  "--ds-text-body-3": "--sa-font-size-200",
  "--ds-leading-body-3": "--sa-font-lineHeight-100",
  "--ds-text-label-1": "--sa-font-size-300",
  "--ds-leading-label-1": "--sa-font-lineHeight-200",
  "--ds-text-label-3": "--sa-font-size-100",
  "--ds-leading-label-3": "--sa-font-lineHeight-100",
  "--ds-shadow-xs": "--sa-shadow-xs",
  "--ds-shadow-lg": "--sa-shadow-lg",
  "--ds-shadow-xl": "--sa-shadow-xl",
};

const val = (t) => (t.$value !== undefined ? t.$value : t.value);

export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map(
      (t) => `  --sa-${t.path.join("-")}: ${val(t)};`
    );
    const legacy = Object.entries(LEGACY_DS_ALIASES).map(
      ([oldName, newVar]) => `  ${oldName}: var(${newVar});`
    );

    // Resolve a {ref} string to a var(--sa-*) chain; pass literals through.
    const resolveRef = (v) =>
      typeof v === "string" && v.startsWith("{")
        ? `var(--sa-${v.slice(1, -1).split(".").join("-")})`
        : v;

    // Appearance/density overrides, derived from $extensions.mosje.themes.
    // `light` re-asserts each themed token's base value so light is explicitly
    // addressable — a nested [data-theme="light"] island can reset an inherited
    // dark theme (e.g. the docs playground previewing light inside a dark page).
    const themeMap = { light: [], dark: [], hc: [], compact: [] };
    // Brand color-mode overrides, derived from $extensions.mosje.colorModes.
    // Keyed dynamically so adding a new mode in the tokens needs no build change.
    const colorModeMap = {};
    for (const t of dictionary.allTokens) {
      const ext = t.original?.$extensions?.mosje;
      if (ext?.themes) {
        for (const [theme, v] of Object.entries(ext.themes)) {
          if (themeMap[theme]) themeMap[theme].push(`  --sa-${t.path.join("-")}: ${resolveRef(v)};`);
        }
        // Mirror the base value into the light reset for any appearance override.
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
    // The legacy --ds-* aliases are declared at :root and therefore resolve
    // *there*, inheriting as computed values. For a nested [data-theme] island
    // (e.g. the docs playground) to actually re-theme --ds-*-based components,
    // each appearance block must RE-DECLARE the aliases so they re-resolve
    // against that island's --sa-* values. (Page-level theming on <html> works
    // either way; this is what makes nested theme islands work.)
    const legacyReassert = `\n\n  /* re-resolve --ds-* aliases for nested theme islands */\n${legacy.join("\n")}`;
    const themeBlocks = [
      colorModeBlocks,
      themeMap.light.length ? `[data-theme="light"] {\n${themeMap.light.join("\n")}${legacyReassert}\n}` : "",
      themeMap.dark.length ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}${legacyReassert}\n}` : "",
      themeMap.hc.length ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}${legacyReassert}\n}` : "",
      themeMap.compact.length ? `[data-density="compact"] {\n${themeMap.compact.join("\n")}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    return (
      `/* GENERATED by @mosje/tokens — do not edit. Edit packages/tokens/src/*.json. */\n` +
      `:root {\n${lines.join("\n")}\n\n` +
      `  /* ---- legacy --ds-* contract (back-compat) ---- */\n${legacy.join("\n")}\n}\n\n` +
      `${themeBlocks}\n`
    );
  },
};
