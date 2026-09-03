"use client";

import { Grid, GridItem } from "@mosje/design-system";
import * as React from "react";

const box: React.CSSProperties = {
  background: "var(--sa-bg-neutral-subtler)",
  padding: "var(--sa-padding-16)",
  borderRadius: "var(--sa-shape-4)",
};

/** `span` is RESPONSIVE: one cell can be full width on a phone and half on a laptop. */
export function Specimen(): React.JSX.Element {
  return (
    <Grid columns={4}>
      <GridItem span={{ base: 4, md: 2 }}><div style={box}>4 on mobile, 2 from md</div></GridItem>
      <GridItem span={{ base: 2, md: 1 }}><div style={box}>2 / 1</div></GridItem>
      <GridItem span={{ base: 2, md: 1 }}><div style={box}>2 / 1</div></GridItem>
      <GridItem span={{ base: 4 }}><div style={box}>always 4</div></GridItem>
    </Grid>
  );
}
