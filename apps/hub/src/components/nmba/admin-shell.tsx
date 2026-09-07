"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon, PortalPage, SiteHeader, SAMAVESH_COBRAND, type PortalRole as SamaveshRole, type SidebarNavGroup, type SidebarNavItem, OrgLogo } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { PORTAL_SESSION_COOKIE, roleLabel } from "@/lib/nmba/committee/session";
import { tiersForRole } from "@/lib/nmba/committee/scope";
import { resetDemoData } from "@/lib/nmba/committee/store";
import type { CommitteeTier, PortalRole } from "@/lib/nmba/committee/types";

const BASE = "/portals/nmba";

type NavItem = { label: string; href: string; icon: string };

const ADMIN_NAV: NavItem[] = [
  { label: "Ministries/Line Departments/Spiritual Organisations Dashboard", href: "/portals/nmba/admin/ministries-dashboard", icon: "apartment" },
  { label: "State/UT/District Dashboard", href: "/portals/nmba/admin/dashboard", icon: "grid_view" },
  { label: "User Management", href: "/portals/nmba/admin/user-management", icon: "group" },
  { label: "All Pledge Reports", href: "/portals/nmba/admin/pledge-reports", icon: "description" },
  { label: "Important Documents", href: "/portals/nmba/admin/important-documents", icon: "library_books" },
  { label: "List of SNO", href: "/portals/nmba/admin/state-nodal-officers", icon: "shield" },
  { label: "List of DNO", href: "/portals/nmba/admin/district-nodal-officers", icon: "verified_user" },
  { label: "Feedback/Grievances", href: "/portals/nmba/admin/feedback", icon: "chat" },
];

const NAPDDR_TIER_ITEMS: Record<CommitteeTier, NavItem> = {
  STATE: { label: "State-Level Committee", href: "/portals/nmba/admin/napddr/state", icon: "account_balance" },
  DISTRICT: { label: "District-Level Committee", href: "/portals/nmba/admin/napddr/district", icon: "business" },
  BLOCK: { label: "Block-Level Committee", href: "/portals/nmba/admin/napddr/block", icon: "location_on" },
};
const NAPDDR_REPORTS: NavItem = { label: "Committee Reports", href: "/portals/nmba/admin/napddr/reports", icon: "assessment" };

const MP = "/portals/nmba/admin/mass-pledge";

/**
 * Clearing the session cookie, at module scope.
 *
 * `react-hooks/immutability` refuses a write to anything declared outside the
 * component from inside its body, and `document` is exactly that. Keeping the
 * write out here satisfies the rule and says what the line does, which
 * `document.cookie = "…max-age=0"` on its own does not.
 */
function clearPortalSession(): void {
  document.cookie = `${PORTAL_SESSION_COOKIE}=; max-age=0; path=/`;
}

/**
 * Mass Pledge nav, by role. Admin oversees but never files; the four
 * organisation logins file but never approve; Block files and is approved by
 * District, which is in turn approved by State.
 *
 * There is no separate "report" entry: the form lives on the Mass Pledge page
 * itself and only appears on 18 August, so a permanent nav item pointing at it
 * would be dead for all but one day of the year.
 */
function massPledgeNavFor(role: PortalRole): NavItem[] {
  const reports: NavItem = { label: "Mass Pledge", href: MP, icon: "volunteer_activism" };
  const approvals: NavItem = { label: "Approvals", href: `${MP}/approvals`, icon: "assignment_turned_in" };
  const dashboard: NavItem = { label: "Pledge Dashboard", href: `${MP}/dashboard`, icon: "bar_chart" };

  switch (role) {
    case "ADMIN":
      return [reports, dashboard];
    case "STATE":
    case "DISTRICT":
      return [reports, approvals, dashboard];
    case "BLOCK":
    case "ENTITY":
      return [reports];
  }
}

/**
 * NMBA names its logins by committee tier; the estate names screens by audience.
 * The mapping is stated once here rather than guessed per screen: ADMIN
 * oversees, the three tiers are departmental officers, and ENTITY is a
 * spiritual organisation or line department signing in on its own behalf.
 */
const SAMAVESH_ROLE: Record<PortalRole, SamaveshRole> = {
  ADMIN: "admin",
  STATE: "officer",
  DISTRICT: "officer",
  BLOCK: "officer",
  ENTITY: "organisation",
};

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const session = usePortalSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = session.role === "ADMIN";
  const napddrTiers = tiersForRole(session.role);
  // Block and organisation logins exist for Mass Pledge only — showing them a
  // committee section with nothing in it would read as a broken menu.
  const showNapddr = napddrTiers.length > 0;
  const napddrItems: NavItem[] = [
    ...napddrTiers.map((t) => NAPDDR_TIER_ITEMS[t]),
    NAPDDR_REPORTS,
  ];
  const massPledgeItems = massPledgeNavFor(session.role);

  const handleLogout = () => {
    clearPortalSession();
    router.push("/portals/nmba/admin/login");
  };

  const { toast } = useToast();

  const handleResetDemo = () => {
    resetDemoData();
    toast("Demo data reset to the starting point.", "success");
  };

  /**
   * One nav definition, rendered twice by the design system's SidebarNav: in
   * the persistent rail and in the mobile drawer. Admin keeps the full portal
   * nav with the NAPDDR committees as a collapsible group — a group with no
   * page of its own, so it carries no href; State/District officers get the
   * NAPDDR pages as a labelled section instead (admin-only items are hidden
   * for them). Mass Pledge has something for every role, so that section is
   * never conditional on role, only its items are.
   */
  const groups: SidebarNavGroup[] = [];
  if (isAdmin) {
    const napddr: SidebarNavItem = {
      label: "NAPDDR Three-Tier Committee",
      icon: "account_balance",
      children: napddrItems.map(({ label, href }) => ({ label, href })),
    };
    groups.push({ items: [...ADMIN_NAV, napddr] });
  } else if (showNapddr) {
    groups.push({ label: "NAPDDR Three-Tier Committee", items: napddrItems });
  }
  groups.push({ label: "Mass Pledge · 18 Aug 2026", items: massPledgeItems });

  return (
    <PortalPage
      portal="nmba"
      role={SAMAVESH_ROLE[session.role]}
      pathname={pathname}
      identity={{
        name: "NMBA",
        expansion: "Nasha Mukt Bharat Abhiyaan",
        mark: <OrgLogo path="/portals/nmba" />,
        href: "/portals/nmba/admin/dashboard",
      }}
      nav={groups}
      mainId="main-content"
      header={(nav) => (
        <SiteHeader
          /* This is the fix. The button used to toggle `collapsed` — the
             DESKTOP rail's state — while the rail carried `hidden lg:flex`, so
             on a phone it did nothing and a SECOND "Menu" button inside the
             content opened a SideSheet nobody would look for. One control now,
             and it means the right thing at each width. */
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          homeHref={BASE}
          variant="portal"
          sticky
          beta
          emblemSrc={`${BASE}/brand/national-emblem.svg`}
          brandLines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "Patient Data Monitoring System",
          }}
          cobranding={[
            { src: `${BASE}/brand/digital-india.svg`, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 34 },
            SAMAVESH_COBRAND,
          ]}
          language={{
            label: "English",
            onClick: () => toast("i18n: Language switch (22 scheduled languages supported) - Demo.", "info"),
          }}
          account={{ name: session.displayName, role: roleLabel(session.role) }}
          accountMenu={[
            {
              label: "Reset demo data",
              icon: <Icon name="restart_alt" size={16} />,
              onSelect: handleResetDemo,
            },
            {
              label: "Sign out",
              danger: true,
              icon: <Icon name="logout" size={16} />,
              onSelect: handleLogout,
            },
          ]}
        />
      )}
    >
      {children}
    </PortalPage>
  );
}
