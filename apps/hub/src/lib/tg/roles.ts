import {
  LayoutGrid,
  Users,
  Shield,
  KeyRound,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { AdminRoleId } from "./store/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleDef {
  id: AdminRoleId;
  label: string;
  /** Mock login id (email) — resolves the role; mock auth accepts any password. */
  email: string;
  /** Route the role lands on after login. */
  home: string;
  nav: NavItem[];
}

const DASHBOARD_ONLY: NavItem[] = [
  { label: "Dashboard", href: "/portals/tg/admin/dashboard", icon: LayoutGrid },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portals/tg/admin/dashboard", icon: LayoutGrid },
  { label: "User Management", href: "/portals/tg/admin/users", icon: Users },
  { label: "Role Management", href: "/portals/tg/admin/roles", icon: Shield },
  { label: "Password Policy", href: "/portals/tg/admin/password-policy", icon: KeyRound },
  { label: "Tenants", href: "/portals/tg/admin/tenants", icon: Building2 },
];

/**
 * The 4 TG admin roles. Citizens use a separate public-facing zone.
 * Emails mirror the live dev deployment shape; mock auth accepts any password
 * (demo: Demo@123). Central Admin gets the full management nav; the three
 * review roles (Examining Officer/Maker, Checker, District Magistrate) share
 * the dashboard-only shell and reach applications via the queue "View" action.
 */
export const ROLES: Record<AdminRoleId, RoleDef> = {
  "central-admin": {
    id: "central-admin",
    label: "Central Admin",
    email: "central.admin@mosje.in",
    home: "/portals/tg/admin/dashboard",
    nav: ADMIN_NAV,
  },
  "examining-officer": {
    id: "examining-officer",
    label: "Examining Officer",
    email: "examining.officer@mosje.in",
    home: "/portals/tg/admin/dashboard",
    nav: DASHBOARD_ONLY,
  },
  checker: {
    id: "checker",
    label: "Checker",
    email: "checker@mosje.in",
    home: "/portals/tg/admin/dashboard",
    nav: DASHBOARD_ONLY,
  },
  "district-magistrate": {
    id: "district-magistrate",
    label: "District Magistrate",
    email: "district.magistrate@mosje.in",
    home: "/portals/tg/admin/dashboard",
    nav: DASHBOARD_ONLY,
  },
};

export const ADMIN_ROLES = Object.values(ROLES);

/** Resolve a role by its login email (case-insensitive). */
export function roleByEmail(email: string): RoleDef | undefined {
  const e = email.trim().toLowerCase();
  return ADMIN_ROLES.find((r) => r.email.toLowerCase() === e);
}
