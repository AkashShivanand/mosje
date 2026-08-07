import type { RoleId } from "./store/types";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
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
      { label: "Dashboard", href: "/portals/nhapoa/district-officer/dashboard", icon: "grid_view" },
      { label: "My Cases", href: "/portals/nhapoa/district-officer/cases", icon: "folder_open" },
      { label: "Clarifications", href: "/portals/nhapoa/district-officer/clarifications", icon: "feedback" },
      { label: "Investigation", href: "/portals/nhapoa/district-officer/investigation", icon: "search" },
      { label: "My Reports", href: "/portals/nhapoa/district-officer/reports", icon: "assessment" },
      { label: "SLA Monitor", href: "/portals/nhapoa/district-officer/sla", icon: "timer" },
      { label: "Notifications", href: "/portals/nhapoa/district-officer/notifications", icon: "notifications" },
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
      { label: "Dashboard", href: "/portals/nhapoa/district-officer/dashboard", icon: "grid_view" },
      { label: "My Cases", href: "/portals/nhapoa/district-officer/cases", icon: "folder_open" },
      { label: "Clarifications", href: "/portals/nhapoa/district-officer/clarifications", icon: "feedback" },
      { label: "Investigation", href: "/portals/nhapoa/district-officer/investigation", icon: "search" },
      { label: "My Reports", href: "/portals/nhapoa/district-officer/reports", icon: "assessment" },
      { label: "SLA Monitor", href: "/portals/nhapoa/district-officer/sla", icon: "timer" },
      { label: "Notifications", href: "/portals/nhapoa/district-officer/notifications", icon: "notifications" },
    ],
  },
  "state-authority": {
    id: "state-authority",
    label: "State Authority",
    username: "ba.stateauthority",
    home: "/portals/nhapoa/state-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/state-authority/dashboard", icon: "grid_view" },
      { label: "Pending Approvals", href: "/portals/nhapoa/state-authority/pending-approvals", icon: "check_box" },
      { label: "Approved Cases", href: "/portals/nhapoa/state-authority/approved-cases", icon: "folder_open" },
      { label: "Sent Back Cases", href: "/portals/nhapoa/state-authority/sent-back", icon: "feedback" },
      { label: "All Cases", href: "/portals/nhapoa/state-authority/all-cases", icon: "folder_open" },
      { label: "State Reports", href: "/portals/nhapoa/state-authority/reports", icon: "assessment" },
      { label: "SLA Monitor", href: "/portals/nhapoa/state-authority/sla", icon: "timer" },
      { label: "Notifications", href: "/portals/nhapoa/state-authority/notifications", icon: "notifications" },
    ],
  },
  "finance-officer": {
    id: "finance-officer",
    label: "Finance Officer",
    username: "ba.financeofficer",
    home: "/portals/nhapoa/finance-officer/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/finance-officer/dashboard", icon: "grid_view" },
      { label: "Disbursement Queue", href: "/portals/nhapoa/finance-officer/queue", icon: "account_balance_wallet" },
      { label: "Transaction Log", href: "/portals/nhapoa/finance-officer/transactions", icon: "receipt_long" },
      { label: "Fund Utilisation", href: "/portals/nhapoa/finance-officer/utilisation", icon: "pie_chart" },
      { label: "Notifications", href: "/portals/nhapoa/finance-officer/notifications", icon: "notifications" },
    ],
  },
  "central-authority": {
    id: "central-authority",
    label: "Central Authority",
    username: "ba.centralauthority",
    home: "/portals/nhapoa/central-authority/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/central-authority/dashboard", icon: "grid_view" },
      { label: "National Grievances", href: "/portals/nhapoa/central-authority/grievances", icon: "folder_open" },
      { label: "State Comparison", href: "/portals/nhapoa/central-authority/state-comparison", icon: "assessment" },
      { label: "Scheme Performance", href: "/portals/nhapoa/central-authority/scheme-performance", icon: "pie_chart" },
      { label: "Fund Allocation", href: "/portals/nhapoa/central-authority/fund-allocation", icon: "account_balance" },
      { label: "Reports & Export", href: "/portals/nhapoa/central-authority/reports", icon: "assessment" },
      { label: "Notifications", href: "/portals/nhapoa/central-authority/notifications", icon: "notifications" },
    ],
  },
  "system-admin": {
    id: "system-admin",
    label: "System Administrator",
    username: "nhapoa_sysadmin",
    home: "/portals/nhapoa/admin/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/admin/dashboard", icon: "grid_view" },
      { label: "Grievance Monitoring", href: "/portals/nhapoa/admin/grievances", icon: "folder_open" },
      { label: "SLA Monitor", href: "/portals/nhapoa/admin/sla-monitor", icon: "timer" },
      { label: "Officer Performance", href: "/portals/nhapoa/admin/officer-performance", icon: "assessment" },
      { label: "Grievance Analytics", href: "/portals/nhapoa/admin/analytics", icon: "pie_chart" },
      { label: "Geographic View", href: "/portals/nhapoa/admin/geographic", icon: "map" },
      { label: "Reports & Export", href: "/portals/nhapoa/admin/reports", icon: "assessment" },
      { label: "User Management", href: "/portals/nhapoa/admin/users", icon: "group" },
      { label: "Role Management", href: "/portals/nhapoa/admin/roles", icon: "shield" },
      { label: "Grievance Categories", href: "/portals/nhapoa/admin/categories", icon: "label" },
      { label: "Feedbacks", href: "/portals/nhapoa/admin/portal-feedback", icon: "chat" },
      { label: "Notifications", href: "/portals/nhapoa/admin/notifications", icon: "notifications" },
    ],
  },
  "call-center": {
    id: "call-center",
    label: "Call Centre Operator",
    username: "ankitSharma",
    home: "/portals/nhapoa/call-center/dashboard",
    nav: [
      { label: "Dashboard", href: "/portals/nhapoa/call-center/dashboard", icon: "grid_view" },
      { label: "Caller Details", href: "/portals/nhapoa/call-center/caller", icon: "call" },
      { label: "Register Grievance", href: "/portals/nhapoa/call-center/register-grievance", icon: "note_add" },
      { label: "Query", href: "/portals/nhapoa/call-center/query", icon: "chat" },
      { label: "Query Log", href: "/portals/nhapoa/call-center/queries", icon: "folder_open" },
      { label: "Directory Search", href: "/portals/nhapoa/call-center/directory", icon: "group" },
      { label: "Track Status", href: "/portals/nhapoa/call-center/track", icon: "find_in_page" },
      { label: "Help & FAQs", href: "/portals/nhapoa/call-center/faq", icon: "help" },
    ],
  },
};

export const ADMIN_ROLES = Object.values(ROLES);

/** Resolve a role by its login username (case-insensitive). */
export function roleByUsername(username: string): RoleDef | undefined {
  const u = username.trim().toLowerCase();
  return ADMIN_ROLES.find((r) => r.username.toLowerCase() === u);
}
