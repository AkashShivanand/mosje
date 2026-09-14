import type { RoleKey } from "./roles";

export interface NavItem {
  label: string;
  /** A group row with children may omit its own page; the row then only opens. */
  href?: string;
  icon: string;
  /** Sub-items, rendered by `SidebarNav` as an expanding group. */
  children?: Array<{ label: string; href: string }>;
  badge?: number | "live";
  roles?: RoleKey[]; // if omitted, visible to all signed-in users
}

export interface NavGroup {
  label?: string; // omit for the first ungrouped block (Dashboard)
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/portals/smile-admin/dashboard", icon: "dashboard" },
      { label: "City Profiling", href: "/portals/smile-admin/city-profiling", icon: "location_city" },
    ],
  },
  {
    label: "Access Control",
    items: [
      { label: "Users", href: "/portals/smile-admin/users", icon: "group", roles: ["super_admin", "central_admin", "state_nodal_officer"] },
      { label: "Roles", href: "/portals/smile-admin/roles", icon: "verified_user", roles: ["super_admin", "central_admin"] },
      { label: "Permissions", href: "/portals/smile-admin/permissions", icon: "key", roles: ["super_admin"] },
      { label: "IA / Nodal Officers", href: "/portals/smile-admin/do-list", icon: "badge", roles: ["super_admin", "central_admin", "state_nodal_officer"] },
      { label: "IA Approvals", href: "/portals/smile-admin/ia-approvals", icon: "how_to_reg", roles: ["super_admin", "central_admin"] },
    ],
  },
  {
    label: "Field Operations",
    items: [
      { label: "Survey Locations", href: "/portals/smile-admin/surveys", icon: "location_on" },
      { label: "Surveyor Mappings", href: "/portals/smile-admin/surveyor-mapped", icon: "map" },
      { label: "Surveyors", href: "/portals/smile-admin/surveyors", icon: "groups" },
      { label: "Beggary Schemes", href: "/portals/smile-admin/beggary-schemes", icon: "menu_book" },
      { label: "IA List", href: "/portals/smile-admin/ia-list", icon: "corporate_fare" },
      { label: "Hotspot Approvals", href: "/portals/smile-admin/hotspot-approvals", icon: "where_to_vote" },
    ],
  },
  {
    label: "Beneficiaries",
    items: [
      {
        label: "Beneficiary List",
        href: "/portals/smile-admin/persons",
        icon: "account_box",
        children: [
          { label: "Under Mobilisation", href: "/portals/smile-admin/persons/under-mobilized" },
          { label: "Mobilised", href: "/portals/smile-admin/persons/mobilized" },
          { label: "In a Shelter Home", href: "/portals/smile-admin/persons/shelter-home" },
        ],
      },
      {
        label: "Shelter Homes",
        href: "/portals/smile-admin/shelter-homes",
        icon: "apartment",
        children: [{ label: "Audit Checklist", href: "/portals/smile-admin/shelter-homes/checklist" }],
      },
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
      {
        label: "MIS Reports",
        icon: "description",
        children: [
          { label: "Mobilised Report", href: "/portals/smile-admin/mis-reports/mobilised" },
          { label: "Rehabilitated Report", href: "/portals/smile-admin/mis-reports/rehabilitated" },
          { label: "Beneficiary Report", href: "/portals/smile-admin/mis-reports/beneficiary" },
          { label: "Swashraya (Shelter Home) Report", href: "/portals/smile-admin/mis-reports/shelter-home" },
          { label: "Implementing Agency Report", href: "/portals/smile-admin/mis-reports/ia-agency-institute" },
          { label: "Survey Location Report", href: "/portals/smile-admin/mis-reports/survey-location" },
          { label: "Comprehensive Rehab Report", href: "/portals/smile-admin/mis-reports/comprehensive-rehab" },
          { label: "Master Report", href: "/portals/smile-admin/mis-reports/master" },
        ],
      },
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
      {
        label: "Master Settings",
        href: "/portals/smile-admin/master-setting",
        icon: "settings",
        roles: ["super_admin", "central_admin"],
        children: [{ label: "Swashraya (Shelter Homes)", href: "/portals/smile-admin/master-setting/shelter-homes" }],
      },
      { label: "Audit Log", href: "/portals/smile-admin/audit-log", icon: "article", roles: ["super_admin", "central_admin"] },
      { label: "Immediate Review", href: "/portals/smile-admin/immediate-review", icon: "report", badge: 18 },
    ],
  },
  {
    label: "Other",
    items: [
      { label: "Consent Forms", href: "/portals/smile-admin/consent", icon: "assignment_turned_in" },
      { label: "Terms & Conditions", href: "/portals/smile-admin/terms-and-conditions", icon: "gavel" },
      { label: "Privacy Policy", href: "/portals/smile-admin/privacy-policy", icon: "shield" },
    ],
  },
];

export function navForRole(role: RoleKey): NavGroup[] {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}
