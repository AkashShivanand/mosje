"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../icon";
import type { NavColumn, NavItem, NavLink, NavMegaItem } from "./types";
import "./header.css";

/* =============================================================================
   Navbar parts — the pieces the Figma library names, as real exported components.
   Until v0.31.0 all of this was inline markup inside SiteHeader, so a portal that
   wanted a mega-menu outside the masthead had nothing to import and re-implemented
   it. Every part below maps 1:1 to a Figma component on the Navbar page.

     Navbar/MenuToggle    → <MenuToggle>       sidebar trigger (glyph mirrors state)
     Navbar/SheetToggle   → <SheetToggle>      NavSheet trigger (one state)
     Navbar/NavItem       → <NavItemLink>      top-level nav entry + its menu
     Navbar/NavDropdown   → <NavDropdown>      simple single-column menu
     Navbar/DropdownItem  → <DropdownItem>     one row inside it
     Navbar/MegaMenu      → <MegaMenu>         multi-column org grid
     Navbar/MegaMenuItem  → <MegaMenuItem>     emblem + abbr + name row

   NAME NOTE: Figma's component is `Navbar/NavItem`, but `NavItem` is already the
   data type every consumer passes to `nav`. A TypeScript type and a component
   cannot share one name in one barrel, so the component is `NavItemLink` and the
   type keeps the name callers already write.
   ========================================================================== */

const IcCaret = () => <Icon name="keyboard_arrow_down" size={16} className="ds-hdr-ic" />;
const IcMegaChevron = () => <Icon name="chevron_right" size={20} className="ds-hdr-ic" />;

/** WCAG 3.2.5 — a link that leaves the tab has to say so, visibly and to AT. */
export const NewTabHint = (): React.JSX.Element => (
  <>
    <Icon name="open_in_new" size={16} className="ds-hdr-ic" />
    <span className="ds-hdr-sr">(opens in a new tab)</span>
  </>
);

/* ── Triggers ─────────────────────────────────────────────────────────────── */

export interface MenuToggleProps {
  /**
   * State of the sidebar this drives. `true` ⇒ `menu_open`, `false` ⇒ `menu`.
   * Also drives `aria-expanded`.
   */
  expanded?: boolean;
  onToggle: () => void;
  /** id of the sidebar element. Pass it ONLY if that id exists on the page. */
  controlsId?: string;
  className?: string;
}

/**
 * MenuToggle — the trigger for a **persistent sidebar** (Figma `Navbar/MenuToggle`).
 *
 * Its glyph is the sidebar's state, not its own: the sidebar is on screen either
 * way, so the control says which way it will go. That is why it takes `expanded`
 * and why `SheetToggle`, which opens an overlay, does not.
 */
export function MenuToggle({
  expanded,
  onToggle,
  controlsId,
  className,
}: MenuToggleProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn("ds-hdr-brand__toggle", className)}
      aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
    >
      <Icon name={expanded ? "menu_open" : "menu"} size={32} />
    </button>
  );
}

export interface SheetToggleProps {
  onOpen: () => void;
  /** id of the NavSheet region this opens. */
  controlsId?: string;
  /** Whether the sheet is currently open (drives `aria-expanded` only). */
  open?: boolean;
  className?: string;
}

/**
 * SheetToggle — the mobile trigger for `NavSheet` (Figma `Navbar/SheetToggle`).
 *
 * ONE glyph, deliberately. The sheet is an overlay dismissed by its own close
 * button, so there is no second state for this control to show. Reaching for
 * `MenuToggle` here would put a sidebar-shaped property on something that opens
 * no sidebar.
 */
export function SheetToggle({
  onOpen,
  controlsId,
  open,
  className,
}: SheetToggleProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn("ds-hdr-burger", className)}
      aria-label="Open navigation menu"
      aria-expanded={open}
      aria-controls={controlsId}
      onClick={onOpen}
    >
      <Icon name="menu" size={32} />
    </button>
  );
}

/* ── Dropdown ─────────────────────────────────────────────────────────────── */

export interface DropdownItemProps {
  item: NavLink;
  onSelect?: () => void;
  className?: string;
}

/** DropdownItem — one row inside a simple nav dropdown (Figma `Navbar/DropdownItem`). */
export function DropdownItem({ item, onSelect, className }: DropdownItemProps): React.JSX.Element {
  return (
    <a
      href={item.href}
      className={cn("ds-hdr-nav__drop-link", item.active && "is-active", className)}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      onClick={onSelect}
    >
      {item.label}
      {item.external && <NewTabHint />}
    </a>
  );
}

export interface NavDropdownProps {
  id?: string;
  label?: string;
  items: NavLink[];
  onSelect?: () => void;
  className?: string;
}

/** NavDropdown — a simple single-column menu (Figma `Navbar/NavDropdown`). */
export function NavDropdown({ id, label, items, onSelect, className }: NavDropdownProps): React.JSX.Element {
  return (
    <div className={cn("ds-hdr-nav__drop-wrap", className)}>
      <ul id={id} className="ds-hdr-nav__drop" aria-label={label}>
        {items.map((c) => (
          <li key={c.label}>
            <DropdownItem item={c} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Mega-menu ────────────────────────────────────────────────────────────── */

export interface MegaMenuItemProps {
  item: NavMegaItem;
  onSelect?: () => void;
  className?: string;
}

/** MegaMenuItem — emblem + abbreviation + full name (Figma `Navbar/MegaMenuItem`). */
export function MegaMenuItem({ item, onSelect, className }: MegaMenuItemProps): React.JSX.Element {
  return (
    <a
      href={item.href}
      className={cn("ds-hdr-mega-item", item.active && "is-active", className)}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      onClick={onSelect}
    >
      <span className="ds-hdr-mega-item__logo">
        {item.iconSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.iconSrc} alt="" loading="lazy" />
        ) : null}
      </span>
      <span className="ds-hdr-mega-item__copy">
        <span className="ds-hdr-mega-item__abbr">{item.abbr}</span>
        <span className="ds-hdr-mega-item__name">{item.name}</span>
      </span>
      <IcMegaChevron />
    </a>
  );
}

export interface MegaMenuProps {
  id?: string;
  label?: string;
  columns: NavColumn[];
  onSelect?: () => void;
  className?: string;
}

/** MegaMenu — the multi-column organisation grid (Figma `Navbar/MegaMenu`). */
export function MegaMenu({ id, label, columns, onSelect, className }: MegaMenuProps): React.JSX.Element {
  return (
    <div className={cn("ds-hdr-nav__drop-wrap is-mega", className)}>
      <div id={id} className="ds-hdr-nav__mega" role="group" aria-label={label}>
        {columns.map((col, ci) => (
          <div key={col.heading ?? ci} className="ds-hdr-nav__mega-col">
            {col.heading && <p className="ds-hdr-nav__mega-head">{col.heading}</p>}
            {col.items?.length ? (
              <ul className="ds-hdr-nav__mega-list is-rich">
                {col.items.map((it) => (
                  <li key={it.abbr}>
                    <MegaMenuItem item={it} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="ds-hdr-nav__mega-list">
                {col.links?.map((c) => (
                  <li key={c.label}>
                    <DropdownItem item={c} onSelect={onSelect} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Nav item ─────────────────────────────────────────────────────────────── */

export interface NavItemLinkProps {
  item: NavItem;
  /** Whether this item's menu is open. Controlled by the nav that owns it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * NavItemLink — one primary nav entry plus whichever menu it carries
 * (Figma `Navbar/NavItem`). `columns` wins over `children` when both are given,
 * matching the type's documented contract.
 */
export function NavItemLink({ item, open = false, onOpenChange, className }: NavItemLinkProps): React.JSX.Element {
  const hasMega = !!item.columns?.length;
  const hasChildren = !hasMega && !!item.children?.length;
  const hasMenu = hasMega || hasChildren;
  const dropId = `ds-hdr-drop-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const close = () => onOpenChange?.(false);

  return (
    <li
      className={cn("ds-hdr-nav__item", className)}
      onMouseEnter={() => hasMenu && onOpenChange?.(true)}
      onMouseLeave={() => onOpenChange?.(false)}
    >
      <a
        href={item.href}
        className={cn("ds-hdr-nav__link", item.active && "is-active")}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noreferrer" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-haspopup={hasMenu ? true : undefined}
        aria-controls={hasMenu && open ? dropId : undefined}
        aria-current={item.active ? "page" : undefined}
        onClick={(e) => {
          if (hasMenu) {
            e.preventDefault();
            onOpenChange?.(!open);
          }
        }}
      >
        {item.label}
        {hasMenu && <IcCaret />}
        {item.external && <NewTabHint />}
      </a>

      {hasChildren && open && (
        <NavDropdown id={dropId} label={item.label} items={item.children!} onSelect={close} />
      )}
      {hasMega && open && (
        <MegaMenu id={dropId} label={item.label} columns={item.columns!} onSelect={close} />
      )}
    </li>
  );
}
