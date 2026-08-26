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
  HeaderSearchConfig,
  HeaderVariant,
  NavItem,
} from "./types";
import "./header.css";

export interface SiteHeaderProps {
  /**
   * Which estate surface this header serves. Optional but recommended — it makes
   * intent explicit at the call site and sets behavioural defaults:
   *  - `"website"` (default): static masthead, no scroll collapse.
   *  - `"portal"`: app-shell chrome — defaults `sticky` on, and with it the
   *    Figma "State=On Scroll" behaviour (see `collapseOnScroll`).
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
  /**
   * Masthead search. Renders the shared DS `<Search>` — the same atom every
   * other screen uses, and the same component the Figma masthead embeds. It
   * used to be a `<button>` dressed as a search box, which is why the two
   * drifted.
   *
   * The type is `HeaderSearchConfig`, shared with `NavSheet`, so the phone can
   * no longer end up with a quietly reduced version of the same field.
   */
  search?: HeaderSearchConfig;
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
   * Pin the navbar to the top of the viewport.
   *
   * DEFAULTS ON FOR EVERY VARIANT as of 2026-08-26. It used to be portals only,
   * which meant the public website — 200px of masthead — scrolled away entirely
   * and left the reader with no navigation, no search and no identity for the
   * length of a scheme page. Search is the fallback for navigation and GIGW 5.2
   * wants it in a consistent position on every page; neither survives a masthead
   * that leaves.
   *
   * The ACCESSIBILITY BAR is deliberately not pinned with the rest: the header
   * sticks at `top: -(bar height)`, so the bar scrolls away and the brand and nav
   * rows stay. It carries page-level preferences, not per-scroll chrome.
   * @default true
   */
  sticky?: boolean;
  /**
   * Condense the masthead once the page scrolls: three tiers become ONE 64px bar
   * (56px on a phone) carrying the emblem, the full nav, search and the CTA.
   *
   * This replaces the old "State=On Scroll", which dropped the middle Ministry
   * line and took the header from 146px to 134px. Measured: twelve pixels — 8% of
   * the header, 1.7% of a 720px viewport — in exchange for a class, a listener and
   * a variant. The condense returns 136px on desktop and 202px on a phone.
   *
   * The condensed bar keeps the emblem AT THE SAME LEFT EDGE it occupies at rest.
   * That is the one deliberate constraint: it is also the go-home control, and an
   * identity mark that jumps across the screen on scroll reads as a different site.
   *
   * Only meaningful with `sticky`, and never applied to `variant="compact"`, which
   * is a single 65px bar already. Pass `false` to pin the masthead at full height.
   * @default true when `sticky`
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
 * (`columns`) for org-heavy menus. Sticky variants also shrink the brand row on
 * scroll (Figma "State=On Scroll") — see `collapseOnScroll`.
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
  /* Pinned by default on every surface — see the `sticky` docs. */
  const isSticky = sticky ?? true;
  /* The compact bar is one 65px tier already; there is nothing to condense, and the
     old default turned the state on for it anyway, where it did nothing at all. */
  const wantsScrollCollapse = (collapseOnScroll ?? isSticky) && isSticky && !isCompact;

  const [openLabel, setOpenLabel] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  /** The condensed bar's search, expanded in place over the nav. */
  const [condSearchOpen, setCondSearchOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const condSearchRef = React.useRef<HTMLInputElement>(null);
  // Default to 100% for portal app-shells so the brand row aligns with full-width topbar,
  // or default to estate container variable for static website headers.
  const inner = {
    maxWidth: maxWidth ?? (isPortal ? "100%" : "var(--sa-container-page)"),
  } as React.CSSProperties;
  const hasNav = !!nav && nav.length > 0;
  const drawerId = React.useId();
  const condensed = wantsScrollCollapse && scrolled;

  /* [DBIM 5.4] "Co-branding section: … with a maximum of 2." Enforced here rather
     than trusted to every call site; anything beyond two belongs in the footer's
     dedicated logo strip, which is DBIM's own answer for the overflow. */
  const marks = (cobranding ?? []).slice(0, 2);
  if ((cobranding?.length ?? 0) > 2) {
    console.warn(
      `[SiteHeader] ${cobranding!.length} co-branding marks passed; DBIM 5.4 allows 2. ` +
        `Rendering the first two — the rest belong in the footer's logo strip.`,
    );
  }

  /**
   * Condense past 120px of scroll, restore below 40.
   *
   * TWO THRESHOLDS, NOT ONE. The old rule was a bare `scrollY > 8`, and a single
   * threshold on a state that changes the document's height is a latch waiting to
   * oscillate: condensing removes ~136px of pinned header, the page shifts, and a
   * reader parked on the boundary gets a header that flickers between two heights.
   * A 40/120 band is wider than any single condense can move the page.
   *
   * A passive listener rather than an IntersectionObserver sentinel, deliberately:
   * the sentinel has to live OUTSIDE the sticky element to work, which means this
   * component would have to return a fragment and every consumer's first child
   * would silently change. Reading `scrollY` inside a rAF costs nothing measurable.
   */
  React.useEffect(() => {
    if (!wantsScrollCollapse) {
      setScrolled(false);
      return;
    }
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled((was) => (was ? y > 40 : y > 120));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [wantsScrollCollapse]);

  /**
   * Publish the masthead's own measurements, so nothing else has to guess them.
   *
   *   --sa-hdr-abar-h     the accessibility bar's height (on the header)
   *   --sa-header-pinned  what stays on screen when scrolled, AT REST (on :root)
   *   --sa-header-bottom  what stays on screen right now (on :root)
   *
   * `scroll-padding-top` used to be four hardcoded numbers — 150 / 72 / 204, and
   * 132 below 767px against a mobile header measured at 258. A 126px shortfall is
   * WCAG 2.4.11 (Focus Not Obscured) the moment the header is pinned, and the
   * tablet band had no rule at all. Numbers written by hand next to a layout that
   * responds to viewport, font scale and content length will always drift; these
   * are measured.
   *
   * `--sa-header-pinned` is only written while RESTING. Anchors and skip links can
   * land while the header is at its full height, so the padding has to clear the
   * taller of the two states, not whichever happens to be showing.
   */
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const measure = () => {
      const abar = el.querySelector<HTMLElement>(".sa-abar");
      const abarH = abar?.offsetHeight ?? 0;
      const pinned = Math.max(0, el.offsetHeight - abarH);
      el.style.setProperty("--sa-hdr-abar-h", `${abarH}px`);
      /* The panels hanging off the nav row are positioned at the header's bottom
         edge, so this is how much of the viewport they have left. While RESTING it
         is the whole header: the accessibility bar is still on screen for the first
         46px of scroll, and a panel sized against the pinned height alone would
         overhang the fold by exactly that much during those 46px. Condensed there
         is no bar left to allow for. Erring tall costs a panel a little height it
         could have used; erring short puts rows off-screen with no way to reach
         them, which is the defect this whole variable exists to close. */
      root.style.setProperty("--sa-header-bottom", `${condensed ? pinned : el.offsetHeight}px`);
      if (!condensed) root.style.setProperty("--sa-header-pinned", `${pinned}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [condensed]);

  /* Condensing swaps the nav row out from under whatever was open in it. Close
     first, so a panel is never orphaned and focus is never stranded on a node that
     is about to be unmounted. */
  React.useEffect(() => {
    if (condensed) setOpenLabel(null);
    else setCondSearchOpen(false);
  }, [condensed]);

  React.useEffect(() => {
    if (condSearchOpen) condSearchRef.current?.focus();
  }, [condSearchOpen]);

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
    const navEl = navRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      navEl?.removeEventListener("focusout", onFocusOut);
    };
  }, [openLabel]);

  const navItems = (nav ?? []).map((item) => (
    <NavItemLink
      key={item.label}
      item={item}
      open={openLabel === item.label}
      onOpenChange={(next) => setOpenLabel(next ? item.label : null)}
    />
  ));

  /* The primary nav renders in one of three places: its own bordered tier below
     the brand row (website / portal), inline in the brand row (compact), or inside
     the condensed bar. Same markup, same refs, same dropdown behaviour. */
  const navRow = hasNav ? (
    <nav className={cn("ds-hdr-nav", isCompact && "is-inline")} aria-label="Primary" ref={navRef}>
      <ul className="ds-hdr-nav__list" style={inner}>
        {navItems}
      </ul>
    </nav>
  ) : null;

  const searchField = search ? (
    /* A `search` LANDMARK, which the masthead's own field never was — it rendered
       as a bare `<div class="ds-search">`, so landmark navigation could not reach
       the primary search box on any page in the estate. [GIGW 3.0 §9] */
    <search className="ds-hdr-searchfield">
      <Search
        className="ds-hdr-searchfield__field"
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
  ) : null;

  /* ── The condensed bar ──────────────────────────────────────────────────────
     Emblem, nav, search, CTA — one row. The emblem holds the same left edge it
     occupies at rest; see `collapseOnScroll` for why that is not negotiable. */
  const condensedBar = (
    <div className="ds-hdr-cond">
      <div className="ds-hdr-cond__in" style={inner}>
        <a
          className="ds-hdr-cond__home"
          href={homeHref}
          aria-label={`${brandLines.department} — home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ds-hdr-cond__emblem" src={emblemSrc} alt={emblemAlt ?? ""} />
        </a>

        {condSearchOpen && search ? (
          <search className="ds-hdr-cond__searchfield">
            <Search
              ref={condSearchRef}
              size="md"
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
              onKeyDown={(e) => {
                if (e.key === "Escape") setCondSearchOpen(false);
              }}
              suggestions={search.suggestions}
              onSuggestionSelect={search.onSuggestionSelect}
              placeholder={search.placeholder ?? "Search"}
              aria-label={search.placeholder ?? "Search"}
            />
          </search>
        ) : (
          hasNav && (
            <nav className="ds-hdr-nav is-cond" aria-label="Primary" ref={navRef}>
              <ul className="ds-hdr-nav__list">{navItems}</ul>
            </nav>
          )
        )}

        <span className="ds-hdr-cond__spacer" />

        {search && (
          <button
            type="button"
            className="ds-hdr-cond__iconbtn"
            aria-label={condSearchOpen ? "Close search" : (search.placeholder ?? "Search")}
            aria-expanded={condSearchOpen}
            onClick={() => setCondSearchOpen((o) => !o)}
          >
            <Icon name={condSearchOpen ? "close" : "search"} size={24} />
          </button>
        )}

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
  );

  return (
    <header
      ref={headerRef}
      className={cn("ds-hdr", isSticky && "is-sticky", condensed && "is-scrolled", className)}
      data-variant={variant}
    >
      {/* ── Tier 1: Accessibility bar (the shared DS component) ──
         Figma is the source of truth, so all four actions render: skip · font
         size · accessibility · language. The bar's skip is VISIBLE (as in Figma
         and on UX4G government sites), which is why the header no longer emits a
         second, visually-hidden `.ds-hdr-skip` — two links to the same target
         announce the bypass twice. WCAG 2.4.1 is satisfied by the visible one.

         IT IS INSIDE THE STICKY HEADER BUT SCROLLS AWAY: the header pins at
         `top: calc(-1 * var(--sa-hdr-abar-h))`, so this row leaves and the brand
         and nav rows stay. Keeping it in the DOM keeps the skip link on the page
         and the markup stable across the condense. */}
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

      {condensed ? (
        condensedBar
      ) : (
        <>
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
                beta={isCompact ? false : beta}
                compact={isCompact}
              />

              {/* A DIRECT CHILD of the brand row, not part of the trailing cluster —
                  that is what lets it wrap onto its own full-width line below
                  `breakpoint/tablet` instead of disappearing. It used to hide at 900px
                  while the nav row survived to 1024, so between the two the reader had
                  neither. */}
              {searchField}

              <div className="ds-hdr-brand__trailing">
                {marks.map((m) =>
                  m.href ? (
                    /* [DBIM 5.6] Hyperlinked logos — the same treatment the footer
                       gives its credits. `href` has been in `BrandMark` all along and
                       was never read, so Digital India sat in every public masthead as
                       an inert image. */
                    <a
                      key={m.src}
                      className="ds-hdr-cobrand-link"
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
                      <span className="ds-hdr-sr"> (opens in a new window)</span>
                    </a>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={m.src} className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
                  ),
                )}

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
        </>
      )}

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
          searchValue={query}
          onSearchValueChange={(v) => {
            setQuery(v);
            search?.onQueryChange?.(v);
          }}
          /* The three controls `AccessibilityBar` drops below `breakpoint/tablet`.
             This is the "consumer's menu" its stylesheet has referred to since the
             day the cluster was hidden; until now nothing rendered them. */
          accessibilityControls={!isCompact}
          accessibility={accessibilityToolbar}
          accessibilityHref={accessibilityHref}
          onAccessibility={onAccessibility}
          language={language}
        />
      )}
    </header>
  );
}
