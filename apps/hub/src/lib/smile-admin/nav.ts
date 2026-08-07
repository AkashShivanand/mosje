import type { RoleKey } from "./roles";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number | "live";
  roles?: RoleKey[]; // if omitted, visible to all signed-in users
}

export interface NavGroup {
  label?: string; // omit for the first ungrouped block (Dashboard)
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/portals/smile-admin/dashboard", icon: "dashboard" }],
  },
  {
    label: "Access Control",
    items: [
      { label: "Users", href: "/portals/smile-admin/users", icon: "group", roles: ["super_admin", "central_admin", "state_nodal_officer"] },
      { label: "Roles", href: "/portals/smile-admin/roles", icon: "verified_user", roles: ["super_admin", "central_admin"] },
      { label: "Permissions", href: "/portals/smile-admin/permissions", icon: "key", roles: ["super_admin"] },
    ],
  },
  {
    label: "Field Operations",
    items: [
      { label: "Survey Locations", href: "/portals/smile-admin/surveys", icon: "location_on" },
      { label: "Surveyor Mappings", href: "/portals/smile-admin/surveyor-mapped", icon: "map" },
      { label: "Beggary Schemes", href: "/portals/smile-admin/beggary-schemes", icon: "menu_book" },
    ],
  },
  {
    label: "Beneficiaries",
    items: [
      { label: "Beneficiary List", href: "/portals/smile-admin/persons", icon: "account_box" },
      { label: "Shelter Homes", href: "/portals/smile-admin/shelter-homes", icon: "apartment" },
      { label: "Shelter Occupants", href: "/portals/smile-admin/shelter-homes/beneficiaries", icon: "home" },
      { label: "Skill & Training", href: "/portals/smile-admin/comprehensive-rehab/skill-training", icon: "school" },
      { label: "Rehab Data", href: "/portals/smile-admin/comprehensive-rehab/data", icon: "volunteer_activism" },
    ],
  },
  {
    label: "Reports & Analytics",
    items: [
      { label: "Performance Statistics", href: "/portals/smile-admin/performance-stats", icon: "bar_chart" },
      { label: "Fund Monitoring", href: "/portals/smile-admin/fund-monitoring", icon: "account_balance_wallet" },
      { label: "Sanction Order", href: "/portals/smile-admin/fund-monitoring/sanction-orders/create", icon: "receipt_long" },
      { label: "Release Order", href: "/portals/smile-admin/fund-monitoring/nisd-releases/create", icon: "send" },
      { label: "Release Onwards", href: "/portals/smile-admin/fund-monitoring/nodal-officer-onward-releases/create", icon: "send" },
      { label: "MIS Reports", href: "/portals/smile-admin/mis-reports/mobilised", icon: "description" },
    ],
  },
  {
    label: "Communications",
    items: [
      { label: "Notifications", href: "/portals/smile-admin/notifications", icon: "notifications" },
      { label: "Compose", href: "/portals/smile-admin/notifications/compose", icon: "edit_square" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Master Settings", href: "/portals/smile-admin/master-setting", icon: "settings", roles: ["super_admin", "central_admin"] },
      { label: "Audit Log", href: "/portals/smile-admin/audit-log", icon: "article", roles: ["super_admin", "central_admin"] },
      { label: "Immediate Review", href: "/portals/smile-admin/immediate-review", icon: "report", badge: 18 },
    ],
  },
];

export function navForRole(role: RoleKey): NavGroup[] {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}
