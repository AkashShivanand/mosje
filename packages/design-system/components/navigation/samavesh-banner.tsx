"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Chip } from "../forms/chip";
import { Divider } from "../layout/divider";
import { PortalCard } from "./portal-card";
import { SAMAVESH_MARK } from "../brand/org-logo-registry";
import { buttonClasses } from "../actions/button";
import {
  DEFAULT_APPS,
  portalLabel,
  portalCategoriesIn,
  type PortalCategory,
} from "./app-switcher-utils";
import "./samavesh-banner.css";

/**
 * How the identity band is coloured.
 *
 * India Saffron is a saturated mid-tone, which is the one thing no ink sits on
 * comfortably — too light for white, too vivid and dark for reading-size dark
 * text. The full evidence (WCAG 2 vs APCA, the user testing, and the colour-space
 * scan that proves no ink clears both on this ground) is in the header of
 * `samavesh-banner.css` and on the component's documentation page.
 *
 * - `light` — white on saffron. DEFAULT, and matches the Figma reference.
 *   WCAG 2 **2.91:1, which FAILS AA**; APCA Lc 59.8, the best perceptual score
 *   available on this ground. A deliberate, recorded deviation.
 * - `dark` — near-black on the same saffron. WCAG 6.50:1 passes; APCA Lc 48.9
 *   clears headline but not body text. The compliant choice.
 * - `tint` — near-black on pale saffron, with saffron as a top rule and a badge
 *   ring. WCAG 17.29:1, APCA Lc 99.1. The only tone that clears BOTH standards
 *   for body text, and the recommended one.
 */
export type SamaveshBannerTone = "light" | "dark" | "tint";

export interface SamaveshBannerPortalItem {
  id?: string;
  name: string;
  shortName: string;
  description?: string;
  href: string;
  external?: boolean;
  category?: PortalCategory;
}

/**
 * Every portal the estate registry reports as BUILT, in registry order.
 *
 * Derived, never restated. A hand-kept copy of this list is what shipped a
 * 404 for NOS on every page of the website: the copy said "live", the registry
 * said "planned", and nothing reconciled them. The banner now cannot show a
 * portal that does not exist, because the only way in is through `DEFAULT_APPS`.
 */
export function liveSamaveshPortals(): SamaveshBannerPortalItem[] {
  return DEFAULT_APPS.filter(
    (a) => a.group === "Portals" && a.status !== "planned",
  ).map((a) => {
    const label = portalLabel(a);
    return {
      id: a.path,
      shortName: label.short,
      name: label.full,
      href: a.path,
      category: a.category as PortalCategory | undefined,
    };
  });
}

export const DEFAULT_SAMAVESH_PORTALS: SamaveshBannerPortalItem[] =
  liveSamaveshPortals();

export interface SamaveshBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onToggle"> {
  /** Initial open state if uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Callback fired when open/closed state changes. */
  onToggle?: (open: boolean) => void;
  /** Portals shown in the drawer. Defaults to every LIVE portal in the registry. */
  portals?: SamaveshBannerPortalItem[];
  /** Title inside the drawer. @default "Choose a portal to visit" */
  drawerTitle?: string;
  /**
   * Href for the footer link. @default "/portals"
   *
   * THE TWO SURFACES NOW LIST THE SAME PORTALS, so the label had to change. It
   * read "Browse every portal, including those in development" while `/portals`
   * still showed unbuilt ones; once the directory went live-only that sentence
   * was simply false, and a link promising more of something it does not have is
   * worse than no link.
   *
   * What `/portals` actually adds is a different VIEW of the same set — search, a
   * category filter, a description on every card. The label says that instead.
   */
  viewAllHref?: string;
  /**
   * The question above the footer link. @default "Are you an officer or administrator?"
   *
   * IT IS A SIGNPOST, NOT A CLAIM ABOUT THE LIST. Both surfaces currently show
   * the same live portals, so any copy promising MORE there is false — which is
   * what "Browse every portal, including those in development" became the day the
   * directory went live-only, and what "Search and compare every portal" was from
   * the start: nothing on `/portals` compares anything.
   *
   * What IS true is who the second route is for. A citizen has already arrived
   * where they are going; an officer needs the directory to reach the portal they
   * sign in to. Pass `viewAllPrompt=""` to render the link with no question.
   */
  viewAllPrompt?: string;
  /** Label for the footer link. @default "Find your portal" */
  viewAllLabel?: string;
  /** Label on the "no category filter" chip. @default "All" */
  allLabel?: string;
  /**
   * Shown when there is nothing to list.
   * @default "No portals are available right now."
   *
   * It CAN happen: the list is derived from the estate registry, so a registry
   * with nothing marked live — a fresh environment, a failed read, a category
   * filter matching nothing — leaves it empty. Rendering a heading above an empty
   * list reads as a broken page; saying so reads as an answer.
   */
  emptyLabel?: string;
  /** Custom source for the SAMAVESH badge. @default `SAMAVESH_MARK` from the brand module */
  logoSrc?: string;
  /** Headline text. @default "SAMAVESH" */
  title?: string;
  /** Subtitle description. */
  subline?: string;
  /** Explore button label. @default "Explore" */
  exploreLabel?: string;
  /**
   * Band colouring. See `SamaveshBannerTone` — the default fails WCAG 2 contrast
   * deliberately and that deviation is recorded, so do not change it casually.
   * @default "light"
   */
  tone?: SamaveshBannerTone;
  /**
   * Pin the band under the masthead WHILE ITS PANEL IS OPEN. @default true
   *
   * Not while closed — a closed band scrolls away like any other. The pin exists
   * to keep the TOGGLE with the PANEL it controls: without it, scrolling took the
   * band and the only visible way to close off the top while the panel stayed
   * over the page. That problem exists only in the open state, so the fix lives
   * only there, and the viewport pays nothing the rest of the time.
   *
   * An earlier version pinned ALWAYS. It read well until the consequence landed:
   * a permanently pinned band has to shrink to be affordable, and shrinking cost
   * the subline — the one line that tells a first visitor SAMAVESH is a single
   * access mechanism rather than a logo. The subline now survives every state.
   *
   * The offset is `--sa-header-stuck`, published by `SiteHeader`. Never
   * `--sa-header-pinned`: that is the RESTING height, for `scroll-padding`, and
   * pinning to it left an 89-155px strip of page content between the two.
   *
   * **Pass `false` for a specimen.** An inline example in a documentation page or
   * a Storybook canvas is not site chrome; pinned, it detaches from the prose
   * explaining it, and stacked tone specimens pin to the same offset.
   */
  sticky?: boolean;
}

/**
 * SAMAVESH Banner — the canonical top banner and portal discovery drawer.
 *
 * Figma: the SAMAVESH library set `56479:42386` (page "SAMAVESH Banner"), Tone ×
 * State, with `PortalCard` instances (`56486:832`) in the open variants. Nodes
 * 7116:33784 / 7298:29968 are the ORIGINAL HANDOFF MOCKUPS — a section of screens,
 * not a component. They are the reference this was built from, not a live mapping,
 * and Code Connect cannot resolve them.
 *
 * THE BAND HAS THREE TONES and the default (`light`, white on saffron) matches
 * the Figma reference and KNOWINGLY FAILS WCAG 2 contrast at 2.91:1. That is a
 * recorded deviation, not an oversight: on this ground no ink clears both WCAG 2
 * and APCA for body text, white is the best perceptual option of the ones that
 * exist, and `tone="tint"` is provided as the tone that clears both. See
 * `SamaveshBannerTone` and the header of `samavesh-banner.css`.
 *
 * Two further divergences from the reference, both upward:
 *
 *  1. The Explore button is a DS `Button variant="success"` (9.12:1) where the
 *     reference's own green is 4.53:1.
 *  2. The filter row renders only when the portals on show span MORE THAN ONE
 *     category. One chip filters nothing.
 *
 * Site-wide chrome: mount BETWEEN the header and `<main>`, never inside it.
 */
export function SamaveshBanner({
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  portals = DEFAULT_SAMAVESH_PORTALS,
  drawerTitle = "Choose a portal to visit",
  viewAllHref = "/portals",
  viewAllPrompt = "Are you an officer or administrator?",
  viewAllLabel = "Find your portal",
  allLabel = "All",
  emptyLabel = "No portals are available right now.",
  logoSrc = SAMAVESH_MARK,
  title = "SAMAVESH",
  subline = "Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
  exploreLabel = "Explore",
  tone = "light",
  sticky = true,
  className,
  ...rest
}: SamaveshBannerProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [activeCategory, setActiveCategory] =
    React.useState<PortalCategory | null>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalOpen;

  const drawerId = React.useId();
  const headingId = React.useId();
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const rootRef = React.useRef<HTMLElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);

  /*
   * THE PANEL HAS TO KNOW HOW TALL THE BAND IS, because it caps itself at the
   * space left between the pinned band and the bottom of the viewport. Measured
   * rather than assumed: the band is 60px with one line of subline and 88px with
   * three, it grows again at 200% zoom, and a typed constant is wrong at both.
   * Same mechanism SiteHeader uses to publish `--sa-header-pinned`.
   */
  React.useLayoutEffect(() => {
    const bar = barRef.current;
    const root = rootRef.current;
    if (!bar || !root) return;
    const publish = () =>
      root.style.setProperty("--_band-h", `${Math.round(bar.getBoundingClientRect().height)}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  /*
   * The filter exists only when it would DO something. Every portal live today
   * is a scheme portal, so this is one category and the row does not render —
   * "All (8)" beside "Scheme Portals (8)" is two controls with one outcome. It
   * appears on its own as the commissions and corporations ship.
   */
  const categories = React.useMemo(
    () => portalCategoriesIn(portals),
    [portals],
  );
  const showFilter = categories.length > 1;

  const visiblePortals = React.useMemo(
    () =>
      showFilter && activeCategory
        ? portals.filter((p) => p.category === activeCategory)
        : portals,
    [portals, activeCategory, showFilter],
  );

  /*
   * `openRef` IS THE SYNCHRONOUS MIRROR of `internalOpen`, and it exists to make
   * a fast double-tap work without putting a side effect inside a state updater.
   *
   * Both halves of that sentence were shipped defects. Reading `open` from the
   * render closure meant two clicks landing in the same tick both saw the same
   * stale value and the second was swallowed — the panel ended OPEN when it
   * should have returned to closed. The fix for that moved `onToggle` INSIDE
   * `setInternalOpen`'s updater, which trades one bug for a subtler one: React
   * requires updaters to be pure and DOUBLE-INVOKES them under StrictMode in
   * development, so every click fired the consumer's callback twice.
   *
   * A ref settles both. It updates synchronously, so the second tap reads the
   * first tap's decision; and the updater goes back to being a plain value, so
   * `onToggle` fires exactly once, outside it. Every uncontrolled write goes
   * through `setUncontrolledOpen` so the two can never drift apart.
   */
  const openRef = React.useRef(defaultOpen);

  /*
   * CLOSING WHILE PINNED IS AN EXIT, NOT A DISAPPEARANCE.
   *
   * The band is `sticky` only while its panel is open. Drop that class while the
   * reader is deep in the page and the band reverts to `relative` in the same
   * frame — which puts it back at its flow position, a thousand pixels above the
   * fold. It does not slide away; it is simply not there any more, and a 80px
   * bar vanishing out of the top of the viewport reads as a glitch.
   *
   * The fix is the oldest rule in interface motion: a thing leaves the way it
   * came. `--closing` holds the band pinned for one short beat and translates it
   * up and out — the same path it would have taken if the reader had scrolled it
   * away themselves — then releases it to flow, by which time it is off-screen
   * and nobody can see the switch.
   *
   * TWO GUARDS, both of which matter:
   *   - Only when it is ACTUALLY PINNED. Close it while the band is still in
   *     view near the top of the page and there is nothing to exit from; playing
   *     an exit there would animate the band off a screen it belongs on.
   *   - Never under `prefers-reduced-motion`. The state change still happens; it
   *     just happens without the travel, which is the whole point of the setting.
   */
  /*
   * CLOSING WHILE PINNED HAS THREE PHASES, AND THE MIDDLE ONE EXISTS BECAUSE OF
   * THE KEYBOARD.
   *
   *   idle    — not pinned, or already gone. `position` comes from `--open`.
   *   parked  — closed, still pinned, NOT animating. Held while focus is inside
   *             the band.
   *   leaving — the exit: pinned, translating up, fading. 150ms.
   *
   * WHY `parked` HAD TO EXIST. `position: sticky` used to live on `--open`, so
   * dropping that class returned the band to its flow position — a thousand
   * pixels above the fold — in a single frame. Not a slide: an absence. The
   * `leaving` phase fixed how that LOOKED, and introduced a worse problem, which
   * is that it carried a focused control off the screen with it. Escape returns
   * focus to the toggle, the toggle is inside the band, and the band was leaving:
   * measured at `top: -1380` with no visible focus indicator anywhere. WCAG 2.4.7.
   *
   * Guarding the animation alone was not enough — the teleport was still there
   * underneath it. So when focus is inside the band the band simply STAYS, at full
   * opacity, in place, with the reader's anchor visible on it. It leaves on
   * `focusout`, by which point their attention has already moved to whatever they
   * focused next and nothing is stranded.
   *
   * A modal can return focus to its trigger because the trigger does not move.
   * Ours does. That is the whole difference, and it is why the usual rule needed
   * a phase in the middle.
   */
  /* 150ms of transition plus a frame of slack, so the class outlives the
     animation rather than cutting it. Keep the two in step if either moves. */
  const EXIT_MS = 200;
  const [exitPhase, setExitPhase] = React.useState<"idle" | "parked" | "leaving">("idle");
  const exitTimer = React.useRef<number | null>(null);

  const clearExit = React.useCallback(() => {
    if (exitTimer.current !== null) {
      window.clearTimeout(exitTimer.current);
      exitTimer.current = null;
    }
  }, []);

  /** Back to flow, now, no animation. */
  const release = React.useCallback(() => {
    clearExit();
    setExitPhase("idle");
  }, [clearExit]);

  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  /* Pinned means the band has reached its sticky offset and stopped. Comparing
     its rect against its own resolved `top` asks the browser what actually
     happened rather than re-deriving it from scroll position and header height,
     which is the calculation that has already been got wrong twice here. */
  const isPinned = React.useCallback(() => {
    const el = rootRef.current;
    if (!el || !sticky) return false;
    const top = Number.parseFloat(window.getComputedStyle(el).top);
    if (!Number.isFinite(top)) return false;
    return el.getBoundingClientRect().top <= top + 1;
  }, [sticky]);

  const setUncontrolledOpen = React.useCallback((next: boolean) => {
    openRef.current = next;
    setInternalOpen(next);
  }, []);

  /** Play the exit, or — under reduced motion — park and wait for a scroll. */
  const leaveNow = React.useCallback(() => {
    clearExit();
    if (prefersReducedMotion()) {
      /* No travel, and no teleport either. Parking holds the band still until the
         reader's own scroll masks the release, which is what "fewer and gentler"
         means here — not "swap the animation for a jump". */
      setExitPhase("parked");
      return;
    }
    setExitPhase("leaving");
    exitTimer.current = window.setTimeout(() => {
      setExitPhase("idle");
      exitTimer.current = null;
    }, EXIT_MS);
  }, [clearExit]);

  const beginExit = React.useCallback(() => {
    if (!isPinned()) return;
    clearExit();
    /* `document.activeElement`, not `:focus-visible`. A mouse click on the toggle
       focuses it too, and moving that focus off-screen is just as wrong for the
       NEXT Tab press even though no ring was ever drawn. */
    if (rootRef.current?.contains(document.activeElement)) {
      setExitPhase("parked");
      return;
    }
    leaveNow();
  }, [isPinned, clearExit, leaveNow]);

  React.useEffect(() => clearExit, [clearExit]);

  /*
   * REOPENING CANCELS ANY PHASE, from every path.
   *
   * `handleToggle` already does it for the uncontrolled case, but a CONTROLLED
   * parent can set `isOpen` back to true without going through it — and a band
   * left in `leaving` with an open panel slides away carrying the panel with it.
   * Watching `open` itself covers every route in.
   */
  React.useEffect(() => {
    if (open) release();
  }, [open, release]);

  /*
   * PARKED HAS TO END. Three ways out, and it needed all three — with only
   * `focusout`, a reader who pressed Escape and then simply SCROLLED kept a band
   * pinned to the top of every screen for the rest of the session, which is the
   * permanently-pinned state this component deliberately does not have.
   *
   *   focusout  — they tabbed on. Animate; their attention has already moved.
   *   scroll    — they moved the page. Animate, or release outright under reduced
   *               motion, where their own scroll masks it.
   *   pointerdown anywhere outside — a click on empty page space moves focus to
   *               <body> and fires `focusout` with a NULL relatedTarget, which the
   *               handler below deliberately ignores (a window blur looks
   *               identical). Without this listener that click left it parked.
   */
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || exitPhase !== "parked" || open) return;

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && el.contains(next)) return;
      /* A null relatedTarget with the document still focused means focus fell to
         <body> — a real move. With the document UNfocused it is a tab switch, and
         animating a band the reader cannot see is not a response to anything. */
      if (!next && !document.hasFocus()) return;
      leaveNow();
    };
    const onScroll = () => {
      if (prefersReducedMotion()) release();
      else leaveNow();
    };
    const onPointerDown = (event: PointerEvent) => {
      /* `Node.contains` THROWS a TypeError on a non-Node — proven, not assumed:
         `band.contains(window)` raises. Real pointer events always carry an
         Element, so this cannot fire from a user; a synthetic or retargeted event
         can, and a thrown listener leaves the band parked forever with no error
         anyone sees. Guard, and treat "not a node" as outside. */
      const target = event.target;
      if (target instanceof Node && el.contains(target)) return;
      leaveNow();
    };

    el.addEventListener("focusout", onFocusOut);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      el.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [exitPhase, open, leaveNow, release]);

  React.useEffect(() => clearExit, [clearExit]);

  /* `close` is idempotent by construction — it sets false rather than negating,
     so an Escape landing in the same tick as an outside-click cannot reopen it. */
  const close = React.useCallback(
    (returnFocus: boolean) => {
      beginExit();
      if (!isControlled) setUncontrolledOpen(false);
      onToggle?.(false);
      if (returnFocus) toggleRef.current?.focus();
    },
    [isControlled, onToggle, setUncontrolledOpen, beginExit],
  );

  const handleToggle = React.useCallback(() => {
    const next = isControlled ? !controlledIsOpen : !openRef.current;
    if (next) {
      /* Reopening cancels an exit in flight, or the band would finish sliding
         away from under a panel the reader has just asked for again. */
      clearExit();
      setExitPhase("idle");
    } else {
      beginExit();
    }
    if (!isControlled) setUncontrolledOpen(next);
    onToggle?.(next);
  }, [isControlled, controlledIsOpen, onToggle, setUncontrolledOpen, beginExit, clearExit]);

  /*
   * Escape closes AND returns focus to the toggle. The return is not a nicety:
   * the drawer collapses to `visibility: hidden`, so a keyboard user who was on
   * a portal card is otherwise left with focus on an element nobody can see and
   * no focus ring anywhere on the page (WCAG 2.4.3 / 2.4.7).
   */
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    /*
     * The drawer OVERLAYS the page rather than pushing it down, so it has to be
     * dismissible by clicking away — an overlay that only closes from its own
     * button traps the reader's attention on something they have already moved
     * past. Focus is NOT returned here: the pointer has already gone elsewhere,
     * and yanking focus back to the banner would fight the click.
     */
    const onPointerDown = (event: PointerEvent) => {
      /* Same guard as the parked handler below: `contains` throws on a non-Node,
         and a throw here would silently disable dismiss-by-clicking-away. */
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      close(false);
    };
    /*
     * SCROLLING DOES NOT CLOSE IT — and an earlier version of this component was
     * wrong to make it. Dismissing a panel the reader deliberately opened,
     * because they scrolled, is the interface overruling them; scrolling is how
     * you LOOK at a long list, not how you say "never mind".
     *
     * The problem that fix was aimed at is real: the band used to scroll away, so
     * ~540px of scroll took it — and the only visible close — off the top while a
     * 600px panel stayed over the page. The answer is to keep the control
     * reachable, not to cancel the intent. The band now pins under the masthead
     * PERMANENTLY (`--sticky` in the stylesheet), so the toggle travels with the
     * panel and the spatial relationship between the two never breaks.
     */
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  return (
    <section
      ref={rootRef}
      className={cn(
        "ds-samavesh-banner",
        tone !== "light" && `ds-samavesh-banner--${tone}`,
        sticky && "ds-samavesh-banner--sticky",
        open && "ds-samavesh-banner--open",
        exitPhase === "parked" && "ds-samavesh-banner--parked",
        exitPhase === "leaving" && "ds-samavesh-banner--leaving",
        className,
      )}
      aria-label="SAMAVESH Portal Directory"
      {...rest}
    >
      <div ref={barRef} className="ds-samavesh-banner__bar">
        {/* `.sa-container` owns the width ladder and the right-wall gutter. */}
        <div className="ds-samavesh-banner__container sa-container">
          <div className="ds-samavesh-banner__brand">
            <div className="ds-samavesh-banner__badge">
              {/* `alt=""`, deliberately. The mark sits immediately beside the word
                  SAMAVESH in real text, so any alt here is read straight after it
                  — "SAMAVESH Emblem SAMAVESH". A decorative image next to the text
                  it depicts takes an empty alt (WCAG H67). */}
              <img src={logoSrc} alt="" width={52} height={52} loading="eager" />
            </div>
            <div className="ds-samavesh-banner__text-group">
              <span className="ds-samavesh-banner__title">{title}</span>
              <span className="ds-samavesh-banner__divider" aria-hidden="true">
                {/* The rule sits on the band, so its tone follows the band's:
                    inverse on saffron, normal on the pale tint. */}
                <Divider
                  orientation="vertical"
                  tone={tone === "tint" ? "default" : "inverse-subtle"}
                  length={32}
                />
              </span>
              <span className="ds-samavesh-banner__subline">{subline}</span>
            </div>
          </div>

          {/*
            ONE control, two shapes. Below 768px this button is stretched over the
            whole band by CSS (`position: absolute; inset: 0`) and shows only its
            chevron, so the entire band is the target — which is what the mobile
            design asks for, and the only way to keep the subline AND a control
            in a 375px row. Rendering a second, mobile-only button instead would
            put the same action in the accessibility tree twice.
          */}
          <div className="ds-samavesh-banner__actions">
            <button
              ref={toggleRef}
              type="button"
              className={buttonClasses(
                "success",
                "filled",
                "md",
                "ds-samavesh-banner__explore-btn",
              )}
              onClick={handleToggle}
              aria-expanded={open}
              aria-controls={drawerId}
              aria-label={open ? `Collapse ${title} portals` : `${exploreLabel} ${title} portals`}
            >
              <span className="ds-samavesh-banner__explore-label">{exploreLabel}</span>
              {/* ONE glyph that rotates, not two that swap. Swapping is a
                  discrete jump at the midpoint of a continuous gesture; rotating
                  the same chevron keeps the feedback continuous and lets the
                  motion be interrupted and reversed without a flicker. */}
              <span className="ds-samavesh-banner__btn-icon" aria-hidden="true">
                <Icon name="expand_more" size={20} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        id={drawerId}
        className={cn(
          "ds-samavesh-banner__drawer",
          open ? "ds-samavesh-banner__drawer--open" : "ds-samavesh-banner__drawer--closed",
        )}
        aria-hidden={!open}
      >
        <div className="ds-samavesh-banner__drawer-clip">
          <div className="ds-samavesh-banner__drawer-inner sa-container">
            {/*
              A <p>, NOT an <h2>. This banner renders BEFORE the page's own <h1>,
              so a heading here inverts the document outline — which mounting it
              outside <main> does not fix, because heading order is a property of
              the document rather than of the landmark. The text still NAMES the
              <nav> below through `aria-labelledby`.
            */}
            <p id={headingId} className="ds-samavesh-banner__drawer-heading">
              {drawerTitle}
            </p>

            {showFilter && (
              <div
                className="ds-samavesh-banner__filters"
                role="group"
                aria-label="Filter portals by category"
              >
                <Chip
                  tone="success"
                  selected={activeCategory === null}
                  onSelectedChange={() => setActiveCategory(null)}
                >
                  {allLabel}
                  <span className="ds-samavesh-banner__count">{portals.length}</span>
                </Chip>
                {categories.map((category) => (
                  <Chip
                    key={category}
                    tone="success"
                    selected={activeCategory === category}
                    onSelectedChange={() =>
                      setActiveCategory(activeCategory === category ? null : category)
                    }
                  >
                    {category}
                    <span className="ds-samavesh-banner__count">
                      {portals.filter((p) => p.category === category).length}
                    </span>
                  </Chip>
                ))}
              </div>
            )}

            {/*
              AN EMPTY STATE, because the list is DERIVED and can therefore be
              empty. `liveSamaveshPortals()` filters the registry to what is
              built; a registry with nothing marked live — a fresh environment, a
              bad fetch, a filter that matches nothing — rendered a heading, an
              empty `<ul>` and a link, which reads as a broken page rather than an
              answer. It says what is true and gives the one route that still
              works, rather than apologising.
            */}
            {visiblePortals.length === 0 ? (
              <p className="ds-samavesh-banner__empty">{emptyLabel}</p>
            ) : (
            /* A real <ul>/<li> of <a> inside a named <nav>. Never
               `role="listitem"` on the anchor — it REPLACES the link role. */
            <nav aria-labelledby={headingId}>
              <ul className="ds-samavesh-banner__grid">
                {visiblePortals.map((portal) => (
                  <li key={portal.id ?? portal.href}>
                    <PortalCard
                      code={portal.shortName}
                      name={portal.name}
                      href={portal.href}
                      path={portal.href}
                      external={portal.external}
                    />
                  </li>
                ))}
              </ul>
            </nav>
            )}

            {viewAllHref && (
              <div className="ds-samavesh-banner__footer-row">
                {viewAllPrompt && (
                  <span className="ds-samavesh-banner__footer-prompt">{viewAllPrompt}</span>
                )}
                <a href={viewAllHref} className="ds-samavesh-banner__view-all">
                  <span>{viewAllLabel}</span>
                  <Icon name="arrow_forward" size={16} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
