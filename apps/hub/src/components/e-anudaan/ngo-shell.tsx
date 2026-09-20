"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OrgLogo, PortalPage, SiteHeader } from "@mosje/design-system";
import type { EventItem } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ServiceErrorNotice, useFailureOnLoad } from "./service-error";
import { ROLES } from "@/lib/e-anudaan/roles";
import { notificationItems, notificationsHref } from "@/lib/e-anudaan/notifications";
import type { EAnudaanState } from "@/lib/e-anudaan/types";

/**
 * The applicant's feed, as BOTH the masthead bell and the notifications page read it — one
 * expression, so the two cannot label the same notice differently.
 *
 * A utilisation certificate is FILED, not responded to, so its deadline is named for what it asks
 * ("File by 30 Jun 2026"); everything else keeps the list's default. The due dates themselves are
 * the notifications module's (`dueAt`).
 */
export function ngoNotifications(state: EAnudaanState): EventItem[] {
  return notificationItems(state, "ngo").map((n) => (n.id.startsWith("uc-") ? { ...n, dueLabel: "File by" } : n));
}

/**
 * ONE moment for a whole screen, for marking an entry whose `dueAt` has passed.
 *
 * The clock is an external system: it is read AFTER paint, and once a minute after that, so a page
 * left open does not go on saying a certificate is due today. Read during render it would move
 * between two entries on one screen — a certificate due today reading Overdue in one row and not
 * the next — and the server's clock would decide the first paint. `undefined` until it is set, so
 * until then only an entry's own `overdue` marks one.
 */
export function useNow(): number | undefined {
  const [now, setNow] = React.useState<number | undefined>(undefined);
  React.useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const every = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, []);
  return now;
}

/**
 * The design system's `Link` renders a plain anchor and takes no router link, so a click is
 * handed to the Next router here — an ordinary click routes on the client, while a modified
 * click (new tab, new window) keeps the anchor's own behaviour.
 */
export function routeOnClick(router: { push: (href: string) => void }, href: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(href);
  };
}

/**
 * The same hand-off for anchors a design-system component draws itself (EventList, ListRow):
 * delegated from a wrapper, for same-site paths only.
 */
export function routeLinksWithin(router: { push: (href: string) => void }) {
  return (e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = (e.target as HTMLElement).closest("a[href]");
    const href = anchor?.getAttribute("href");
    if (!href || !href.startsWith("/") || href.startsWith("//") || anchor?.getAttribute("target")) return;
    e.preventDefault();
    router.push(href);
  };
}

/**
 * Authenticated shell for the NGO applicant. Bounces to /sign-in without an NGO session.
 *
 * The chrome is `PortalPage` — the guard is the only thing left here, which is
 * the division `AppShell` and `PortalPage` both ask for: presentation in the
 * template, session in a thin wrapper around it.
 *
 * **This shell carried the mobile-navigation defect `PortalPage` exists to
 * remove.** Its masthead button toggled `collapsed`, the DESKTOP rail's state,
 * while the rail itself was `hidden md:flex` — so below 768px the button
 * collapsed a column that was not on screen and an applicant on a phone had no
 * way to reach another page. `PortalPage` reads the viewport at click time and
 * gives the one button its two meanings: collapse the rail above the anchor,
 * open the drawer below it.
 */
export function NgoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout, markAllNotificationsRead } = useEAnudaan();
  /** Any signed-in page: the session can end, or the role be refused, on the next request (error-catalogue.ts). */
  const [sessionFailure, clearSessionFailure] = useFailureOnLoad("session", pathname);

  const isNgo = state.session === "ngo";
  const role = ROLES.ngo;
  const notifications = React.useMemo(() => ngoNotifications(state), [state]);

  React.useEffect(() => {
    if (hydrated && !isNgo) router.replace("/portals/e-anudaan/login?role=ngo");
  }, [hydrated, isNgo, router]);

  if (!hydrated || !isNgo) return null;

  return (
    <PortalPage
      portal="e-anudaan"
      /* The applicant is an organisation, not a citizen: E-Anudaan's NGO signs
         in on behalf of a registered society, and the rail it should see is the
         organisation's. */
      role="organisation"
      pathname={pathname}
      identity={{
        name: "E-Anudaan",
        // Non-breaking hyphens: the name must not wrap as "Grant-" / "in-Aid".
        expansion: "Grant\u2011in\u2011Aid Management",
        mark: <OrgLogo path="/portals/e-anudaan" />,
        href: "/portals/e-anudaan/ngo",
      }}
      nav={[{ items: role.nav }]}
      header={(nav) => (
        <SiteHeader
          linkAs={Link}
          homeHref="/portals/e-anudaan"
          variant="portal"
          emblemSrc="/images/emblem.svg"
          brandLines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "Department of Social Justice & Empowerment",
          }}
          beta
          /* The phone layers: the Lockup 2 whole, and this service named in the bar
             that pins. E-Anudaan has no mark of its own, so none is passed and the
             emblem stands in, as OrgLogo's own fallback does. */
          service={{ name: "E-Anudaan", href: role.home }}
          /* The render prop is the fix: the masthead drives the rail through
             PortalPage's own state rather than a boolean this file keeps. */
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          account={{ name: role.personName, role: "NGO Applicant" }}
          /* The bell replaces the sidebar's Notifications item — one door, one count
             (docs/specs/notification-object.md). */
          notifications={{
            items: notifications,
            href: notificationsHref("ngo"),
            onMarkAllRead: markAllNotificationsRead,
          }}
          accountMenu={[
            {
              label: "Sign out",
              danger: true,
              onSelect: () => {
                logout();
                router.push("/portals/e-anudaan/login?role=ngo");
              },
            },
          ]}
        />
      )}
    >
      {sessionFailure ? (
        <ServiceErrorNotice failure={sessionFailure} homeHref={role.home} onRetry={clearSessionFailure} onDismiss={clearSessionFailure} />
      ) : (
        children
      )}
    </PortalPage>
  );
}
