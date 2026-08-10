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
 * - **Colour** — the SAMAVESH brand-palette picker (`ColorModeSwitcher`).
 *   This is NOT a light/dark toggle; the panel says so explicitly.
 * - **Sign in** — the demo credentials table for whatever login surface
 *   `pathname` resolves to (`findDemoAccounts`). Absent entirely — not
 *   rendered empty — when the current path has no registered accounts.
 *
 * Requires a `<ColorModeProvider>` ancestor: the Colour tab renders
 * `ColorModeSwitcher`, which reads `useColorMode()` and throws outside one.
 *
 * Owns only the floating shell — FAB, open/close state, outside-click +
 * Escape handling, the focus trap, and which tab is active. Behaviour is
 * ported from `AppSwitcher` (`zone-switcher.tsx`): fixed bottom-left at
 * 20px, Escape closes, outside-click closes, focus returns to the FAB on
 * close. Opening always starts on the Apps tab — no remembered tab.
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
import { ColorModeSwitcher } from "../foundations/color-mode-switcher";
import { DemoAccountsPanel } from "./demo-accounts-panel";
import { findDemoAccounts } from "./demo-accounts";

import "./demo-dock.css";

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
  const [activeTab, setActiveTab] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();
  const idBase = React.useId();

  const demoSet = React.useMemo(
    () => (pathname ? findDemoAccounts(pathname) : null),
    [pathname],
  );

  const tabs: TabDef[] = React.useMemo(() => {
    const base: TabDef[] = [
      { id: "apps", label: "Apps" },
      { id: "colour", label: "Colour" },
    ];
    if (demoSet) base.push({ id: "signin", label: "Sign in" });
    return base;
  }, [demoSet]);

  // If the tabs shrink (e.g. pathname changes to a surface with no demo
  // accounts) while "Sign in" is active, fall back to Apps rather than
  // pointing at an index that no longer exists.
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

  const closePanel = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openPanel = React.useCallback(() => {
    setActiveTab(0);
    setOpen(true);
  }, []);

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
      {open && (
        <div
          ref={panelRef}
          className="ds-demodock__panel"
          id={panelId}
          role="dialog"
          aria-label={label}
          aria-modal="false"
          onKeyDown={onPanelKeyDown}
        >
          <div className="ds-demodock__header">
            <div className="ds-demodock__header-row">
              <div className="ds-demodock__title-group">
                <span className="ds-demodock__title">{label}</span>
                <span className="ds-demodock__current">
                  <span className="ds-demodock__current-label">
                    Currently in
                  </span>{" "}
                  <span className="ds-demodock__current-name">
                    {currentApp?.name ?? "Unknown"}
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
            {activeTabId === "apps" && (
              <TabPanel idBase={idBase} tabId="apps">
                <AppSwitcherPanel
                  apps={apps}
                  pathname={pathname}
                  onNavigate={closePanel}
                />
              </TabPanel>
            )}
            {activeTabId === "colour" && (
              <TabPanel idBase={idBase} tabId="colour">
                <div className="ds-demodock__colour">
                  <ColorModeSwitcher />
                  <p className="ds-demodock__colour-note">
                    This switches the SAMAVESH brand palette, not a
                    light/dark theme.
                  </p>
                </div>
              </TabPanel>
            )}
            {activeTabId === "signin" && demoSet && (
              <TabPanel idBase={idBase} tabId="signin">
                <DemoAccountsPanel
                  accounts={demoSet.accounts}
                  idLabel={demoSet.idLabel}
                  onUse={closePanel}
                />
              </TabPanel>
            )}
          </div>

          <div className="ds-demodock__footer">
            Demo tooling — not part of the product
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
