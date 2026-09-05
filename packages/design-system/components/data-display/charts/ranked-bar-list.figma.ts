// url=<SAMAVESH>?node-id=57420-15961
// source=packages/design-system/components/data-display/charts/ranked-bar-list.tsx
// component=RankedBarList
import figma from "figma";

/**
 * The `Ranked Bar List` master is a composition of five `Ranked Bar Row`
 * instances and carries no properties of its own: a designer overrides label,
 * value and fill per row, and switches Rank off on the row for a breakdown.
 * The code takes the rows as data, so the snippet shows the data shape.
 */
export default {
  example: figma.code`
    <RankedBarList
      title="Top states by pledges"
      items={states.map((s) => ({ label: s.name, value: s.pledges, href: \`/states/\${s.code}\` }))}
      pageSize={8}
    />
  `,
  imports: ['import { RankedBarList } from "@mosje/design-system"'],
  id: "ranked-bar-list",
  metadata: { nestable: true },
};
