"use client";

import * as React from "react";
import { navDisabledAria, navTag } from "./nav-link-tag";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
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
const IcMegaChevron = () => <Icon name="chevron_right" size={24} className="ds-hdr-ic" />;

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
      <Icon
        name="menu_open"
        size={24}
        className={cn(!expanded && "ds-hdr-brand__toggle-flip")}
      />
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
      <Icon name="menu" size={24} />
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
  const Tag = navTag(item.disabled);
  return (
    <Tag
      href={item.disabled ? undefined : item.href}
      {...navDisabledAria(item.disabled)}
      className={cn(
        "ds-hdr-nav__drop-link",
        item.active && "is-active",
        item.disabled && "is-disabled",
        className,
      )}
      aria-disabled={item.disabled || undefined}
      target={item.external && !item.disabled ? "_blank" : undefined}
      rel={item.external && !item.disabled ? "noreferrer" : undefined}
      onClick={item.disabled ? undefined : onSelect}
    >
      {item.label}
      {item.external && !item.disabled && <NewTabHint />}
    </Tag>
  );
}

/**
 * The parent entry's own page, offered inside the panel it opens.
 *
 * A nav item that carries a menu renders as `<a href>` and then cancels its own
 * click, so its destination is unreachable by mouse or keyboard — "Department" is
 * a real page that nothing in the masthead could open. Rather than take the href
 * away (it is the no-JS fallback, and middle-click still uses it), the panel
 * carries the destination as a row of its own.
 */
export interface NavOverview {
  label: string;
  href: string;
}

function OverviewRow({ overview, onSelect }: { overview: NavOverview; onSelect?: () => void }): React.JSX.Element {
  return (
    <a className="ds-hdr-nav__overview" href={overview.href} onClick={onSelect}>
      <span>All of {overview.label}</span>
      <Icon name="arrow_forward" size={20} aria-hidden="true" />
    </a>
  );
}

export interface NavDropdownProps {
  id?: string;
  label?: string;
  items: NavLink[];
  /** The parent entry's own page, rendered as a closing row. */
  overview?: NavOverview;
  onSelect?: () => void;
  className?: string;
}

/** NavDropdown — a simple single-column menu (Figma `Navbar/NavDropdown`). */
export function NavDropdown({ id, label, items, overview, onSelect, className }: NavDropdownProps): React.JSX.Element {
  return (
    <div className={cn("ds-hdr-nav__drop-wrap", className)}>
      <ul id={id} className="ds-hdr-nav__drop" aria-label={label}>
        {items.map((c) => (
          <li key={c.label}>
            <DropdownItem item={c} onSelect={onSelect} />
          </li>
        ))}
        {overview && (
          <li>
            <OverviewRow overview={overview} onSelect={onSelect} />
          </li>
        )}
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
  const Tag = navTag(item.disabled);
  return (
    <Tag
      href={item.disabled ? undefined : item.href}
      {...navDisabledAria(item.disabled)}
      className={cn(
        "ds-hdr-mega-item",
        item.active && "is-active",
        item.disabled && "is-disabled",
        className,
      )}
      aria-disabled={item.disabled || undefined}
      target={item.external && !item.disabled ? "_blank" : undefined}
      rel={item.external && !item.disabled ? "noreferrer" : undefined}
      onClick={item.disabled ? undefined : onSelect}
    >
      <span className={cn("ds-hdr-mega-item__logo", !item.iconSrc && "is-fallback")}>
        {item.iconSrc ? (
          <img src={item.iconSrc} alt="" loading="lazy" />
        ) : (
          /* Not a monogram: the abbreviation is already the row's title, and
             repeating "NC" beside "NCSC" is noise. An institution glyph says
             "organisation, no emblem supplied" — an empty frame says "broken". */
          <Icon name="account_balance" size={24} aria-hidden="true" />
        )}
      </span>
      <span className="ds-hdr-mega-item__copy">
        <span className="ds-hdr-mega-item__abbr">{item.abbr}</span>
        <span className="ds-hdr-mega-item__name">{item.name}</span>
      </span>
      <IcMegaChevron />
    </Tag>
  );
}

export interface MegaMenuProps {
  id?: string;
  label?: string;
  columns: NavColumn[];
  /** The parent entry's own page, rendered as a closing row. */
  overview?: NavOverview;
  onSelect?: () => void;
  className?: string;
}

/** MegaMenu — the multi-column organisation grid (Figma `Navbar/MegaMenu`). */
export function MegaMenu({ id, label, columns, overview, onSelect, className }: MegaMenuProps): React.JSX.Element {
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
        {overview && (
          <div className="ds-hdr-nav__mega-foot">
            <OverviewRow overview={overview} onSelect={onSelect} />
          </div>
        )}
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
  /* Open is deliberately slower than a flick across the row; close is slower
     still, so travelling from the label to the panel — or across a sibling on the
     way to a centred one — does not drop what you were reaching for. */
  const OPEN_MS = 100;
  const CLOSE_MS = 300;
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const liRef = React.useRef<HTMLLIElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const Tag = navTag(item.disabled);
  const clear = () => {
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = undefined;
  };
  React.useEffect(() => clear, []);
  const schedule = (next: boolean, ms: number) => {
    clear();
    timer.current = setTimeout(() => onOpenChange?.(next), ms);
  };
  const hasMega = !!item.columns?.length;
  const hasChildren = !hasMega && !!item.children?.length;
  // A disabled entry opens nothing — the caret would promise a menu it will not show.
  const hasMenu = !item.disabled && (hasMega || hasChildren);
  const dropId = `ds-hdr-drop-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
  const close = () => onOpenChange?.(false);
  /* The parent's own page, offered inside the panel — see `NavOverview`. Only when
     there is somewhere real to go: "#" and "" are not destinations. */
  const overview =
    hasMenu && item.href && item.href !== "#" ? { label: item.label, href: item.href } : undefined;

  /** Every focusable row inside the open panel, in document order. */
  const panelItems = () =>
    Array.from(
      liRef.current?.querySelectorAll<HTMLElement>(
        ".ds-hdr-nav__drop a[href], .ds-hdr-nav__mega a[href]",
      ) ?? [],
    );

  const focusAt = (list: HTMLElement[], ix: number) => {
    if (list.length === 0) return;
    const wrapped = ((ix % list.length) + list.length) % list.length;
    list[wrapped]?.focus();
  };

  /**
   * ARROW KEYS INTO AND AROUND THE PANEL.
   *
   * This is the ARIA Disclosure Navigation pattern, which is why the trigger is a
   * link and not a `menuitem` — but APG's own note is that arrow support is what
   * makes a large disclosure usable, and the organisations panel runs to thirty
   * rows. Without it the only way past "Associated Organisations" to "Offerings"
   * was thirty presses of Tab. Tab still walks the panel exactly as before; these
   * are additions, not a replacement.
   */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMenu) return;
    const list = open ? panelItems() : [];
    const onTrigger = e.target === linkRef.current;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        clear();
        if (!open) {
          onOpenChange?.(true);
          // The panel is not in the DOM until the next paint.
          requestAnimationFrame(() => focusAt(panelItems(), 0));
        } else {
          focusAt(list, onTrigger ? 0 : list.indexOf(document.activeElement as HTMLElement) + 1);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        clear();
        if (!open) {
          onOpenChange?.(true);
          requestAnimationFrame(() => {
            const l = panelItems();
            focusAt(l, l.length - 1);
          });
        } else if (onTrigger) {
          focusAt(list, list.length - 1);
        } else {
          focusAt(list, list.indexOf(document.activeElement as HTMLElement) - 1);
        }
        break;
      case "Home":
        if (open && !onTrigger) {
          e.preventDefault();
          focusAt(list, 0);
        }
        break;
      case "End":
        if (open && !onTrigger) {
          e.preventDefault();
          focusAt(list, list.length - 1);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          clear();
          close();
          linkRef.current?.focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions --
       the <li> is the HOVER REGION for a menu whose trigger is the link inside it,
       and it must be: moving the handlers onto the link closes the menu the moment
       the pointer travels from the trigger toward the panel. The keyboard path is
       not missing — `onKeyDown` below opens and closes the same menu with the
       arrow keys, on the focusable link. */
    <li
      ref={liRef}
      className={cn("ds-hdr-nav__item", className)}
      onMouseEnter={() => hasMenu && schedule(true, OPEN_MS)}
      /* GATED ON `hasMenu`, and it has to be. Unconditionally, an entry with no
         menu of its own scheduled a close on every mouse-leave — so brushing past
         "Home" on the way to the centred organisations panel shut that panel
         300ms later, from a nav item that owns nothing. An item that has a menu
         still closes its own. */
      onMouseLeave={() => hasMenu && schedule(false, CLOSE_MS)}
      onKeyDown={onKeyDown}
    >
      <Tag
        ref={linkRef}
        href={item.disabled ? undefined : item.href}
        {...navDisabledAria(item.disabled)}
        className={cn(
          "ds-hdr-nav__link",
          item.active && "is-active",
          item.disabled && "is-disabled",
        )}
        aria-disabled={item.disabled || undefined}
        target={item.external && !item.disabled ? "_blank" : undefined}
        rel={item.external && !item.disabled ? "noreferrer" : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-controls={hasMenu && open ? dropId : undefined}
        /* "page" only when this entry IS a page. An entry that owns a menu carries
           `href="#"` and is a SECTION — it is active because the reader is somewhere
           beneath it, not because they are on it. Announcing "current page" there
           names a destination that does not exist; `true` says "the current one of
           these", which is what is true. */
        aria-current={item.active ? (hasMenu ? true : "page") : undefined}
        onClick={(e) => {
          if (hasMenu) {
            e.preventDefault();
            clear();
            onOpenChange?.(!open);
          }
        }}
      >
        {item.label}
        {hasMenu && <IcCaret />}
        {item.external && !item.disabled && <NewTabHint />}
      </Tag>

      {hasChildren && open && (
        <NavDropdown id={dropId} label={item.label} items={item.children!} overview={overview} onSelect={close} />
      )}
      {hasMega && open && (
        <MegaMenu id={dropId} label={item.label} columns={item.columns!} overview={overview} onSelect={close} />
      )}
    </li>
  );
}
