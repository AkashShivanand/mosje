"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { BrandLockup } from "./brand-lockup";
import { AccountMenu } from "./account-menu";
import { useA11yToolbar, type FontLevel } from "./a11y-controls";
import type {
  AccountMenuItem,
  BrandLines,
  BrandMark,
  HeaderAccount,
  HeaderVariant,
  NavItem,
  UtilityTone,
} from "./types";
import "./header.css";

export interface SiteHeaderProps {
  /**
   * Which estate surface this header serves. Optional but recommended — it makes
   * intent explicit at the call site and sets behavioural defaults:
   *  - `"website"` (default): static masthead, no scroll collapse.
   *  - `"portal"`: app-shell chrome — defaults `sticky` on. (Scroll-collapse of
   *    the accessibility bar — Figma "Appbar / on Scroll" — is available via the
   *    explicit `collapseOnScroll` prop; it stays opt-in because it changes the
   *    chrome height that app-shell sidebar offsets are measured against.)
   * Explicit `sticky` / `collapseOnScroll` props always override these defaults.
   */
  variant?: HeaderVariant;

  // ── Accessibility bar ──
  /** Top-left "Government of India" link. */
  govLink?: { href: string; label: string; flagSrc?: string };
  /** Skip-to-content target id. @default "#main-content" */
  skipTo?: string;
  /** Accessibility-bar tone. @default "blue" */
  tone?: UtilityTone;
  /** Render the gov accessibility toolbar (font-size · contrast · accessibility). @default true */
  accessibilityToolbar?: boolean;
  /**
   * Optional observation hook fired when the text size changes (e.g. analytics).
   * The control works by default — this never replaces the behaviour, so the
   * toolbar can never become a no-op.
   */
  onFontSize?: (level: FontLevel) => void;
  /** Optional observation hook fired when high-contrast is toggled. */
  onContrast?: (on: boolean) => void;
  /**
   * Accessibility-options control. When `onAccessibility` is set it renders a
   * button calling it; otherwise it links to `accessibilityHref`.
   */
  onAccessibility?: () => void;
  /** Accessibility-statement page (GIGW-required). @default "/accessibility-statement" */
  accessibilityHref?: string;
  /** Language selector. @default { label: "English" } */
  language?: { label?: string; onClick?: () => void };

  // ── Brand row ──
  /** National Emblem image URL (basePath-aware). */
  emblemSrc: string;
  emblemAlt?: string;
  /** Government text stack beside the emblem. */
  brandLines: BrandLines;
  /** Show the BETA badge. @default false */
  beta?: boolean;
  /** Portal: collapse/menu toggle rendered on the far left of the brand row. */
  onToggleNav?: () => void;
  /** Portal: whether the app-shell nav/sidebar controlled by the toggle is open (drives `aria-expanded`). */
  navExpanded?: boolean;
  /** Portal: id of the nav/sidebar the toggle controls (drives `aria-controls`). */
  navControlsId?: string;
  /** Portal: blue gradient divider between the emblem and the text. @default false */
  brandDivider?: boolean;
  /** Search field affordance. Renders a button styled as a search box. */
  search?: { placeholder?: string; onSearch?: () => void };
  /** Cobranding marks in the trailing zone (Digital India, SAMAVESH …). */
  cobranding?: BrandMark[];
  /** Portal account block (name / email + avatar). */
  account?: HeaderAccount;
  /** Account dropdown items. When provided, the account block opens a menu. */
  accountMenu?: AccountMenuItem[];
  /** Trailing CTA (e.g. a Login or Apply Online button). */
  actions?: React.ReactNode;

  // ── Nav row ──
  /** Horizontal primary navigation. Collapses to a drawer below 1024px. */
  nav?: NavItem[];

  /** Content max-width in px. @default 1320 */
  maxWidth?: number;
  /**
   * Stick the whole navbar to the top of the viewport (app-shell portals).
   * @default false (true when variant="portal")
   */
  sticky?: boolean;
  /**
   * Collapse the accessibility bar once the page scrolls, reclaiming vertical
   * space (Figma "Appbar / on Scroll"). Only meaningful with `sticky`. Opt-in —
   * when on, ensure any app-shell sidebar offset accounts for the shorter
   * scrolled height (or make the sidebar sticky under the brand row).
   * @default false
   */
  collapseOnScroll?: boolean;
  className?: string;
}

/* ── Inline icons (no runtime icon dependency) ─────────────────────────────── */
const IcExternal = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="ds-hdr-util__ext">
    <path d="M4 2h6v6M10 2 5 7M8 7v3H2V4h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcContrast = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 3v18a9 9 0 0 0 0-18Z" fill="currentColor" />
  </svg>
);
const IcAccessibility = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="4" r="2" fill="currentColor" />
    <path d="M4 8h16M12 8v6m0 0-3 6m3-6 3 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IcGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const IcCaret = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ds-hdr-ic">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IcMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * SiteHeader — the SAMAVESH Navbar, matching the UX4G "Navbar Website" and Portal
 * DS "Navbar Portal" Figma components pixel-for-pixel. Three tiers:
 *
 *   1. Accessibility bar — GoI link · font-size A−/A/A+ · contrast · accessibility · language
 *   2. Brand row         — [collapse] · emblem + lockup · {search + CTA | cobranding + account}
 *   3. Navigation row     — horizontal nav items (justify-between), drawer below 1024px
 *
 * Website variant: pass `variant="website"` + `search` + `actions` (Login).
 * Portal variant: pass `variant="portal"` (defaults sticky + scroll-collapse) +
 * `onToggleNav` + `brandDivider` + `cobranding` + `account`.
 *
 * Nav items support a simple dropdown (`children`) or a multi-column mega-menu
 * (`columns`) for org-heavy menus. `variant="portal"` also collapses the
 * accessibility bar on scroll (Figma "Appbar / on Scroll").
 */
export function SiteHeader({
  variant,
  govLink = { href: "https://india.gov.in/", label: "Government of India" },
  skipTo = "#main-content",
  tone = "blue",
  accessibilityToolbar = true,
  onFontSize,
  onContrast,
  onAccessibility,
  accessibilityHref = "/accessibility-statement",
  language = { label: "English" },
  emblemSrc,
  emblemAlt,
  brandLines,
  beta = false,
  onToggleNav,
  navExpanded,
  navControlsId,
  brandDivider = false,
  search,
  cobranding,
  account,
  accountMenu,
  actions,
  nav,
  maxWidth = 1320,
  sticky,
  collapseOnScroll,
  className,
}: SiteHeaderProps): React.JSX.Element {
  const isPortal = variant === "portal";
  // variant supplies behavioural defaults; explicit props always win.
  // `sticky` defaults on for portals; scroll-collapse stays opt-in (it changes
  // the chrome height, which app-shell sidebar offsets are measured against).
  const isSticky = sticky ?? isPortal;
  const wantsScrollCollapse = (collapseOnScroll ?? false) && isSticky;

  const [openLabel, setOpenLabel] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const inner = { maxWidth } as React.CSSProperties;
  const hasNav = !!nav && nav.length > 0;
  const drawerId = React.useId();

  // Scroll-shrink: collapse the accessibility bar after the page scrolls a touch.
  React.useEffect(() => {
    if (!wantsScrollCollapse) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [wantsScrollCollapse]);

  // Functional accessibility toolbar (text size + high contrast) — works by default.
  const a11y = useA11yToolbar();
  const fontLabels = ["Default text size", "Large text size", "Larger text size"] as const;

  // Nav dropdown: close on Escape, outside-click, or focus leaving the nav.
  const navRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openLabel === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenLabel(null);
    };
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenLabel(null);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (navRef.current && !navRef.current.contains(e.relatedTarget as Node)) setOpenLabel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    navRef.current?.addEventListener("focusout", onFocusOut);
    const nav = navRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      nav?.removeEventListener("focusout", onFocusOut);
    };
  }, [openLabel]);

  // Mobile drawer: close on Escape, and move focus to the first link on open.
  const drawerRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    drawerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <header
      className={cn("ds-hdr", isSticky && "is-sticky", scrolled && "is-scrolled", className)}
      data-variant={variant}
    >
      {/* Skip link MUST be the first focusable element on the page (WCAG 2.4.1). */}
      <a href={skipTo} className="ds-hdr-skip">Skip to Main Content</a>

      {/* ── Tier 1: Accessibility bar ── */}
      <div className={cn("ds-hdr-util", `tone-${tone}`)}>
        <div className="ds-hdr-util__in" style={inner}>
          <a className="ds-hdr-util__gov" href={govLink.href} target="_blank" rel="noreferrer">
            {govLink.flagSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ds-hdr-util__flag" src={govLink.flagSrc} alt="" />
            )}
            <span>{govLink.label}</span>
            <IcExternal />
          </a>

          <div className="ds-hdr-util__end">
            {accessibilityToolbar && (
              <>
                <span className="ds-hdr-util__sep" aria-hidden="true" />
                <div className="ds-hdr-util__fontsize" role="group" aria-label="Text size">
                  {(["A−", "A", "A+"] as const).map((glyph, i) => (
                    <button
                      key={glyph}
                      type="button"
                      aria-label={fontLabels[i]}
                      aria-pressed={a11y.fontLevel === i}
                      onClick={() => {
                        a11y.setFont(i as FontLevel);
                        onFontSize?.(i as FontLevel);
                      }}
                    >
                      {glyph}
                    </button>
                  ))}
                </div>
                <span className="ds-hdr-util__sep" aria-hidden="true" />
                <button
                  type="button"
                  className="ds-hdr-util__icbtn"
                  aria-label="High contrast"
                  title="Toggle high contrast"
                  aria-pressed={a11y.contrast}
                  onClick={() => {
                    const next = !a11y.contrast;
                    a11y.setContrast(next);
                    onContrast?.(next);
                  }}
                >
                  <IcContrast />
                </button>
                <span className="ds-hdr-util__sep" aria-hidden="true" />
                {onAccessibility ? (
                  <button type="button" className="ds-hdr-util__icbtn" aria-label="Accessibility statement" title="Accessibility statement" onClick={onAccessibility}>
                    <IcAccessibility />
                  </button>
                ) : (
                  <a className="ds-hdr-util__icbtn" href={accessibilityHref} aria-label="Accessibility statement" title="Accessibility statement">
                    <IcAccessibility />
                  </a>
                )}
                <span className="ds-hdr-util__sep" aria-hidden="true" />
              </>
            )}
            {language && (
              <button type="button" className="ds-hdr-util__icbtn has-text" aria-label="Select language" title="Select language" onClick={language.onClick}>
                <IcGlobe />
                {language.label && <span>{language.label}</span>}
                <IcCaret />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 2: Brand row ── */}
      <div className="ds-hdr-brand">
        <div className="ds-hdr-brand__in" style={inner}>
          {onToggleNav && (
            <button
              type="button"
              className="ds-hdr-brand__toggle"
              aria-label={navExpanded ? "Close navigation" : "Open navigation"}
              aria-expanded={navExpanded}
              aria-controls={navControlsId}
              onClick={onToggleNav}
            >
              <IcMenu />
            </button>
          )}

          <BrandLockup
            className="ds-hdr-brand__lockup"
            emblemSrc={emblemSrc}
            emblemAlt={emblemAlt}
            lines={brandLines}
            beta={beta}
            divider={brandDivider}
          />

          <div className="ds-hdr-brand__trailing">
            {search && (
              <button type="button" className="ds-hdr-searchfield" onClick={search.onSearch}>
                <span className="ds-hdr-searchfield__icon" aria-hidden="true"><IcSearch /></span>
                <span className="ds-hdr-searchfield__placeholder">
                  {search.placeholder ?? "Search"}
                </span>
              </button>
            )}

            {cobranding?.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.src} className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
            ))}

            {account && <AccountMenu account={account} items={accountMenu} />}

            {actions}

            {hasNav && (
              <button
                type="button"
                className="ds-hdr-burger"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={drawerOpen}
                aria-controls={drawerId}
                onClick={() => setDrawerOpen((v) => !v)}
              >
                <IcMenu />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 3: Navigation row ── */}
      {hasNav && (
        <nav className="ds-hdr-nav" aria-label="Primary" ref={navRef}>
          <ul className="ds-hdr-nav__list" style={inner}>
            {nav!.map((item) => {
              const hasMega = !!item.columns?.length;
              const hasChildren = !hasMega && !!item.children?.length;
              const hasMenu = hasMega || hasChildren;
              const isOpen = openLabel === item.label;
              const dropId = `ds-hdr-drop-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <li
                  key={item.label}
                  className="ds-hdr-nav__item"
                  onMouseEnter={() => hasMenu && setOpenLabel(item.label)}
                  onMouseLeave={() => setOpenLabel(null)}
                >
                  <a
                    href={item.href}
                    className={cn("ds-hdr-nav__link", item.active && "is-active")}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    aria-haspopup={hasMenu ? true : undefined}
                    aria-controls={hasMenu && isOpen ? dropId : undefined}
                    onClick={(e) => {
                      if (hasMenu) {
                        e.preventDefault();
                        setOpenLabel(isOpen ? null : item.label);
                      }
                    }}
                  >
                    {item.label}
                    {hasMenu && <IcCaret />}
                  </a>

                  {hasChildren && isOpen && (
                    <div className="ds-hdr-nav__drop-wrap">
                      <ul id={dropId} className="ds-hdr-nav__drop">
                        {item.children!.map((c) => (
                          <li key={c.label}>
                            <a href={c.href} className="ds-hdr-nav__drop-link" onClick={() => setOpenLabel(null)}>
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {hasMega && isOpen && (
                    <div className="ds-hdr-nav__drop-wrap is-mega">
                      <div id={dropId} className="ds-hdr-nav__mega" role="group" aria-label={item.label}>
                        {item.columns!.map((col, ci) => (
                          <div key={col.heading ?? ci} className="ds-hdr-nav__mega-col">
                            {col.heading && <p className="ds-hdr-nav__mega-head">{col.heading}</p>}
                            {col.items?.length ? (
                              <ul className="ds-hdr-nav__mega-list is-rich">
                                {col.items.map((it) => (
                                  <li key={it.abbr}>
                                    <a
                                      href={it.href}
                                      className={cn("ds-hdr-mega-item", it.active && "is-active")}
                                      target={it.external ? "_blank" : undefined}
                                      rel={it.external ? "noreferrer" : undefined}
                                      onClick={() => setOpenLabel(null)}
                                    >
                                      <span className="ds-hdr-mega-item__logo">
                                        {it.iconSrc ? (
                                          // eslint-disable-next-line @next/next/no-img-element
                                          <img src={it.iconSrc} alt="" loading="lazy" />
                                        ) : null}
                                      </span>
                                      <span className="ds-hdr-mega-item__copy">
                                        <span className="ds-hdr-mega-item__abbr">{it.abbr}</span>
                                        <span className="ds-hdr-mega-item__name">{it.name}</span>
                                      </span>
                                      <IcCaret />
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <ul className="ds-hdr-nav__mega-list">
                                {col.links?.map((c) => (
                                  <li key={c.label}>
                                    <a
                                      href={c.href}
                                      className="ds-hdr-nav__drop-link"
                                      target={c.external ? "_blank" : undefined}
                                      rel={c.external ? "noreferrer" : undefined}
                                      onClick={() => setOpenLabel(null)}
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
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* ── Mobile drawer (disclosure region, not a modal) ── */}
      {hasNav && drawerOpen && (
        <nav id={drawerId} className="ds-hdr-drawer" aria-label="Navigation menu" ref={drawerRef}>
          <ul className="ds-hdr-drawer__list">
            {nav!.map((item) => {
              // Flatten a mega-menu's columns (rich items or links) into the drawer.
              const subLinks: { label: string; href: string }[] | undefined = item.columns?.length
                ? item.columns.flatMap((col) =>
                    col.items?.length
                      ? col.items.map((it) => ({ label: it.abbr, href: it.href }))
                      : (col.links ?? []).map((l) => ({ label: l.label, href: l.href })),
                  )
                : item.children;
              return (
                <li key={item.label} className="ds-hdr-drawer__group">
                  <a href={item.href} className={cn("ds-hdr-drawer__link", item.active && "is-active")} onClick={() => setDrawerOpen(false)}>
                    {item.label}
                  </a>
                  {subLinks?.length ? (
                    <ul className="ds-hdr-drawer__sub">
                      {subLinks.map((c) => (
                        <li key={c.label}>
                          <a href={c.href} className="ds-hdr-drawer__sublink" onClick={() => setDrawerOpen(false)}>{c.label}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
