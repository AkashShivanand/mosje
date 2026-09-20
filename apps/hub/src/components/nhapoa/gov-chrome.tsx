"use client";

import { SiteHeader, type SiteHeaderProps, SAMAVESH_COBRAND, OrgLogo } from "@mosje/design-system";

import Link from "next/link";

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
 * Single-sourced SAMBAL portal header (route `nhapoa`) — powered by @mosje/design-system SiteHeader
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
      linkAs={Link}
      homeHref={BASE}
      variant="portal"
      sticky
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        /* DBIM 5.2.2 Lockup 2: the Ministry and the Department. SAMBAL — the National
           Helpline Against Atrocities — is the SERVICE, named in the working bar
           (`service`) and in the sidebar, not in the lockup. */
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      /* The phone layers: the Lockup 2 whole, and this service named in the bar that pins. */
      service={{ name: "SAMBAL", mark: <OrgLogo path="/portals/nhapoa" size="sm" />, href: BASE }}
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
