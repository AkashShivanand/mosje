"use client";

import { useState } from "react";
import Link from "next/link";
import { AccessibilityBar, BrandLockup, Icon } from "@mosje/design-system";
import { type NavItem } from "@/lib/eutthan/portal-data";
import { portalLink } from "./eutthan-shared";

export function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="top-bar">
      {/* The government utility strip is the shared DS AccessibilityBar. This
          portal drew its own — a CSS `.flag` block and two plain spans — which
          carried no skip link, no text-size control and no accessibility entry,
          so the one row on the page that exists to serve those needs served none
          of them. */}
      <AccessibilityBar
        layout="fluid"
        govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
        skipTo="#eu-main-content"
        showSkip
        fontSize
        accessibility
        language={{ label: "English" }}
      />
      <div className="top-actions">
        <button type="button" aria-label="Notifications">
          <Icon name="notifications" size={15} />
        </button>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Icon name="logout" size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export function Masthead({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="masthead">
      {/* This block used to draw an invented mark — a circle and a triangle in
          inline SVG — where the National Emblem belongs. That is an estate rule,
          not a preference (CLAUDE.md): the mark is the National Emblem, never an
          abstract or invented one. The DS lockup is the only place it comes from. */}
      <div className="brand-block">
        <BrandLockup
          emblemSrc="/images/National-Emblem-logo.svg"
          lines={{
            org: "Government of India",
            ministry: "Ministry of Social Justice & Empowerment",
            department: "DAPSC Allocation & Progress Tracker",
          }}
          href={portalLink("/")}
          beta
          compact
        />
      </div>
      <div className="profile">
        <div>
          <strong>{name}</strong>
          <small>{roleLabel}</small>
        </div>
        <div className="avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
      </div>
    </div>
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
