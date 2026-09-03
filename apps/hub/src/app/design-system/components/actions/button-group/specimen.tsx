"use client";

import { Button, ButtonGroup } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <ButtonGroup aria-label="Application actions">
        <Button>Approve</Button>
        <Button appearance="outlined">Return for Correction</Button>
      </ButtonGroup>
      {/* `attached` is for buttons that are ALTERNATIVES to one another. */}
      <ButtonGroup aria-label="Reporting period" attached>
        <Button appearance="outlined">Day</Button>
        <Button appearance="outlined">Week</Button>
        <Button appearance="outlined">Month</Button>
      </ButtonGroup>
    </div>
  );
}
