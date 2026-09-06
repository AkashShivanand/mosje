// url=<SAMAVESH>?node-id=57616-830
// source=packages/design-system/components/data-display/transfer-list.tsx
// component=TransferList
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is what the reader has ticked and what is left, neither of which is a
 * prop: ticking is the component's own state, and "nothing left" is simply every
 * id being in `selectedIds`.
 *
 * Give it `items` plus `selectedIds`, never two arrays — the caller keeps one
 * list and the component splits it.
 */
const state = instance.getEnum("State", {
  Default: "default",
  Ticked: "ticked",
  "Nothing left": "exhausted",
});

const selected =
  state === "exhausted"
    ? '["bankura", "nadia", "purulia", "gaya"]'
    : '["bankura", "nadia"]';

export default {
  example: figma.code`
    <TransferList
      label="Districts mapped to this surveyor"
      availableLabel="Available districts"
      selectedLabel="Mapped districts"
      items={districts}
      selectedIds={${selected}}
      onChange={setMapped}
    />
  `,
  imports: ['import { TransferList } from "@mosje/design-system"'],
  id: "transfer-list",
  metadata: { nestable: false },
};
