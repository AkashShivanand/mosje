"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACCOUNTS, type Account, type RoleKey } from "@/lib/roles";

interface AppState {
  account: Account | null;
  hydrated: boolean;
  signIn: (mobile: string, password: string) => { ok: true } | { ok: false; reason: string };
  signOut: () => void;
  fontScale: "small" | "default" | "large";
  setFontScale: (s: "small" | "default" | "large") => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = "smile.session.v1";
const PREF_KEY = "smile.prefs.v1";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [fontScale, setFontScale] = useState<"small" | "default" | "large">("default");
  const [highContrast, setHighContrast] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const sess = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (sess?.mobile) {
        const found = ACCOUNTS.find((a) => a.mobile === sess.mobile);
        if (found) setAccount(found);
      }
      const prefs = JSON.parse(localStorage.getItem(PREF_KEY) || "null");
      if (prefs) {
        if (prefs.fontScale) setFontScale(prefs.fontScale);
        if (typeof prefs.highContrast === "boolean") setHighContrast(prefs.highContrast);
        if (typeof prefs.sidebarCollapsed === "boolean") setSidebarCollapsed(prefs.sidebarCollapsed);
      }
    } catch {}
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-fontscale", fontScale);
    document.documentElement.setAttribute("data-highcontrast", String(highContrast));
    localStorage.setItem(PREF_KEY, JSON.stringify({ fontScale, highContrast, sidebarCollapsed }));
  }, [fontScale, highContrast, sidebarCollapsed, hydrated]);

  const signIn: AppState["signIn"] = (mobile, password) => {
    const found = ACCOUNTS.find((a) => a.mobile === mobile && a.password === password);
    if (!found) return { ok: false, reason: "Invalid mobile number or password." };
    setAccount(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mobile: found.mobile }));
    // Set session cookie so the Edge middleware can enforce server-side auth.
    document.cookie = "smile_session=1; path=/portals/smile-admin; SameSite=Lax";
    return { ok: true };
  };

  const signOut = () => {
    setAccount(null);
    localStorage.removeItem(STORAGE_KEY);
    // Expire the session cookie so the middleware redirects unauthenticated requests.
    document.cookie = "smile_session=; path=/portals/smile-admin; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const value = useMemo<AppState>(
    () => ({
      account,
      hydrated,
      signIn,
      signOut,
      fontScale,
      setFontScale,
      highContrast,
      setHighContrast,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [account, hydrated, fontScale, highContrast, sidebarCollapsed, mobileNavOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function useRole(): RoleKey | null {
  return useApp().account?.role ?? null;
}
