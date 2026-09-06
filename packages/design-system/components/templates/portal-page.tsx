"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { AppShell } from "../layout/app-shell";
import { SidebarNav } from "../navigation/sidebar";
import type { SidebarNavGroup, SidebarNavIdentity, SidebarNavItem } from "../navigation/sidebar";
import "./screen-templates.css";

/**
 * The audiences a portal signs in, reused as the axis a screen varies on.
 *
 * The same three the login template already publishes (`PortalAudience`), plus
 * the two the estate's built portals actually distinguish inside a session:
 * an officer who reads and an officer who decides. Sixteen hand-rolled shells
 * across eight portals name themselves `admin`, `citizen`, `public`, `user`,
 * `ngo`, `review`, `console` and `tc` — five vocabularies for these five roles.
 *
 * Do not add a sixth. A portal that seems to need one is renaming, not adding —
 * the same rule `PortalAudience` states, for the same reason.
 */
export type PortalRole = "public" | "citizen" | "organisation" | "officer" | "admin";

/**
 * A nav item that knows who may see it.
 *
 * A superset of `SidebarNavItem` rather than a change to it: the rail does not
 * need to know about roles, and giving it that knowledge would put an
 * authorisation concept inside a presentational component.
 */
export interface PortalNavItem extends SidebarNavItem {
  /**
   * Roles this item is shown to. Omit and every role sees it.
   *
   * **This is not authorisation.** Hiding a link does not protect the route
   * behind it — the server does that. It exists so a citizen is not shown a
   * rail full of destinations that will refuse them, which is the difference
   * between a portal that seems small and one that seems broken.
   */
  roles?: PortalRole[];
}

export interface PortalNavGroup extends Omit<SidebarNavGroup, "items"> {
  items: PortalNavItem[];
}

/**
 * Drop the items this role may not see, and then the groups that emptied.
 *
 * A group label standing over nothing is worse than no group — it reads as a
 * section that failed to load.
 */
export function navForRole(groups: PortalNavGroup[], role: PortalRole): SidebarNavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

export interface PortalPageProps {
  /**
   * The portal's slug. Sets `data-portal`, which is how the estate re-binds a
   * portal's palette — see the contract at the top of `apps/hub/src/app/globals.css`.
   */
  portal: string;
  /** The viewer's role. Filters the rail and is published as `data-role`. */
  role: PortalRole;
  /** The masthead. Pass `<SiteHeader variant="portal" … />`. */
  header: React.ReactNode;
  /** The rail's groups, before role filtering. Omit for a portal with no rail. */
  nav?: PortalNavGroup[];
  /** The current path, for the rail's active state. */
  pathname?: string;
  /** The organisation block at the top of the rail. */
  identity?: SidebarNavIdentity;
  /** A slim footer under the body row. */
  footer?: React.ReactNode;
  /**
   * Start with the rail collapsed to its 88px icon rail.
   *
   * **Two widths exist and only two.** The handoff draws 300, 88, 268, 260 and
   * 280 for one page type; only the first two are decisions and the other three
   * are drift, all inside SHRESHTA. See
   * `docs/audit/figma-handoff-defects-2026-09-06.md` §2.1.
   * @default false
   */
  defaultCollapsed?: boolean;
  /** Render a skeleton instead of `children`, while the app hydrates. */
  pending?: boolean;
  /** `id` for the `<main>`, and the skip link's target. @default "main" */
  mainId?: string;
  /** The screen. One Tier-B template. */
  children: React.ReactNode;
  className?: string;
}

/**
 * PortalPage — Tier A, the only chrome a signed-in portal screen needs.
 *
 * It replaces the **sixteen hand-rolled shells** the estate carried across eight
 * portals — `admin-shell` four times, `citizen-shell` twice, plus `public-`,
 * `user-`, `ngo-`, `review-`, `console-` and `tc-shell` — **none of which
 * imported `AppShell`**, though `AppShell` had shipped and was documented.
 *
 * What it adds over `AppShell`, which is exactly what those sixteen each wired
 * by hand and each wired slightly differently:
 *
 * | | |
 * |---|---|
 * | `data-portal` | the palette re-bind every portal needs and several forgot |
 * | the rail's two widths | one CSS variable, two values, no third |
 * | role-filtered nav | so a citizen is not shown an officer's destinations |
 * | the mobile drawer | `sidebarOpen` state, wired once rather than eight times |
 *
 * It is **presentational**: no store, no router, no redirect, no session. Keep
 * an auth guard as a thin wrapper around it, exactly as `AppShell` asks.
 *
 * Do not use it for a login screen — that is `PortalLoginTemplate`, which has no
 * rail and no session.
 */
export function PortalPage({
  portal,
  role,
  header,
  nav,
  pathname = "",
  identity,
  footer,
  defaultCollapsed = false,
  pending = false,
  mainId = "main",
  children,
  className,
}: PortalPageProps): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  /* Filtered here rather than in the caller so every portal filters the same
     way. Unconditional, so the hook order never changes with the nav. */
  const groups = React.useMemo(
    () => (nav ? navForRole(nav, role) : []),
    [nav, role],
  );

  /* The rail closes when the route changes. Without this, a citizen who taps a
     destination on a phone lands on the new page with the drawer still over it
     and has to dismiss the navigation they just used. */
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const sidebar =
    groups.length > 0 ? (
      <SidebarNav
        groups={groups}
        pathname={pathname}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseControl
        identity={identity}
      />
    ) : undefined;

  return (
    <div
      className={cn("sa-portal-page", className)}
      data-portal={portal}
      data-role={role}
      /* The rail's width is one variable with two values. `data-rail` is what
         the stylesheet keys off, so nothing downstream computes a width. */
      data-rail={collapsed ? "collapsed" : "expanded"}
    >
      <AppShell
        header={header}
        sidebar={sidebar}
        footer={footer}
        pending={pending}
        mainId={mainId}
        sidebarOpen={drawerOpen}
        onSidebarOpenChange={setDrawerOpen}
        sidebarLabel={identity ? `${identity.name} navigation` : "Portal navigation"}
      >
        {children}
      </AppShell>
    </div>
  );
}
