"use client";

import { Button, ButtonGroup } from "@mosje/design-system";
import * as React from "react";
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

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
      <p style={eyebrow}>Arrangements the master grid does not show</p>
      <ButtonGroup aria-label="Application actions, one destructive" align="between">
        <Button variant="danger" appearance="outlined">Withdraw Application</Button>
        <Button>Save and Continue</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Form actions, aligned to the end" align="end">
        <Button appearance="text" variant="neutral">Cancel</Button>
        <Button appearance="outlined" disabled>Save Draft</Button>
        <Button loading>Submitting…</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Actions on a narrow screen" vertical>
        <Button>Approve</Button>
        <Button appearance="outlined">Return for Correction</Button>
        <Button appearance="text" variant="neutral">View History</Button>
      </ButtonGroup>
    </div>
  );
}
