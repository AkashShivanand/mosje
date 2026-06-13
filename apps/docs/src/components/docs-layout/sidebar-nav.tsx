"use client";
import * as React from "react";
import { NAV } from "@/lib/nav";

const ROOT = "/design-system";

const basePath = (href: string) => (href.split("#")[0] ?? href).replace(/\/$/, "") || "/";
const hashOf = (href: string) => {
  const i = href.indexOf("#");
  return i === -1 ? "" : href.slice(i);
};

interface Loc {
  path: string;
  hash: string;
}

/** Track pathname + hash so anchor nav items light up independently. */
function useLocation(): Loc {
  const [loc, setLoc] = React.useState<Loc>({ path: "", hash: "" });
  React.useEffect(() => {
    const update = () =>
      setLoc({
        path: window.location.pathname.replace(/\/$/, ""),
        hash: window.location.hash,
      });
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  return loc;
}

export function SidebarNav(): React.JSX.Element {
  const loc = useLocation();

  return (
    <nav className="docs-sidebar__nav" aria-label="Documentation navigation">
      {NAV.map((group) => (
        <div key={group.title} className="docs-nav__group">
          <div className="docs-nav__group-title">{group.title}</div>
          {group.items.map((item) => {
            const b = basePath(item.href);
            const h = hashOf(item.href);
            // Exact path match — a parent route never lights up on its children
            // (e.g. "Overview" /resources stays off on /resources/changelog).
            const onPath = b === ROOT ? loc.path === ROOT : loc.path === b;

            let isActive = false;
            if (onPath) {
              if (h) {
                // Anchor item: active only when the current hash matches it.
                isActive = loc.hash === h;
              } else {
                // Bare page item: active unless the current hash points to a
                // sibling anchor that shares this base path.
                const hashHitsSibling =
                  loc.hash !== "" &&
                  group.items.some(
                    (s) =>
                      s !== item &&
                      basePath(s.href) === b &&
                      hashOf(s.href) === loc.hash,
                  );
                isActive = !hashHitsSibling;
              }
            }

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
