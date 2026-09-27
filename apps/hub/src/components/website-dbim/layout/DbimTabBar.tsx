"use client";

import * as React from "react";
import Link from "next/link";
import { Icon, IconButton } from "@mosje/design-system";

import { dbimHref, type DbimLink } from "@/lib/website-dbim/nav";

/**
 * The inner page's sub-tab bar. Tabs never wrap: when they overflow (Archives has
 * eleven; a phone overflows any section) the row scrolls sideways with its scrollbar
 * hidden, and the reference's square primary-400 chevron appears at the end — and at
 * the start once scrolled — to page it. The active tab is scrolled into view on load
 * when it would otherwise be entirely out of sight.
 */
export function DbimTabBar({ tabs, active }: { tabs: DbimLink[]; active: string }) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });

  const measure = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft > 1, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 });
  }, []);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const current = el.querySelector<HTMLElement>('[aria-current="page"]');
    // Only when the active tab's START is out of sight — as the reference does, a
    // partly visible active tab is left where it is, with the chevron offering more.
    if (current && current.offsetLeft > el.clientWidth - 40) {
      el.scrollLeft = current.offsetLeft - 16;
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="db-tabs">
      <div className="db-container db-tabs__container">
        <nav className="db-tabs__bar" aria-label="Section pages">
          {edges.start && (
            <IconButton
              variant="neutral"
              appearance="text"
              className="db-tabs__scroll db-tabs__scroll--prev"
              aria-label="Scroll section pages back"
              onClick={() => page(-1)}
              icon={<Icon name="chevron_left" size={24} />}
            />
          )}
          <ul ref={listRef} className="db-tabs__list" onScroll={measure}>
            {tabs.map((t) => {
              const isActive = t.path === active;
              return (
                <li key={t.path}>
                  <Link
                    href={dbimHref(t.path)}
                    className={isActive ? "db-tabs__link is-active" : "db-tabs__link"}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {edges.end && (
            <IconButton
              variant="neutral"
              appearance="text"
              className="db-tabs__scroll db-tabs__scroll--next"
              aria-label="Scroll section pages forward"
              onClick={() => page(1)}
              icon={<Icon name="chevron_right" size={24} />}
            />
          )}
        </nav>
      </div>
    </div>
  );
}
