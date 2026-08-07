/**
 * Map an UNMARKED `--sa-<path>` name to its tier-MARKED form (`--sa-ref-…`, `--sa-cmp-…`).
 *
 * The legacy alias tables in this repo were written before tiers were marked, so they name
 * targets without a marker. Rather than hand-edit ~44 entries across two files — and re-edit
 * them every time a token changes tier — every hardcoded target is passed through here.
 */
export function makeRetier(allTokens, { tierOfFile, toCssName }) {
  const marked = new Map();
  for (const t of allTokens) {
    const tier = tierOfFile(t.filePath);
    if (tier !== "sys") marked.set(`--sa-${t.path.join("-")}`, toCssName(t.path, tier));
  }
  return (name) => marked.get(name) ?? name;
}

/**
 * Rewrite every `var(--sa-…)` in a generated stylesheet to the tier-MARKED name.
 *
 * Applied as a final pass over each format's output rather than at each of the ~10 sites
 * that build a target name by hand. Those sites are spread across two large format files
 * and hand-patching them is exactly the kind of thing that gets half-done — this cannot
 * miss one. Declarations are untouched; only var() targets are rewritten, and unmarked
 * declarations no longer exist, so the rewrite is total and safe.
 */
export function retierCss(css, retier) {
  return css.replace(/var\((--sa-[A-Za-z0-9-]+)\)/g, (_, name) => `var(${retier(name)})`);
}
