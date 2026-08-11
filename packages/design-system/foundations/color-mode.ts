/**
 * Framework-agnostic BRAND-axis core for the MoSJE estate.
 *
 * A brand is which primary ramp is active — INDEPENDENT of light/dark appearance.
 *
 * These were called `blue-light` and `blue-dark` until 2026-08-07, which read as light and
 * dark THEMES. They never were: both render on LIGHT surfaces and differ only in palette
 * (gov-blue + saffron + warm grey vs gov-navy + green + cool grey). The names were actively
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
  { id: "navy", label: "Navy", swatch: "#003366" },
] as const;

/**
 * Ids that shipped before the rename. Normalised on read so persisted cookies and existing
 * `data-color-mode` markup keep working; the generated CSS carries both selectors.
 */
export const LEGACY_COLOR_MODE_IDS: Readonly<Record<string, string>> = {
  "blue-light": "blue",
  "blue-dark": "navy",
  "ux4g-light": "ux4g",
  "ux4g-dark": "ux4gdeep",
} as const;

/**
 * UX4G 3.0's own palette, as two extra peer modes.
 *
 * These are NOT in `COLOR_MODES` on purpose: they only render correctly in an app that
 * also imports `@mosje/design-system/ux4g.css`, which is opt-in. Offering them in a
 * switcher UI in an app that has not loaded that stylesheet would show a mode that does
 * nothing. An app that HAS loaded it opts in explicitly, by reading `useColorMode()` and
 * rendering its own control over the combined list:
 *
 *   const { mode, setMode } = useColorMode();
 *   [...COLOR_MODES, ...UX4G_COLOR_MODES].map((m) => <button onClick={() => setMode(m.id)} />)
 *
 * They exist so UX4G conformance can be demonstrated by flipping one attribute rather
 * than argued about — the MoSJE default (gov-blue, per DBIM) is unchanged either way.
 */
export const UX4G_COLOR_MODES: readonly ColorMode[] = [
  { id: "ux4g", label: "UX4G Violet", swatch: "#6a4eff" },
  { id: "ux4gdeep", label: "UX4G Deep", swatch: "#4a2bc2" },
] as const;

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
    (COLOR_MODES.some((m) => m.id === value) || UX4G_COLOR_MODES.some((m) => m.id === value))
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
