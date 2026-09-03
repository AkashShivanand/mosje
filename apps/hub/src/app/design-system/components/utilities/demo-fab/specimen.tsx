"use client";

import { DemoFab } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ position: "relative", minHeight: "14rem" }}>
      <DemoFab
        idLabel="Mobile number"
        accounts={[{ role: "Volunteer", id: "9876543210", password: "demo@1234" }]}
      />
    </div>
  );
}
