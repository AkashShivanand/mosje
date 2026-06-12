"use client";
import * as React from "react";

interface DocsHeaderProps {
  onSearchOpen: () => void;
  breadcrumb?: string[];
}

export function DocsHeader({ onSearchOpen, breadcrumb = [] }: DocsHeaderProps): React.JSX.Element {
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
      <div className="docs-header__breadcrumb" aria-label="Breadcrumb">
        <a href="/design-system" style={{ color: "var(--ds-ink-muted)", textDecoration: "none" }}>
          SAMAVESH
        </a>
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={i}>
            <span className="docs-header__breadcrumb-sep" aria-hidden="true">/</span>
            <span style={{ color: i === breadcrumb.length - 1 ? "var(--ds-ink)" : "inherit" }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>
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
      <a
        href="/storybook/"
        style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}
        target="_blank"
        rel="noopener noreferrer"
      >
        Storybook ↗
      </a>
    </header>
  );
}
