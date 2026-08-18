import * as React from "react";

interface A11yItem {
  criterion: string;
  level: "A" | "AA" | "AAA" | "GIGW";
  description: string;
}

export function A11yChecklist({ items }: { items: A11yItem[] }): React.JSX.Element {
  return (
    <ul className="a11y-checklist" aria-label="Accessibility requirements">
      {items.map((item, i) => (
        <li key={i} className="a11y-checklist__item">
          <span className="a11y-checklist__icon" aria-hidden="true">✓</span>
          <div>
            <div className="a11y-checklist__criterion">
              {item.criterion}{" "}
              <span style={{ fontSize: "var(--sa-type-label-3-size)", fontWeight: 700, padding: "var(--sa-padding-2) var(--sa-padding-4)", borderRadius: "var(--sa-shape-4)", background: "var(--sa-color-action-primary-tonal)", color: "var(--sa-bg-brand-primary-bolder)" }}>
                WCAG {item.level}
              </span>
            </div>
            <div className="a11y-checklist__desc">{item.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
