/**
 * Framework-agnostic BRAND-axis core for the MoSJE estate.
 *
 * A brand is which primary ramp is active — INDEPENDENT of light/dark appearance.
 *
 * These were called `blue-light` and `blue-dark` until 2026-08-07, which read as light and
 * dark THEMES. They never were: both render on LIGHT surfaces and differ only in palette
 * (primary + saffron + warm grey vs navy + green + cool grey). The names were actively
 * misleading — this file used to need a comment explaining that its own ids meant the
 * opposite of what they said. Appearance lives on `data-theme` (light | dark | hc) and the
 * two axes compose.
 *
 * The token pipeline emits a `[data-brand="<id>"]` block per brand, including the default
 * (see packages/tokens/src/*.json + the generated @mosje/design-system/tokens.css) — so a
 * `data-brand` island always resolves through the cascade, even one that nests back to the
 * default brand inside an ambient non-default page. Adding a mode = add a ramp + colorModes
 * override in the tokens, then one entry here. Nothing else changes.
 *
 * Safe to import from both server and client (browser APIs are guarded).
 */

export interface ColorMode {
  /** Stable id used in the `data-color-mode` attribute + persistence cookie. */
  id: string;
  /** Human-facing label for the switcher. */
  label: string;
  /** Representative swatch (any CSS color) shown in the switcher. */
  swatch: string;
}

/**
 * The estate's color modes. The FIRST entry is the default — it maps to `:root`
 * and carries no `data-color-mode` attribute.
 */
export const COLOR_MODES: readonly ColorMode[] = [
  { id: "blue", label: "Blue", swatch: "#0373df" },
  // #162f6a is the DBIM key colour, which replaced #003366 on 2026-08-11. The two are
  // deltaE 1.9 apart — the same colour to the eye — so this is a compliance fix, not a
  // restyle, and a THIRD brand for the old navy would be a switch with no visible effect.
  { id: "navy", label: "Navy", swatch: "#003366" },
] as const;

/**
 * DBIM's six primary colour groups, as brands — a CONFORMANCE PREVIEW, not shipping options.
 *
 * Kept OUT of `COLOR_MODES` deliberately. `COLOR_MODES` is
 * the estate's own brand axis and anything listed there reads as a supported choice; these
 * exist so DBIM conformance can be demonstrated in the running app rather than argued about,
 * and the UI that offers them has to say so. `DemoDock`'s Colour tab renders them under their
 * own heading with that caveat attached, and nothing else in the estate offers them at all.
 *
 * MoSJE's selection is Blue. DBIM's rule is that an organisation picks exactly ONE group, so
 * the other five are here to show what the alternatives would have cost — which is a real
 * question, because two of them collide with the functional palette DBIM itself mandates (see
 * `test/hue-separation.test.mjs`, where the measurements are recorded).
 *
 * FULL CONFORMANCE, not a primary-ramp reskin. Selecting one of these also repaints the four
 * status colours to DBIM's own (Liberty Green, Mustard Yellow, Coral Red, DBIM Blue), swaps
 * the brand-tinted greys for DBIM's pure ones, and moves body text to Deep Earthy Brown. A
 * mode that changed only the primary ramp would be a much weaker claim and is not what these
 * are.
 *
 * NEVER IN FIGMA, by standing instruction. The Palette collection's modes are a hardcoded
 * [Blue, Navy] pair in `formats/figma-variables.mjs`, which reads only `colorModes.navy` — so
 * a DBIM brand cannot reach the library by accident, only by someone deliberately changing
 * that file.
 */
export const DBIM_COLOR_MODES: readonly ColorMode[] = [
  { id: "dbim-blue", label: "Blue", swatch: "#162f6a" },
  { id: "dbim-burgundy", label: "Burgundy", swatch: "#6c1340" },
  { id: "dbim-purple", label: "Purple", swatch: "#29136c" },
  { id: "dbim-green", label: "Green", swatch: "#0f5757" },
  { id: "dbim-chrome-yellow", label: "Chrome Yellow", swatch: "#5d3e00" },
  { id: "dbim-cinnamon-red", label: "Cinnamon Red", swatch: "#771d1d" },
] as const;

/**
 * Ids that shipped before the rename. Normalised on read so persisted cookies and existing
 * `data-color-mode` markup keep working; the generated CSS carries both selectors.
 */
export const LEGACY_COLOR_MODE_IDS: Readonly<Record<string, string>> = {
  "blue-light": "blue",
  "blue-dark": "navy",
  // `dbim` shipped earlier on 2026-08-11 as the single DBIM brand, when Blue was the only
  // group implemented. Renamed when the other five landed and a bare `dbim` became the odd id
  // out beside `dbim-burgundy`, `dbim-purple`, … Migrated here so a persisted cookie resolves,
  // and aliased as a CSS selector in `build/brand-modes.mjs` so server-rendered markup does.
  dbim: "dbim-blue",
} as const;

// The two UX4G palette modes (`ux4g`, `ux4gdeep`) were removed on 2026-09-04 together with the
// `--ux4g-*` parity stylesheet that defined them: nothing in the estate imported it, so the
// modes never rendered anywhere. Conformance is measured by tools/ux4g-conformance instead.

export type ColorModeId = (typeof COLOR_MODES)[number]["id"];

export const DEFAULT_COLOR_MODE: string = COLOR_MODES[0]?.id ?? "blue";
export const COLOR_MODE_COOKIE = "mosje-color-mode";
export const COLOR_MODE_ATTR = "data-brand";
/** Kept only so callers can clear stale markup; the CSS still matches it. */
export const LEGACY_COLOR_MODE_ATTR = "data-color-mode";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isColorMode(value: string | null | undefined): boolean {
  return (
    !!value &&
    (COLOR_MODES.some((m) => m.id === value) ||
      DBIM_COLOR_MODES.some((m) => m.id === value))
  );
}

export function normalizeColorMode(value: string | null | undefined): string {
  if (isColorMode(value)) return value as string;
  // A pre-rename id from a persisted cookie or server-rendered attribute.
  const migrated = value ? LEGACY_COLOR_MODE_IDS[value] : undefined;
  return migrated && isColorMode(migrated) ? migrated : DEFAULT_COLOR_MODE;
}

/** Parse the mode from a raw Cookie header (server-side, e.g. Next `headers()`). */
export function colorModeFromCookieHeader(
  header: string | null | undefined,
): string {
  if (!header) return DEFAULT_COLOR_MODE;
  const match = header.match(
    new RegExp(`(?:^|; )${COLOR_MODE_COOKIE}=([^;]+)`),
  );
  const raw = match?.[1];
  return normalizeColorMode(raw ? decodeURIComponent(raw) : null);
}

/** Read the mode from `document.cookie` (client). */
export function readColorModeCookie(): string {
  if (typeof document === "undefined") return DEFAULT_COLOR_MODE;
  return colorModeFromCookieHeader(document.cookie);
}

/** Persist the mode to a cookie and apply it to `<html>` (client). */
export function applyColorMode(mode: string): void {
  if (typeof document === "undefined") return;
  const normalized = normalizeColorMode(mode);
  document.documentElement.setAttribute(COLOR_MODE_ATTR, normalized);
  document.cookie = `${COLOR_MODE_COOKIE}=${encodeURIComponent(
    normalized,
  )}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Inline no-flash script. Render once in `<head>` via
 * `<script dangerouslySetInnerHTML={{ __html: colorModeInitScript() }} />` so the
 * correct `data-color-mode` is set before first paint even without SSR. Safe to
 * combine with SSR (idempotent).
 *
 * @security `dangerouslySetInnerHTML` is safe here: the returned string is a
 * compile-time constant. The only runtime input is the cookie value read by the
 * script itself inside the browser — no user-supplied data is interpolated
 * server-side, so XSS injection via this function is not possible.
 */
export function colorModeInitScript(defaultMode: string = DEFAULT_COLOR_MODE): string {
  const fallback = normalizeColorMode(defaultMode);
  // The legacy id map is inlined so a stale cookie does not paint the wrong brand for one
  // frame before React hydrates and corrects it.
  const legacy = JSON.stringify(LEGACY_COLOR_MODE_IDS);
  return `(function(){try{var L=${legacy};var m=document.cookie.match(/(?:^|; )${COLOR_MODE_COOKIE}=([^;]+)/);var v=m?decodeURIComponent(m[1]):"${fallback}";v=L[v]||v;document.documentElement.setAttribute("${COLOR_MODE_ATTR}",v);}catch(e){}})();`;
}
