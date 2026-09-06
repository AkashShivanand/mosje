"use client";

import { Button, OrgLogo, SidebarNav } from "@mosje/design-system";
import * as React from "react";

const GROUPS = [
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
];

const IDENTITY = {
  name: "NOS",
  expansion: "National Overseas Scholarship",
  mark: <OrgLogo org="nos" />,
  href: "/portals/nos",
};

/**
 * The specimen shows every level and both modes: the portal identity on its
 * SAMAVESH wash at the head, a group open to level 3 on the active path, a
 * badge, and a labelled second group. The masthead toggles a portal's rail; the
 * button above stands in for it here, so toggle it to see the count become a
 * dot and the group become a flyout. Beside it, the
 * arrangement the master grid does not show: the collapsed rail keeping its
 * signals — the mark alone, the badge as a dot, the labels in tooltips.
 */
export function Specimen(): React.JSX.Element {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", justifyItems: "start" }}>
      <Button size="sm" appearance="outlined" onClick={() => setCollapsed((c) => !c)} aria-expanded={!collapsed}>
        {collapsed ? "Expand the rail" : "Collapse the rail"}
      </Button>
    <div style={{ display: "flex", gap: "var(--sa-inline-24)", alignItems: "flex-start", flexWrap: "wrap", minHeight: "36rem" }}>
      <SidebarNav
        identity={IDENTITY}
        pathname="/portals/scw/applications/track/review"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        groups={GROUPS}
      />
      <SidebarNav identity={IDENTITY} pathname="/portals/scw/notifications" collapsed groups={GROUPS} />
    </div>
    </div>
  );
}
