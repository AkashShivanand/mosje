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
  if (legacy) parts.push(`[${LEGACY_BRAND_ATTR}="${legacy}"]`);
  return parts.join(",\n");
}
