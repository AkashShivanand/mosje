// url=<SAMAVESH>?node-id=57420-16040
// source=packages/design-system/components/data-display/charts/internal/legend.tsx
// component=Legend
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Swatch` → the `swatch` of every `LegendItem`. Solid is a categorical
 * series; Ramp is the sequential scale under a choropleth or heatmap; Dots are
 * marker shapes for a point map, where shape is the second encoding. The items
 * themselves are data, so the snippet shows the shape one item takes.
 */
const swatch = instance.getEnum("Swatch", {
  Solid: "solid",
  Ramp: "ramp",
  Dots: "dots",
});

export default {
  example: figma.code`
    <Legend items={series.map((s, i) => ({ label: s.name, color: categoricalColor(i), value: s.total, swatch: "${swatch}" }))} />
  `,
  imports: ['import { Legend, categoricalColor } from "@mosje/design-system"'],
  id: "legend",
  metadata: { nestable: true },
};
