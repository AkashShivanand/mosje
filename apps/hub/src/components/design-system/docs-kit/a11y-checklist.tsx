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
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: "var(--ds-primary-tonal)", color: "var(--ds-primary)" }}>
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
