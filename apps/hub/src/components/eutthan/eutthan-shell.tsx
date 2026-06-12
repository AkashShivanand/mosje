"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { type NavItem } from "@/lib/eutthan/portal-data";
import { portalLink } from "./eutthan-shared";

export function TopBar({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="top-bar">
      <div className="top-left">
        <div className="flag" aria-hidden="true">
          <span />
        </div>
        <span className="goi-link">Government of India</span>
        <span className="divider" aria-hidden="true" />
        <span className="goi-link">
          Ministry of Social Justice &amp; Empowerment
        </span>
      </div>
      <div className="top-actions">
        <button type="button" aria-label="Notifications">
          <Bell size={15} />
        </button>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Logout"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export function Masthead({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="masthead">
      <div className="brand-block">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="30" cy="30" r="28" fill="#f3f4f6" stroke="#e5e7eb" />
          <circle cx="30" cy="18" r="5" fill="var(--primary)" />
          <path
            d="M30 23L18 45H42L30 23Z"
            fill="var(--primary)"
            opacity="0.65"
          />
        </svg>
        <div>
          <div className="brand-meta">
            <span>eUtthan Portal</span>
            <span className="beta">BETA</span>
          </div>
          <h1>DAPSC Allocation &amp; Progress Tracker</h1>
        </div>
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
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
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
            {item.icon && <item.icon size={18} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
