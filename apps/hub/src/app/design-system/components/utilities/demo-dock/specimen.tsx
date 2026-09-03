"use client";

import { DemoDock } from "@mosje/design-system";
import * as React from "react";

/*
  Rendered inline for the specimen. In the estate it is mounted once by the hub
  root layout and floats against the right wall — see the placement rule.
*/
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ position: "relative", minHeight: "16rem" }}>
      <DemoDock pathname="/portals/scw" />
    </div>
  );
}
