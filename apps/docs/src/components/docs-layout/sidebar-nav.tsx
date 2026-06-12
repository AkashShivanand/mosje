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
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`docs-nav__item${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {item.badge && (
                  <span className={`docs-nav__badge docs-nav__badge--${item.badge}`}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
