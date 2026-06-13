"use client";
import * as React from "react";
import { SidebarNav } from "./sidebar-nav";
import { DocsHeader } from "./docs-header";
import { OnThisPage } from "./on-this-page";
import { CmdSearch } from "@/components/search/cmd-search";
import "./docs-layout.css";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);

  // Lock body scroll while the mobile nav drawer is open, and close on Escape.
  React.useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  // Close the drawer when a navigation link inside it is activated.
  const onSidebarClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a")) setNavOpen(false);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="docs-shell">
        <aside
          id="docs-sidebar"
          className={`docs-sidebar${navOpen ? " is-open" : ""}`}
          onClick={onSidebarClick}
        >
          <a href="/design-system" className="docs-sidebar__brand">
            <span className="docs-sidebar__logo" aria-hidden="true">SA</span>
            <div>
              <div className="docs-sidebar__name">SAMAVESH</div>
              <div className="docs-sidebar__tagline">Design System</div>
            </div>
          </a>
          <SidebarNav />
        </aside>
        {navOpen && (
          <div
            className="docs-scrim"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
        )}
        <DocsHeader
          onSearchOpen={() => setSearchOpen(true)}
          navOpen={navOpen}
          onMenuToggle={() => setNavOpen((v) => !v)}
        />
        <main id="main-content" className="docs-main">
          <div className="docs-content">{children}</div>
          <OnThisPage />
        </main>
      </div>
      {searchOpen && <CmdSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
