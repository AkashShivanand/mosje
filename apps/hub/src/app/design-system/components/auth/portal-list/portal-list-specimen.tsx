"use client";

import * as React from "react";
import { Button, PortalList, SideSheet } from "@mosje/design-system";

/**
 * The picker as a surface actually composes it — `SideSheet` + `PortalList` —
 * beside the list on its own, so a reader can see both the part and the whole.
 */
export function PortalListSpecimen(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [planned, setPlanned] = React.useState(false);

  return (
    <div
      style={{
        padding: "var(--sa-padding-24)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <Button onClick={() => setOpen(true)}>Open the picker</Button>
        <Button appearance="outlined" variant="neutral" onClick={() => setPlanned((p) => !p)}>
          {planned ? "Live portals only" : "Include portals not open yet"}
        </Button>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--sa-bg-neutral-base)",
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-16)",
        }}
      >
        <PortalList includePlanned={planned} activePath="/portals/e-anudaan" />
      </div>

      <SideSheet open={open} onClose={() => setOpen(false)} title="Choose a portal to login">
        <PortalList activePath="/portals/e-anudaan" />
      </SideSheet>
    </div>
  );
}
