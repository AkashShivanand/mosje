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
  "--ds-success-tonal": "--sa-color-green-50",
  "--ds-danger": "--sa-color-status-danger",
  "--ds-warning": "--sa-color-status-warning",
  "--ds-info": "--sa-color-status-info",
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
  "--ds-radius-xxs": "--sa-radius-xxs",
  "--ds-radius-xs": "--sa-radius-xs",
  "--ds-radius-sm": "--sa-radius-sm",
  "--ds-radius-md": "--sa-radius-md",
  "--ds-radius-pill": "--sa-radius-pill",
  "--ds-font-sans": "--sa-font-family-latin",
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
    const themeMap = { dark: [], hc: [], compact: [] };
    // Brand color-mode overrides, derived from $extensions.mosje.colorModes.
    // Keyed dynamically so adding a new mode in the tokens needs no build change.
    const colorModeMap = {};
    for (const t of dictionary.allTokens) {
      const ext = t.original?.$extensions?.mosje;
      if (ext?.themes) {
        for (const [theme, v] of Object.entries(ext.themes)) {
          if (themeMap[theme]) themeMap[theme].push(`  --sa-${t.path.join("-")}: ${resolveRef(v)};`);
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
    const themeBlocks = [
      colorModeBlocks,
      themeMap.dark.length ? `[data-theme="dark"] {\n${themeMap.dark.join("\n")}\n}` : "",
      themeMap.hc.length ? `[data-theme="hc"] {\n${themeMap.hc.join("\n")}\n}` : "",
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
