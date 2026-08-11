"use client";

/**
 * SAMAVESH Design System — DemoDock
 *
 * DEMO-ONLY component. The single floating widget that replaces the
 * AppSwitcher's colour swatches and every hand-rolled `DemoFab` — one FAB,
 * bottom-right (docked above the UX4G accessibility widget — see the
 * "Placement" note further down), that opens a tabbed panel:
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
 * **Placement — bottom-right, docked directly above the UX4G accessibility
 * widget.** This used to be bottom-left, mirroring the retired
 * `AppSwitcher`. It moved for two reasons (see
 * `docs/superpowers/specs/` / the placement report for the fuller writeup):
 *
 * 1. Bottom-left is where `PortalLoginShell` pins its "Signing Into" strip
 *    (see that file). The two used to collide on NMBA's login routes, and
 *    the fix was a manual per-registry-entry boolean on `DemoAccountSet`
 *    that raised the FAB — an opt-in a future portal could easily forget,
 *    and one that made the FAB visibly relocate between routes
 *    ("cheap"-looking, per design review). Moving the FAB to the corner
 *    nothing else uses eliminates the collision at the source instead of
 *    reacting to it: there is nothing left bottom-left for anything to opt
 *    into, so that flag is gone rather than replaced.
 * 2. Bottom-right already has a fixed, 70px, official government control
 *    (`UX4GAccessibilityWidget`) that this estate must not resize, restyle
 *    the geometry of, or otherwise fight (see that file's own doc comment).
 *    Sitting a SECOND, unrelated FAB in the opposite corner at a different
 *    size and a different edge offset read as two accidental widgets, not
 *    one considered pair. Docking DemoDock directly above it — same right
 *    edge, a fixed gap, DemoDock's own established 44px size kept — reads
 *    as one coordinated utility rail instead, and gives every route the
 *    exact same FAB position: nothing here is ever obstructed by page
 *    furniture, because nothing else in this codebase renders bottom-right.
 *
 * The gap above the widget is measured live (see the effect below) rather
 * than hardcoded, so a vendor change to the widget's own size doesn't
 * silently reintroduce an overlap — the same "derive it, don't remember it"
 * principle that dropping the old opt-in flag was about, just aimed at a
 * widget this estate doesn't control instead of a strip it does.
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

import "./demo-dock.css";

// Matches --ds-duration-fast (150ms, see tokens.css). Kept in sync by hand —
// there is no runtime token reader in this dependency-free package — so the
// exit animation (CSS) and the DOM-removal delay (this constant) agree on
// how long the closing panel stays mounted.
const CLOSE_ANIMATION_MS = 150;

// The UX4G accessibility widget's own trigger id — stable across its v1.15 →
// v3.28 upgrade (see `ux4g-accessibility-widget.tsx`'s doc comment, which
// relies on the same id surviving a full class-namespace rename). Used only
// to MEASURE the widget, never to alter it.
const UX4G_TRIGGER_ID = "uw-widget-custom-trigger";
// Breathing room between DemoDock and the widget it docks above.
const DOCK_GAP_PX = 14;
// The widget script injects its markup asynchronously; retry for up to
// ~4.5s (30 × 150ms) before settling on the CSS fallback in demo-dock.css.
const UX4G_TRIGGER_POLL_MS = 150;
const UX4G_TRIGGER_MAX_ATTEMPTS = 30;

const IconFlask = () => (
  <svg
    className="ds-demodock__fab-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 2v7.31" />
    <path d="M14 9.3V1.99" />
    <path d="M8.5 2h7" />
    <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    <path d="M5.52 16h12.96" />
  </svg>
);

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
    stroke="var(--ds-on-primary)"
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
 * `tokens.css` re-declares the `--ds-*` aliases inside every
 * `[data-brand="…"]` block, and a `var()` reference resolves against the
 * cascade at the element where it's *used* — so setting `data-brand` right
 * here, on the tile, is enough to make every `var(--ds-*)` inside it
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
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);
  const panelId = React.useId();
  const idBase = React.useId();

  // Dock the FAB directly above the UX4G accessibility widget's trigger,
  // measured live rather than hardcoded — see the component doc comment.
  // The widget's script injects its markup asynchronously (its own file
  // documents the same "wait for late DOM" shape via `relabelMacShortcut`),
  // so this polls briefly rather than assuming the element exists on mount.
  // `--ds-demodock-bottom` is read by `.ds-demodock` in demo-dock.css, which
  // also carries a fallback for the (today, only theoretical) case where the
  // widget never appears — a CDN block, a future zone without it — so the
  // FAB still lands in a sensible spot rather than at `bottom: 0`.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    let attempts = 0;
    let timer: number | undefined;
    const measure = () => {
      const trigger = document.getElementById(UX4G_TRIGGER_ID);
      if (trigger) {
        const rect = trigger.getBoundingClientRect();
        const bottom = Math.round(window.innerHeight - rect.top + DOCK_GAP_PX);
        root.style.setProperty("--ds-demodock-bottom", `${bottom}px`);
        return;
      }
      if (attempts++ < UX4G_TRIGGER_MAX_ATTEMPTS) {
        timer = window.setTimeout(measure, UX4G_TRIGGER_POLL_MS);
      }
    };
    measure();
    // Defensive re-measure — the widget's own geometry is fixed-px and does
    // not respond to viewport resize today, but re-checking costs nothing
    // and means a future upstream change can't silently drift the two apart.
    window.addEventListener("resize", measure);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, []);

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

  const openPanel = React.useCallback(() => {
    if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    setClosing(false);
    setActiveTab(0);
    setOpen(true);
  }, []);

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
                  <IconFlask />
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

      <button
        ref={triggerRef}
        type="button"
        className="ds-demodock__fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        {/* Label precedes the icon in the DOM (icon renders last/rightmost,
            pinned to the button's fixed right edge via `justify-content:
            flex-end` in the CSS) so the hover-reveal grows LEFTWARD, away
            from the fixed right corner, instead of the icon itself
            drifting. Visual only — the button's accessible name comes from
            `aria-label` above, so the reveal-on-hover label is never the
            sole source of the name (it stays hidden from assistive tech at
            every width, not just when collapsed). */}
        <span className="ds-demodock__fab-label" aria-hidden="true">
          {label}
        </span>
        <IconFlask />
      </button>
    </div>
  );
}
