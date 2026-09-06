"use client";

import { DemoAccountsPanel } from "@mosje/design-system";
import * as React from "react";

/**
 * The panel is a BODY — it draws no surface of its own, because the shell that
 * renders it (DemoDock, DemoFab) owns one. So the specimen supplies the white
 * card it really sits in. Without it the component was documented on the
 * specimen's own grey ground, which is the same token as the row hover wash,
 * so the row's hover and focus states were invisible on the one page that
 * exists to show them.
 */
export function Specimen(): React.JSX.Element {
  return (
    <div
      style={{
        maxWidth: "24rem",
        borderRadius: "var(--sa-shape-8)",
        border: "1px solid var(--sa-border-neutral-base)",
        backgroundColor: "var(--sa-bg-neutral-base)",
      }}
    >
      <DemoAccountsPanel
        idLabel="Mobile number"
        accounts={[
          { role: "Volunteer", id: "9876543210", password: "demo@1234" },
          { role: "SAGE Organisation", id: "9876500000", password: "demo@1234" },
        ]}
      />
    </div>
  );
}
