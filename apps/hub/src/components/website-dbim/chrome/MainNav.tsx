"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Icon } from "@mosje/design-system";

import { DBIM_MENU, dbimHref, dbimMenuFor, type DbimMenu } from "@/lib/website-dbim/nav";

/** The path inside the DBIM tree, whichever address served it (`/website/…` or `/website-dbim/…`). */
export function useDbimPath(): string {
  const pathname = usePathname() ?? "/";
  const inner = pathname.replace(/^\/website(-dbim)?(?=\/|$)/, "");
  return inner === "" ? "/" : inner;
}

/**
 * The DBIM menu row (992px and up): Home and the six fixed entries, each opening a
 * dark translucent panel of its second-level pages.
 *
 * A DISCLOSURE, not an ARIA menu: the panel holds ordinary links, so a screen reader
 * hears "Ministry, collapsed, button" and then a list of links — which is what it is.
 * It opens on hover (as the reference does) AND on the keyboard: Enter, Space or
 * ArrowDown opens it and moves to the first link, Up/Down walk the links, Escape
 * closes and hands focus back to the entry, and tabbing out closes it.
 */
export function DbimMainNav() {
  const path = useDbimPath();
  const active = dbimMenuFor(path);
  const isHome = path === "/";

  return (
    <nav className="db-nav" aria-label="Main">
      <ul className="db-nav__list">
        <li className="db-nav__item db-nav__item--home">
          <Link href={dbimHref("/")} className={isHome ? "db-nav__home is-active" : "db-nav__home"} aria-current={isHome ? "page" : undefined}>
            <span className="db-nav__label">Home</span>
          </Link>
        </li>
        {DBIM_MENU.map((menu) => (
          <MenuEntry key={menu.path} menu={menu} active={active?.path === menu.path} path={path} />
        ))}
      </ul>
    </nav>
  );
}

function MenuEntry({ menu, active, path }: { menu: DbimMenu; active: boolean; path: string }) {
  const [open, setOpen] = React.useState(false);
  const itemRef = React.useRef<HTMLLIElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  const links = () => Array.from(itemRef.current?.querySelectorAll<HTMLAnchorElement>(".db-nav__panel a") ?? []);
  const openAndFocus = (index: number) => {
    setOpen(true);
    // The panel is display:none until open; focus once it has painted.
    requestAnimationFrame(() => links().at(index)?.focus());
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAndFocus(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAndFocus(-1);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onPanelKey = (e: React.KeyboardEvent) => {
    const all = links();
    const i = all.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      all[(i + 1) % all.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      all[(i - 1 + all.length) % all.length]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <li
      ref={itemRef}
      className={`db-nav__item${active ? " is-active" : ""}${open ? " is-open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!itemRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Button
        ref={triggerRef}
        type="button"
        variant="neutral"
        appearance="text"
        className="db-nav__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={active ? "true" : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
      >
        <span className="db-nav__label">{menu.label}</span>
        <Icon name="expand_more" size={24} className="db-nav__chevron" />
      </Button>
      <ul id={panelId} className="db-nav__panel" onKeyDown={onPanelKey}>
        {menu.children.map((child) => (
          <li key={child.path}>
            <Link
              href={dbimHref(child.path)}
              aria-current={child.path === path ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
