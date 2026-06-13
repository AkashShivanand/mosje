"use client";
import * as React from "react";
import { NAV } from "@/lib/nav";

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
