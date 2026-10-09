// url=<SAMAVESH>?node-id=58896-801
// source=packages/design-system/components/dashboard/headline-band.tsx
// component=HeadlineBand
import figma from "figma";

const instance = figma.selectedInstance;

/** Figures is how many sit beside the lead: the code's `figures` array, by length. */
const figures = instance.getEnum("Figures", { None: 0, One: 1, Four: 4 });

export default {
  example: figma.code`
    <HeadlineBand
      title="At a Glance, All India"
      lead={{ value: "34.83 Cr", label: "Total Outreach", context: "Persons reached by awareness activities, since launch" }}
      ${figures ? figma.code`figures={figures.slice(0, ${figures})}` : ""}
      linkAs={Link}
    />
  `,
  imports: ['import { HeadlineBand } from "@mosje/design-system"', 'import Link from "next/link"'],
  id: "headline-band",
  metadata: { nestable: false },
};
