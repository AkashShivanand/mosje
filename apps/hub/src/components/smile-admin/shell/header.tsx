"use client";

import { Icon, SiteHeader } from "@mosje/design-system";
import type { AccountMenuItem } from "@mosje/design-system";
import { useApp } from "@/store/smile-admin/app-context";
import { ROLE_LABELS } from "@/lib/smile-admin/roles";
import { useRouter } from "next/navigation";

// smile-admin is mounted under basePath "/portals/smile-admin"; the shared DS
// renders a plain <img>, so public-asset srcs are prefixed explicitly.
const BP = "/portals/smile-admin";

export function Header() {
  const {
    account,
    signOut,
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileNavOpen,
  } = useApp();
  const router = useRouter();

  function onToggleNav() {
    // Mobile: open drawer. Desktop: toggle sidebar collapse.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setMobileNavOpen(true);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }

  const menu: AccountMenuItem[] = [
    {
      label: "Profile",
      icon: <Icon name="person" size={16} />,
      onSelect: () => router.push("/portals/smile-admin/users/onboard"),
    },
    {
      label: "Sign out",
      icon: <Icon name="logout" size={16} />,
      danger: true,
      onSelect: () => {
        signOut();
        router.push("/portals/smile-admin/login");
      },
    },
  ];

  return (
    <SiteHeader
      homeHref={BP}
      variant="portal"
      sticky
      emblemSrc={`${BP}/brand/national-emblem.svg`}
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "Department of Social Justice & Empowerment",
      }}
      beta
      onToggleNav={onToggleNav}
      /* Drives both the glyph (menu_open vs menu) and aria-expanded. The
         toggle is the sidebar's control, so it reads out the sidebar's state. */
      navExpanded={!sidebarCollapsed}
      navControlsId="smile-admin-sidebar"
      account={
        account
          ? {
              name: account.name,
              email: account.email,
              role: ROLE_LABELS[account.role],
            }
          : undefined
      }
      accountMenu={account ? menu : undefined}
    />
  );
}
