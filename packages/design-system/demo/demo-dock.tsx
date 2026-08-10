"use client";

/**
 * SAMAVESH Design System — DemoDock
 *
 * DEMO-ONLY component. The single floating widget that replaces the
 * AppSwitcher's colour swatches and every hand-rolled `DemoFab` — one FAB,
 * bottom-left, that opens a tabbed panel:
 *
 * - **Apps** — the same searchable cross-zone list as `AppSwitcher`
 *   (`AppSwitcherPanel`), so a stakeholder never has to leave the dock to
 *   jump between portals.
 * - **Colour** — a row of brand-palette swatches, driven directly by
 *   `useColorMode()`. Clicking a swatch applies that mode immediately —
 *   there is no separate switcher component (the old `ColorModeSwitcher`
 *   was retired; this is its replacement, with the label chrome and
 *   pill-track background stripped out).
 * - **Sign in** — the demo credentials table for whatever login route
 *   `pathname` resolves to (`findDemoAccounts`, gated by `isLoginRoute`).
 *   Present, and ordered *first*, only when `pathname` is itself a login
 *   route — not merely somewhere under a portal that has one. Absent
 *   entirely — not rendered empty — everywhere else.
 *
 * Requires a `<ColorModeProvider>` ancestor: the Colour tab calls
 * `useColorMode()`, which throws outside one.
 *
 * Owns only the floating shell — FAB, open/close state, outside-click +
 * Escape handling, the focus trap, and which tab is active. Behaviour is
 * ported from `AppSwitcher` (`zone-switcher.tsx`): fixed bottom-left at
 * 20px, Escape closes, outside-click closes, focus returns to the FAB on
 * close. Opening always starts on the first tab — Sign in when the current
 * route is a login route, Apps otherwise — never a remembered tab.
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
import { useColorMode } from "../foundations/color-mode-provider";
import { DemoAccountsPanel } from "./demo-accounts-panel";
import { findDemoAccounts, isLoginRoute } from "./demo-accounts";

import "./demo-dock.css";

// Matches --ds-duration-fast (150ms, see tokens.css). Kept in sync by hand —
// there is no runtime token reader in this dependency-free package — so the
// exit animation (CSS) and the DOM-removal delay (this constant) agree on
// how long the closing panel stays mounted.
const CLOSE_ANIMATION_MS = 150;

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
 * The Colour tab's body — a plain row of brand-palette swatches, nothing
 * else. Implemented as a WAI-ARIA radiogroup with a roving tabindex (arrow
 * keys move + select, Home/End jump) so it keeps the accessibility the old
 * `ColorModeSwitcher` had, without any of its visible label or track chrome.
 */
function ColourSwatches() {
  const { mode, setMode, modes } = useColorMode();
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

  return (
    <div className="ds-demodock__colour">
      <div
        role="radiogroup"
        aria-label="Colour mode"
        className="ds-demodock__swatch-row"
      >
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
              aria-label={m.label}
              tabIndex={checked ? 0 : -1}
              title={m.label}
              className={cn("ds-demodock__swatch", checked && "is-active")}
              style={{ background: m.swatch }}
              onClick={() => setMode(m.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {checked && <IconCheck />}
            </button>
          );
        })}
      </div>
      <p className="ds-demodock__colour-note">
        Switches the SAMAVESH brand palette, not a light/dark theme.
      </p>
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
                <ColourSwatches />
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
        onClick={() => (open ? closePanel() : openPanel())}
      >
        <IconFlask />
        {label}
      </button>
    </div>
  );
}
