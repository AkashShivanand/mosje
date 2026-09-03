"use client";

import { Icon, IconButton } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "flex", gap: "var(--sa-inline-8)" }}>
      <IconButton aria-label="Edit this application" icon={<Icon name="edit" size={20} />} />
      <IconButton aria-label="Close" appearance="outlined" icon={<Icon name="close" size={20} />} />
    </div>
  );
}
