import * as React from "react";

export type Status = "Proposed" | "Alpha" | "Beta" | "Stable" | "Deprecated" | "New";
const DOTS: Record<Status, string> = {
  Proposed: "○", Alpha: "◑", Beta: "◕", Stable: "●", Deprecated: "✕", New: "★",
};

export function StatusBadge({ status }: { status: Status }): React.JSX.Element {
  return (
    <span className={`status-badge status-badge--${status}`} aria-label={`Component status: ${status}`}>
      <span aria-hidden="true">{DOTS[status]}</span>
      {status}
    </span>
  );
}
