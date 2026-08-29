"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { DocsHeader } from "./docs-header";
import { OnThisPage } from "./on-this-page";
import { CmdSearch } from "@/components/design-system/search/cmd-search";
import "./docs-layout.css";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps): React.JSX.Element {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement>(null);

  // While the mobile nav drawer is open: lock body scroll, close on Escape,
  // move focus into the drawer and trap Tab inside it, then restore focus.
  React.useEffect(() => {
    if (!navOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const drawer = sidebarRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNavOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
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
          ref={sidebarRef}
          id="docs-sidebar"
          className={`docs-sidebar${navOpen ? " is-open" : ""}`}
          onClick={onSidebarClick}
        >
          <Link href="/design-system" className="docs-sidebar__brand">
            {/* next/image, per CLAUDE.md — the codemod that added this sidebar logo
                left a bare <img>, which is the one lint warning the estate carried.
                Decorative, so alt="" and it stays out of the accessible name; the
                wordmark beside it already names the link. */}
            <Image
              src="/design-system/samavesh-logo.svg"
              alt=""
              width={32}
              height={32}
              className="docs-sidebar__logo-img"
            />
            <div>
              <div className="docs-sidebar__name">SAMAVESH</div>
              <div className="docs-sidebar__tagline">Design System</div>
            </div>
          </Link>
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
