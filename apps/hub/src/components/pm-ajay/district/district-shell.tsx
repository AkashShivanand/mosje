"use client";

/* The Adarsh Gram district officer's shell.
   DS Audit: PortalPage ✅ existing · SiteHeader ✅ existing · OrgLogo ✅ existing.
   Chrome is the design system's; this file is the session guard and the rail's data. */

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OrgLogo, PortalPage, SiteHeader, SAMAVESH_COBRAND } from "@mosje/design-system";
import { useAuth } from "@/store/pm-ajay/auth-context";
import { DISTRICT_NAV, DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { DISTRICT_SCOPE } from "@/lib/pm-ajay/district/registers";
import { PortalFooter } from "@/components/pm-ajay/shell/portal-footer";

const PORTAL = "/portals/pm-ajay";

/**
 * Chrome plus guard. Everything else — the rail's two widths, the phone drawer, the
 * skip link, the page's `<main>` — belongs to `PortalPage`, which is why this file is
 * short. `pending` covers the moment before the stored session has been read: the
 * portal used to return `null` there, which reads as a broken page.
 */
export function DistrictShell({ children }: { children: React.ReactNode }) {
  const { account, restored, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (restored && !account) router.replace(`${PORTAL}/login`);
  }, [account, restored, router]);

  const signedIn = Boolean(account);

  return (
    <PortalPage
      portal="pm-ajay"
      role="officer"
      pathname={pathname}
      pending={!restored || !signedIn}
      identity={{
        name: "PM-AJAY",
        expansion: "Adarsh Gram — District",
        mark: <OrgLogo path="/portals/pm-ajay" />,
        href: `${DISTRICT_BASE}/dashboard`,
      }}
      nav={DISTRICT_NAV}
      mainId="pm-main"
      footer={<PortalFooter lastUpdated={DISTRICT_SCOPE.asOf} />}
      header={(nav) => (
        <SiteHeader
          linkAs={Link}
          homeHref={PORTAL}
          variant="portal"
          // org-logo-exempt(portal-local): the National Emblem, not an organisation mark,
          // and pm-ajay serves its own copy under its own basePath, as this portal's
          // navbar.tsx does. The registry holds organisation marks.
          emblemSrc={`${PORTAL}/images/National-Emblem-logo.svg`}
          brandLines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "Department of Social Justice & Empowerment",
          }}
          beta
          service={{ name: "PM-AJAY", mark: <OrgLogo path={PORTAL} size="sm" />, href: `${DISTRICT_BASE}/dashboard` }}
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          skipTo="#pm-main"
          govLink={{
            href: "https://india.gov.in/",
            label: "Government of India",
            flagSrc: `${PORTAL}/images/Indian-Flag.svg`,
          }}
          language={{ label: "English" }}
          account={
            account
              ? { name: account.name, role: `${account.designation} · ${DISTRICT_SCOPE.district}` }
              : undefined
          }
          accountMenu={[
            {
              label: "Sign out",
              danger: true,
              onSelect: () => {
                signOut();
                router.push(`${PORTAL}/login`);
              },
            },
          ]}
          cobranding={[
            {
              src: `${PORTAL}/images/digital-india-logo.svg`,
              alt: "Digital India — Power To Empower",
              href: "https://www.digitalindia.gov.in/",
              height: 40,
            },
            SAMAVESH_COBRAND,
          ]}
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
