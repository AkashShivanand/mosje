"use client";

/* PM-AJAY Dashboard — MoSJE portal chrome.
   Now rendered from the shared @mosje/design-system SiteHeader (the SAMAVESH
   "Website" / public-brand variant) so the National Emblem lockup, GoI utility
   bar, and Government marks stay in lockstep with the rest of the estate. */

import { SiteHeader } from "@mosje/design-system";

// next/public assets are served under the portal basePath; the shared DS renders
// a plain <img>, so srcs are prefixed explicitly.
const IMG_BASE = "/portals/pm-ajay";

export function Navbar() {
  return (
    <SiteHeader
      homeHref={IMG_BASE}
      variant="portal"
      emblemSrc={`${IMG_BASE}/images/National-Emblem-logo.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      skipTo="#pm-main"
      govLink={{
        href: "https://india.gov.in/",
        label: "Government of India",
        flagSrc: `${IMG_BASE}/images/Indian-Flag.svg`,
      }}
      language={{ label: "English" }}
      cobranding={[
        { src: `${IMG_BASE}/images/digital-india-logo.svg`, alt: "Digital India — Power To Empower", href: "https://www.digitalindia.gov.in/", height: 40 },
        { src: `${IMG_BASE}/images/samavesh.png`, alt: "SAMAVESH", height: 44 },
      ]}
    />
  );
}
