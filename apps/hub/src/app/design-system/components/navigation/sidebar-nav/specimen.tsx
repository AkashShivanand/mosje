"use client";

import { OrgLogo, SidebarNav } from "@mosje/design-system";
import * as React from "react";

/**
 * The specimen shows every level and both modes: the portal identity at the
 * head with the collapse control in its row, a group open to level 3, a badge,
 * and a labelled second group. Toggle the control
 * to see the count become a dot and the group become a flyout.
 */
export function Specimen(): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div style={{ display: "flex", minHeight: "36rem" }}>
      <SidebarNav
        identity={{
          name: "SCW",
          expansion: "Senior Citizens' Welfare",
          mark: <OrgLogo org="scw" size="md" />,
          href: "/portals/scw",
        }}
        pathname="/portals/scw/applications/track/review"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        showCollapseControl
        groups={[
          {
            items: [
              { label: "Dashboard", href: "/portals/scw", icon: "dashboard" },
              {
                label: "Applications",
                href: "/portals/scw/applications",
                icon: "description",
                children: [
                  { label: "New Application", href: "/portals/scw/applications/new" },
                  {
                    label: "Track Applications",
                    href: "/portals/scw/applications/track",
                    children: [
                      { label: "Under Review", href: "/portals/scw/applications/track/review" },
                      { label: "Sanctioned", href: "/portals/scw/applications/track/sanctioned" },
                    ],
                  },
                  { label: "Drafts", href: "/portals/scw/applications/drafts" },
                ],
              },
              {
                label: "Notifications",
                href: "/portals/scw/notifications",
                icon: "notifications",
                badge: 3,
              },
            ],
          },
          {
            label: "Administration",
            items: [
              { label: "Officers", href: "/portals/scw/officers", icon: "badge" },
              { label: "Settings", href: "/portals/scw/settings", icon: "settings" },
            ],
          },
        ]}
      />
    </div>
  );
}
