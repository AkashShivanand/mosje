"use client";

import * as React from "react";
import {
  SiteHeader,
  buttonClasses,
  type NavItem,
} from "@mosje/design-system";

const EMBLEM = "/design-system/national-emblem.svg";
const LOGO = (k: string) => `/design-system/org-logos/${k}.png`;

const BRAND_LINES = {
  org: "Government of India",
  ministry: "Ministry of Social Justice & Empowerment",
  department: "Department of Social Justice & Empowerment",
};

const SAMPLE_NAV: NavItem[] = [
  { label: "Home", href: "#", active: true },
  {
    label: "Department",
    href: "#",
    children: [
      { label: "About Us", href: "#" },
      { label: "Who’s Who", href: "#" },
      { label: "Directory", href: "#" },
    ],
  },
  {
    label: "Offerings",
    href: "#",
    children: [
      { label: "Schemes & Services", href: "#" },
      { label: "Vacancies", href: "#" },
      { label: "Tenders", href: "#" },
    ],
  },
  {
    // Mega-menu: org-heavy item rendered as rich emblem + abbr + name rows.
    label: "Associated Organisations",
    href: "#",
    columns: [
      {
        heading: "Commissions",
        items: [
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "#", iconSrc: LOGO("ncsc") },
          { abbr: "NCSK", name: "National Commission for Safai Karamchari", href: "#", iconSrc: LOGO("ncsk") },
          { abbr: "NCBC", name: "National Commission for Backward Classes", href: "#", iconSrc: LOGO("ncbc") },
        ],
      },
      {
        heading: "Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "#", iconSrc: LOGO("nsfdc") },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance and Development Corporation", href: "#", iconSrc: LOGO("nskfdc") },
          { abbr: "NBCFDC", name: "National Backward Classes Finance and Development Corporation", href: "#", iconSrc: LOGO("nbcfdc") },
        ],
      },
      {
        heading: "Foundation / Autonomous Bodies",
        items: [
          { abbr: "DAF", name: "Dr. Ambedkar Foundation", href: "#", iconSrc: LOGO("daf") },
          { abbr: "JRF", name: "Jagjivan Ram Foundation", href: "#", iconSrc: LOGO("jrf") },
          { abbr: "DAIC", name: "Dr Ambedkar International Centre", href: "#", iconSrc: LOGO("daic") },
        ],
      },
      {
        heading: "Scheme Specific Thematic Portals",
        items: [
          { abbr: "DWBDNC", name: "Development and Welfare Board for De-notified, Nomadic, and Semi-Nomadic Communities", href: "#", iconSrc: LOGO("dwbdnc") },
          { abbr: "SCW", name: "Senior Citizens Welfare", href: "#", iconSrc: LOGO("scw") },
        ],
      },
      {
        heading: "Training & Capacity Building",
        items: [
          { abbr: "NISD", name: "National Institute of Social Defence", href: "#", iconSrc: LOGO("nisd") },
        ],
      },
    ],
  },
  { label: "Connect", href: "#" },
];

/** Bordered "viewport" so a full-width header reads as a contained specimen. */
function Frame({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      style={{
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        overflow: "hidden",
        background: "var(--sa-bg-neutral-base)",
      }}
    >
      {children}
    </div>
  );
}

const PORTAL_NAV: NavItem[] = [
  { label: "Home", href: "#", active: true },
  { label: "Features", href: "#", children: [{ label: "Overview", href: "#" }, { label: "Modules", href: "#" }] },
  { label: "APIs", href: "#", children: [{ label: "Reference", href: "#" }] },
  { label: "Adoption", href: "#", children: [{ label: "Onboarding", href: "#" }] },
  { label: "Governance", href: "#", children: [{ label: "Policies", href: "#" }] },
  { label: "Resources", href: "#", children: [{ label: "Docs", href: "#" }] },
  { label: "Support", href: "#" },
];

/** Live SiteHeader — Website variant: accessibility bar + brand row (lockup · search · Login) + nav. */
export function SiteHeaderPreview(): React.JSX.Element {
  return (
    <Frame>
      <SiteHeader
        variant="website"
        /* A SPECIMEN, so it opts out — as the portal and compact previews below
           already did. `sticky` defaults on for every variant now, and an inline
           example that pins itself over the documentation and condenses as you
           scroll past it is demonstrating the page, not the component. */
        sticky={false}
        emblemSrc={EMBLEM}
        brandLines={BRAND_LINES}
        beta
        language={{ label: "English" }}
        search={{ placeholder: "Search schemes and services", onSearch: () => {} }}
        nav={SAMPLE_NAV}
        actions={
          <a className={buttonClasses("primary", "outlined", "md")} href="#">
            Login
          </a>
        }
      />
    </Frame>
  );
}

/** Live SiteHeader — Portal variant: collapse toggle · emblem divider · account block · nav. */
export function SiteHeaderNavyPreview(): React.JSX.Element {
  // Live state, not a no-op handler: the toggle IS a stateful control, and a
  // preview that never changes cannot show what the two states look like.
  const [navExpanded, setNavExpanded] = React.useState(true);
  return (
    <Frame>
      <SiteHeader
        variant="portal"
        sticky={false}
        emblemSrc={EMBLEM}
        brandLines={BRAND_LINES}
        beta
        onToggleNav={() => setNavExpanded((v) => !v)}
        navExpanded={navExpanded}
        language={{ label: "English" }}
        search={{ placeholder: "Search applications" }}
        account={{ name: "Officer Name", email: "officer@gov.in", role: "State Nodal Officer" }}
        accountMenu={[
          { label: "Profile", onSelect: () => {} },
          { label: "Sign out", danger: true, onSelect: () => {} },
        ]}
        nav={PORTAL_NAV}
      />
    </Frame>
  );
}

/** Live SiteHeader — Compact variant: one 64px tier for hub index surfaces. */
export function SiteHeaderCompactPreview(): React.JSX.Element {
  return (
    <Frame>
      <SiteHeader
        variant="compact"
        sticky={false}
        homeHref="#"
        emblemSrc={EMBLEM}
        brandLines={{
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Digital Estate",
        }}
        nav={[
          { label: "Website", href: "#", active: true },
          { label: "Portals", href: "#" },
          { label: "Design System", href: "#" },
          { label: "Reports", href: "#" },
          { label: "Storybook", href: "#", external: true },
        ]}
      />
    </Frame>
  );
}
