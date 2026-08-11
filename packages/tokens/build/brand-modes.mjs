/**
 * Brand palettes — the `data-brand` axis.
 *
 * WHY THESE WERE RENAMED
 * ----------------------
 * They used to be called `blue-light` and `blue-dark`, which read as light and dark THEMES.
 * They are not. They are two brand palettes, both rendered on light surfaces:
 *
 *   blue  →  primary #0373df + warm grey neutrals
 *   navy  →  primary #162f6a + cool grey neutrals   (the DBIM key colour)
 *
 * Since 2026-08-11 the PRIMARY ramp is the only thing a brand swap changes. Secondary
 * (India Saffron #ff671f) and accent (India Green #046a38) are both SAMAVESH logo colours
 * and are therefore brand-INVARIANT — navy used to swap secondary to green, which landed it
 * 1.00:1 from the success colour. See build/brand-ramps.mjs.
 *
 * Appearance is a separate axis (`data-theme`: light | dark | hc) and the two compose. A
 * developer reading `data-color-mode="blue-dark"` had every reason to expect a dark UI and
 * got a navy one — the names were actively misleading, and `color-mode.ts` had to carry a
 * comment explaining that its own ids meant the opposite of what they said.
 *
 * The old ids stay working as deprecated selector aliases (LEGACY_ATTR below) so the 21
 * properties already shipping `data-color-mode` do not break.
 */

/** Canonical brand id → the legacy `data-color-mode` value it replaces. */
export const LEGACY_BRAND_ID = {
  navy: "blue-dark",
  ux4g: "ux4g-light",
  ux4gdeep: "ux4g-dark",
  // `dbim` shipped on 2026-08-11 as a single DBIM brand, when DBIM's Blue group was the only
  // one implemented. The other five groups landed the same day and the bare id became the odd
  // one out in a list of `dbim-burgundy`, `dbim-purple`, … so it was renamed. The old
  // attribute keeps working as a selector alias, and `LEGACY_COLOR_MODE_IDS` in
  // `foundations/color-mode.ts` migrates a persisted cookie.
  "dbim-blue": "dbim",
};

/** The default brand carries no attribute — it is `:root`. */
export const DEFAULT_BRAND = "blue";

export const BRAND_ATTR = "data-brand";
export const LEGACY_BRAND_ATTR = "data-color-mode";

/**
 * The selector for a brand block: the new attribute plus the deprecated one, so existing
 * markup keeps working. Emitted as a selector list rather than a duplicated block so the
 * two can never drift apart.
 */
export function brandSelector(id) {
  const legacy = LEGACY_BRAND_ID[id];
  const parts = [`[${BRAND_ATTR}="${id}"]`];
  if (legacy) {
    parts.push(`[${LEGACY_BRAND_ATTR}="${legacy}"]`);
    // `dbim` is the one legacy id that was never a `data-color-mode` value — it shipped on the
    // CURRENT attribute and was renamed to `dbim-blue` when the other five DBIM groups landed.
    // The others (`blue-dark`, `ux4g-light`, `ux4g-dark`) only ever existed on the old
    // attribute, so aliasing them on `data-brand` too would claim ids that never shipped.
    if (RENAMED_ON_CURRENT_ATTR.has(legacy)) parts.push(`[${BRAND_ATTR}="${legacy}"]`);
  }
  return parts.join(",\n");
}

/** Legacy ids that were `data-brand` values, not `data-color-mode` values. */
const RENAMED_ON_CURRENT_ATTR = new Set(["dbim"]);
