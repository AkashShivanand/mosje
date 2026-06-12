"use client";
import * as React from "react";
import { SidebarNav } from "./sidebar-nav";
import { DocsHeader } from "./docs-header";
import { OnThisPage } from "./on-this-page";
import "./docs-layout.css";

interface DocsLayoutProps {
  children: React.ReactNode;
  breadcrumb?: string[];
}

export function DocsLayout({ children, breadcrumb }: DocsLayoutProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <a href="/design-system" className="docs-sidebar__brand">
            <span className="docs-sidebar__logo" aria-hidden="true">SA</span>
            <div>
              <div className="docs-sidebar__name">SAMAVESH</div>
              <div className="docs-sidebar__tagline">Design System</div>
            </div>
          </a>
          <SidebarNav />
        </aside>
        <DocsHeader onSearchOpen={() => setSearchOpen(true)} breadcrumb={breadcrumb} />
        <main id="main-content" className="docs-main">
          <div className="docs-content">{children}</div>
          <OnThisPage />
        </main>
      </div>
      {searchOpen && (
        <React.Suspense fallback={null}>
          {/* CmdSearch lazy-imported to keep initial bundle small */}
          <div onClick={() => setSearchOpen(false)} />
        </React.Suspense>
      )}
    </>
  );
}
