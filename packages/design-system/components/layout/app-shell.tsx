"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { SideSheet } from "../feedback/side-sheet";
import "./layout.css";

export interface AppShellProps {
  /** The masthead. Pass `<SiteHeader variant="portal" />`. */
  header: React.ReactNode;
  /** Left navigation. Pass `<SidebarNav />`. Omit for a portal page with no nav. */
  sidebar?: React.ReactNode;
  /** Page content. Rendered inside the shell's single `<main>`. */
  children: React.ReactNode;
  /** Optional slim footer below the body row. */
  footer?: React.ReactNode;
  /**
   * Render a skeleton instead of `children`. Use it while an app hydrates or
   * loads the first payload — it replaces the `return null` each portal used to
   * write, which flashes a blank page.
   */
  pending?: boolean;
  /**
   * Whether the mobile navigation drawer is open. Below the tablet anchor the
   * sidebar is a drawer rather than a column, because a narrowed column leaves
   * the labels unreadable. Ignored above that width.
   */
  sidebarOpen?: boolean;
  /** Called when the drawer asks to close (backdrop, Escape, close button). */
  onSidebarOpenChange?: (open: boolean) => void;
  /** Title for the mobile drawer. @default "Navigation" */
  sidebarLabel?: string;
  /** `id` for the `<main>`, used as the skip-link target. @default "main" */
  mainId?: string;
  className?: string;
}

/**
 * AppShell — the portal page skeleton: chrome, sidebar, content.
 *
 * Chrome rows are `auto` and the body row is `1fr`, so **nothing subtracts a
 * chrome height from the viewport**. That matters because the brand row hugs
 * its content — a two-line lockup, a BETA badge or an account block all move
 * it — so any `calc(100vh - <constant>)` is wrong by construction, not merely
 * off by a few pixels.
 *
 * Presentational only: no store, no router, no redirect. Keep an auth guard as
 * a thin wrapper around it and use `pending` for the loading frame.
 *
 * Use it for every signed-in portal page. Do NOT use it for a login screen —
 * that is `PortalLoginShell`, which has no sidebar and no session.
 */
export function AppShell({
  header,
  sidebar,
  children,
  footer,
  pending = false,
  sidebarOpen = false,
  onSidebarOpenChange,
  sidebarLabel = "Navigation",
  mainId = "main",
  className,
}: AppShellProps): React.JSX.Element {
  return (
    <div className={cn("sa-app-shell", className)}>
      {header}

      <div className="sa-app-shell__body">
        {/* A plain wrapper on purpose: SidebarNav renders its own <aside>
            landmark, and nesting a second one duplicates it for screen readers. */}
        {sidebar ? <div className="sa-app-shell__sidebar">{sidebar}</div> : null}

        <main id={mainId} className="sa-app-shell__main" tabIndex={-1}>
          {pending ? (
            <div className="sa-app-shell__pending" aria-hidden="true">
              <div className="sa-app-shell__pending-bar" />
              <div className="sa-app-shell__pending-block" />
            </div>
          ) : (
            children
          )}
          {pending ? <span className="ds-sr-only">Loading</span> : null}
        </main>
      </div>

      {footer}

      {/* Below the tablet anchor the same nav is offered as a drawer. */}
      {sidebar ? (
        <SideSheet
          open={sidebarOpen}
          onClose={() => onSidebarOpenChange?.(false)}
          side="left"
          size="sm"
          title={sidebarLabel}
        >
          {sidebar}
        </SideSheet>
      ) : null}
    </div>
  );
}
