// url=<SAMAVESH>?node-id=57599-770
// source=packages/design-system/components/forms/inline-edit.tsx
// component=InlineEdit
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * The axis is the SHAPE OF THE DATA and of the write, never a prop:
 *
 * - Reading / Editing is internal. The component opens and closes its own field.
 * - Not recorded is `value=""`, and the component renders `emptyText`.
 * - Failed is what happens when `onSave` REJECTS. There is no `error` prop —
 *   the failure belongs to the write, not to the caller's state.
 *
 * The save is confirmed rather than optimistic and there is no prop to change
 * that, so nothing here maps to one.
 */
const state = instance.getEnum("State", {
  Reading: "reading",
  "Not recorded": "empty",
  Editing: "editing",
  Failed: "failed",
});

const value = state === "empty" ? '""' : '"Bankura"';

export default {
  example: figma.code`
    <InlineEdit
      label="District"
      value={${value}}
      onSave={async (next) => {
        await saveDistrict(next);   // reject and the reader keeps their text
      }}
    />
  `,
  imports: ['import { InlineEdit } from "@mosje/design-system"'],
  id: "inline-edit",
  metadata: { nestable: false },
};
