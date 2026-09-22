"use client";

import { useRouter } from "next/navigation";
import { AccountMenu, Icon } from "@mosje/design-system";

export interface AccountUser {
  name: string;
  email?: string;
  role?: string;
  initials?: string;
}

/**
 * Avatar + dropdown shown in the masthead when "logged in" — the design
 * system's AccountMenu. Until 2026-09-22 this was a raw button over a
 * hand-built panel with its own outside-click listener: no keyboard
 * navigation, no Escape, no menu semantics.
 */
export function UserMenu({
  user,
  showProfile = false,
}: {
  user: AccountUser;
  showProfile?: boolean;
}) {
  const router = useRouter();
  return (
    <AccountMenu
      avatarSize={40}
      account={{ name: user.name, email: user.email, role: user.role }}
      items={[
        ...(showProfile
          ? [{ label: "Profile Settings", icon: <Icon name="settings" size={16} />, onSelect: () => router.push("/portals/scw/admin/profile") }]
          : []),
        { label: "Logout", icon: <Icon name="logout" size={16} />, danger: true, onSelect: () => router.push("/portals/scw/login") },
      ]}
    />
  );
}
