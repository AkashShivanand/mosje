"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer, Icon, PortalPage, SiteHeader, SAMAVESH_COBRAND, type SidebarNavChild, type SidebarNavGroup, type SidebarNavItem, OrgLogo } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { TC_SESSION_COOKIE } from "@/lib/nmba/treatment-centre/roles";
import { navForRole, type NavNode } from "./tc-nav";

const BASE = "/portals/nmba";

/**
 * The role's nav tree becomes the design system rail's data. A group has no
 * page of its own, so it carries no href and only opens; DDAC nests IRCA, ODIC
 * and CPLI as level-2 groups under one level-1 group, which is the rail's
 * third and last level. Leaf icons below level 1 are not drawn — the rail's
 * connectors carry the hierarchy instead.
 */
function toChild(node: NavNode): SidebarNavChild {
  if (node.kind === "leaf") return { label: node.label, href: node.href };
  return {
    label: node.label,
    children: node.children.flatMap((l) => (l.kind === "leaf" ? [{ label: l.label, href: l.href }] : [])),
  };
}

function toGroups(nodes: NavNode[]): SidebarNavGroup[] {
  const items: SidebarNavItem[] = nodes.map((n) =>
    n.kind === "leaf"
      ? { label: n.label, href: n.href, icon: n.icon }
      : { label: n.label, icon: n.icon, children: n.children.map(toChild) },
  );
  return [{ items }];
}

export function TreatmentCentreShell({ children }: { children: React.ReactNode }) {
  const session = useTCSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const groups = React.useMemo(() => toGroups(navForRole(session.role)), [session.role]);

  const handleLogout = () => {
    document.cookie = `${TC_SESSION_COOKIE}=; max-age=0; path=/`;
    router.push(`${BASE}/treatment-centre/login-otp`);
  };

  return (
    <PortalPage
      portal="nmba"
      /* A treatment centre signs in as an institution, not as a departmental
         officer: it records its own patients and files its own returns. */
      role="organisation"
      pathname={pathname}
      identity={{
        name: "NMBA",
        expansion: "Nasha Mukt Bharat Abhiyaan",
        mark: <OrgLogo path="/portals/nmba" />,
        href: "/portals/nmba/treatment-centre/dashboard",
      }}
      nav={groups}
      mainId="main-content"
      footer={<Footer />}
      header={(nav) => (
        <SiteHeader
          homeHref={`${BASE}/treatment-centre`}
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
          /* This shell was the ONE that got the two meanings right, with its own
             matchMedia listener, its own isMobile state and its own drawer.
             None of that was wrong — it was just the ninth copy. PortalPage
             reads the viewport at click time instead, so the behaviour survives
             and the fifty lines that implemented it do not. */
          onToggleNav={nav.toggle}
          navExpanded={nav.open}
          language={{
            label: "English",
            onClick: () => toast("i18n: Language switch (22 scheduled languages supported) - Demo.", "info"),
          }}
          account={{ name: session.centerName, role: `${session.role} · (TC)` }}
          accountMenu={[
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
