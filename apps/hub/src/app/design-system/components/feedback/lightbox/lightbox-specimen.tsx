"use client";

import * as React from "react";
import { Lightbox, Button } from "@mosje/design-system";

/**
 * A Lightbox is a modal overlay, so it cannot be shown inline the way a Button
 * or a Badge can — rendered `open`, it covers the documentation it is meant to
 * illustrate. The specimen is therefore a trigger plus real open/close state,
 * which also demonstrates the only interaction the component has.
 *
 * It is a client component because `onClose` is a function, and a Server
 * Component cannot pass one across the boundary. The docs page itself must stay
 * a Server Component: it exports `metadata`, which "use client" forbids.
 */
export function LightboxSpecimen(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button appearance="outlined" onClick={() => setOpen(true)}>
        Open lightbox
      </Button>
      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        items={[{ type: "image", src: "/design-system/samavesh-logo.svg", caption: "Beneficiary Camp 2026" }]}
      />
    </>
  );
}
