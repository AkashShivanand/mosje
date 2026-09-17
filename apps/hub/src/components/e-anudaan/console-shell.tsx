"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader, OrgLogo, PortalPage, StatusScreen, type PortalNavGroup } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ServiceErrorNotice, useFailureOnLoad } from "./service-error";
import { ROLES, consoleRouteAccess } from "@/lib/e-anudaan/roles";
import { notificationItems, notificationsHref } from "@/lib/e-anudaan/notifications";

/**
 * Authenticated shell for the 12 officer roles — a wrapper around `PortalPage`.
 *
 * The rail's items come from the ROLE rather than from `PortalNavItem.roles`:
 * each of the twelve officers has its own `nav` in `roles.ts`, which is a finer
 * distinction than `PortalRole` draws and the right one to keep. `PortalRole`
 * says what KIND of viewer this is — `officer` — which is what the palette and
 * any role-varying screen inside it reads.
 *
 * Three things this gained by moving off a hand-assembled shell:
 *
 * **It no longer returns `null` while the session resolves.** That flashed a
 * blank page and then reflowed the whole layout when the store hydrated.
 * `pending` keeps the shell on screen with a skeleton in it, which is the
 * pattern that prop exists for.
 *
 * **Navigation on a phone.** The rail carried `hidden md:flex` and the
 * masthead's button drove the desktop rail's collapsed state, so below the
 * tablet anchor an officer had a menu button that collapsed a rail they could
 * not see, and no way to reach another screen.
 *
 * **`data-portal`**, which the palette re-bind reads and this shell never set.
 *
 * **The route agrees with the sidebar.** The rail showed each officer only their own screens,
 * but any officer could type another's address and use it — the ASO opened the Sanction Desk and
 * scheduled a PMU inspection (security audit S06, 14 Sep 2026). `consoleRouteAccess` decides from
 * the same `caps` and `nav` the rail is built from; a screen belonging to another role renders
 * the 403 status screen, and an address naming no screen the 404, both inside the chrome.
 *
 * **An NGO that opens a console address is refused, not signed out** (audit N-17). It was sent to
 * the officer login, which read as a lost session and cost the clerk their place. It now gets the
 * same 403 an officer gets for another role's screen, with the way back to the NGO dashboard.
 */
export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout, markAllNotificationsRead } = useEAnudaan();
  /** Any signed-in page: the session can end, or the role be refused, on the next request (error-catalogue.ts). */
  const [sessionFailure, clearSessionFailure] = useFailureOnLoad("session", pathname);

  const isOfficer = state.session !== null && state.session !== "ngo";
  const isNgo = state.session === "ngo";
  const role = isOfficer ? ROLES[state.session!] : null;

  const notifications = React.useMemo(() => notificationItems(state, role?.id ?? null), [state, role]);

  /* Unconditional, so the hook order never changes with the session. */
  const nav = React.useMemo<PortalNavGroup[]>(
    () => (role ? [{ items: role.nav }] : []),
    [role],
  );

  React.useEffect(() => {
    if (hydrated && !isOfficer && !isNgo) router.replace("/portals/e-anudaan/login?role=officer");
  }, [hydrated, isOfficer, isNgo, router]);

  // `consoleRouteAccess` refuses the NGO every console screen; its role carries its own home.
  const viewer = role ?? (isNgo ? ROLES.ngo : null);
  const access = viewer ? consoleRouteAccess(pathname, viewer) : "allowed";
  const toDashboard = { label: "Go to My Dashboard", onClick: () => viewer && router.push(viewer.home) };

  return (
    <PortalPage
      portal="e-anudaan"
      role="officer"
      pathname={pathname}
      nav={nav}
      /* The masthead's skip link resolves to `#main`, which is this default —
         the two must agree or the link points at nothing. */
      mainId="main"
      identity={{
        name: "E-Anudaan",
        // Non-breaking hyphens (U+2011): a narrow rail broke the name as "Grant-" / "in-Aid".
        expansion: "Grant\u2011in\u2011Aid Management",
        mark: <OrgLogo path="/portals/e-anudaan" />,
        href: "/portals/e-anudaan",
      }}
      pending={!hydrated || !viewer}
      /* A function, so the masthead drives the rail: above the tablet anchor its
         button collapses the column, below it opens the drawer. */
      header={(navState) => (
        <SiteHeader
          linkAs={Link}
          homeHref="/portals/e-anudaan/dashboard"
          variant="portal"
          emblemSrc="/images/emblem.svg"
          brandLines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "Department of Social Justice & Empowerment",
          }}
          beta
          onToggleNav={navState.toggle}
          navExpanded={navState.open}
          account={viewer ? { name: viewer.personName, role: viewer.label } : undefined}
          /* The bell is this portal's one door to notifications: the sidebar item and
             the account-menu item it replaces are gone (docs/specs/notification-object.md). */
          notifications={
            role
              ? {
                  items: notifications,
                  href: notificationsHref(role.id),
                  onMarkAllRead: markAllNotificationsRead,
                }
              : undefined
          }
          accountMenu={[
            {
              label: "Sign out",
              danger: true,
              onSelect: () => {
                logout();
                router.push(`/portals/e-anudaan/login?role=${isNgo ? "ngo" : "officer"}`);
              },
            },
          ]}
        />
      )}
    >
      {sessionFailure ? (
        <ServiceErrorNotice failure={sessionFailure} homeHref={role?.home} onRetry={clearSessionFailure} onDismiss={clearSessionFailure} />
      ) : access === "allowed" ? (
        children
      ) : access === "forbidden" ? (
        <StatusScreen
          kind="403"
          title="You Do Not Have Access to This Page"
          description={
            isNgo
              ? "This page is for officers of the Ministry. Your organisation's applications are on your dashboard."
              : "This page belongs to another officer's role. Your own applications and registers are on your dashboard."
          }
          primaryAction={toDashboard}
          searchUrl={null}
          wayfindingLinks={[]}
        />
      ) : (
        <StatusScreen
          kind="404"
          title="Page Not Found"
          description="No page exists at this address. The link may be incomplete."
          primaryAction={toDashboard}
          searchUrl={null}
          wayfindingLinks={[]}
        />
      )}
    </PortalPage>
  );
}
