"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@mosje/design-system";
import { NAV, type NavGroup, type NavItem } from "@/lib/design-system/nav";

const ROOT = "/design-system";

const basePath = (href: string) =>
  (href.split("#")[0] ?? href).replace(/\/$/, "") || "/";
const hashOf = (href: string) => {
  const i = href.indexOf("#");
  return i === -1 ? "" : href.slice(i);
};

/**
 * The documentation site's own left navigation — groups of pages with a quick
 * filter, hash-anchor tracking and badges. It is NOT the design system's
 * SidebarNav (the portal rail): that one has a route-driven current state,
 * icons on every item and a collapsed mode, none of which a docs index needs.
 * It was named SidebarNav until 2026-09-05, which made a grep for hand-rolled
 * rails report the docs chrome as one.
 */
export function DocsNav(): React.JSX.Element {
  const pathname = usePathname() ?? "";
  const [currentHash, setCurrentHash] = React.useState("");
  const [filterQuery, setFilterQuery] = React.useState("");
  const [collapsedGroups, setCollapsedGroups] = React.useState<
    Record<string, boolean>
  >({});

  const cleanPath = pathname.replace(/\/$/, "");

  // Listen to hash changes on the window
  React.useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filter groups based on search query
  const filteredNav: NavGroup[] = React.useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return NAV;
    return NAV.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.href.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q)),
      ),
    })).filter((group) => group.items.length > 0);
  }, [filterQuery]);

  return (
    <div className="docs-sidebar__container">
      {/* Quick Filter Search Box */}
      <div className="docs-sidebar__filter">
        <div className="docs-sidebar__filter-wrap">
          <Icon name="search" size={16} className="docs-sidebar__filter-icon" />
          <input
            type="text"
            className="docs-sidebar__filter-input"
            placeholder="Filter components..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            aria-label="Filter documentation links"
          />
          {filterQuery && (
            <button
              type="button"
              className="docs-sidebar__filter-clear"
              onClick={() => setFilterQuery("")}
              aria-label="Clear filter"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>
      </div>

      <nav className="docs-sidebar__nav" aria-label="Documentation navigation">
        {filteredNav.map((group) => {
          const isCollapsed = Boolean(collapsedGroups[group.title]);

          return (
            <div
              key={group.title}
              className={`docs-nav__group${isCollapsed && !filterQuery ? " is-collapsed" : ""}`}
            >
              <button
                type="button"
                className="docs-nav__group-header"
                onClick={() => toggleGroup(group.title)}
                aria-expanded={!isCollapsed || Boolean(filterQuery)}
              >
                <span className="docs-nav__group-title">
                  {group.title}
                  <span className="docs-nav__group-count">
                    ({group.items.length})
                  </span>
                </span>
                <Icon
                  name={isCollapsed && !filterQuery ? "expand_more" : "expand_less"}
                  size={16}
                  className="docs-nav__group-chevron"
                />
              </button>

              {(!isCollapsed || Boolean(filterQuery)) && (
                <div className="docs-nav__group-items">
                  {group.items.map((item: NavItem) => {
                    const b = basePath(item.href);
                    const h = hashOf(item.href);
                    const onPath =
                      b === ROOT ? cleanPath === ROOT : cleanPath === b;

                    let isActive = false;
                    if (onPath) {
                      if (h) {
                        isActive = currentHash === h;
                      } else {
                        const hashHitsSibling =
                          currentHash !== "" &&
                          group.items.some(
                            (s) =>
                              s !== item &&
                              basePath(s.href) === b &&
                              hashOf(s.href) === currentHash,
                          );
                        isActive = !hashHitsSibling;
                      }
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`docs-nav__item${isActive ? " is-active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.badge && (
                          <span
                            className={`docs-nav__dot docs-nav__dot--${item.badge}`}
                            title={`Status: ${item.badge}`}
                            aria-hidden="true"
                          />
                        )}
                        <span className="docs-nav__label">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`docs-nav__badge docs-nav__badge--${item.badge.toLowerCase()}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
