"use client";

import { DemoAccountsPanel } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "24rem" }}>
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
