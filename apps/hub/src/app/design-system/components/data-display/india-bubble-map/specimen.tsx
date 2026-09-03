"use client";

import { IndiaBubbleMap } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <IndiaBubbleMap
      title="Applications Received by State"
      data={[
        { state: "Uttar Pradesh", value: 4520 },
        { state: "Maharashtra", value: 3180 },
        { state: "Bihar", value: 2740 },
        { state: "Delhi", value: 1960 },
        { state: "Kerala", value: 1240 },
      ]}
    />
  );
}
