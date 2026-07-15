import {
  LayoutGrid,
  FolderOpen,
  MessageSquareWarning,
  Search,
  FileBarChart,
  Timer,
  Bell,
  CheckSquare,
  Wallet,
  Receipt,
  PieChart,
  Landmark,
  Users,
  Shield,
  Map,
  Tags,
  Phone,
  MessageSquare,
  FilePlus2,
  FileSearch,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { RoleId } from "./store/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleDef {
  id: RoleId;
  label: string;
  /** Live dev username (from audit.config.json) — used as the mock login id. */
  username: string;
  /** Route the role lands on after login. */
  home: string;
  nav: NavItem[];
}

/**
 * The 8 NHAPOA roles. Citizen is public (no login); the 7 admin roles log in
 * on the shared admin shell. Usernames mirror the live dev deployment so the
 * clone feels authentic; the mock auth accepts any password (demo: Demo@123).
 */
export const ROLES: Record<Exclude<RoleId, "citizen">, RoleDef> = {
  "district-officer": {
    id: "district-officer",
    label: "District Officer",
    username: "ba.districtofficer",
    home: "/portals/nhapoa/district-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/district-officer/dashboard", icon: LayoutGrid },
      { label: "My Cases", href: "/portals/nhapoa/district-officer/cases", icon: FolderOpen },
      { label: "Clarifications", href: "/portals/nhapoa/district-officer/clarifications", icon: MessageSquareWarning },
      { label: "Investigation", href: "/portals/nhapoa/district-officer/investigation", icon: Search },
      { label: "My Reports", href: "/portals/nhapoa/district-officer/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/portals/nhapoa/district-officer/sla", icon: Timer },
      { label: "Notifications", href: "/portals/nhapoa/district-officer/notifications", icon: Bell },
    ],
  },
  // SHO shares the District-Officer shell and routes (confirmed live: the SHO
  // login lands on /district-officer/dashboard and uses the same screens).
  sho: {
    id: "sho",
    label: "Station House Officer",
    username: "so_govindnagar_kn",
    home: "/portals/nhapoa/district-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/district-officer/dashboard", icon: LayoutGrid },
      { label: "My Cases", href: "/portals/nhapoa/district-officer/cases", icon: FolderOpen },
      { label: "Clarifications", href: "/portals/nhapoa/district-officer/clarifications", icon: MessageSquareWarning },
      { label: "Investigation", href: "/portals/nhapoa/district-officer/investigation", icon: Search },
      { label: "My Reports", href: "/portals/nhapoa/district-officer/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/portals/nhapoa/district-officer/sla", icon: Timer },
      { label: "Notifications", href: "/portals/nhapoa/district-officer/notifications", icon: Bell },
    ],
  },
  "state-authority": {
    id: "state-authority",
    label: "State Authority",
    username: "ba.stateauthority",
    home: "/portals/nhapoa/state-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/state-authority/dashboard", icon: LayoutGrid },
      { label: "Pending Approvals", href: "/portals/nhapoa/state-authority/pending-approvals", icon: CheckSquare },
      { label: "Approved Cases", href: "/portals/nhapoa/state-authority/approved-cases", icon: FolderOpen },
      { label: "Sent Back Cases", href: "/portals/nhapoa/state-authority/sent-back", icon: MessageSquareWarning },
      { label: "All Cases", href: "/portals/nhapoa/state-authority/all-cases", icon: FolderOpen },
      { label: "State Reports", href: "/portals/nhapoa/state-authority/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/portals/nhapoa/state-authority/sla", icon: Timer },
      { label: "Notifications", href: "/portals/nhapoa/state-authority/notifications", icon: Bell },
    ],
  },
  "finance-officer": {
    id: "finance-officer",
    label: "Finance Officer",
    username: "ba.financeofficer",
    home: "/portals/nhapoa/finance-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/finance-officer/dashboard", icon: LayoutGrid },
      { label: "Disbursement Queue", href: "/portals/nhapoa/finance-officer/queue", icon: Wallet },
      { label: "Transaction Log", href: "/portals/nhapoa/finance-officer/transactions", icon: Receipt },
      { label: "Fund Utilisation", href: "/portals/nhapoa/finance-officer/utilisation", icon: PieChart },
      { label: "Notifications", href: "/portals/nhapoa/finance-officer/notifications", icon: Bell },
    ],
  },
  "central-authority": {
    id: "central-authority",
    label: "Central Authority",
    username: "ba.centralauthority",
    home: "/portals/nhapoa/central-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/central-authority/dashboard", icon: LayoutGrid },
      { label: "National Grievances", href: "/portals/nhapoa/central-authority/grievances", icon: FolderOpen },
      { label: "State Comparison", href: "/portals/nhapoa/central-authority/state-comparison", icon: FileBarChart },
      { label: "Scheme Performance", href: "/portals/nhapoa/central-authority/scheme-performance", icon: PieChart },
      { label: "Fund Allocation", href: "/portals/nhapoa/central-authority/fund-allocation", icon: Landmark },
      { label: "Reports & Export", href: "/portals/nhapoa/central-authority/reports", icon: FileBarChart },
      { label: "Notifications", href: "/portals/nhapoa/central-authority/notifications", icon: Bell },
    ],
  },
  "system-admin": {
    id: "system-admin",
    label: "System Administrator",
    username: "nhapoa_sysadmin",
    home: "/portals/nhapoa/admin/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/admin/dashboard", icon: LayoutGrid },
      { label: "Grievance Monitoring", href: "/portals/nhapoa/admin/grievances", icon: FolderOpen },
      { label: "SLA Monitor", href: "/portals/nhapoa/admin/sla-monitor", icon: Timer },
      { label: "Officer Performance", href: "/portals/nhapoa/admin/officer-performance", icon: FileBarChart },
      { label: "Grievance Analytics", href: "/portals/nhapoa/admin/analytics", icon: PieChart },
      { label: "Geographic View", href: "/portals/nhapoa/admin/geographic", icon: Map },
      { label: "Reports & Export", href: "/portals/nhapoa/admin/reports", icon: FileBarChart },
      { label: "User Management", href: "/portals/nhapoa/admin/users", icon: Users },
      { label: "Role Management", href: "/portals/nhapoa/admin/roles", icon: Shield },
      { label: "Grievance Categories", href: "/portals/nhapoa/admin/categories", icon: Tags },
      { label: "Feedbacks", href: "/portals/nhapoa/admin/portal-feedback", icon: MessageSquare },
      { label: "Notifications", href: "/portals/nhapoa/admin/notifications", icon: Bell },
    ],
  },
  "call-center": {
    id: "call-center",
    label: "Call Centre Operator",
    username: "ankitSharma",
    home: "/portals/nhapoa/call-center/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/call-center/dashboard", icon: LayoutGrid },
      { label: "Caller Details", href: "/portals/nhapoa/call-center/caller", icon: Phone },
      { label: "Register Grievance", href: "/portals/nhapoa/call-center/register-grievance", icon: FilePlus2 },
      { label: "Query", href: "/portals/nhapoa/call-center/query", icon: MessageSquare },
      { label: "Query Log", href: "/portals/nhapoa/call-center/queries", icon: FolderOpen },
      { label: "Directory Search", href: "/portals/nhapoa/call-center/directory", icon: Users },
      { label: "Track Status", href: "/portals/nhapoa/call-center/track", icon: FileSearch },
      { label: "Help & FAQs", href: "/portals/nhapoa/call-center/faq", icon: HelpCircle },
    ],
  },
};

export const ADMIN_ROLES = Object.values(ROLES);

/** Resolve a role by its login username (case-insensitive). */
export function roleByUsername(username: string): RoleDef | undefined {
  const u = username.trim().toLowerCase();
  return ADMIN_ROLES.find((r) => r.username.toLowerCase() === u);
}
