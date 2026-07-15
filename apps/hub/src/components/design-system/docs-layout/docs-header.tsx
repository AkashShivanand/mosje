"use client";
import * as React from "react";
import { NAV } from "@/lib/design-system/nav";
import { applyTheme, readThemeCookie, type Theme } from "@/lib/design-system/theme";

interface DocsHeaderProps {
  onSearchOpen: () => void;
  /** Mobile nav drawer open state (for the hamburger control). */
  navOpen?: boolean;
  /** Toggle the mobile nav drawer. */
  onMenuToggle?: () => void;
}

function useBreadcrumb(): [string, string] | null {
  const [crumb, setCrumb] = React.useState<[string, string] | null>(null);

  // Reads window.location, so it can only run after mount (SSR-safe seed is
  // null) — the standard client-hydration pattern, hence the scoped disables.
  React.useEffect(() => {
    const p = window.location.pathname.replace(/\/$/, "");
    if (p === "/design-system") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCrumb(null);
      return;
    }
    // Pick the BEST-matching nav item, not the first: prefer a real page item
    // (no #hash) and the most specific (longest) base path. Avoids anchor items
    // that share a base path winning — e.g. Patterns "#patterns" shadowing
    // Resources/Overview on /design-system/resources.
    let best: { group: string; label: string; len: number; hasHash: boolean } | null = null;
    for (const group of NAV) {
      for (const item of group.items) {
        const hrefBase = (item.href.split("#")[0] ?? item.href).replace(/\/$/, "");
        if (hrefBase === "/design-system") continue;
        if (p !== hrefBase && !p.startsWith(hrefBase + "/")) continue;
        const hasHash = item.href.includes("#");
        const better =
          !best ||
          (best.hasHash && !hasHash) ||
          (best.hasHash === hasHash && hrefBase.length > best.len);
        if (better) best = { group: group.title, label: item.label, len: hrefBase.length, hasHash };
      }
    }
    setCrumb(best ? [best.group, best.label] : null);
  }, []);

  return crumb;
}

export function DocsHeader({ onSearchOpen, navOpen, onMenuToggle }: DocsHeaderProps): React.JSX.Element {
  const breadcrumb = useBreadcrumb();
  const [theme, setTheme] = React.useState<Theme>("light");
  const isDark = theme === "dark";

  // Reconcile with the cookie after mount (the no-flash script already set the
  // attribute pre-paint; this syncs React state to it) — client-hydration
  // pattern, hence the scoped disable.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readThemeCookie());
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onSearchOpen]);

  return (
    <header className="docs-header" role="banner">
      <button
        className="docs-header__menu"
        onClick={onMenuToggle}
        aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={navOpen ?? false}
        aria-controls="docs-sidebar"
        type="button"
      >
        {navOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <nav className="docs-header__breadcrumb" aria-label="Breadcrumb">
        <a href="/design-system" className="docs-header__breadcrumb-home">
          SAMAVESH
        </a>
        {breadcrumb && (
          <>
            <span className="docs-header__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="docs-header__breadcrumb-section">{breadcrumb[0]}</span>
            <span className="docs-header__breadcrumb-sep" aria-hidden="true">/</span>
            <span className="docs-header__breadcrumb-page">{breadcrumb[1]}</span>
          </>
        )}
      </nav>
      <button
        className="docs-header__theme-toggle"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
        title={isDark ? "Light mode" : "Dark mode"}
        type="button"
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <button
        className="docs-header__search-btn"
        onClick={onSearchOpen}
        aria-label="Search documentation (Cmd K)"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m11 11 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="docs-header__search-label">Search docs…</span>
        <kbd className="docs-header__search-kbd">⌘K</kbd>
      </button>
    </header>
  );
}
