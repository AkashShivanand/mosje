"use client";

import * as React from "react";
import { Icon } from "../../utilities/icon";
import { Avatar } from "../../data-display/avatar";
import { cn } from "../../../utils/cn";
import type { AccountMenuItem, HeaderAccount } from "./types";
import "./header.css";

export interface AccountMenuProps {
  account: HeaderAccount;
  /** Dropdown items. When empty, the account renders as a static (Figma) block. */
  items?: AccountMenuItem[];
  /**
   * Avatar size. 48 in the resting brand row; `SiteHeader` passes 40 inside the
   * condensed bar, whose every control is 40 — at 48 the avatar, not the bar's
   * min-height, decided the height, and a phone measured 64 against a designed 56.
   * Figma: Navbar/Portal On Scroll carries Avatar Size=Large - 40px.
   * @default 48
   */
  avatarSize?: 40 | 48;
  className?: string;
}

/**
 * Derive up-to-two-letter initials from a display name.
 *
 * Returns `undefined` rather than "?" when there is nothing to derive from: a
 * question mark inside an avatar reads as an error, and `Avatar` already falls
 * back to a person glyph, which reads as "no picture".
 *
 * `toUpperCase()` is a no-op on Devanagari and every other unicased script, so
 * a Hindi name yields Hindi initials rather than mangled Latin ones.
 */
function initials(name: string): string | undefined {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return (parts[0]?.[0] ?? "").toUpperCase() || undefined;
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

/**
 * AccountMenu — the signed-in account control in the portal masthead.
 *
 * ── TWO MODES, AND THE DIFFERENCE MUST BE VISIBLE ─────────────────────────
 * With no `items` it is a static identity block: no caret, no button, not
 * focusable, no hover treatment. With items it is a menu button. The caret is
 * the ONLY thing that separates the two on screen, which is why it is
 * conditional and why it must not become decoration on both.
 *
 * That is also the answer to "does an avatar need a disclosure icon". For a
 * consumer product used daily — Gmail, iCloud — a bare avatar is over-learned
 * and needs no caret. This is a government portal a citizen may open twice a
 * year, and it ships BOTH modes from one component. Explicit wins.
 *
 * ── THE AVATAR IS THE DS `Avatar`, AND IT IS CIRCULAR ─────────────────────
 * It used to be a hand-rolled <img>/<span> pair styled to a rounded square,
 * inside the design system that exports `Avatar`. Circular is the component's
 * own default, and here it carries information: everything else square in this
 * masthead is an institution — the National Emblem, the co-brand marks, the
 * organisation chips in the mega-menu. The one round thing is the person.
 *
 * ── KEYBOARD: THE FULL APG MENU BUTTON ────────────────────────────────────
 * The old build declared `role="menu"` and implemented none of what that role
 * promises. Now: Enter / Space / ArrowDown open and focus the first item;
 * ArrowUp opens and focuses the last; arrows cycle; Home and End jump; Escape
 * closes and returns focus to the trigger; Tab closes and lets focus move on.
 * Focus is roving (`tabindex` 0 / -1), not `aria-activedescendant`.
 *
 * First-character type-ahead is the one APG option not implemented — these
 * menus run three to five items, where it earns nothing.
 */
export function AccountMenu({
  account,
  items = [],
  avatarSize = 48,
  className,
}: AccountMenuProps): React.JSX.Element {
  const interactive = items.length > 0;
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = React.useId();

  /* `preventScroll` throughout: this control lives in a masthead pinned to the top
     of the viewport, and any scrolling on focus's behalf moves the page toward
     scrollTop 0 — the threshold that un-condenses the header out from under this
     menu. Defensive rather than a fix for an observed failure. */
  const close = React.useCallback((restoreFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const openAt = React.useCallback((index: number) => {
    setOpen(true);
    setActiveIndex(index);
  }, []);

  // Move real focus to the active item whenever it changes while open.
  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [open, activeIndex]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      // A click outside dismisses WITHOUT stealing focus back — the reader is
      // already on their way somewhere else.
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAt(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAt(items.length - 1);
    }
    // Enter and Space are the button's own activation; onClick handles them.
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // APG: Tab closes the menu and lets focus continue past the trigger.
        close(false);
        break;
      default:
        break;
    }
  };

  const avatar = (
    <Avatar
      className="ds-hdr-account__avatar"
      size={avatarSize}
      /* A ROUNDED SQUARE, not a circle. This masthead's institutions are square
         (the emblem, the co-brand marks), its controls are outlined squares, and
         its person is the rounded square between them — the shape the estate used
         before a pass made it circular to match Avatar's default. Figma:
         Navbar/AccountMenu, Avatar Shape=Rectangular. */
      shape="rounded"
      src={account.avatarSrc}
      alt=""
      initials={initials(account.name)}
    />
  );

  const details = (
    <span className="ds-hdr-account__details">
      <span className="ds-hdr-account__name" title={account.name}>
        {account.name}
      </span>
      {/* THE ROLE, NOT THE EMAIL, UNDER THE NAME. An officer's role is what
          decides what they may approve, and in these portals one person holds
          different jurisdictions — the address confirms nothing the name did not.
          The email moves inside the menu head, with the name and role. When a
          portal passes no role the address stands in, so the line is never empty. */}
      {(account.role ?? account.email) && (
        <span className="ds-hdr-account__role" title={account.role ?? account.email}>
          {account.role ?? account.email}
        </span>
      )}
    </span>
  );

  // ── Static: identity, not a control. No caret, no button, no hover. ──
  if (!interactive) {
    return (
      <div className={cn("ds-hdr-account", className)}>
        {details}
        {avatar}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("ds-hdr-acct", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn("ds-hdr-account", "is-button", open && "is-open")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        /* The visible name is inside the accessible name (WCAG 2.5.3), so voice
           control can still say "Asha Ramesh". */
        aria-label={`${account.name}, account menu`}
        onClick={() => (open ? close() : openAt(0))}
        onKeyDown={onTriggerKeyDown}
      >
        {details}
        {avatar}
        <Icon
          name="keyboard_arrow_down"
          size={16}
          className="ds-hdr-account__caret"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="ds-hdr-acct__menu">
          {/* OUTSIDE the menu. `role="menu"` only admits menuitem, group and
              separator children — a name-and-role header inside it was invalid
              and made screen readers announce an item count that was one too
              many. */}
          <div className="ds-hdr-acct__menu-head">
            <div className="ds-hdr-acct__menu-name">{account.name}</div>
            {account.role && (
              <div className="ds-hdr-acct__menu-role">{account.role}</div>
            )}
            {account.email && (
              <div className="ds-hdr-acct__menu-email">{account.email}</div>
            )}
          </div>

          <div className="ds-hdr-acct__menu-sep" role="separator" />

          <div
            id={menuId}
            role="menu"
            /* A `menu` is a composite widget, so it takes focus itself and then
               manages its items — hence a programmatic-only tab stop. Without it
               the role claims a keyboard model the element cannot support. */
            tabIndex={-1}
            aria-label={`${account.name}, account`}
            className="ds-hdr-acct__menu-list"
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item, i) => (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={i === activeIndex ? 0 : -1}
                className={cn("ds-hdr-acct__menu-item", item.danger && "is-danger")}
                onClick={() => {
                  close(false);
                  item.onSelect();
                }}
              >
                {item.icon && (
                  <span className="ds-hdr-acct__menu-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
