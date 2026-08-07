/**
 * Appearance theme controller for the SAMAVESH docs portal.
 *
 * This is the *appearance* axis (light ⇄ dark) — distinct from the design
 * system's *brand* axis (`data-brand`, which picks the primary ramp).
 * It drives the generated `[data-theme="dark"]` token block in
 * `@mosje/design-system/tokens.css`.
 *
 * Persisted in a cookie so the choice survives reloads, and applied before
 * first paint via `themeInitScript()` to avoid a flash of the wrong theme.
 */

export type Theme = "light" | "dark";

export const THEME_COOKIE = "mosje-theme";
export const THEME_ATTR = "data-theme";
export const DEFAULT_THEME: Theme = "light";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function normalize(value: string | null | undefined): Theme {
  return value === "dark" ? "dark" : "light";
}

/** Read the persisted theme from `document.cookie` (client only). */
export function readThemeCookie(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]+)`),
  );
  return normalize(match?.[1] ? decodeURIComponent(match[1]) : null);
}

/** Apply the theme to `<html>` and persist it (client only). */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const normalized = normalize(theme);
  if (normalized === "dark") {
    document.documentElement.setAttribute(THEME_ATTR, "dark");
  } else {
    // Light is the :root default — remove the attribute rather than set "light".
    document.documentElement.removeAttribute(THEME_ATTR);
  }
  document.cookie = `${THEME_COOKIE}=${normalized}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Inline no-flash script. Render once in `<head>` so the correct `data-theme`
 * is set before first paint.
 *
 * @security The returned string is a compile-time constant; the only runtime
 * input is the cookie value read by the script itself in the browser. No
 * server-supplied data is interpolated, so it is XSS-safe.
 */
export function themeInitScript(): string {
  return `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]+)/);if(m&&decodeURIComponent(m[1])==="dark"){document.documentElement.setAttribute("${THEME_ATTR}","dark");}}catch(e){}})();`;
}
