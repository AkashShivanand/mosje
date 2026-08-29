"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return React.useMemo(() => {
    const p = (pathname ?? "").replace(/\/$/, "");
    if (!p || p === "/design-system") {
      return null;
    }

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
    return best ? [best.group, best.label] : null;
  }, [pathname]);
}

export function DocsHeader({ onSearchOpen, navOpen, onMenuToggle }: DocsHeaderProps): React.JSX.Element {
  const breadcrumb = useBreadcrumb();
  const isMac = React.useSyncExternalStore(
    () => () => {},
    () => typeof navigator !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform),
    () => true
  );

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
        <Link href="/design-system" className="docs-header__breadcrumb-home">
          SAMAVESH
        </Link>
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
        aria-label={`Search documentation (${isMac ? "Cmd K" : "Ctrl K"})`}
        type="button"
      >
        <Icon name="search" size={16} />
        <span className="docs-header__search-label">Search docs…</span>
        <kbd className="docs-header__search-kbd">{isMac ? "⌘K" : "Ctrl K"}</kbd>
      </button>
    </header>
  );
}
