import * as React from "react";
import { Icon } from "@mosje/design-system";

// Material Symbols names, not emoji — the design-system docs should be built
// out of the icon system they document, and emoji render differently per OS.
const ICONS = {
  info: "info",
  warning: "warning",
  tip: "lightbulb",
  danger: "e911_emergency",
} as const;

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps): React.JSX.Element {
  return (
    <div className={`callout callout--${type}`} role={type === "danger" ? "alert" : undefined}>
      <span className="callout__icon" aria-hidden="true">
        <Icon name={ICONS[type]} size={20} />
      </span>
      <div>
        {title && <div className="callout__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
