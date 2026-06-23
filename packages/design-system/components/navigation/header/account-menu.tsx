"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import type { AccountMenuItem, HeaderAccount } from "./types";
import "./header.css";

export interface AccountMenuProps {
  account: HeaderAccount;
  /** Dropdown items. When empty, the account renders as a static (Figma) block. */
  items?: AccountMenuItem[];
  className?: string;
}

/** Derive up-to-two-letter initials from a display name. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0]?.[0] ?? "?").toUpperCase();
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

/**
 * AccountMenu — the SiteHeader (portal) account block: name / email + 48px avatar,
 * matching the Figma "Navbar Portal" account. Static when `items` is empty; an
 * accessible dropdown (Profile / Sign out …) when items are provided.
 *
 * Built with the same outside-click / Escape pattern as AppSwitcher so the DS
 * keeps zero runtime dependencies (no Radix). Token-only styling.
 */
export function AccountMenu({
  account,
  items = [],
  className,
}: AccountMenuProps): React.JSX.Element {
  const interactive = items.length > 0;
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuId = React.useId();

  const close = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const inner = (
    <>
      <span className="ds-hdr-account__details">
        <span className="ds-hdr-account__name">{account.name}</span>
        {account.email && (
          <span className="ds-hdr-account__email">{account.email}</span>
        )}
      </span>
      {account.avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ds-hdr-account__avatar" src={account.avatarSrc} alt="" />
      ) : (
        <span className="ds-hdr-account__avatar" aria-hidden="true">
          {initials(account.name)}
        </span>
      )}
      {interactive && (
        <svg className="ds-hdr-account__caret" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  // Static block — no dropdown (matches the Figma portal account display).
  if (!interactive) {
    return <div className={cn("ds-hdr-account", className)}>{inner}</div>;
  }

  return (
    <div ref={rootRef} className={cn("ds-hdr-acct", className)}>
      <button
        ref={triggerRef}
        type="button"
        className="ds-hdr-account is-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {inner}
      </button>

      {open && (
        <div id={menuId} role="menu" className="ds-hdr-acct__menu">
          <div className="ds-hdr-acct__menu-head">
            <div className="ds-hdr-acct__menu-name">{account.name}</div>
            {account.role && (
              <div className="ds-hdr-acct__menu-role">{account.role}</div>
            )}
          </div>
          <div className="ds-hdr-acct__menu-sep" role="separator" />
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={cn("ds-hdr-acct__menu-item", item.danger && "is-danger")}
              onClick={() => {
                setOpen(false);
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
      )}
    </div>
  );
}
