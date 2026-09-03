"use client";

import { IndiaPointMap } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <IndiaPointMap
      title="Regional Offices"
      bubbles={[
        { id: "del", lon: 77.21, lat: 28.61, label: "New Delhi", value: 42 },
        { id: "mum", lon: 72.88, lat: 19.08, label: "Mumbai", value: 31 },
        { id: "kol", lon: 88.36, lat: 22.57, label: "Kolkata", value: 24 },
        { id: "che", lon: 80.27, lat: 13.08, label: "Chennai", value: 19 },
      ]}
    />
  );
}
