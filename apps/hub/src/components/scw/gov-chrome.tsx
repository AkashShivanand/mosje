"use client";

import { SiteHeader, Divider, type SiteHeaderProps } from "@mosje/design-system";

const BASE = "/portals/scw";

export interface ScwHeaderProps {
  account?: SiteHeaderProps["account"];
  accountMenu?: SiteHeaderProps["accountMenu"];
  actions?: React.ReactNode;
  nav?: SiteHeaderProps["nav"];
  onToggleNav?: () => void;
  navExpanded?: boolean;
}

/**
 * Single-sourced SCW Portal header — powered by @mosje/design-system SiteHeader
 * (variant="portal"). The navy ground is the `data-brand` axis, not a
 * component prop — `tone` was retired.
 */
export function ScwHeader({
  account,
  accountMenu,
  actions,
  nav,
  onToggleNav,
  navExpanded,
}: ScwHeaderProps) {
  return (
    <SiteHeader
      homeHref={BASE}
      variant="portal"
      sticky
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        department: "Ministry of Social Justice & Empowerment",
      }}
      beta
      skipTo="#main"
      govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
      language={{ label: "English" }}
      cobranding={[
        { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 36 },
        { src: `${BASE}/brand/samavesh-logo.svg`, alt: "SAMAVESH", height: 40 },
      ]}
      account={account}
      accountMenu={accountMenu}
      actions={actions}
      nav={nav}
      onToggleNav={onToggleNav}
      navExpanded={navExpanded}
    />
  );
}

/** Footer used by the citizen (UX4G-branded) portal. */
export function Ux4gFooter() {
  return (
    <footer className="border-t border-line bg-navy-950 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-body-3">
        <span>© 2026 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government of India ® 2026 UX4G</span>
        <div className="flex items-center gap-3">
          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
          <Divider orientation="vertical" tone="inverse-subtle" length={12} />
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

// A dedicated floating accessibility button used to live here (bottom-right,
// citizen portal) but never actually opened anything. The official
// UX4GAccessibilityWidget (rendered in the root layout) is the real one.
