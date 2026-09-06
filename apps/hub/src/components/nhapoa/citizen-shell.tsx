"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Divider, OrgLogo, PortalPage, type PortalNavGroup } from "@mosje/design-system";
import { NhapoaHeader } from "./gov-chrome";

const CITIZEN_NAV: PortalNavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/portals/nhapoa", icon: "grid_view" },
      { label: "Register Grievance", href: "/portals/nhapoa/register-grievance", icon: "note_add" },
      { label: "Register Rescue", href: "/portals/nhapoa/register-rescue", icon: "support" },
      { label: "Track Status", href: "/portals/nhapoa/track-status", icon: "find_in_page" },
      { label: "Help & FAQs", href: "/portals/nhapoa/help-faqs", icon: "help" },
    ],
  },
];

function SambalFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-body-3 sm:px-6">
        <span>© 2026 Ministry of Social Justice &amp; Empowerment, Government of India · SAMBAL</span>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
          <Divider orientation="vertical" tone="inverse-subtle" length={12} />
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

/**
 * Public citizen shell for SAMBAL — gov chrome, navigation, footer. No auth; every
 * screen behind it is public.
 *
 * **Measured before this moved onto `PortalPage`, on
 * `/portals/nhapoa/register-grievance`:** six navigation links visible at 1440px
 * and **zero at 375px**, with a menu button that changed nothing when pressed.
 * The rail carried `hidden shrink-0 md:flex` and the masthead's button drove the
 * DESKTOP rail's collapsed state, so on a phone a citizen filing a grievance
 * under the PoA Act could not reach Register Rescue, Track Status or Help &
 * FAQs at all.
 *
 * That is the worst instance of the pattern found so far, because it is the
 * surface where a phone is most likely to be the only device the person has.
 */
export function CitizenShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalPage
      portal="nhapoa"
      role="citizen"
      pathname={pathname}
      nav={CITIZEN_NAV}
      /* `NhapoaHeader` points its skip link at `#main`, which is PortalPage's
         default — the two must agree or the link resolves to nothing. */
      identity={{
        name: "SAMBAL",
        expansion: "National Helpline Against Atrocities",
        mark: <OrgLogo path="/portals/nhapoa" />,
        href: "/portals/nhapoa",
      }}
      footer={<SambalFooter />}
      /* A function, so the masthead drives the rail: above the tablet anchor its
         button collapses the column, below it opens the drawer. */
      header={(nav) => <NhapoaHeader onToggleNav={nav.toggle} navExpanded={nav.open} />}
    >
      {/* The measure this portal reads at. Kept from the shell it replaces rather
          than widened, because these are long statutory forms and a 5xl column is
          a deliberate reading width, not leftover padding. */}
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </PortalPage>
  );
}
