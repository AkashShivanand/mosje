import * as React from "react";

type Status = "Proposed" | "Alpha" | "Beta" | "Stable" | "Deprecated";
const DOTS: Record<Status, string> = {
  Proposed: "○", Alpha: "◑", Beta: "◕", Stable: "●", Deprecated: "✕",
};

export function StatusBadge({ status }: { status: Status }): React.JSX.Element {
  return (
    <span className={`status-badge status-badge--${status}`} aria-label={`Component status: ${status}`}>
      <span aria-hidden="true">{DOTS[status]}</span>
      {status}
    </span>
  );
}
