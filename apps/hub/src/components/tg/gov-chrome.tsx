"use client";

import * as React from "react";
import { SiteHeader, type SiteHeaderProps } from "@mosje/design-system";

const BASE = "/portals/tg";

export interface TgHeaderProps {
  account?: SiteHeaderProps["account"];
  accountMenu?: SiteHeaderProps["accountMenu"];
  actions?: React.ReactNode;
  nav?: SiteHeaderProps["nav"];
  onToggleNav?: () => void;
  navExpanded?: boolean;
}

/**
 * Single-sourced TG Portal header — powered by @mosje/design-system SiteHeader
 * (variant="portal", tone="navy").
 */
export function TgHeader({
  account,
  accountMenu,
  actions,
  nav,
  onToggleNav,
  navExpanded,
}: TgHeaderProps) {
  return (
    <SiteHeader
      homeHref={BASE}
      variant="portal"
      sticky
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
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

