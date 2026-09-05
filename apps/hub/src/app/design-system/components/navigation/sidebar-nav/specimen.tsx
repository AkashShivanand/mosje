"use client";

import { SidebarNav } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={{ maxWidth: "20rem" }}>
      <SidebarNav
        pathname="/portals/scw/applications"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseControl
        groups={[
          {
            label: "Casework",
            items: [
              { label: "Dashboard", href: "/portals/scw", icon: "dashboard" },
              {
                label: "Applications",
                href: "/portals/scw/applications",
                icon: "description",
                badge: 12,
              },
            ],
          },
          {
            label: "Registers",
            items: [{ label: "SAGE Homes", href: "/portals/scw/homes", icon: "home_work" }],
          },
        ]}
      />
      </div>
      {/* Arrangements the master grid does not show: a group open on the active path, and the collapsed rail keeping its signals. */}
      <div style={{ display: "flex", gap: "var(--sa-inline-24)", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ maxWidth: "20rem" }}>
          <SidebarNav
            pathname="/portals/scw/schemes/pm-ajay"
            groups={[
              {
                label: "Casework",
                items: [
                  { label: "Dashboard", href: "/portals/scw", icon: "dashboard" },
                  {
                    label: "Schemes",
                    href: "/portals/scw/schemes",
                    icon: "account_balance",
                    children: [
                      { label: "PM-AJAY", href: "/portals/scw/schemes/pm-ajay" },
                      { label: "SMILE", href: "/portals/scw/schemes/smile" },
                      { label: "NAPDDR", href: "/portals/scw/schemes/napddr" },
                    ],
                  },
                  { label: "Applications", href: "/portals/scw/applications", icon: "description", badge: 12 },
                ],
              },
            ]}
          />
        </div>
        <SidebarNav
          pathname="/portals/scw/applications"
          collapsed
          showCollapseControl
          groups={[
            {
              label: "Casework",
              items: [
                { label: "Dashboard", href: "/portals/scw", icon: "dashboard" },
                { label: "Applications", href: "/portals/scw/applications", icon: "description", badge: 12 },
              ],
            },
            { label: "Registers", items: [{ label: "SAGE Homes", href: "/portals/scw/homes", icon: "home_work" }] },
          ]}
        />
      </div>
    </div>
  );
}
