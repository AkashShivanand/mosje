"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
import { BrandLockup } from "./brand-lockup";
import { Search } from "../../forms/search";
import type { BrandLines, NavItem, NavLink } from "./types";
import "./header.css";

export interface NavSheetProps {
  open: boolean;
  onClose: () => void;
  /** Primary navigation — the same array the masthead renders. */
  nav: NavItem[];
  /** Brand lockup shown in the sheet header (Figma shows the Mobile lockup). */
  emblemSrc: string;
  emblemAlt?: string;
  brandLines: BrandLines;
  /** Where the lockup links. Same rule as SiteHeader: pass the zone root. */
  homeHref?: string;
  /** Trailing CTA (Login / Admin Login), pinned above the list. */
  actions?: React.ReactNode;
  /** Search configuration to render inside the sheet */
  search?: { placeholder?: string; onSearch?: (q: string) => void };
  id?: string;
  className?: string;
}

/** A mega-menu's columns flatten into one list — the sheet has no room for a grid. */
function flatten(item: NavItem): NavLink[] | undefined {
  if (item.columns?.length) {
    return item.columns.flatMap((col) =>
      col.items?.length
        ? col.items.map((it) => ({ label: it.abbr, href: it.href, external: it.external }))
        : (col.links ?? []),
    );
  }
  return item.children;
}

/**
 * NavSheet — the mobile navigation overlay (Figma `Navbar/NavSheet`).
 *
 * Matches the Figma component: a 344px sheet with its own header (brand lockup +
 * close), divider-separated 56px rows, and an `expand_more` caret on any row that
 * carries children. Its three Figma states — Default / Expanded / Mega — are the
 * same component with nothing open, one row open, and a flattened org list open;
 * they are states, not variants a consumer picks.
 *
 * DELIBERATELY NOT A MODAL. It is a disclosure region with a close control, so it
 * does not trap focus — the same rule the Chatbot panel carries. Escape closes it
 * and focus returns to the trigger, which is the behaviour a `SheetToggle` implies.
 */
export function NavSheet({
  open,
  onClose,
  nav,
  emblemSrc,
  emblemAlt,
  brandLines,
  homeHref = "/",
  actions,
  search,
  id,
  className,
}: NavSheetProps): React.JSX.Element | null {
  const [openLabel, setOpenLabel] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Collapse any open row when the sheet closes, so it reopens in its Default state.
  React.useEffect(() => {
    if (!open) setOpenLabel(null);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="ds-navsheet__scrim" onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={ref}
        className={cn("ds-navsheet", className)}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal={false}
      >
        <div className="ds-navsheet__header">
          <BrandLockup
            emblemSrc={emblemSrc}
            emblemAlt={emblemAlt}
            lines={brandLines}
            href={homeHref}
            compact
          />
          <button
            type="button"
            className="ds-navsheet__close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        {search && (
          <div className="ds-navsheet__search">
            <Search
              size="lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery("")}
              onSubmit={(v) => search.onSearch?.(v)}
              placeholder={search.placeholder ?? "Search"}
              aria-label={search.placeholder ?? "Search"}
            />
          </div>
        )}

        {actions && <div className="ds-navsheet__actions">{actions}</div>}

        <ul className="ds-navsheet__list">
          {nav.map((item) => {
            const subLinks = flatten(item);
            const hasSub = !!subLinks?.length;
            const isOpen = openLabel === item.label;
            const subId = `ds-navsheet-sub-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <li key={item.label} className="ds-navsheet__row">
                {hasSub ? (
                  <button
                    type="button"
                    className={cn("ds-navsheet__link", item.active && "is-active")}
                    aria-expanded={isOpen}
                    aria-controls={subId}
                    onClick={() => setOpenLabel(isOpen ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <Icon
                      name={isOpen ? "expand_less" : "expand_more"}
                      size={24}
                      className="ds-navsheet__caret"
                    />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={cn("ds-navsheet__link", item.active && "is-active")}
                    aria-current={item.active ? "page" : undefined}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                  </a>
                )}

                {hasSub && isOpen && (
                  <ul id={subId} className="ds-navsheet__sub">
                    {subLinks!.map((c) => (
                      <li key={c.label}>
                        <a
                          href={c.href}
                          className="ds-navsheet__sublink"
                          target={c.external ? "_blank" : undefined}
                          rel={c.external ? "noreferrer" : undefined}
                          onClick={onClose}
                        >
                          {c.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
