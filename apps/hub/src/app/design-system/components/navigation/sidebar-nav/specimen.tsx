"use client";

import { SidebarNav } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
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
  );
}
