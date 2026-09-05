"use client";

import { SiteHeader, type SiteHeaderProps, SAMAVESH_COBRAND } from "@mosje/design-system";

const BASE = "/portals/nhapoa";

export interface NhapoaHeaderProps {
  account?: SiteHeaderProps["account"];
  accountMenu?: SiteHeaderProps["accountMenu"];
  actions?: React.ReactNode;
  nav?: SiteHeaderProps["nav"];
  onToggleNav?: () => void;
  navExpanded?: boolean;
}

/**
 * Single-sourced NHAPOA Portal header — powered by @mosje/design-system SiteHeader
 * (variant="portal"). The navy ground is the `data-brand` axis, not a
 * component prop — `tone` was retired.
 */
export function NhapoaHeader({
  account,
  accountMenu,
  actions,
  nav,
  onToggleNav,
  navExpanded,
}: NhapoaHeaderProps) {
  return (
    <SiteHeader
      homeHref={BASE}
      variant="portal"
      sticky
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "National Helpline Against Atrocities",
        department: "SAMBAL",
        // ds-exempt(hindi-source): SiteHeader renders departmentHi inside its own <span lang="hi">
        departmentHi: "संबल",
      }}
      beta
      skipTo="#main"
      govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
      language={{ label: "English" }}
      cobranding={[
        { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 36 },
        SAMAVESH_COBRAND,
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
