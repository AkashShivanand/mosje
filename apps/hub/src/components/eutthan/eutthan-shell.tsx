"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader, Icon, type AccountMenuItem } from "@mosje/design-system";
import { type NavItem } from "@/lib/eutthan/portal-data";
import { portalLink } from "./eutthan-shared";

export function EutthanHeader({
  name,
  roleLabel,
  onLogout,
}: {
  name: string;
  roleLabel: string;
  onLogout: () => void;
}) {
  const accountMenu: AccountMenuItem[] = [
    {
      label: "Notifications",
      icon: <Icon name="notifications" size={16} />,
      onSelect: () => {},
    },
    {
      label: "Logout",
      icon: <Icon name="logout" size={16} />,
      danger: true,
      onSelect: onLogout,
    },
  ];

  return (
    <SiteHeader
      homeHref={portalLink("/")}
      variant="portal"
      sticky
      emblemSrc="/images/National-Emblem-logo.svg"
      brandLines={{
        org: "Government of India",
        ministry: "Ministry of Social Justice & Empowerment",
        department: "DAPSC Allocation & Progress Tracker",
      }}
      beta
      skipTo="#eu-main-content"
      govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
      language={{ label: "English" }}
      account={{
        name,
        role: roleLabel,
      }}
      accountMenu={accountMenu}
    />
  );
}

export function Sidebar({ navItems, path }: { navItems: NavItem[]; path: string }) {
  const [reportsOpen, setReportsOpen] = useState(() =>
    path.startsWith("/reports")
  );

  return (
    <nav className="sidebar" aria-label="Main navigation">
      {navItems.map((item) => {
        if (item.children) {
          const anyActive = item.children.some((c) => c.href === path);
          const open = reportsOpen || anyActive;
          return (
            <div key={item.href}>
              <button
                type="button"
                className={`nav-item${anyActive ? " active" : ""}`}
                style={{
                  width: "100%",
                  border: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
                onClick={() => setReportsOpen((o) => !o)}
              >
                {item.icon && <Icon name={item.icon} size={18} />}
                <span>{item.label}</span>
                {open ? <Icon name="keyboard_arrow_down" size={14} /> : <Icon name="keyboard_arrow_right" size={14} />}
              </button>
              {open && (
                <div style={{ paddingLeft: 16 }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={portalLink(child.href)}
                      className={`nav-item sub${child.href === path ? " active" : ""}`}
                      aria-current={child.href === path ? "page" : undefined}
                    >
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={portalLink(item.href)}
            className={`nav-item${item.href === path ? " active" : ""}`}
            aria-current={item.href === path ? "page" : undefined}
          >
            {item.icon && <Icon name={item.icon} size={18} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
