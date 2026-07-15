import * as React from "react";

const ICONS = { info: "ℹ️", warning: "⚠️", tip: "💡", danger: "🚨" };

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps): React.JSX.Element {
  return (
    <div className={`callout callout--${type}`} role={type === "danger" ? "alert" : undefined}>
      <span className="callout__icon" aria-hidden="true">{ICONS[type]}</span>
      <div>
        {title && <div className="callout__title">{title}</div>}
        {children}
      </div>
    </div>
  );
}
