"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
import { AccessibilityControls } from "../../utilities/accessibility-controls";
import { BrandLockup } from "./brand-lockup";
import { MegaMenuItem } from "./nav-parts";
import { Search } from "../../forms/search";
import type { BrandLines, HeaderSearchConfig, NavItem } from "./types";
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
  /**
   * The masthead's search, in FULL — the same `HeaderSearchConfig` the header
   * itself renders, autocomplete included.
   *
   * It used to be a narrowed `{ placeholder, onSearch }`, so `onQueryChange`,
   * `suggestions` and `onSuggestionSelect` were dropped on the floor: autocomplete
   * worked on desktop and silently did not on a phone. A downgraded copy of a
   * component is a fork with extra steps.
   */
  search?: HeaderSearchConfig;
  /**
   * The query, owned by `SiteHeader`. The sheet used to hold its own, so whatever
   * the reader had typed in the masthead vanished the moment they opened the menu.
   */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  /**
   * Text size · accessibility options · language, rendered as a labelled section
   * at the foot of the sheet — because `AccessibilityBar` sheds all three below
   * `breakpoint/tablet` and, until this existed, nothing picked them up. See
   * `AccessibilityControls`. Pass `false` to omit the section entirely.
   * @default true
   */
  accessibilityControls?: boolean;
  /** Show the accessibility-options row. Mirrors `SiteHeader`'s `accessibilityToolbar`. */
  accessibility?: boolean;
  accessibilityHref?: string;
  onAccessibility?: () => void;
  language?: { label?: string; onClick?: () => void } | false;
  id?: string;
  className?: string;
}

/**
 * What an expanded row shows. A mega-menu keeps its COLUMNS in the sheet — headings,
 * emblems and full organisation names — stacked vertically rather than side by side.
 *
 * It used to flatten them to a bare list of abbreviations, which is what the code
 * did and not what the library says: Figma's `NavSheet State=Mega` (55327:3503)
 * nests the real `Navbar/MegaMenu Device=Mobile` (4268:914) at 344 wide, a vertical
 * stack of Col frames each carrying its Header and its rows. Flattening threw away
 * every column heading, every emblem and every full name — on the one surface where
 * an unfamiliar abbreviation like "NCSC" is hardest to place.
 */
function subContent(item: NavItem) {
  if (item.columns?.length) return { columns: item.columns } as const;
  if (item.children?.length) return { children: item.children } as const;
  return null;
}

/**
 * NavSheet — the mobile navigation overlay (Figma `Navbar/NavSheet`).
 *
 * Matches the Figma component: a 344px sheet with its own header (brand lockup +
 * close), divider-separated 56px rows, and an `expand_more` caret on any row that
 * carries children. Its three Figma states — Default / Expanded / Mega — are the
 * same component with nothing open, a simple child list open, and a full mega-menu
 * open; they are states, not variants a consumer picks.
 *
 * IT IS A MODAL, AND IT NOW SAYS SO. It covers the viewport behind a scrim that
 * swallows every click, so sighted users are already confined to it. It used to
 * declare `aria-modal={false}` anyway — telling a screen-reader user the page
 * behind was still theirs to browse while, for everyone else, it was not. Focus
 * was not trapped either, so Tab walked out of the sheet into a page the reader
 * could neither see nor click.
 *
 * Now: `aria-modal="true"`, focus trapped inside, the body scroll locked while it
 * is open, and — the part its own docstring used to promise without any code
 * behind it — focus RESTORED to whatever opened it when it closes.
 *
 * It slides from the RIGHT, matching the SheetToggle that opens it. A control on
 * the right that produces a panel on the left breaks the relationship between the
 * two, and on a phone it means the reader's thumb is nowhere near the close button.
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
  searchValue,
  onSearchValueChange,
  accessibilityControls = true,
  accessibility = true,
  accessibilityHref,
  onAccessibility,
  language,
  id,
  className,
}: NavSheetProps): React.JSX.Element | null {
  const [openLabel, setOpenLabel] = React.useState<string | null>(null);
  /* Uncontrolled fallback, so a consumer rendering NavSheet on its own still gets
     a working field. `SiteHeader` always controls it. */
  const [ownQuery, setOwnQuery] = React.useState("");
  const query = searchValue ?? ownQuery;
  const setQuery = onSearchValueChange ?? setOwnQuery;
  /* Portals need a DOM, so nothing renders until after hydration. */
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const ref = React.useRef<HTMLDivElement>(null);
  /** Whatever had focus when the sheet opened — almost always the SheetToggle. */
  const returnTo = React.useRef<HTMLElement | null>(null);

  // Escape, the focus trap, and returning focus where it came from.
  React.useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Trap: wrap at both ends rather than letting focus reach the page behind.
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0]!;
      const last = list[list.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !ref.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    focusables()[0]?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      // Restore on the way out. `AccountMenu` has always done this; the sheet
      // only claimed to, and a keyboard reader was dropped at the top of the
      // document every time they closed it.
      returnTo.current?.focus();
    };
  }, [open, onClose]);

  // Lock the page behind it. `overflow: hidden` on <body> keeps the scroll
  // position (the position:fixed trick does not), and the padding compensates
  // for the scrollbar so the layout does not jump as it disappears.
  React.useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  /* Flag the sheet as open, so the UX4G widget's floating button can stand down.
     It comes back on a phone (accessibility-bar.css un-hides it below 768, since
     the bar has no control there) and it anchors the bottom-right corner — which
     is where this sheet is. Screenshotted 2026-08-26: the FAB sat directly on top
     of the sheet's own A+ button and its "Accessibility options" row. Two doors to
     one panel, one covering the other.

     Hidden, never unmounted: the bridge in `AccessibilityControls` opens the panel
     by dispatching a click on this element, and a dispatched click still reaches a
     hidden node. Remove it from the DOM and the sheet's own row stops working. */
  React.useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.saNavsheetOpen = "1";
    return () => {
      delete root.dataset.saNavsheetOpen;
    };
  }, [open]);

  // Collapse any open row when the sheet closes, so it reopens in its Default state.
  React.useEffect(() => {
    if (!open) setOpenLabel(null);
  }, [open]);

  if (!open || !mounted) return null;

  /* PORTALLED TO <body>, and that is the whole point of it.
     `SiteHeader` renders this inside `<header class="ds-hdr">`, and `.ds-hdr` is
     `position: relative` with a `z-index`, so it opens a stacking context — which
     capped everything inside it, this sheet included, at the header's own level.
     The sheet's `z-index: 1101` was therefore scoped to a context worth far less
     at the root, and the sheet still opened UNDERNEATH the Important Links rail
     (1002) and the chatbot launcher (1010). Raising the number inside the context
     could never have fixed it. Leaving the context does. */
  return createPortal(
    <>
      <div className="ds-navsheet__scrim" onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={ref}
        className={cn("ds-navsheet", className)}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        <div className="ds-navsheet__header">
          {/* NOT `compact` — Figma's sheet header carries the default lockup at its
              full 64px emblem. The header's step-downs (ministry hidden, department a
              rung smaller) are scoped in header.css, where the 96px is derived. */}
          <BrandLockup
            emblemSrc={emblemSrc}
            emblemAlt={emblemAlt}
            lines={brandLines}
            href={homeHref}
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
          <search className="ds-navsheet__search">
            <Search
              size="lg"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                search.onQueryChange?.(e.target.value);
              }}
              onClear={() => {
                setQuery("");
                search.onQueryChange?.("");
              }}
              onSubmit={(v) => search.onSearch?.(v)}
              suggestions={search.suggestions}
              onSuggestionSelect={search.onSuggestionSelect}
              placeholder={search.placeholder ?? "Search"}
              aria-label={search.placeholder ?? "Search"}
            />
          </search>
        )}

        {actions && <div className="ds-navsheet__actions">{actions}</div>}

        {/* A NAVIGATION LANDMARK, like the row it replaces. `.ds-hdr-nav` is a
            `<nav aria-label="Primary">`; below 1024 that row is gone and this is
            the page's primary navigation — but it was a bare `<ul>` inside a
            dialog, so landmark navigation lost the menu at exactly the width
            where a screen-reader user most needs it. */}
        <nav aria-label="Primary">
        <ul className="ds-navsheet__list">
          {nav.map((item) => {
            const sub = subContent(item);
            const hasSub = !!sub;
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

                {hasSub && isOpen && sub!.columns && (
                  <div id={subId} className="ds-navsheet__mega">
                    {sub!.columns.map((col, ci) => (
                      <div key={col.heading ?? ci} className="ds-navsheet__mega-col">
                        {col.heading && <p className="ds-navsheet__mega-head">{col.heading}</p>}
                        {col.items?.length ? (
                          <ul className="ds-navsheet__mega-list">
                            {col.items.map((it) => (
                              <li key={it.abbr}>
                                <MegaMenuItem item={it} onSelect={onClose} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="ds-navsheet__sub">
                            {col.links?.map((c) => (
                              <li key={c.label}>
                                <a
                                  href={c.disabled ? undefined : c.href}
                                  className={cn("ds-navsheet__sublink", c.disabled && "is-disabled")}
                                  aria-disabled={c.disabled || undefined}
                                  target={c.external && !c.disabled ? "_blank" : undefined}
                                  rel={c.external && !c.disabled ? "noreferrer" : undefined}
                                  onClick={c.disabled ? undefined : onClose}
                                >
                                  {c.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {hasSub && isOpen && sub!.children && (
                  <ul id={subId} className="ds-navsheet__sub">
                    {sub!.children.map((c) => (
                      <li key={c.label}>
                        <a
                          href={c.disabled ? undefined : c.href}
                          className={cn("ds-navsheet__sublink", c.disabled && "is-disabled")}
                          aria-disabled={c.disabled || undefined}
                          target={c.external && !c.disabled ? "_blank" : undefined}
                          rel={c.external && !c.disabled ? "noreferrer" : undefined}
                          onClick={c.disabled ? undefined : onClose}
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
        </nav>

        {accessibilityControls && (
          <AccessibilityControls
            variant="sheet"
            accessibility={accessibility}
            accessibilityHref={accessibilityHref}
            onAccessibility={onAccessibility}
            language={language}
          />
        )}
      </div>
    </>,
    document.body,
  );
}
