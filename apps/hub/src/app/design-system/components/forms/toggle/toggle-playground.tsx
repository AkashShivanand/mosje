"use client";
import * as React from "react";
import { Toggle } from "@mosje/design-system";

export function TogglePlayground() {
  const [v1, setV1] = React.useState(true);
  const [v2, setV2] = React.useState(false);

  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-24)", maxWidth: "400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-text-neutral-base)" }}>Enable two-factor authentication</span>
        <Toggle checked={v1} onChange={(e) => setV1(e.target.checked)} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-text-neutral-base)" }}>Allow push notifications</span>
        <Toggle checked={v2} onChange={(e) => setV2(e.target.checked)} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.5 }}>
        <span style={{ fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-text-neutral-base)" }}>Enterprise features (Disabled)</span>
        <Toggle checked={true} disabled onChange={() => {}} />
      </div>
    </div>
  );
}
