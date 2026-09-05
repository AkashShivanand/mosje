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
  language?: { label?: string; lang?: string; onClick?: () => void };

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
  /**
   * Trailing CTA (e.g. a Login or Apply Online button). In the condensed bar every
   * link or button in this slot is held at the bar's 40px control height, so pass
   * `Button size="default"` (40) — a 32 or 36 would be stretched, a 48 squeezed.
   */
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
   *
   * TWO LAYOUTS, ONE MARGIN. `variant="website"` is CONTAINED — the cap above
   * plus the margin ladder, exactly `.sa-container`. `variant="portal"` is
   * FLUID — no cap, the margin ladder only, so the rows run edge to edge and
   * `maxWidth` is ignored. Figma draws both on a 1440 frame: `Navbar/Website`
   * caps each row at `container/page` (1320 there) and `Navbar/Portal` lets
   * each row fill; both pad with `grid/margin/page`. Every row's inline padding
   * here is `--sa-grid-margin-page` (16 · 24 from 768 · 32 from 1920) for the
   * same reason — it was a literal 16/24 per breakpoint until 2026-09-05, which
   * agreed with the ladder everywhere except 1920 and up.
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
  /* THE FLAG IS NOT OPTIONAL. Two of eleven shells passed one; the other nine
     rendered a government bar with no national mark on it, and the two surfaces
     did not agree on what the bar was. The default points at the hub-root copy
     (`apps/hub/public/images/Indian-Flag.svg`), which every zone can load on the
     single origin. A shell may still pass its own. */
  govLink = { href: "https://india.gov.in/", label: "Government of India", flagSrc: "/images/Indian-Flag.svg" },
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
  /** Held true across printing, so scroll anchoring cannot re-condense the header. */
  const printingRef = React.useRef(false);
  /** Held true across the condense/expand morph — see the effect that sets it. */
  const morphingRef = React.useRef(false);
  const [morphing, setMorphing] = React.useState(false);
  /** The condensed bar's search, expanded in place over the nav. */
  const [condSearchOpen, setCondSearchOpen] = React.useState(false);
  /** The portal's phone search, disclosed under the brand row on tap. */
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const mobileSearchRef = React.useRef<HTMLInputElement>(null);
  /** The condensed nav has run out of room; fall back to the sheet. */
  const [navOverflows, setNavOverflows] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const condSearchRef = React.useRef<HTMLInputElement>(null);
  const condInRef = React.useRef<HTMLDivElement>(null);
  const condListRef = React.useRef<HTMLUListElement>(null);
  /** The morphing box, and the two faces it crossfades between. */
  const morphRef = React.useRef<HTMLDivElement>(null);
  const restFaceRef = React.useRef<HTMLDivElement>(null);
  const condFaceRef = React.useRef<HTMLDivElement>(null);
  // Portal = FLUID (no cap; the rows pad with --sa-grid-margin-page and run edge to
  // edge, as Navbar/Portal's rows fill their 1440 frame). Website = CONTAINED on the
  // same cap the page below binds. See the `maxWidth` docstring above.
  const inner = {
    maxWidth: maxWidth ?? (isPortal ? "100%" : "var(--sa-container-page)"),
  } as React.CSSProperties;
  const hasNav = !!nav && nav.length > 0;
  /**
   * ONE MENU CONTROL ON A PHONE. A portal that has a sidebar (`onToggleNav`) and a
   * top-level `nav` used to show two menu-shaped controls below 1024 — the sidebar
   * toggle leading and the sheet trigger trailing — with nothing to tell a reader
   * which opened what. The rule: on a portal the sidebar is the navigation surface
   * below the laptop anchor, and the nav row is a desktop affordance. The sheet
   * and its trigger are not rendered when the sidebar is there; the portal's
   * sidebar carries the same top-level entries. The website has no sidebar, so
   * its sheet is unaffected.
   */
  const showSheet = hasNav && !(isPortal && onToggleNav);
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
      if (printingRef.current || morphingRef.current) return;
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
   *   --sa-header-stuck   where the masthead's bottom edge lands once pinned,
   *                       IN WHICHEVER STATE IT IS IN NOW (on :root)
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
   *
   * `--sa-header-stuck` IS THE OPPOSITE, and the distinction is the whole reason it
   * exists. A `scroll-padding` has to clear the taller state; a sticky OFFSET has to
   * match the current one. Anything that pins itself below the masthead and read
   * `--sa-header-pinned` therefore pinned to a height the header no longer has the
   * moment it condensed — measured on the website with the SAMAVESH band open: an
   * 89px strip of page content showing between the two on desktop, 155px on a phone,
   * because the band sat at 154/212 while the condensed header ended at 65/57.
   *
   * Only a STICKY header publishes it. A non-sticky specimen — the three on the
   * SiteHeader documentation page — contributes nothing to a sticky offset, and a
   * page rendering several headers must not have the last one to measure win.
   */
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const measure = () => {
      /* READ THE STATE OFF THE DOM BEING MEASURED, never off the `condensed`
         React value this effect closed over. The two disagree for one frame at
         every transition: React re-renders, the condensed bar is in the DOM at
         its new height, and the ResizeObserver registered by the PREVIOUS effect
         is still the one attached — so `measure` fires with the new geometry and
         the old flag. Caught by measuring: `--sa-header-pinned` was being written
         as 57px while condensed, when it exists precisely to hold the RESTING
         212px. That number is `scroll-padding-top`, so the frame that got it
         wrong left an anchor 155px short of clearing an expanded masthead —
         WCAG 2.4.11, and invisible unless you go looking. `is-scrolled` is set
         from the same render that produced the geometry, so it cannot be a frame
         out of step with it. */
      const isCondensed = el.classList.contains("is-scrolled");
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
      root.style.setProperty("--sa-header-bottom", `${isCondensed ? pinned : el.offsetHeight}px`);
      if (!isCondensed) root.style.setProperty("--sa-header-pinned", `${pinned}px`);
      if (isSticky) root.style.setProperty("--sa-header-stuck", `${pinned}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [condensed, isSticky]);


  /**
   * Publish the condensed state, so chrome pinned UNDER the masthead can condense
   * with it rather than run a second copy of the thresholds.
   *
   * An attribute rather than a variable, because what a consumer needs is a
   * SELECTOR, not a number — and the two thresholds (past 120, back under 40) are
   * deliberately asymmetric so the bar cannot flutter at one scroll position. A
   * second component re-deriving that from `scrollY` is a second place for the
   * hysteresis to be got wrong, and the two would disagree for the frames in
   * between. Same shape as `data-sa-abar-a11y` in `accessibility-entry-point.md`.
   *
   * Its consumer is the SAMAVESH band, which condenses while pinned over an open
   * panel. This was removed once, correctly, when that consumer briefly had no
   * condensed state — governance that governs nothing is worse than none — and is
   * back because the consumer is back. Do not keep it if the last one goes again.
   *
   * Written only by a STICKY header: a non-sticky specimen never condenses, and a
   * page rendering several headers must not have the last one to measure win.
   */
  React.useEffect(() => {
    if (!isSticky) return;
    const root = document.documentElement;
    if (condensed) root.setAttribute("data-sa-header-condensed", "");
    else root.removeAttribute("data-sa-header-condensed");
    return () => root.removeAttribute("data-sa-header-condensed");
  }, [condensed, isSticky]);

  /**
   * Print the FULL masthead, whatever the reader had scrolled to.
   *
   * The condensed bar carries the emblem and no department name — deliberate on
   * screen, where the name is one scroll away, and wrong on paper, where it is
   * gone for good. What a printed government page needs from its header is who
   * published it, which is the whole reason the print rules below strip the nav,
   * the search and the account block and keep the lockup.
   *
   * CSS cannot undo this on its own: the tiers are swapped in React, not hidden,
   * so `@media print` has nothing to reveal. Restoring the state before the dialog
   * opens is what gives those rules something to work with.
   */
  React.useEffect(() => {
    if (!wantsScrollCollapse) return;
    /* THE FLAG IS THE WHOLE FIX, and the reason is SCROLL ANCHORING. Restoring the
       tiers grows the header by ~135px, all of it above the viewport, so the
       browser helpfully shifts `scrollY` down by the same amount to keep the
       visible content still. That shift is a scroll event, the scroll handler
       reads the new position, and the masthead condenses straight back — measured:
       the handler fired, the state was set, and the condensed bar never left. */
    const onBeforePrint = () => {
      printingRef.current = true;
      setScrolled(false);
    };
    const onAfterPrint = () => {
      printingRef.current = false;
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, [wantsScrollCollapse]);

  /* Condensing swaps the nav row out from under whatever was open in it. Close
     first, so a panel is never orphaned and focus is never stranded on a node that
     is about to be unmounted. */
  const [prevCondensed, setPrevCondensed] = React.useState(condensed);
  if (prevCondensed !== condensed) {
    setPrevCondensed(condensed);
    if (condensed) setOpenLabel(null);
    else setCondSearchOpen(false);
  }

  /**
   * The swap unmounts whatever the reader was on. A pointer user never notices; a
   * keyboard reader who had tabbed into the masthead and then scrolled would find
   * focus back on `<body>` — at the top of the document, place lost.
   *
   * Tracked with a `focusin` listener rather than sampled inside the effect below.
   * Sampling only sees the moments the effect runs, which is when `condensed`
   * CHANGES — and focus almost always moves between two of those, so the sample
   * was `<body>` every time and the restore never fired once.
   */
  const hadFocusRef = React.useRef(false);
  React.useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onIn = () => {
      hadFocusRef.current = true;
    };
    const onOut = (e: FocusEvent) => {
      /* Only when focus leaves for somewhere real. A swap moves it to <body>
         first, and treating that as "left" would clear the flag before the
         effect below has had a chance to read it. */
      const next = e.relatedTarget as Node | null;
      if (next && !el.contains(next)) hadFocusRef.current = false;
    };
    el.addEventListener("focusin", onIn);
    el.addEventListener("focusout", onOut);
    return () => {
      el.removeEventListener("focusin", onIn);
      el.removeEventListener("focusout", onOut);
    };
  }, []);

  React.useEffect(() => {
    const el = headerRef.current;
    if (!el || !hadFocusRef.current) return;
    if (document.activeElement !== document.body) return;
    el.querySelector<HTMLElement>(".ds-hdr-cond__home, .ds-hdr-lockup")?.focus({
      preventScroll: true,
    });
  }, [condensed]);

  /**
   * `preventScroll`, defensively.
   *
   * A plain `focus()` scrolls the element into view, and this one lives in a
   * header pinned to the top of the viewport: any scrolling on its behalf moves
   * the page toward scrollTop 0, which is the threshold that un-condenses the
   * masthead and unmounts this very field. The field is already on screen when it
   * mounts, so in practice the browser has nothing to do — this is a guard against
   * a state where it would, not a fix for one observed here. (It was briefly
   * credited with fixing exactly that; the disappearing bar turned out to be a
   * test harness scrolling the target into view before clicking it.)
   */
  /**
   * Give the morphing box a height it can actually animate to.
   *
   * `height: auto` does not transition, and the two faces are different heights by
   * 135px, so something has to hand CSS a number. Both faces stay MOUNTED — the
   * inactive one is `visibility: hidden`, which still lays out, so it can be
   * measured at any time — and this writes whichever height is current.
   *
   * The resting face is the one left in normal flow, so before this effect has ever
   * run the box is already the right height and the server-rendered masthead is not
   * a 46px stub waiting for JavaScript.
   */
  React.useEffect(() => {
    if (!wantsScrollCollapse) return;
    const morph = morphRef.current;
    const rest = restFaceRef.current;
    const cond = condFaceRef.current;
    if (!morph || !rest || !cond || typeof ResizeObserver === "undefined") return;
    const apply = () => {
      const h = condensed ? cond.offsetHeight : rest.offsetHeight;
      if (h > 0) morph.style.height = `${h}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(rest);
    ro.observe(cond);
    return () => ro.disconnect();
  }, [condensed, wantsScrollCollapse]);

  /**
   * Hold the trigger still while the box is moving, and clip it while it moves.
   *
   * TWO PROBLEMS, ONE FLAG.
   *
   * The box shrinks by ~89px of PINNED height, all of it above the viewport, so the
   * browser's scroll anchoring shifts `scrollY` down by the same amount to keep the
   * content still — and that shift is a scroll event the handler would read back.
   * Measured: condensing at 130 landed at 52. The restore threshold is 40, so
   * condensing a few pixels past the 120 trigger would land within single digits of
   * un-condensing, and the animation would be driving its own trigger. The read is
   * suspended for the length of the transition and taken once at the end.
   *
   * And the outgoing face is 200px tall inside a box on its way to 65, so for the
   * length of the crossfade it OVERFLOWS — its ghost paints over the page below.
   * Caught in a frame captured 125ms in: the emblem and department line sitting on
   * the content under a bar that had already arrived. The box clips only while it is
   * moving, because at rest it must not clip at all: the dropdowns and the mega-menu
   * hang below the header and would be cut off.
   *
   * The duration is READ FROM THE ELEMENT rather than repeated here, so the guard
   * cannot drift from the CSS — including under reduced motion, where the height
   * snaps and this collapses to nothing.
   */
  const firstMorph = React.useRef(true);
  React.useEffect(() => {
    if (!wantsScrollCollapse) return;
    if (firstMorph.current) {
      firstMorph.current = false;
      return;
    }
    const morph = morphRef.current;
    const ms = morph
      ? Math.max(0, parseFloat(getComputedStyle(morph).transitionDuration || "0") * 1000)
      : 0;
    morphingRef.current = true;
    setMorphing(true);
    const t = window.setTimeout(() => {
      morphingRef.current = false;
      setMorphing(false);
      const y = window.scrollY;
      setScrolled((was) => (was ? y > 40 : y > 120));
    }, ms + 20);
    return () => window.clearTimeout(t);
  }, [condensed, wantsScrollCollapse]);

  React.useEffect(() => {
    if (condSearchOpen) condSearchRef.current?.focus({ preventScroll: true });
  }, [condSearchOpen]);

  React.useEffect(() => {
    if (mobileSearchOpen) mobileSearchRef.current?.focus({ preventScroll: true });
  }, [mobileSearchOpen]);

  /**
   * When the nav stops fitting the condensed bar, hand it to the sheet.
   *
   * Measured on 2026-08-26 at 1280px: seven items are 825px, and after the
   * emblem, the search button and the CTA the 1200px column leaves 44px. One more
   * top-level entry fits with 40px to spare, a second leaves 9px, and a third
   * overlaps by 88 — items here neither wrap nor shrink, they run under the search
   * button. An information architecture should not have to be measured against a
   * masthead before it can change.
   *
   * The fallback is the sheet, not a "More" menu: three of these entries own
   * mega-menus, which do not nest sensibly inside a flat dropdown, and the sheet
   * already renders their columns properly at every width below 1024.
   *
   * WHY THIS CANNOT OSCILLATE. The requirement is read from the list's own
   * `max-content` width, which does not depend on the container — and the burger's
   * width is subtracted in BOTH states, so collapsing the nav (which reveals the
   * burger) cannot make the nav fit again and flip it straight back.
   */
  React.useEffect(() => {
    if (!condensed || !hasNav) {
      setNavOverflows(false);
      return;
    }
    const inner = condInRef.current;
    const list = condListRef.current;
    if (!inner || !list || typeof ResizeObserver === "undefined") return;
    const GAP = 16;
    const measure = () => {
      const required = list.getBoundingClientRect().width;
      /* The EFFECTIVE flex items, not `inner.children`. `.ds-hdr-brand__actions`
         is `display: contents`, so its own box measures zero while the CTA inside
         it takes ~110px and participates in the flex row as an item in its own
         right. Counting the wrapper missed the button entirely, and the bar
         overlapped by 20px at eight items before this check noticed. */
      const flexItems: Element[] = [];
      for (const child of Array.from(inner.children)) {
        if (getComputedStyle(child).display === "contents") {
          flexItems.push(...Array.from(child.children));
        } else {
          flexItems.push(child);
        }
      }
      /* THE SHEET TRIGGER IS EXCLUDED FROM BOTH SIDES, and that is what makes this
         stable rather than merely cautious. It is absent while the nav shows and
         present once the nav collapses, so counting it would make the two states
         compute different answers — the 16px of its gap alone is enough to flip a
         borderline layout back and forth forever. Ignoring it entirely asks the
         same question in both directions: "does the nav fit in the row it would
         have to itself?" An earlier version reserved 56px unconditionally instead;
         that was stable too, but it threw away a whole nav entry at 1280 to buy
         something this gets for free. */
      const laidOut = flexItems.filter(
        (el) => !el.classList.contains("ds-hdr-burger") && el.getClientRects().length > 0,
      );
      let taken = 0;
      for (const item of laidOut) {
        if (item === list.parentElement) continue;
        if (item.classList.contains("ds-hdr-cond__spacer")) continue;
        taken += item.getBoundingClientRect().width;
      }
      /* clientWidth INCLUDES padding — 24px a side here, so 48px of room that does
         not exist. Left in, the check reads 48px more space than the row has and
         lets the nav overflow by up to that much before it notices. */
      const cs = getComputedStyle(inner);
      const content =
        inner.clientWidth - parseFloat(cs.paddingLeft || "0") - parseFloat(cs.paddingRight || "0");
      const available = content - taken - GAP * Math.max(0, laidOut.length - 1);
      setNavOverflows(required > available);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    ro.observe(list);
    return () => ro.disconnect();
  }, [condensed, hasNav, nav]);

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
    <search className={cn("ds-hdr-searchfield", isPortal && mobileSearchOpen && "is-open")}>
      <Search
        ref={isPortal ? mobileSearchRef : undefined}
        className="ds-hdr-searchfield__field"
        size="lg"
        value={query}
        onKeyDown={(e) => {
          if (e.key === "Escape" && isPortal) setMobileSearchOpen(false);
        }}
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
    <div className={cn("ds-hdr-cond", !hasNav && "is-navless")}>
      <div className="ds-hdr-cond__in" style={inner} ref={condInRef}>
        {/* The app-shell sidebar toggle. It lives in the brand row at rest, and
            leaving it out of this bar meant a portal lost the control for its own
            navigation the moment the page scrolled — on the surface where the
            sidebar IS the navigation. */}
        {onToggleNav && (
          <MenuToggle
            expanded={navExpanded}
            onToggle={onToggleNav}
            controlsId={navControlsId}
            className="ds-hdr-cond__toggle"
          />
        )}

        {/* IDENTITY, NOT JUST THE EMBLEM. The bar is 64px and on a portal most
            of it was empty: the nav lives in the sidebar, so nothing followed a
            20px emblem until the profile block a thousand pixels away — the
            department's name had left the page. ALL THREE LINES ride with the
            emblem — Government of India and the Ministry on one muted 12px line,
            the Department at 14 beneath — because DBIM 5.2 makes none of them
            optional, and 36px of type sits inside the bar's 48. They show wherever
            the inline nav is not on this row (every portal, and the website below
            1024 or once its nav has moved to the sheet), and stay off where the
            nav needs the width. Emblem-only below 768.
            Figma: Navbar/BrandLockup Size=Condensed inside the On Scroll bars. */}
        <BrandLockup
          className="ds-hdr-cond__lockup"
          emblemSrc={emblemSrc}
          emblemAlt={emblemAlt}
          lines={brandLines}
          href={homeHref}
          compact
          textHiddenOnMobile
        />

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
              <ul className="ds-hdr-nav__list" ref={condListRef}>
                {navItems}
              </ul>
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

        {/* 40, not the brand row's 48: at 48 the avatar decided the bar's height. */}
        {account && <AccountMenu account={account} items={accountMenu} avatarSize={40} />}

        <span className="ds-hdr-brand__actions">{actions}</span>

        {showSheet && (
          <SheetToggle
            open={drawerOpen}
            onOpen={() => setDrawerOpen(true)}
            controlsId={drawerId}
          />
        )}
      </div>
    </div>
  );

  /* The three tiers at rest. Extracted so the morph can render them as one of its
     two faces, and a non-condensing header can render them on their own. */
  const restingTiers = (
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
                    <img className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
                    <span className="ds-hdr-sr"> (opens in a new window)</span>
                  </a>
                ) : (
                  <img key={m.src} className="ds-hdr-cobrand" src={m.src} alt={m.alt} style={{ height: m.height ?? 40 }} />
                ),
              )}

              {isCompact && navRow}

              {/* THE PORTAL'S PHONE SEARCH IS DISCLOSED, NOT LAID OUT. On the website
                  the field takes a full row under the lockup because search is that
                  site's navigation fallback. A portal navigates by its sidebar, and
                  a 56px field under a two-line lockup pushed the page start past
                  300px on a phone. Below 768 the field waits behind a 40px button in
                  the row — the same control the condensed bar uses — and opens on
                  its own row on tap; Escape closes it. Nothing renders here from 768
                  up, where the field is on the row as before.
                  AND NOT WHEN THERE IS A SIDEBAR. A portal that has one opens a drawer
                  on a phone, and search lives at the head of that drawer (SidebarNav
                  `header`); a search button beside the toggle would be a second door
                  to the same room, and the 52px it costs is the difference between an
                  identity that wraps to two lines and one that wraps to four. */}
              {isPortal && search && !onToggleNav && (
                <button
                  type="button"
                  className="ds-hdr-brand__searchbtn"
                  aria-label={mobileSearchOpen ? "Close search" : (search.placeholder ?? "Search")}
                  aria-expanded={mobileSearchOpen}
                  onClick={() => setMobileSearchOpen((o) => !o)}
                >
                  <Icon name={mobileSearchOpen ? "close" : "search"} size={24} />
                </button>
              )}

              {account && <AccountMenu account={account} items={accountMenu} />}

              <span className="ds-hdr-brand__actions">{actions}</span>

              {showSheet && (
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
  );

  return (
    <header
      ref={headerRef}
      className={cn("ds-hdr", isSticky && "is-sticky", condensed && "is-scrolled", className)}
      data-variant={variant}
      data-nav-overflow={navOverflows ? "true" : undefined}
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
          govLink={{ flagSrc: "/images/Indian-Flag.svg", ...govLink }}
          skipTo={skipTo}
          showSkip
          fontSize
          accessibility={accessibilityToolbar}
          accessibilityHref={accessibilityHref}
          onAccessibility={onAccessibility}
          language={language}
          /* `page`, so tier 1 sits on the same column as the brand and nav rows.
             `wide` is a flat 1200 and does not follow the container ladder. */
          layout={isPortal ? "fluid" : "page"}
          maxWidth={maxWidth}
        />
      )}

      {/* ── The morph ──────────────────────────────────────────────────────────
         Both faces are rendered whenever the header can condense, because a
         crossfade needs two things to cross. The conditional render this replaced
         swapped one subtree for another in a single frame: 200px of masthead became
         65px of bar with nothing in between, which is the abruptness.

         The inactive face is `inert` as well as visually hidden — it is real DOM
         carrying real links, and a keyboard reader must not be able to tab into a
         masthead that is not on screen.

         A header that does NOT condense keeps the old single-face markup: compact is
         one 65px tier already, and a consumer passing `collapseOnScroll={false}` has
         asked for no morph at all. Neither should pay for this. */}
      {wantsScrollCollapse ? (
        <div className="ds-hdr__morph" ref={morphRef} data-morphing={morphing ? "" : undefined}>
          <div
            className="ds-hdr__face ds-hdr__face--rest"
            ref={restFaceRef}
            data-active={condensed ? undefined : ""}
            inert={condensed || undefined}
          >
            {restingTiers}
          </div>
          <div
            className="ds-hdr__face ds-hdr__face--cond"
            ref={condFaceRef}
            data-active={condensed ? "" : undefined}
            inert={!condensed || undefined}
          >
            {condensedBar}
          </div>
        </div>
      ) : (
        restingTiers
      )}


      {/* ── Mobile navigation (Figma Navbar/NavSheet) ── */}
      {showSheet && (
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
