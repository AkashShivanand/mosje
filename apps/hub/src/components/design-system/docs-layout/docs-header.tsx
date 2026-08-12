"use client";
import * as React from "react";
import { Icon } from "@mosje/design-system";
import { NAV } from "@/lib/design-system/nav";

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
        <Icon name={navOpen ? "close" : "menu"} size={20} />
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
        className="docs-header__search-btn"
        onClick={onSearchOpen}
        aria-label="Search documentation (Cmd K)"
        type="button"
      >
        <Icon name="search" size={16} />
        <span className="docs-header__search-label">Search docs…</span>
        <kbd className="docs-header__search-kbd">⌘K</kbd>
      </button>
    </header>
  );
}
