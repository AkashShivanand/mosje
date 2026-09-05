"use client";

import { Icon, IconButton } from "@mosje/design-system";
import * as React from "react";
const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const row: React.CSSProperties = { display: "flex", gap: "var(--sa-inline-12)", alignItems: "center", flexWrap: "wrap" };
const dark: React.CSSProperties = { ...row, padding: "var(--sa-padding-16)", background: "var(--sa-bg-brand-primary-bolder)", borderRadius: "var(--sa-shape-8)" };
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
    <div style={stack}>
      <div style={{ display: "flex", gap: "var(--sa-inline-8)" }}>
        <IconButton aria-label="Edit this application" icon={<Icon name="edit" size={20} />} />
        <IconButton aria-label="Close" appearance="outlined" icon={<Icon name="close" size={20} />} />
      </div>
      <p style={eyebrow}>Arrangements the master grid does not show</p>
      <div style={row}>
        <IconButton aria-label="Add a beneficiary" size="sm" appearance="outlined" variant="neutral" icon={<Icon name="add" size={16} />} />
        <IconButton aria-label="Send the application" size="lg" appearance="filled" icon={<Icon name="send" size={24} />} />
        <IconButton aria-label="Delete this document" variant="danger" appearance="text" icon={<Icon name="delete" size={20} />} />
        <IconButton aria-label="Mark as verified" variant="success" appearance="filled" icon={<Icon name="check" size={20} />} />
        <IconButton aria-label="Refreshing the list" loading icon={<Icon name="refresh" size={20} />} />
        <IconButton aria-label="Edit this application" disabled icon={<Icon name="edit" size={20} />} />
        <IconButton aria-label="Open the National Portal of India" href="https://www.india.gov.in" external icon={<Icon name="open_in_new" size={20} />} />
      </div>
      <div style={dark}>
        <IconButton aria-label="Close the banner" tone="inverse" appearance="outlined" icon={<Icon name="close" size={20} />} />
        <IconButton aria-label="Search schemes" tone="inverse" appearance="text" icon={<Icon name="search" size={20} />} />
      </div>
    </div>
  );
}
