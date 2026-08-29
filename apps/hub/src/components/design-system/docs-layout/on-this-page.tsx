"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@mosje/design-system";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function OnThisPage(): React.JSX.Element {
  const pathname = usePathname();
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Discover headings in page content when pathname changes or DOM updates
  React.useEffect(() => {
    const scanHeadings = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(
          ".docs-content h2, .docs-content h3",
        ),
      ).filter((el) => !el.closest("[data-no-toc]"));

      setHeadings(
        els
          .map((el) => ({
            id: el.id,
            text: el.textContent?.trim() ?? "",
            level: parseInt(el.tagName[1] ?? "2"),
          }))
          .filter((h) => h.id && h.text),
      );
    };

    // Immediate scan + brief timeout for client component renders
    scanHeadings();
    const t = setTimeout(scanHeadings, 150);
    return () => clearTimeout(t);
  }, [pathname]);

  React.useEffect(() => {
    if (headings.length === 0) return;
    const headerH =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--docs-header-h")
        .trim() || "0px";

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0 && visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: `-${headerH} 0px -60% 0px` },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [headings]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (headings.length === 0) return <></>;

  return (
    <>
      {/* Desktop TOC Rail */}
      <nav className="docs-toc" aria-label="On this page">
        <div className="docs-toc__title">On this page</div>
        <ul className="docs-toc__list">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => handleLinkClick(e, h.id)}
                className={`docs-toc__item${activeId === h.id ? " is-active" : ""}`}
                style={
                  h.level === 3
                    ? { paddingLeft: "var(--sa-padding-24)" }
                    : undefined
                }
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Floating TOC Trigger */}
      <div className="docs-mobile-toc-bar">
        <button
          type="button"
          className="docs-mobile-toc-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Table of contents"
          aria-expanded={mobileOpen}
        >
          <Icon name="list" size={20} />
          <span>On this page ({headings.length})</span>
        </button>
      </div>

      {/* Mobile TOC Bottom Sheet / Drawer */}
      {mobileOpen && (
        <div
          className="docs-mobile-toc-scrim"
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="On this page navigation"
        >
          <div
            className="docs-mobile-toc-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="docs-mobile-toc-header">
              <span className="docs-mobile-toc-title">On this page</span>
              <button
                type="button"
                className="docs-mobile-toc-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close table of contents"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <ul className="docs-mobile-toc-list">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => handleLinkClick(e, h.id)}
                    className={`docs-mobile-toc-link${activeId === h.id ? " is-active" : ""}`}
                    style={
                      h.level === 3
                        ? { paddingLeft: "var(--sa-padding-24)" }
                        : undefined
                    }
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
