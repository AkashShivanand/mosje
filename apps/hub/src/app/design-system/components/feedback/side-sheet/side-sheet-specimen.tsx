"use client";

import * as React from "react";
import { SideSheet, Button } from "@mosje/design-system";

/**
 * Like Lightbox, SideSheet is an overlay — rendered `open` inline it sits over
 * the page documenting it. The specimen gives it a trigger and real state.
 *
 * Client component because `onClose` is a function and the docs page is a
 * Server Component (it exports `metadata`).
 */
export function SideSheetSpecimen(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button appearance="outlined" onClick={() => setOpen(true)}>
        Open side sheet
      </Button>
      <SideSheet open={open} title="Application Details" onClose={() => setOpen(false)}>
        <div style={{ padding: "var(--sa-padding-20)" }}>
          <p style={{ margin: 0 }}>Beneficiary application deep inspection panel.</p>
        </div>
      </SideSheet>
    </>
  );
}
