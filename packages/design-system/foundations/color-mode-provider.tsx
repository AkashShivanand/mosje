"use client";

import * as React from "react";
import {
  COLOR_MODES,
  DEFAULT_COLOR_MODE,
  applyColorMode,
  hasChosenColorMode,
  normalizeColorMode,
  readColorModeCookie,
  type ColorMode,
} from "./color-mode";

interface ColorModeContextValue {
  /** Active color-mode id. */
  mode: string;
  /** Switch + persist the color mode. */
  setMode: (mode: string) => void;
  /** All available modes (for building a switcher). */
  modes: readonly ColorMode[];
}

const ColorModeContext = React.createContext<ColorModeContextValue | null>(null);

export interface ColorModeProviderProps {
  /** Mode resolved on the server (from the cookie) to avoid a flash. */
  initialMode?: string;
  /**
   * The brand this surface opens in when nobody has chosen one — from
   * `defaultColorModeForPath`. A chosen mode always outranks it.
   *
   * Passed in rather than derived here so this package stays framework-agnostic:
   * the hub reads the path with `usePathname` and hands the answer down, which
   * is also what lets the brand follow a client-side navigation from the website
   * into a portal, where the inline `<head>` script never runs again.
   */
  routeDefault?: string;
  children: React.ReactNode;
}

export function ColorModeProvider({
  initialMode,
  routeDefault,
  children,
}: ColorModeProviderProps): React.JSX.Element {
  const [mode, setModeState] = React.useState<string>(() =>
    normalizeColorMode(initialMode ?? routeDefault ?? DEFAULT_COLOR_MODE),
  );

  /*
   * One rule, and it runs again whenever the route default changes: a chosen
   * brand wins; otherwise the surface opens in its own default.
   *
   * This used to call `applyColorMode(readColorModeCookie())` unconditionally on
   * mount, which did two harmful things at once — it PERSISTED a cookie nobody
   * had asked for, and because `readColorModeCookie` falls back to the estate
   * default it would have stamped `blue` over a portal's navy on first paint.
   * `persist: false` here is what keeps "has a cookie" meaning "chose".
   */
  React.useEffect(() => {
    const next = hasChosenColorMode()
      ? readColorModeCookie()
      : normalizeColorMode(routeDefault ?? DEFAULT_COLOR_MODE);
    applyColorMode(next, { persist: false });
    setModeState((current) => (current === next ? current : next));
  }, [routeDefault]);

  const setMode = React.useCallback((next: string) => {
    const normalized = normalizeColorMode(next);
    applyColorMode(normalized);
    setModeState(normalized);
  }, []);

  const value = React.useMemo<ColorModeContextValue>(
    () => ({ mode, setMode, modes: COLOR_MODES }),
    [mode, setMode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const ctx = React.useContext(ColorModeContext);
  if (!ctx) {
    throw new Error("useColorMode must be used within a <ColorModeProvider>");
  }
  return ctx;
}
