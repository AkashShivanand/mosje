/**
 * Framework-agnostic color-mode core for the MoSJE estate.
 *
 * A "color mode" is a brand axis (which primary ramp is active) — INDEPENDENT of
 * light/dark appearance. The token pipeline emits a `[data-color-mode="<id>"]`
 * block per non-default mode (see packages/tokens/src/*.json + the generated
 * @mosje/design-system/tokens.css). Adding a mode = add a ramp + colorModes
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
  { id: "blue-light", label: "Blue · Light", swatch: "#0373df" },
  { id: "blue-dark", label: "Blue · Dark", swatch: "#003366" },
] as const;

export type ColorModeId = (typeof COLOR_MODES)[number]["id"];

export const DEFAULT_COLOR_MODE: string = COLOR_MODES[0]?.id ?? "blue-light";
export const COLOR_MODE_COOKIE = "mosje-color-mode";
export const COLOR_MODE_ATTR = "data-color-mode";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isColorMode(value: string | null | undefined): boolean {
  return !!value && COLOR_MODES.some((m) => m.id === value);
}

export function normalizeColorMode(value: string | null | undefined): string {
  return isColorMode(value) ? (value as string) : DEFAULT_COLOR_MODE;
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
 */
export function colorModeInitScript(defaultMode: string = DEFAULT_COLOR_MODE): string {
  const fallback = normalizeColorMode(defaultMode);
  return `(function(){try{var m=document.cookie.match(/(?:^|; )${COLOR_MODE_COOKIE}=([^;]+)/);var v=m?decodeURIComponent(m[1]):"${fallback}";document.documentElement.setAttribute("${COLOR_MODE_ATTR}",v);}catch(e){}})();`;
}
