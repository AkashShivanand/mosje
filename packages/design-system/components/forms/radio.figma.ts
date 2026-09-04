// url=<SAMAVESH>?node-id=18-791
// source=packages/design-system/components/forms/radio.tsx
// component=Radio
import figma from "figma";

const instance = figma.selectedInstance;

/** Figma `Size` → `SelectionSize`. Exhaustive: all 3 options mapped. */
const size = instance.getEnum("Size", {
  Small: "sm",
  Medium: "md",
  Large: "lg",
});

/** Figma `Checked` → `defaultChecked`. Two values; a radio has no mixed state. */
const checked = instance.getEnum("Checked", {
  Off: false,
  On: true,
});

/**
 * Figma `State` is a presentation variant, not a prop — see checkbox.figma.ts. Only
 * `Disabled` has a counterpart.
 */
const disabled = instance.getEnum("State", {
  Enabled: false,
  Hover: false,
  Focused: false,
  Pressed: false,
  Disabled: true,
});

const label = instance.getString("Label");
const showLabel = instance.getBoolean("Show Label");
const description = instance.getString("Description");
const showDescription = instance.getBoolean("Show Description");
const invalid = instance.getBoolean("Invalid");
const required = instance.getBoolean("Required");

/*
 * `name` and `value` are REQUIRED in code and have no Figma property: they are what binds
 * options into one native group, which is a form decision rather than a drawing. The
 * snippet emits placeholders a developer must replace. Not modelled: readOnly,
 * labelPlacement, hideLabel (see checkbox.figma.ts); variant="card" is the `Selection Card` set.
 */

export default {
  example: figma.code`
    <Radio
      name="group-name"
      value="option-value"
      ${showLabel ? figma.code`label="${label}"` : figma.code`label="${label}" hideLabel`}
      ${showDescription ? figma.code`description="${description}"` : ""}
      ${size !== "md" ? figma.code`size="${size}"` : ""}
      ${checked ? "defaultChecked" : ""}
      ${invalid ? "invalid" : ""}
      ${required ? "required" : ""}
      ${disabled ? "disabled" : ""}
    />
  `,
  imports: ['import { Radio } from "@mosje/design-system"'],
  id: "radio",
  metadata: { nestable: true },
};
