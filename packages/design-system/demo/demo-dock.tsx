"use client";

/**
 * SAMAVESH Design System — DemoDock
 *
 * DEMO-ONLY component. The single floating widget that replaces the
 * AppSwitcher's colour swatches and every hand-rolled `DemoFab` — one
 * folding rail on the right wall (see the "Placement" note further down),
 * that opens a tabbed panel:
 *
 * - **Apps** — the same searchable cross-zone list as `AppSwitcher`
 *   (`AppSwitcherPanel`), so a stakeholder never has to leave the dock to
 *   jump between portals.
 * - **Colour** — a labelled grid of brand-palette *motif tiles*, driven
 *   directly by `useColorMode()`. Each tile is a miniature abstraction of a
 *   UI (header bar, content surface, button shape, accent mark) rendered in
 *   that mode's own palette via a nested `[data-brand]` island on the tile
 *   itself — so a tile shows what the palette looks like without needing
 *   the whole page to switch first, and without hardcoding any hex value
 *   (see `foundations/color-mode.ts` + `design.md`'s "Brand islands" note).
 *   Clicking a tile applies that mode immediately — there is no separate
 *   switcher component (the old `ColorModeSwitcher` was retired; this is
 *   its replacement, with the label chrome and pill-track background
 *   stripped out). A global shortcut — **⌘⌥C** / **Ctrl+Alt+C** — cycles the
 *   colour mode from anywhere in the app, whether the dock is open or
 *   closed, and whether this tab is the active one or not; it's suppressed
 *   while focus is in a text input/textarea/select/contenteditable, and the
 *   change is announced to screen readers via a polite live region
 *   (`useLiveRegion`). A row of unlabelled colour dots in the panel
 *   *header* was considered and rejected: at 40px (the AAA 44px
 *   touch-target floor) ten future modes don't fit one header row, and
 *   colour alone as the only signal fails WCAG 1.4.1. A wrapping grid of
 *   labelled tiles has room for both a real target size and a label, and —
 *   unlike a vertical one-per-row list — keeps the tab's height from
 *   growing unboundedly as more modes are added (it wraps into rows within
 *   a fixed floor instead).
 * - **Sign in** — the demo credentials table for whatever login route
 *   `pathname` resolves to (`findDemoAccounts`, gated by `isLoginRoute`).
 *   Present, and ordered *first*, only when `pathname` is itself a login
 *   route — not merely somewhere under a portal that has one. Absent
 *   entirely — not rendered empty — everywhere else.
 *
 * Requires a `<ColorModeProvider>` ancestor: both the Colour tab and the
 * shell itself (for the global shortcut) call `useColorMode()`, which
 * throws outside one.
 *
 * Owns only the floating shell — FAB, open/close state, outside-click +
 * Escape handling, the focus trap, and which tab is active. Escape closes,
 * outside-click closes, focus returns to the FAB on close. Opening always
 * starts on the first tab — Sign in when the current route is a login
 * route, Apps otherwise — never a remembered tab.
 *
 * **Placement — the right wall, vertically centred.** The dock is a tab
 * flush to the right edge of the viewport, at mid-height. It is not in a
 * corner at all, and that is the point: a corner is contested (the UX4G
 * accessibility widget owns bottom-right and this estate must not restyle
 * it), while the middle of the right wall is empty on every surface in the
 * estate.
 *
 * This is the third placement, and the history is worth keeping because
 * each move fixed the previous one's actual defect rather than its
 * symptom:
 *
 * 1. **Bottom-left** collided with `PortalLoginShell`'s "Signing Into"
 *    strip on NMBA's login routes. The fix was a per-registry-entry boolean
 *    that raised the FAB — an opt-in a future portal could forget, and one
 *    that made the FAB visibly relocate between routes.
 * 2. **Bottom-right, stacked above the UX4G widget.** That removed the
 *    collision but inherited a worse problem: the widget is `display: none`
 *    on every page carrying an `AccessibilityBar`
 *    (`.claude/rules/accessibility-entry-point.md`), so the measured stack
 *    never resolved and the FAB floated 108px above an empty corner across
 *    most of the estate.
 * 3. **The right wall.** Nothing else is there, on any route, so there is
 *    nothing to measure, nothing to stack above, and no offset to keep in
 *    sync. `useCornerRailOffset` — written for step 2 and merged the same
 *    day — was retired with it, because a shared primitive with no consumer
 *    reads as governance while governing nothing.
 *
 * The lesson the three moves share: **a placement that has to be computed
 * is a placement that can be computed wrong.** This one cannot, because
 * there is nothing to compute.
 */

import * as React from "react";
import { cn } from "../utils/cn";
import {
  AppEntry,
  DEFAULT_APPS,
  matchActivePath,
} from "../components/navigation/app-switcher-utils";
import { AppSwitcherPanel } from "../components/navigation/app-switcher-panel";
import { Tabs, TabPanel, TabDef } from "../components/navigation/tabs";
import { LiveRegion, useLiveRegion } from "../components/a11y/live-region";
import { useColorMode } from "../foundations/color-mode-provider";
import { DBIM_COLOR_MODES, type ColorMode } from "../foundations/color-mode";
import { DemoAccountsPanel } from "./demo-accounts-panel";
import { findDemoAccounts, isLoginRoute } from "./demo-accounts";
import { FlaskIcon } from "./flask-icon";

import "./demo-dock.css";

// Matches --sa-motion-exit-duration (150ms, see tokens.css). Kept in sync by hand —
// there is no runtime token reader in this dependency-free package — so the
// exit animation (CSS) and the DOM-removal delay (this constant) agree on
// how long the closing panel stays mounted.
const CLOSE_ANIMATION_MS = 150;

const IconClose = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const IconCheck = () => (
  <svg
    className="ds-demodock__swatch-check"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--sa-color-text-onPrimary)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * Keeps the global colour-mode shortcut from hijacking normal typing — an
 * input, a textarea, a select, or any `contenteditable` region swallows the
 * keystroke instead of cycling the palette out from under the user.
 */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

/**
 * A miniature abstraction of a UI — header bar, content surface, accent
 * mark, button shape — rendered in ONE mode's palette regardless of which
 * mode the rest of the app is in. The trick is a nested `[data-brand]`
 * island: `foundations/color-mode.ts` documents that the generated
 * `tokens.css` re-declares the `--sa-*` aliases inside every
 * `[data-brand="…"]` block, and a `var()` reference resolves against the
 * cascade at the element where it's *used* — so setting `data-brand` right
 * here, on the tile, is enough to make every `var(--sa-*)` inside it
 * resolve to that mode's own values, live, with no hardcoded hex and no
 * prop threading. `aria-hidden` because the tile is decorative; the
 * accessible name for the option comes from the visible text label next to
 * it.
 */
function ColourModeMotif({
  mode,
  checked,
}: {
  mode: ColorMode;
  checked: boolean;
}) {
  return (
    <span className="ds-demodock__motif" data-brand={mode.id} aria-hidden="true">
      <span className="ds-demodock__motif-bar">
        <span className="ds-demodock__motif-dot" />
        <span className="ds-demodock__motif-dot" />
      </span>
      <span className="ds-demodock__motif-body">
        <span className="ds-demodock__motif-accent" />
        <span className="ds-demodock__motif-button" />
      </span>
      {checked && (
        <span className="ds-demodock__motif-check">
          <IconCheck />
        </span>
      )}
    </span>
  );
}

/**
 * The Colour tab's body — a labelled list of brand-palette swatches plus a
 * live component preview. Implemented as a WAI-ARIA radiogroup with a roving
 * tabindex (arrow keys move + select, Home/End jump), same as the old
 * `ColorModeSwitcher`, but each option now carries a visible text label
 * (WCAG 1.4.1 — colour is never the only signal) instead of relying on an
 * unlabelled dot.
 */
function ColourGroup({
  modes,
  mode,
  setMode,
  ariaLabel,
}: {
  modes: readonly ColorMode[];
  mode: string;
  setMode: (id: string) => void;
  ariaLabel: string;
}) {
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusAndSelect = (index: number) => {
    const next = (index + modes.length) % modes.length;
    const target = modes[next];
    if (!target) return;
    setMode(target.id);
    btnRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAndSelect(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAndSelect(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAndSelect(0);
        break;
      case "End":
        event.preventDefault();
        focusAndSelect(modes.length - 1);
        break;
      default:
        break;
    }
  };

  // Each group is its own radiogroup. A single group spanning both sections would let an
  // arrow key walk from a shipping brand into a conformance preview without the heading that
  // explains the difference ever being announced.
  const activeInGroup = modes.some((m) => m.id === mode);

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="ds-demodock__swatch-list">
      {modes.map((m, i) => {
        const checked = m.id === mode;
        return (
          <button
            key={m.id}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            // Roving tabindex: when nothing in this group is selected the first option is the
            // tab stop, so the group is always reachable by keyboard.
            tabIndex={checked || (!activeInGroup && i === 0) ? 0 : -1}
            className={cn("ds-demodock__swatch-option", checked && "is-active")}
            onClick={() => setMode(m.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <ColourModeMotif mode={m} checked={checked} />
            <span className="ds-demodock__swatch-label">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ColourTab() {
  const { mode, setMode, modes } = useColorMode();

  return (
    <div className="ds-demodock__colour">
      <ColourGroup
        modes={modes}
        mode={mode}
        setMode={setMode}
        ariaLabel="SAMAVESH brand palette"
      />

      <p className="ds-demodock__colour-note">
        Switches the SAMAVESH brand palette, not a light/dark theme. Press{" "}
        <kbd>⌘⌥C</kbd> <span aria-hidden="true">/</span>{" "}
        <kbd>Ctrl+Alt+C</kbd> to cycle it from anywhere — even with this
        panel closed.
      </p>

      {/* DBIM conformance previews, deliberately separated from the estate's own brands by a
          heading, a rule and a caveat. They are not shipping options and must not read as a
          sixth and seventh way to theme a portal: DBIM's rule is that an organisation selects
          exactly ONE primary group, MoSJE's selection is Blue, and the other five are here so
          the alternatives can be SEEN. Two of them collide with DBIM's own status palette —
          that is a finding these previews exist to surface, not a bug in this dock. */}
      <div className="ds-demodock__colour-section">
        <h3 className="ds-demodock__colour-heading">
          DBIM conformance
          <span className="ds-demodock__colour-tag">demo only</span>
        </h3>
        <p className="ds-demodock__colour-subnote">
          DBIM&rsquo;s six primary groups, transcribed from the DBIM ToolKit. Selecting one
          applies <strong>full</strong>{" "}
          DBIM conformance — the primary group, DBIM&rsquo;s four status colours, its pure
          greys, and Deep Earthy Brown body text — not just a repainted brand ramp. For
          evaluating conformance only:{" "}
          <strong>these are not in the Figma library</strong>{" "}
          and are not a shipping palette. MoSJE&rsquo;s selected group is Blue.
        </p>
        <ColourGroup
          modes={DBIM_COLOR_MODES}
          mode={mode}
          setMode={setMode}
          ariaLabel="DBIM conformance preview palette"
        />
      </div>
    </div>
  );
}

export interface DemoDockProps {
  /** Override the default estate registry, passed through to the Apps tab. */
  apps?: AppEntry[];
  /** Current hub-origin path. Drives the active app and which accounts show. */
  pathname: string | null;
  /** FAB label, and the panel's header title. @default "Demo tools" */
  label?: string;
  className?: string;
}

/**
 * DemoDock — one floating, demo-only console for the estate: app switching,
 * brand-palette preview, and demo sign-in credentials, behind a single FAB.
 */
export function DemoDock({
  apps = DEFAULT_APPS,
  pathname,
  label = "Demo tools",
  className,
}: DemoDockProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  // Whether the rail is showing its two extra doors. Held in React rather
  // than left to a `:hover` rule, because THE LEAD'S CLICK BEHAVIOUR DEPENDS
  // ON IT (see `onLeadClick`), and a CSS-only hover state is not readable
  // from an event handler.
  const [railOpen, setRailOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);
  const panelId = React.useId();
  const idBase = React.useId();

  const demoSet = React.useMemo(
    () => (pathname ? findDemoAccounts(pathname) : null),
    [pathname],
  );
  const showSignIn = Boolean(demoSet) && !!pathname && isLoginRoute(pathname);

  // Sign in, when it applies, leads — it's the reason a reviewer opens the
  // dock on a login page. Apps and Colour keep their order behind it.
  const tabs: TabDef[] = React.useMemo(() => {
    const base: TabDef[] = [
      { id: "apps", label: "Apps" },
      { id: "colour", label: "Colour" },
    ];
    return showSignIn ? [{ id: "signin", label: "Sign in" }, ...base] : base;
  }, [showSignIn]);

  // A mirror of `tabs` that `openPanel` can read without taking `tabs` as a
  // dependency — the list is rebuilt per route, and rebuilding `openPanel`
  // with it would re-arm every callback that holds it.
  const tabsRef = React.useRef<TabDef[]>(tabs);
  React.useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  // If the tabs shrink (e.g. pathname changes to a surface with no demo
  // accounts) while "Sign in" is active, fall back to the first tab rather
  // than pointing at an index that no longer exists.
  React.useEffect(() => {
    if (activeTab > tabs.length - 1) setActiveTab(0);
  }, [tabs.length, activeTab]);

  const activeNormPath = React.useMemo(
    () => matchActivePath(apps, pathname ?? ""),
    [apps, pathname],
  );
  const currentApp = React.useMemo(
    () =>
      apps.find((a) => {
        const p = a.path === "/" ? "/" : a.path.replace(/\/$/, "");
        return p === activeNormPath;
      }) ?? null,
    [apps, activeNormPath],
  );

  // Global colour-mode shortcut (⌘⌥C / Ctrl+Alt+C) — cycles to the next
  // brand palette from anywhere on the page, whether the dock is open or
  // closed. Matches the shape UX4G's own accessibility widget already uses
  // for ⌘⌥A / Ctrl+Alt+A, so the two never collide. Keyed off `event.code`
  // rather than `event.key` so it's layout-stable (Option+C types "ç" on a
  // US Mac layout, but its `code` is still "KeyC"). The strongest demo
  // moment — re-toning the whole page live — needs the panel out of the
  // way, which is exactly what no in-panel control can offer.
  const { mode: colorMode, setMode: setColorMode, modes: colorModes } = useColorMode();
  const colourAnnouncer = useLiveRegion();
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "KeyC" || !event.altKey) return;
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.repeat) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      const index = colorModes.findIndex((m) => m.id === colorMode);
      const next = colorModes[(index + 1) % colorModes.length];
      if (!next) return;
      setColorMode(next.id);
      colourAnnouncer.announce(`Colour mode: ${next.label}`);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [colorMode, colorModes, setColorMode, colourAnnouncer]);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const closePanel = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    if (reduceMotion) {
      setClosing(false);
      return;
    }
    // Keep the panel mounted for the exit animation (see demo-dock.css
    // `.is-closing`), then remove it from the DOM.
    setClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
  }, []);

  // Targets a tab by ID, never by index, because the tab LIST changes shape:
  // Sign in is prepended on login routes, so index 0 is "Sign in" there and
  // "Apps" everywhere else. A door that wants Colour has to ask for Colour by
  // name or it lands on whatever happens to occupy that slot on this route.
  const openPanel = React.useCallback((tabId?: string) => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    setClosing(false);
    setActiveTab(() => {
      if (!tabId) return 0;
      const index = tabsRef.current.findIndex((t) => t.id === tabId);
      return index === -1 ? 0 : index;
    });
    setOpen(true);
  }, []);

  /**
   * The lead's click rule, and it is about STATE rather than about the
   * device: **if the rail is not expanded, expand it; otherwise open the
   * panel.**
   *
   * That one sentence covers both input models without testing for either.
   * A pointer user's hover has already expanded the rail, so their click
   * falls straight through to the panel — one click, exactly as the old FAB
   * behaved. A touch user has no hover, so their first tap expands (what a
   * disclosure is expected to do) and the second reaches the panel.
   *
   * The alternative was branching on `pointerType`, which is the same
   * behaviour expressed as a device test — and device tests are wrong on
   * hybrids, where a touchscreen laptop is both at once.
   */
  const onLeadClick = React.useCallback(() => {
    if (open) {
      closePanel();
      return;
    }
    if (!railOpen) {
      setRailOpen(true);
      return;
    }
    openPanel();
  }, [open, railOpen, closePanel, openPanel]);

  /**
   * Hover and focus are TWO INDEPENDENT HOLDS on the rail, not one flag, and
   * conflating them is a real defect rather than a tidiness question. The
   * first version had each handler set `railOpen` directly, which broke both
   * ways round:
   *
   * - Focus a door, then move the mouse away: `pointerleave` set the flag
   *   false and **collapsed the rail out from under a keyboard user**, with
   *   their focused control still inside it. Caught by driving real, trusted
   *   events — a programmatic `.focus()` fires nothing at all in a tab
   *   without OS focus, so the synthetic tests had reported this as passing.
   * - The mirror: blur while the mouse is still over the rail collapsed it,
   *   and hovering could not reopen it, because the pointer was already
   *   inside and no fresh `pointerenter` was coming.
   *
   * So each input keeps its own latch and the rail is open while EITHER
   * holds. Refs rather than state because only the derived value needs to
   * render.
   */
  const hoverHeldRef = React.useRef(false);
  const focusHeldRef = React.useRef(false);
  const syncRail = React.useCallback(() => {
    setRailOpen(hoverHeldRef.current || focusHeldRef.current);
  }, []);

  // Only for a pointer that genuinely hovers. A touch `pointerenter` fires on
  // tap and would expand the rail underneath the very tap meant to expand it,
  // collapsing the two-step in `onLeadClick` into one ambiguous step.
  const onPointerEnter = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "touch") return;
      hoverHeldRef.current = true;
      syncRail();
    },
    [syncRail],
  );

  const onPointerLeave = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "touch") return;
      hoverHeldRef.current = false;
      syncRail();
    },
    [syncRail],
  );

  const onRailFocus = React.useCallback(() => {
    focusHeldRef.current = true;
    syncRail();
  }, [syncRail]);

  // `relatedTarget` is the element focus is moving TO, so a move between the
  // lead and a door must not release the focus latch mid-traversal.
  const onRailBlur = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget as Node | null;
      if (next && event.currentTarget.contains(next)) return;
      focusHeldRef.current = false;
      syncRail();
    },
    [syncRail],
  );

  const shouldRender = open || closing;

  // Close on outside click + Escape.
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        closePanel();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closePanel]);

  // Tab focus trap inside the dialog panel.
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closePanel();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button:not([disabled]), [href], input, [tabindex='0']",
    );
    if (!focusables || focusables.length === 0) return;
    const list = Array.from(focusables);
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const activeTabId = tabs[activeTab]?.id ?? "apps";

  return (
    <div ref={rootRef} className={cn("ds-demodock", className)}>
      {/* Always mounted (not just while the panel is open) so the global
          colour-mode shortcut can announce a change even with the dock
          closed — that's the whole point of the shortcut. */}
      <LiveRegion ref={colourAnnouncer.ref} />
      {shouldRender && (
        <div
          ref={panelRef}
          className={cn("ds-demodock__panel", closing && !open && "is-closing")}
          id={panelId}
          role="dialog"
          aria-label={label}
          aria-modal="false"
          onKeyDown={onPanelKeyDown}
        >
          <div className="ds-demodock__header">
            <div className="ds-demodock__header-row">
              <div className="ds-demodock__title-group">
                <span className="ds-demodock__badge" aria-hidden="true">
                  <FlaskIcon />
                </span>
                <span className="ds-demodock__title-text">
                  <span className="ds-demodock__title">{label}</span>
                  <span className="ds-demodock__current">
                    <span className="ds-demodock__current-label">
                      Currently in
                    </span>{" "}
                    <span className="ds-demodock__current-name">
                      {currentApp?.name ?? "Unknown"}
                    </span>
                  </span>
                </span>
              </div>
              <button
                type="button"
                className="ds-demodock__close"
                onClick={closePanel}
                aria-label={`Close ${label}`}
              >
                <IconClose />
              </button>
            </div>

            <div className="ds-demodock__tabs">
              <Tabs
                tabs={tabs}
                active={activeTab}
                onChange={setActiveTab}
                idBase={idBase}
                ariaLabel={label}
              />
            </div>
          </div>

          <div className="ds-demodock__body">
            {activeTabId === "signin" && demoSet && (
              <TabPanel idBase={idBase} tabId="signin">
                <DemoAccountsPanel
                  accounts={demoSet.accounts}
                  idLabel={demoSet.idLabel}
                  onUse={closePanel}
                />
              </TabPanel>
            )}
            {activeTabId === "apps" && (
              <TabPanel idBase={idBase} tabId="apps">
                <AppSwitcherPanel
                  apps={apps}
                  pathname={pathname}
                  onNavigate={closePanel}
                  showCurrentApp={false}
                />
              </TabPanel>
            )}
            {activeTabId === "colour" && (
              <TabPanel idBase={idBase} tabId="colour">
                <ColourTab />
              </TabPanel>
            )}
          </div>
        </div>
      )}

      {/* ── The folding rail ──────────────────────────────────────────
          At rest a tab: the flask, plus a vertical wordmark that says what
          this is without being touched. Engaged, it unfolds downward into
          three doors. One object in two states, not two widgets sharing an
          edge.

          THE FLASK IS THE ANCHOR and must not move across the fold. Two
          things secure that, and both were settled by measuring a prototype
          rather than by eye:

          - The container is anchored by its `top`, not centred, so
            everything the fold adds appears BELOW the flask. Centred, the
            flask slides upward as the rail grows, and the object reads as
            jumping rather than opening.
          - The width is CONSTANT. The prototype grew 48 → 58 on unfold;
            because the container is right-anchored and centres its
            children, that slid the flask 5px LEFT. The width change bought
            a faint "engaged" signal and cost the anchor, so the shadow
            carries that signal instead.

          The wordmark collapses as the drawer expands, so the rail grows
          52x105 -> 52x153, a net 48px — the label pays for most of the
          drawer, and it sits below the flask, so giving up its space costs
          the anchor nothing. All three numbers are measured in the browser,
          not derived on paper.

          All three doors open the SAME panel, pre-selected. That is the
          win over the old single FAB: Colour drops from two clicks to one,
          which matters because re-toning the page live is the most-used
          action in a demo — the ⌘⌥C shortcut exists to work around exactly
          that cost. */}
      <div
        className={cn("ds-demodock__rail", railOpen && "is-open")}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onRailFocus}
        onBlur={onRailBlur}
      >
        <button
          ref={triggerRef}
          type="button"
          className="ds-demodock__lead"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={label}
          onClick={onLeadClick}
        >
          <span className="ds-demodock__cell">
            <FlaskIcon size={26} />
          </span>
          {/* Decorative. The accessible name is the button's `aria-label`,
              so this must never be the sole source of it — it collapses to
              zero height on unfold, and an accessible name that disappears
              on hover would be a defect. */}
          <span className="ds-demodock__word" aria-hidden="true">
            {label.split(" ")[0]}
          </span>
        </button>

        <div className="ds-demodock__drawer">
          <span className="ds-demodock__rule" aria-hidden="true" />
          <button
            type="button"
            className="ds-demodock__door"
            aria-haspopup="dialog"
            aria-label="Colour mode"
            onClick={() => openPanel("colour")}
          >
            <span className="ds-demodock__swatch" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="ds-demodock__door"
            aria-haspopup="dialog"
            aria-label="Switch app"
            onClick={() => openPanel("apps")}
          >
            <span className="ds-demodock__apps" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
