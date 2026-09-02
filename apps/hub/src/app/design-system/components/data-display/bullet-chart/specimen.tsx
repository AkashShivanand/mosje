"use client";

import { BulletChart } from "@mosje/design-system";
import * as React from "react";

export function BulletChartSpecimen(): React.JSX.Element {
  return (
    <BulletChart
      title="Scheme Delivery Against Target"
      unit="₹ crore"
      rows={[
        { label: "Grants Released", value: 940, target: 1200, ranges: [600, 1000], max: 1400 },
        { label: "Utilisation Certified", value: 610, target: 940, ranges: [400, 800], max: 1400 },
        { label: "Hostels Completed", value: 128, target: 110, ranges: [60, 100], max: 140 },
      ]}
    />
  );
}
