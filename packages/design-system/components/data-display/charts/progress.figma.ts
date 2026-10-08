// url=<SAMAVESH>?node-id=58870-1516
// source=packages/design-system/components/data-display/charts/progress.tsx
// component=Progress
import figma from "figma";

/*
 * Progress Bar (8 Oct 2026): one variant per whole percentage, because a Figma instance cannot
 * be given its own bar length any other way. The code takes the figure itself; `compact`
 * because the Figma set is the bare bar, with no label row.
 */
const instance = figma.selectedInstance;
const value = instance.getEnum(
  "Value",
  Object.fromEntries(Array.from({ length: 101 }, (_, i) => [String(i), String(i)])),
);

export default {
  example: figma.code`<Progress value={${value}} max={100} label="Utilisation of release" compact />`,
  imports: ['import { Progress } from "@mosje/design-system"'],
  id: "progress",
  metadata: { nestable: true },
};
