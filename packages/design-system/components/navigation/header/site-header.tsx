"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { AccessibilityBar } from "../../utilities/accessibility-bar";
import { Icon } from "../../utilities/icon";
import { BrandLockup } from "./brand-lockup";
import { AccountMenu } from "./account-menu";
import { MenuToggle, NavItemLink, SheetToggle } from "./nav-parts";
import { NavSheet } from "./nav-sheet";
import { Search } from "../../forms/search";
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
  /**
   * Render the accessibility-statement control in the accessibility bar.
   * @default true
   *
   * The bar's own font-size stepper is ON (2026-08-14). Text size is served by the
   * bar where it exists, and the widget's floating button is hidden there so the two
   * do not both advertise the same panel; contrast, spacing and dark mode remain the
   * widget's. See docs/specs/samavesh-accessibility-consolidation.md, amended.
   */
  accessibilityToolbar?: boolean;
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
  /**
   * Where the brand lockup links. **Always pass this.**
   *
   * It defaults to `/`, which is the hub root — so a website page that omits it
   * sends "click the emblem to go home" to the estate index instead of the site
   * the reader is on. Pass the zone root: `/website` for the public site, the
   * portal's own landing for a portal, `/` only for the hub itself.
   * @default "/"
   */
  homeHref?: string;
  /** Portal: collapse/menu toggle rendered on the far left of the brand row. */
  onToggleNav?: () => void;
  /** Portal: whether the app-shell nav/sidebar controlled by the toggle is open (drives `aria-expanded`). */
  navExpanded?: boolean;
  /** Portal: id of the nav/sidebar the toggle controls (drives `aria-controls`). */
  navControlsId?: string;
  /** Portal: blue gradient divider between the emblem and the text. @default false */
  brandDivider?: boolean;
  /**
   * Masthead search. Renders the shared DS `<Search>` — the same atom every
   * other screen uses, and the same component the Figma masthead embeds. It
   * used to be a `<button>` dressed as a search box, which is why the two
   * drifted.
   *
   * `onSearch` receives the typed query (Enter, or the leading icon).
   */
  search?: { placeholder?: string; onSearch?: (query: string) => void };
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

  /**
   * Content max-width in px. Overrides the estate container for this header only.
   *
   * Leave unset. The default is `--sa-container-page` — UX4G 3.0's two-step
   * content container (1200 desktop / 1320 desktop XL), the same variable the
   * page content below the header uses. Passing a number here re-introduces the
   * misalignment this default exists to prevent: until 13 August 2026 this
   * defaulted to a hardcoded 1320 while every website section capped at 1280,
   * so the emblem sat 20px outside the content column on wide viewports.
   */
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

/* ── Glyphs ────────────────────────────────────────────────────────────────
   The nav row's glyphs (caret, mega chevron, new-tab hint) and the two triggers
   moved to nav-parts.tsx, where the components that own them live. Nothing is
   left inline here: every glyph in this file is the shared <Icon>. */

/**
 * SiteHeader — the SAMAVESH Navbar. ONE component serves all three estate
 * placements, matching the Figma library (Navbar/Website, Navbar/Portal,
 * Navbar/MenuToggle) pixel-for-pixel:
 *
 *   variant="website"  public site  — three tiers, static
 *   variant="portal"   app shell    — three tiers, sticky, sidebar toggle + account
 *   variant="compact"  hub index    — ONE 64px tier, nav inline, no accessibility bar
 *
 * The website and portal variants render three tiers:
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
  accessibilityToolbar = true,
  onAccessibility,
  accessibilityHref = "/accessibility-statement",
  language = { label: "English" },
  emblemSrc,
  emblemAlt,
  brandLines,
  beta = true,
  homeHref = "/",
  onToggleNav,
  navExpanded,
  navControlsId,
  search,
  cobranding,
  account,
  accountMenu,
  actions,
  nav,
  maxWidth,
  sticky,
  collapseOnScroll,
  className,
}: SiteHeaderProps): React.JSX.Element {
  const isPortal = variant === "portal";
  const isCompact = variant === "compact";
  // variant supplies behavioural defaults; explicit props always win.
  // `sticky` defaults on for portals; scroll-collapse stays opt-in.
  const isSticky = sticky ?? (isPortal || isCompact);
  const wantsScrollCollapse = (collapseOnScroll ?? false) && isSticky;

  const [openLabel, setOpenLabel] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  // Default to 100% for portal app-shells so the brand row aligns with full-width topbar,
  // or default to estate container variable for static website headers.
  const inner = {
    maxWidth: maxWidth ?? (isPortal ? "100%" : "var(--sa-container-page)"),
  } as React.CSSProperties;
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

  // Escape-to-close and initial focus now belong to <NavSheet>, with the markup.

  /* The primary nav renders in one of two places: its own bordered tier below
     the brand row (website / portal), or inline in the brand row (compact).
     Same markup, same refs, same dropdown behaviour — only the slot moves. */
  const navRow = hasNav ? (
    <nav className={cn("ds-hdr-nav", isCompact && "is-inline")} aria-label="Primary" ref={navRef}>
      <ul className="ds-hdr-nav__list" style={inner}>
        {nav!.map((item) => (
          <NavItemLink
            key={item.label}
            item={item}
            open={openLabel === item.label}
            onOpenChange={(next) => setOpenLabel(next ? item.label : null)}
          />
        ))}
      </ul>
    </nav>
  ) : null;

  return (
    <header
      className={cn("ds-hdr", isSticky && "is-sticky", scrolled && "is-scrolled", className)}
      data-variant={variant}
    >
      {/* ── Tier 1: Accessibility bar (the shared DS component) ──
         Figma is the source of truth, so all four actions render: skip · font
         size · accessibility · language. The bar's skip is VISIBLE (as in Figma
         and on UX4G government sites), which is why the header no longer emits a
         second, visually-hidden `.ds-hdr-skip` — two links to the same target
         announce the bypass twice. WCAG 2.4.1 is satisfied by the visible one.
         The accessibility control opens the UX4G widget. */}
      {/* `tone` is the BRAND AXIS, not a component prop — `data-brand="navy"`
          re-resolves bg/brand/primary/bolder to the navy ramp (#003366), the same
          value the retired tone="navy" hardcoded. Scoped to the bar so the brand
          row and nav row below keep their own surfaces. */}
      {!isCompact && (
        <AccessibilityBar
          govLink={govLink}
          skipTo={skipTo}
          showSkip
          fontSize
          accessibility={accessibilityToolbar}
          accessibilityHref={accessibilityHref}
          onAccessibility={onAccessibility}
          language={language}
          layout={isPortal ? "fluid" : "wide"}
          maxWidth={maxWidth}
        />
      )}

      {/* ── Tier 2: Brand row ── */}
      <div className="ds-hdr-brand">
        <div className="ds-hdr-brand__in" style={inner}>
          {onToggleNav && (
            <MenuToggle
              expanded={navExpanded}
              onToggle={onToggleNav}
              controlsId={navControlsId}
            />
          )}

          <BrandLockup
            className="ds-hdr-brand__lockup"
            emblemSrc={emblemSrc}
            emblemAlt={emblemAlt}
            lines={brandLines}
            href={homeHref}
            beta={beta}
            compact={isCompact}
          />

          <div className="ds-hdr-brand__trailing">
            {search && (
              <Search
                className="ds-hdr-searchfield"
                size="lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery("")}
                onSubmit={(v) => search.onSearch?.(v)}
                placeholder={search.placeholder ?? "Search"}
                aria-label={search.placeholder ?? "Search"}
              />
            )}

            {cobranding?.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={m.src} className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
            ))}

            {isCompact && navRow}

            {account && <AccountMenu account={account} items={accountMenu} />}

            <span className="ds-hdr-brand__actions">{actions}</span>

            {hasNav && (
              <SheetToggle
                open={drawerOpen}
                onOpen={() => setDrawerOpen(true)}
                controlsId={drawerId}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 3: Navigation row (website / portal) ── */}
      {!isCompact && navRow}

      {/* ── Mobile navigation (Figma Navbar/NavSheet) ── */}
      {hasNav && (
        <NavSheet
          id={drawerId}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          nav={nav!}
          emblemSrc={emblemSrc}
          emblemAlt={emblemAlt}
          brandLines={brandLines}
          homeHref={homeHref}
          actions={actions}
          search={search}
        />
      )}
    </header>
  );
}
