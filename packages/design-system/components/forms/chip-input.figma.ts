// url=<SAMAVESH>?node-id=58542-819
// source=packages/design-system/components/forms/chip.tsx
// component=Chip
import figma from "figma";

const instance = figma.selectedInstance;

/** `Removable` → an `onDismiss` handler; False is the read-only chip with no button. */
const removable = instance.getEnum("Removable", { True: true, False: false });
/** `State` → the native-style `disabled` prop. */
const disabled = instance.getEnum("State", { Default: false, Disabled: true });
const label = instance.getString("Label");

export default {
  example: figma.code`
    <Chip
      size="sm"
      ${removable ? figma.code`onDismiss={() => remove("${label}")} dismissLabel="Remove ${label}"` : ""}
      ${disabled ? "disabled" : ""}
    >
      ${label}
    </Chip>
  `,
  imports: ['import { Chip } from "@mosje/design-system"'],
  id: "chip-input",
  metadata: { nestable: true },
};
