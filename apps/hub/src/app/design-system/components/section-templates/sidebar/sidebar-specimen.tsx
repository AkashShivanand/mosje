"use client";

import * as React from "react";
import { Button, SidebarNav, type SidebarNavGroup } from "@mosje/design-system";

const GROUPS: SidebarNavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/portals/demo/dashboard", icon: "grid_view" }],
  },
  {
    label: "Beneficiaries",
    items: [
      {
        label: "Transgender",
        href: "/portals/demo/transgender",
        icon: "diversity_3",
        children: [
          { label: "Dashboard", href: "/portals/demo/transgender" },
          { label: "Certificate / ID", href: "/portals/demo/transgender/certificate" },
          { label: "Scholarships", href: "/portals/demo/transgender/scholarships" },
        ],
      },
      { label: "Beggary Rehabilitation", href: "/portals/demo/smile", icon: "home_work", badge: 4 },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Reports", href: "/portals/demo/reports", icon: "description" },
      { label: "Users", href: "/portals/demo/users", icon: "group" },
    ],
  },
];

/**
 * A live SidebarNav with real state, so both modes and the group-expansion
 * behaviour can actually be tried. `pathname` is pinned to the Transgender
 * child route, which is what makes its parent group open and highlighted.
 */
export function SidebarSpecimen(): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="cdp-stack">
      <div className="cdp-row">
        <Button appearance="outlined" onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
        </Button>
      </div>
      <SidebarNav
        id="sidebar-specimen"
        groups={GROUPS}
        pathname="/portals/demo/transgender/certificate"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseControl
      />
    </div>
  );
}
