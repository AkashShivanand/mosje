"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OrgLogo, PortalPage, SiteHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";

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
  const { state, hydrated, logout } = useEAnudaan();

  const isNgo = state.session === "ngo";
  const role = ROLES.ngo;

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
        expansion: "Grant-in-Aid Management",
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
          /* The render prop is the fix: the masthead drives the rail through
             PortalPage's own state rather than a boolean this file keeps. */
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          account={{ name: role.personName, role: "NGO Applicant" }}
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
      {children}
    </PortalPage>
  );
}
