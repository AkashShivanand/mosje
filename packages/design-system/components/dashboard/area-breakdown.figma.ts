// url=<SAMAVESH>?node-id=58898-1167
// source=packages/design-system/components/dashboard/area-breakdown.tsx
// component=AreaBreakdown
import figma from "figma";

const instance = figma.selectedInstance;

/** Measures is the length of `measures`: two or more draw the segmented switch. */
const measures = instance.getEnum("Measures", { One: 1, Two: 2 });

export default {
  example: figma.code`
    <AreaBreakdown
      measures={${measures === 2 ? figma.code`[identified, rehabilitated]` : figma.code`[outreach]`}}
      valueFormat={compactCount}
      onSelectArea={(state) => go({ state })}
    />
  `,
  imports: ['import { AreaBreakdown, compactCount } from "@mosje/design-system"'],
  id: "area-breakdown",
  metadata: { nestable: false },
};
