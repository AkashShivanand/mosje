"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Button, Icon, SideSheet } from "@mosje/design-system";

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
      ).filter(
        (el) =>
          !el.closest("[data-no-toc]") &&
          // A heading inside a RENDERED design-system component belongs to the
          // thing being demonstrated, not to this page. The template marks the
          // top specimen `data-no-toc`, but a page that renders a component
          // inside a tab has no such wrapper — thirteen do — and the Site
          // Footer's four column headings and its Related Links heading were
          // offered as navigation for a documentation page that has no such
          // sections.
          // `.ds-prose` is this app's own prose helper, not a component, and
          // the Contributing page puts real headings inside one.
          !el.closest('[class*="ds-"]:not(.ds-prose)') &&
          // A heading in a tab the reader is not on is not on the page. The
          // docs tabs mount every panel and hide the inactive ones, so the
          // contents list offered "The Four Content Shapes", "Example" and
          // "Criteria This Component Meets" while the Design tab was open —
          // and a `hidden` element has no layout, so each of those links
          // scrolled nowhere at all.
          !el.closest("[hidden]"),
      );

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

    // Switching tabs changes only the `?tab=` query, not the path, so nothing
    // above re-runs — and the list would go stale the moment a reader moved off
    // Design. Watching the attribute the tabs actually toggle re-scans without
    // reaching for `useSearchParams`, which would need its own Suspense
    // boundary here.
    const content = document.querySelector(".docs-content");
    const obs = content
      ? new MutationObserver(() => scanHeadings())
      : null;
    if (obs && content) {
      obs.observe(content, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    }

    return () => {
      clearTimeout(t);
      obs?.disconnect();
    };
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
        <Button
          className="docs-mobile-toc-btn"
          size="sm"
          iconLeft={<Icon name="list" size={20} />}
          onClick={() => setMobileOpen(true)}
          aria-label="Table of contents"
          aria-expanded={mobileOpen}
        >
          On This Page ({headings.length})
        </Button>
      </div>

      {/* The design system's SideSheet from the bottom edge: it owns the scrim, the
          focus trap, Escape and scroll lock the hand-built sheet here lacked. */}
      <SideSheet open={mobileOpen} onClose={() => setMobileOpen(false)} title="On This Page" side="bottom">
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
      </SideSheet>
    </>
  );
}
