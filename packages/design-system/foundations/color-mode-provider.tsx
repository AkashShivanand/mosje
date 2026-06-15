"use client";

import * as React from "react";
import {
  COLOR_MODES,
  DEFAULT_COLOR_MODE,
  applyColorMode,
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
  children: React.ReactNode;
}

export function ColorModeProvider({
  initialMode,
  children,
}: ColorModeProviderProps): React.JSX.Element {
  const [mode, setModeState] = React.useState<string>(() =>
    normalizeColorMode(initialMode ?? DEFAULT_COLOR_MODE),
  );

  // Reconcile with the cookie after mount (covers no-SSR apps + stale initial).
  React.useEffect(() => {
    const fromCookie = readColorModeCookie();
    applyColorMode(fromCookie);
    setModeState((current) => (current === fromCookie ? current : fromCookie));
  }, []);

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
