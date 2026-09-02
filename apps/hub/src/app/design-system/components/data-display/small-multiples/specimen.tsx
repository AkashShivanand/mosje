"use client";

import { BarChart, SmallMultiples, texturedColor } from "@mosje/design-system";
import * as React from "react";

const STATES = [
  { name: "Uttar Pradesh", values: [450, 380, 290] },
  { name: "Maharashtra", values: [310, 300, 260] },
  { name: "Bihar", values: [280, 210, 180] },
  { name: "Madhya Pradesh", values: [240, 230, 150] },
];
const CATEGORIES = ["SC", "ST", "OBC"];

/** Four panels, one shared scale, and texture as the second encoding. */
export function SmallMultiplesSpecimen(): React.JSX.Element {
  return (
    <SmallMultiples
      title="Applications by State and Category"
      items={STATES}
      columns={4}
      labelOf={(s) => s.name}
      valuesOf={(s) => s.values}
      renderItem={(s, sharedMax) => (
        <BarChart
          title={`${s.name} applications by category`}
          tableView="sr-only"
          textured
          max={sharedMax}
          height={140}
          data={s.values.map((v, i) => ({
            label: CATEGORIES[i] ?? String(i),
            value: v,
            color: texturedColor(i),
          }))}
        />
      )}
    />
  );
}
