"use client";
import * as React from "react";

interface Heading { id: string; text: string; level: number; }

export function OnThisPage(): React.JSX.Element {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState("");

  // Reads the rendered DOM (headings only exist post-mount), so this can only
  // run in an effect — client-hydration pattern, hence the scoped disable.
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".docs-content h2, .docs-content h3"));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(els.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      level: parseInt(el.tagName[1] ?? "2"),
    })).filter((h) => h.id));
  }, []);

  React.useEffect(() => {
    if (headings.length === 0) return;
    // The top inset must equal the sticky header's height, or the heading that is
    // level with the header counts as "visible" and the wrong item highlights. Read
    // it from --docs-header-h rather than repeating the number: this used to be a
    // bare "-56px", which is how the two could drift apart unnoticed.
    const headerH =
      getComputedStyle(document.documentElement).getPropertyValue("--docs-header-h").trim() ||
      "0px";
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0 && visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: `-${headerH} 0px -60% 0px` }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length === 0) return <></>;

  return (
    <nav className="docs-toc" aria-label="On this page">
      <div className="docs-toc__title">On this page</div>
      <ul className="docs-toc__list">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`docs-toc__item${activeId === h.id ? " is-active" : ""}`}
              style={h.level === 3 ? { paddingLeft: "var(--sa-padding-xl)" } : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
