"use client";
import * as React from "react";
import { NAV } from "@/lib/nav";
import { applyTheme, readThemeCookie, type Theme } from "@/lib/theme";

interface DocsHeaderProps {
  onSearchOpen: () => void;
}

function useBreadcrumb(): [string, string] | null {
  const [crumb, setCrumb] = React.useState<[string, string] | null>(null);

  React.useEffect(() => {
    const p = window.location.pathname.replace(/\/$/, "");
    if (p === "/design-system") {
      setCrumb(null);
      return;
    }
    for (const group of NAV) {
      for (const item of group.items) {
        const hrefBase = item.href.split("#")[0];
        if (hrefBase !== "/design-system" && (p === hrefBase || p.startsWith(hrefBase + "/"))) {
          setCrumb([group.title, item.label]);
          return;
        }
      }
    }
  }, []);

  return crumb;
}

export function DocsHeader({ onSearchOpen }: DocsHeaderProps): React.JSX.Element {
  const breadcrumb = useBreadcrumb();
  const [theme, setTheme] = React.useState<Theme>("light");
  const isDark = theme === "dark";

  // Reconcile with the cookie after mount (the no-flash script already set the
  // attribute pre-paint; this syncs React state to it).
  React.useEffect(() => {
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
        Search docs…
        <kbd className="docs-header__search-kbd">⌘K</kbd>
      </button>
    </header>
  );
}
