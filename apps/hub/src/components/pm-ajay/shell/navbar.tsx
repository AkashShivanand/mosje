"use client";

/* PM-AJAY Dashboard — MoSJE portal chrome.
   Now rendered from the shared @mosje/design-system SiteHeader (the SAMAVESH
   "Website" / public-brand variant) so the National Emblem lockup, GoI utility
   bar, and Government marks stay in lockstep with the rest of the estate. */

import { OrgLogo, SiteHeader, SAMAVESH_COBRAND } from "@mosje/design-system";

import Link from "next/link";

// next/public assets are served under the portal basePath; the shared DS renders
// a plain <img>, so srcs are prefixed explicitly.
const IMG_BASE = "/portals/pm-ajay";

export interface NavbarProps {
  /** The phone drawer is open. Drives the working bar's menu button. */
  navExpanded?: boolean;
  /** Open or close the phone drawer. Omit on a page that has no rail. */
  onToggleNav?: () => void;
}

export function Navbar({ navExpanded, onToggleNav }: NavbarProps = {}) {
  return (
    <SiteHeader
      linkAs={Link}
      homeHref={IMG_BASE}
      variant="portal"
      emblemSrc={`${IMG_BASE}/images/National-Emblem-logo.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      /* The phone layers are back. They were switched off while `.pm-app` scaled a
         fixed 1440 canvas to fit — a phone masthead drawn inside a scaled canvas,
         and sticky pinning does not survive a transformed ancestor. The canvas is
         fluid now, so the working bar pins and carries the rail's menu button. */
      service={{ name: "PM-AJAY", mark: <OrgLogo path={IMG_BASE} size="sm" />, href: IMG_BASE }}
      navExpanded={navExpanded}
      onToggleNav={onToggleNav}
      skipTo="#pm-main"
      govLink={{
        href: "https://india.gov.in/",
        label: "Government of India",
        flagSrc: `${IMG_BASE}/images/Indian-Flag.svg`,
      }}
      language={{ label: "English" }}
      cobranding={[
        { src: `${IMG_BASE}/images/digital-india-logo.svg`, alt: "Digital India — Power To Empower", href: "https://www.digitalindia.gov.in/", height: 40 },
        SAMAVESH_COBRAND,
      ]}
    />
  );
}
