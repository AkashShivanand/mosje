"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { SiteHeader, OrgLogo, PortalPage, type PortalNavGroup } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";

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
 */
export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, logout } = useEAnudaan();

  const isOfficer = state.session !== null && state.session !== "ngo";
  const role = isOfficer ? ROLES[state.session!] : null;

  /* Unconditional, so the hook order never changes with the session. */
  const nav = React.useMemo<PortalNavGroup[]>(
    () => (role ? [{ items: role.nav }] : []),
    [role],
  );

  React.useEffect(() => {
    if (hydrated && !isOfficer) router.replace("/portals/e-anudaan/login?role=officer");
  }, [hydrated, isOfficer, router]);

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
        expansion: "Grant-in-Aid Management",
        mark: <OrgLogo path="/portals/e-anudaan" tile={false} />,
        href: "/portals/e-anudaan",
      }}
      pending={!hydrated || !role}
      /* A function, so the masthead drives the rail: above the tablet anchor its
         button collapses the column, below it opens the drawer. */
      header={(navState) => (
        <SiteHeader
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
          account={role ? { name: role.personName, role: role.label } : undefined}
          accountMenu={[
            {
              label: "Notifications",
              onSelect: () => {
                router.push("/portals/e-anudaan/dashboard/notifications");
              },
            },
            {
              label: "Sign out",
              danger: true,
              onSelect: () => {
                logout();
                router.push("/portals/e-anudaan/login?role=officer");
              },
            },
          ]}
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
