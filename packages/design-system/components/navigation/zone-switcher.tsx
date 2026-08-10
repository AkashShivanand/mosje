"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { AppEntry, DEFAULT_APPS } from "./app-switcher-utils";
import { AppSwitcherPanel } from "./app-switcher-panel";

import "./zone-switcher.css";

export interface AppSwitcherProps {
  /** Override the default estate registry. */
  apps?: AppEntry[];
  /**
   * @deprecated No longer does anything, and safe to remove from call sites.
   *
   * This used to hide a "Dev" section holding the design system and Storybook.
   * They are now in "Resources" and always shown: the people who most need to
   * check what a component is meant to do — BAs, QAs, designers — never run a
   * dev build, so gating those two on NODE_ENV hid them from exactly the wrong
   * audience. Kept as a no-op so existing callers keep compiling.
   */
  devMode?: boolean;
  /** FAB label text. @default "Apps" */
  label?: string;
  className?: string;
}

/**
 * SAMAVESH AppSwitcher — searchable cross-zone control panel.
 *
 * Renders a fixed FAB (bottom-left) that opens a panel with:
 * - Current app indicator (header, always visible)
 * - Search bar (/ shortcut focuses it while panel is open)
 * - Grouped list: Website → Portals → Dev (dev-only, hidden in prod)
 *
 * The panel body itself is `AppSwitcherPanel`; this component owns only the
 * floating shell — the FAB, open/close state, outside-click + Escape
 * handling, and the focus trap.
 *
 * Does not need a <ColorModeProvider> — it has no colour-mode UI of its own.
 * (`DemoDock` is the shell that renders colour-mode swatches alongside this
 * panel's content; it needs one.)
 * Uses plain <a href> links so navigation works from inside any basePath-ed zone.
 */
export function AppSwitcher({
  apps = DEFAULT_APPS,
  devMode = false,
  label = "Apps",
  className,
}: AppSwitcherProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [pathname, setPathname] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  // Client-only pathname — avoids SSR mismatch.
  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const closePanel = React.useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
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

  return (
    <div ref={rootRef} className={cn("ds-appsw", className)}>
      {open && (
        <div
          ref={panelRef}
          className="ds-appsw__panel"
          id={panelId}
          role="dialog"
          aria-label="App switcher"
          aria-modal="false"
          onKeyDown={onPanelKeyDown}
        >
          <AppSwitcherPanel
            apps={apps}
            pathname={pathname}
            onNavigate={closePanel}
          />
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="ds-appsw__fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="ds-appsw__fab-icon"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
    </div>
  );
}
