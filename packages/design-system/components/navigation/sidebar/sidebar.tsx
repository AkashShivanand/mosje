"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../icon";
import type {
  SidebarNavProps,
  SidebarNavItem,
  SidebarNavChild,
} from "./types";
import "./sidebar.css";

// ── Internal: chevron SVG ────────────────────────────────────────────────────

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Internal: resize handle SVG ─────────────────────────────────────────────

function HandleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="48"
      viewBox="0 0 16 48"
      fill="none"
      aria-hidden
    >
      {/* Subtle pill grip */}
      <rect x="7" y="18" width="2" height="12" rx="1" fill="currentColor" opacity=".4" />
      {/* Arrow hints */}
      <path
        d="M5 22l-2 2 2 2M11 22l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".5"
      />
    </svg>
  );
}

// ── Internal: child item ─────────────────────────────────────────────────────

function ChildItem({
  child,
  pathname,
  isLast,
}: {
  child: SidebarNavChild;
  pathname: string;
  isLast: boolean;
}) {
  const isActive =
    pathname === child.href || pathname.startsWith(child.href + "/");

  return (
    <li className={cn("ds-sidebar__child", isLast && "is-last")}>
      <a
        href={child.href}
        aria-current={isActive ? "page" : undefined}
        className={cn("ds-sidebar__child-label", isActive && "is-active")}
      >
        {child.label}
      </a>
    </li>
  );
}

// ── Internal: main nav item ──────────────────────────────────────────────────

function MainItem({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarNavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const hasChildren = Boolean(item.children?.length);

  const isSelfActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const isChildActive =
    hasChildren &&
    item.children!.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  const highlighted = isSelfActive || isChildActive;

  const [open, setOpen] = React.useState(highlighted);

  // Keep open when a child is active
  React.useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  const rowClass = cn("ds-sidebar__main-row", highlighted && "is-active");

  // Collapsed mode: icon-only with tooltip via title
  if (collapsed) {
    return (
      <div className="ds-sidebar__main-item">
        <a
          href={hasChildren ? undefined : item.href}
          title={item.label}
          aria-label={item.label}
          aria-current={isSelfActive ? "page" : undefined}
          className={rowClass}
          {...(hasChildren
            ? { role: "button", onClick: () => setOpen((o) => !o) }
            : {})}
        >
          <Icon name={item.icon} className="ds-sidebar__icon" aria-hidden />
        </a>
      </div>
    );
  }

  // Expanded mode — leaf item (no children)
  if (!hasChildren) {
    return (
      <div className="ds-sidebar__main-item">
        <a
          href={item.href}
          aria-current={isSelfActive ? "page" : undefined}
          className={rowClass}
        >
          <Icon name={item.icon} className="ds-sidebar__icon" aria-hidden />
          <span className="ds-sidebar__label">{item.label}</span>
          {item.badge != null && (
            <span className="ds-sidebar__badge" aria-label={`${item.badge} notifications`}>
              {item.badge}
            </span>
          )}
        </a>
      </div>
    );
  }

  // Expanded mode — group with children
  const groupId = `ds-sidebar-group-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="ds-sidebar__main-item">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={groupId}
        className={rowClass}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={item.icon} className="ds-sidebar__icon" aria-hidden />
        <span className="ds-sidebar__label">{item.label}</span>
        {item.badge != null && (
          <span className="ds-sidebar__badge" aria-label={`${item.badge} notifications`}>
            {item.badge}
          </span>
        )}
        <ChevronDown
          className={cn("ds-sidebar__chevron", open && "is-open")}
        />
      </button>
      {open && (
        <ul id={groupId} role="list" className="ds-sidebar__subnav">
          {item.children!.map((child, i) => (
            <ChildItem
              key={child.href}
              child={child}
              pathname={pathname}
              isLast={i === item.children!.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Public: SidebarNav ───────────────────────────────────────────────────────

/**
 * SidebarNav — portal app-shell left navigation.
 *
 * Figma source: SAMAVESH DS › Side Navigation › sidebar/sidebar-nav (4208:740)
 * Mirrors Portal DS › sidebar/type-1 (8190:16300).
 *
 * - Expanded (300px) / Collapsed (88px) modes.
 * - Two-level hierarchy: top-level items + optional collapsible children with
 *   a curved-connector visual matching the Figma design.
 * - Token-driven: `--ds-primary-50` active bg, `--ds-primary` active text.
 * - Optional collapse-control drag handle (showCollapseControl).
 *
 * @example
 * ```tsx
 * <SidebarNav
 *   groups={navGroups}
 *   pathname={usePathname()}
 *   collapsed={collapsed}
 *   onCollapsedChange={setCollapsed}
 *   showCollapseControl
 *   footer={<StatusFooter />}
 * />
 * ```
 */
export function SidebarNav({
  groups,
  pathname,
  collapsed = false,
  onCollapsedChange,
  showCollapseControl = false,
  footer,
  className,
}: SidebarNavProps): React.JSX.Element {
  return (
    <aside
      className={cn(
        "ds-sidebar",
        collapsed ? "is-collapsed" : "is-expanded",
        className
      )}
      aria-label="Portal navigation"
    >
      <nav className="ds-sidebar__nav" aria-label="Main navigation">
        {groups.map((group, gi) => (
          <div key={gi} className="ds-sidebar__group">
            {group.label && !collapsed && (
              <div className="ds-sidebar__group-label" aria-hidden>
                {group.label}
              </div>
            )}
            <ul role="list" className="ds-sidebar__group-items">
              {group.items.map((item) => (
                <li key={item.href}>
                  <MainItem
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && <div className="ds-sidebar__footer">{footer}</div>}

      {showCollapseControl && onCollapsedChange && (
        <button
          type="button"
          className="ds-sidebar__control"
          onClick={() => onCollapsedChange(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="ds-sidebar__control-line" aria-hidden />
          <HandleIcon className="ds-sidebar__control-handle" />
          <div className="ds-sidebar__control-line" aria-hidden />
        </button>
      )}
    </aside>
  );
}
