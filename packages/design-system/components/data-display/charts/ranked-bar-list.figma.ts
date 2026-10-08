// url=<SAMAVESH>?node-id=57420-15961
// source=packages/design-system/components/data-display/charts/ranked-bar-list.tsx
// component=RankedBarList
import figma from "figma";

const instance = figma.selectedInstance;
// The rows are nested instances; Figma sets Show bar / Show detail per row, the code once for
// the list (`showBar`) and per item (`detail`). The first row stands for the list.
const row = instance.findInstance("row 1");
const showBar = row.getBoolean("Show bar");
const showDetail = row.getBoolean("Show detail");

export default {
  example: figma.code`
    <RankedBarList
      title="Top states by pledges"
      items={states.map((s) => ({ label: s.name, value: s.pledges${showDetail ? figma.code`, detail: s.detail` : ""}, href: \`/states/\${s.code}\` }))}
      ${showBar ? "" : figma.code`showBar={false}`}
      pageSize={8}
    />
  `,
  imports: ['import { RankedBarList } from "@mosje/design-system"'],
  id: "ranked-bar-list",
  metadata: { nestable: true },
};
