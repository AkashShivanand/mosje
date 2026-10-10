// url=<SAMAVESH>?node-id=58898-1461
// source=packages/design-system/components/dashboard/area-breakdown.tsx
// component=AreaExplorer
import figma from "figma";

const instance = figma.selectedInstance;

/** State is whether `selected` is set: the extremes until a State/UT is picked. */
const picked = instance.getEnum("State", { Extremes: false, Picked: true });

export default {
  example: figma.code`
    <AreaExplorer
      measureName="Total Outreach · NMBA"
      rows={rows}
      valueFormat={compactCount}
      ${picked ? figma.code`selected="Kerala"` : figma.code`selected={undefined}`}
      onSelect={setPicked}
      ${picked ? figma.code`selectedContent={<DescriptionList size="figure" columns={1} divided items={stateFacts} />}` : ""}
    />
  `,
  imports: ['import { AreaExplorer, DescriptionList, compactCount } from "@mosje/design-system"'],
  id: "area-explorer",
  metadata: { nestable: false },
};
