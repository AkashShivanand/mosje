"use client";
import * as React from "react";
import { NAV } from "@/lib/nav";

export function SidebarNav(): React.JSX.Element {
  const [pathname, setPathname] = React.useState("");

  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <nav className="docs-sidebar__nav" aria-label="Documentation navigation">
      {NAV.map((group) => (
        <div key={group.title} className="docs-nav__group">
          <div className="docs-nav__group-title">{group.title}</div>
          {group.items.map((item) => {
            const hrefBase = item.href.split("#")[0];
            // Root-level page: exact match only — avoids every path matching "/design-system"
            const isActive =
              hrefBase === "/design-system"
                ? pathname === "/design-system" || pathname === "/design-system/"
                : pathname === hrefBase || pathname.startsWith(hrefBase + "/");
            return (
              <a
                key={item.label}
                href={item.href}
                className={`docs-nav__item${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.badge && (
                  <span
                    className={`docs-nav__dot docs-nav__dot--${item.badge}`}
                    title={item.badge}
                    aria-hidden="true"
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
