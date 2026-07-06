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
    home: "/district-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/district-officer/dashboard", icon: LayoutGrid },
      { label: "My Cases", href: "/district-officer/cases", icon: FolderOpen },
      { label: "Clarifications", href: "/district-officer/clarifications", icon: MessageSquareWarning },
      { label: "Investigation", href: "/district-officer/investigation", icon: Search },
      { label: "My Reports", href: "/district-officer/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/district-officer/sla", icon: Timer },
      { label: "Notifications", href: "/district-officer/notifications", icon: Bell },
    ],
  },
  // SHO shares the District-Officer shell and routes (confirmed live: the SHO
  // login lands on /district-officer/dashboard and uses the same screens).
  sho: {
    id: "sho",
    label: "Station House Officer",
    username: "so_govindnagar_kn",
    home: "/district-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/district-officer/dashboard", icon: LayoutGrid },
      { label: "My Cases", href: "/district-officer/cases", icon: FolderOpen },
      { label: "Clarifications", href: "/district-officer/clarifications", icon: MessageSquareWarning },
      { label: "Investigation", href: "/district-officer/investigation", icon: Search },
      { label: "My Reports", href: "/district-officer/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/district-officer/sla", icon: Timer },
      { label: "Notifications", href: "/district-officer/notifications", icon: Bell },
    ],
  },
  "state-authority": {
    id: "state-authority",
    label: "State Authority",
    username: "ba.stateauthority",
    home: "/state-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/state-authority/dashboard", icon: LayoutGrid },
      { label: "Pending Approvals", href: "/state-authority/pending-approvals", icon: CheckSquare },
      { label: "Approved Cases", href: "/state-authority/approved-cases", icon: FolderOpen },
      { label: "Sent Back Cases", href: "/state-authority/sent-back", icon: MessageSquareWarning },
      { label: "All Cases", href: "/state-authority/all-cases", icon: FolderOpen },
      { label: "State Reports", href: "/state-authority/reports", icon: FileBarChart },
      { label: "SLA Monitor", href: "/state-authority/sla", icon: Timer },
      { label: "Notifications", href: "/state-authority/notifications", icon: Bell },
    ],
  },
  "finance-officer": {
    id: "finance-officer",
    label: "Finance Officer",
    username: "ba.financeofficer",
    home: "/finance-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/finance-officer/dashboard", icon: LayoutGrid },
      { label: "Disbursement Queue", href: "/finance-officer/queue", icon: Wallet },
      { label: "Transaction Log", href: "/finance-officer/transactions", icon: Receipt },
      { label: "Fund Utilisation", href: "/finance-officer/utilisation", icon: PieChart },
      { label: "Notifications", href: "/finance-officer/notifications", icon: Bell },
    ],
  },
  "central-authority": {
    id: "central-authority",
    label: "Central Authority",
    username: "ba.centralauthority",
    home: "/central-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/central-authority/dashboard", icon: LayoutGrid },
      { label: "National Grievances", href: "/central-authority/grievances", icon: FolderOpen },
      { label: "State Comparison", href: "/central-authority/state-comparison", icon: FileBarChart },
      { label: "Scheme Performance", href: "/central-authority/scheme-performance", icon: PieChart },
      { label: "Fund Allocation", href: "/central-authority/fund-allocation", icon: Landmark },
      { label: "Reports & Export", href: "/central-authority/reports", icon: FileBarChart },
      { label: "Notifications", href: "/central-authority/notifications", icon: Bell },
    ],
  },
  "system-admin": {
    id: "system-admin",
    label: "System Administrator",
    username: "nhapoa_sysadmin",
    home: "/admin/dashboard",
    nav: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
      { label: "Grievance Monitoring", href: "/admin/grievances", icon: FolderOpen },
      { label: "SLA Monitor", href: "/admin/sla-monitor", icon: Timer },
      { label: "Officer Performance", href: "/admin/officer-performance", icon: FileBarChart },
      { label: "Grievance Analytics", href: "/admin/analytics", icon: PieChart },
      { label: "Geographic View", href: "/admin/geographic", icon: Map },
      { label: "Reports & Export", href: "/admin/reports", icon: FileBarChart },
      { label: "User Management", href: "/admin/users", icon: Users },
      { label: "Role Management", href: "/admin/roles", icon: Shield },
      { label: "Grievance Categories", href: "/admin/categories", icon: Tags },
      { label: "Feedbacks", href: "/admin/portal-feedback", icon: MessageSquare },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  "call-center": {
    id: "call-center",
    label: "Call Centre Operator",
    username: "ankitSharma",
    home: "/call-center/dashboard",
    nav: [
      { label: "Dashboard", href: "/call-center/dashboard", icon: LayoutGrid },
      { label: "Caller Details", href: "/call-center/caller", icon: Phone },
      { label: "Register Grievance", href: "/call-center/register-grievance", icon: FilePlus2 },
      { label: "Query", href: "/call-center/query", icon: MessageSquare },
      { label: "Query Log", href: "/call-center/queries", icon: FolderOpen },
      { label: "Directory Search", href: "/call-center/directory", icon: Users },
      { label: "Track Status", href: "/call-center/track", icon: FileSearch },
      { label: "Help & FAQs", href: "/call-center/faq", icon: HelpCircle },
    ],
  },
};

export const ADMIN_ROLES = Object.values(ROLES);

/** Resolve a role by its login username (case-insensitive). */
export function roleByUsername(username: string): RoleDef | undefined {
  const u = username.trim().toLowerCase();
  return ADMIN_ROLES.find((r) => r.username.toLowerCase() === u);
}
