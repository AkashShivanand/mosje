import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  MapPin,
  Map,
  BookOpenCheck,
  UserSquare2,
  Building2,
  Home,
  GraduationCap,
  HeartHandshake,
  BarChart3,
  Wallet,
  Receipt,
  Send,
  FileText,
  Bell,
  PenSquare,
  Settings2,
  ScrollText,
  AlertOctagon,
} from "lucide-react";
import type { RoleKey } from "./roles";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | "live";
  roles?: RoleKey[]; // if omitted, visible to all signed-in users
}

export interface NavGroup {
  label?: string; // omit for the first ungrouped block (Dashboard)
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Access Control",
    items: [
      { label: "Users", href: "/users", icon: Users, roles: ["super_admin", "central_admin", "state_nodal_officer"] },
      { label: "Roles", href: "/roles", icon: ShieldCheck, roles: ["super_admin", "central_admin"] },
      { label: "Permissions", href: "/permissions", icon: KeyRound, roles: ["super_admin"] },
    ],
  },
  {
    label: "Field Operations",
    items: [
      { label: "Survey Locations", href: "/surveys", icon: MapPin },
      { label: "Surveyor Mappings", href: "/surveyor-mapped", icon: Map },
      { label: "Beggary Schemes", href: "/beggary-schemes", icon: BookOpenCheck },
    ],
  },
  {
    label: "Beneficiaries",
    items: [
      { label: "Beneficiary List", href: "/persons", icon: UserSquare2 },
      { label: "Shelter Homes", href: "/shelter-homes", icon: Building2 },
      { label: "Shelter Occupants", href: "/shelter-homes/beneficiaries", icon: Home },
      { label: "Skill & Training", href: "/comprehensive-rehab/skill-training", icon: GraduationCap },
      { label: "Rehab Data", href: "/comprehensive-rehab/data", icon: HeartHandshake },
    ],
  },
  {
    label: "Reports & Analytics",
    items: [
      { label: "Performance Statistics", href: "/performance-stats", icon: BarChart3 },
      { label: "Fund Monitoring", href: "/fund-monitoring", icon: Wallet },
      { label: "Sanction Order", href: "/fund-monitoring/sanction-orders/create", icon: Receipt },
      { label: "Release Order", href: "/fund-monitoring/nisd-releases/create", icon: Send },
      { label: "Release Onwards", href: "/fund-monitoring/nodal-officer-onward-releases/create", icon: Send },
      { label: "MIS Reports", href: "/mis-reports/mobilised", icon: FileText },
    ],
  },
  {
    label: "Communications",
    items: [
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Compose", href: "/notifications/compose", icon: PenSquare },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Master Settings", href: "/master-setting", icon: Settings2, roles: ["super_admin", "central_admin"] },
      { label: "Audit Log", href: "/audit-log", icon: ScrollText, roles: ["super_admin", "central_admin"] },
      { label: "Immediate Review", href: "/immediate-review", icon: AlertOctagon, badge: 18 },
    ],
  },
];

export function navForRole(role: RoleKey): NavGroup[] {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}
