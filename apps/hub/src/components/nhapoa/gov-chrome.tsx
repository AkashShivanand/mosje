"use client";

import { SiteHeader, type SiteHeaderProps } from "@mosje/design-system";

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
 * (variant="portal", tone="navy").
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
      tone="navy"
      sticky
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "National Helpline Against Atrocities",
        department: "SAMBAL संबल",
      }}
      beta
      brandDivider
      skipTo="#main"
      govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
      language={{ label: "English" }}
      cobranding={[
        { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", height: 36 },
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
