// url=<SAMAVESH>?node-id=57609-759
// source=packages/design-system/components/data-display/bulk-actions-bar.tsx
// component=BulkActionsBar
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is whether the select-all offer is drawn, which in code is the
 * presence of `total` and `onSelectAll` rather than a flag. At `count={0}` the
 * component renders NOTHING, which is why there is no empty variant to map.
 */
const selectAll = instance.getEnum("Select all", {
  Hidden: "hidden",
  Shown: "shown",
});

const all = selectAll === "shown" ? figma.code`total={240} onSelectAll={selectEvery}` : "";

export default {
  example: figma.code`
    <BulkActionsBar
      count={3}
      noun="application"
      onClear={clearSelection}
      onAction={run}
      ${all}
      actions={[
        { id: "return", label: "Return for correction", tone: "warning" },
        { id: "reject", label: "Reject", tone: "danger" },
      ]}
    />
  `,
  imports: ['import { BulkActionsBar } from "@mosje/design-system"'],
  id: "bulk-actions-bar",
  metadata: { nestable: false },
};
