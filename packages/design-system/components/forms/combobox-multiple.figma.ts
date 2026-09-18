// url=<SAMAVESH>?node-id=58555-1985
// source=packages/design-system/components/forms/combobox.tsx
// component=Combobox
import figma from "figma";

const instance = figma.selectedInstance;

/** Figma `Size` → `FieldSize`. Exhaustive; Default is `md` and is omitted. */
const size = instance.getEnum("Size", {
  Small: "sm",
  Default: "md",
  Large: "lg",
  "Extra Large": "xl",
});

/** As the single set: only Error, Warning, Success, Disabled and Read Only become props. */
const state = instance.getEnum("State", {
  Empty: "empty",
  Hover: "empty",
  Focused: "empty",
  Filled: "filled",
  Error: "error",
  Warning: "warning",
  Success: "success",
  Disabled: "disabled",
  "Read Only": "readOnly",
});

const label = instance.getString("Label Text");
const required = instance.getBoolean("Required");
const optional = instance.getBoolean("Optional");
const showHint = instance.getBoolean("Hint");
const hint = instance.getString("Hint Text");
const message = instance.getString("Message Text");
const placeholder = instance.getString("Placeholder");
const labelHelp = instance.getBoolean("Label Help");

/*
 * Declared omitted in the fixture, and not read:
 *   Chip 3–6    — how many chips the picture shows; the real count is `value.length`.
 *   More        — the fold is `maxVisibleChips`, whose default (5) is what the master
 *                 draws; emitting it would add nothing.
 *   More Text   — the "+N more" count is computed by the component, never passed.
 *   chip labels — exposed nested Chip / Input instances; they are sample data.
 */
const placeholderIsDefault = placeholder === "Start typing to search";

export default {
  example: figma.code`
    <Combobox
      multiple
      label="${label}"
      options={options}
      value={chosen}
      onChange={setChosen}
      ${size !== "md" ? figma.code`size="${size}"` : ""}
      ${placeholderIsDefault ? "" : figma.code`placeholder="${placeholder}"`}
      ${showHint ? figma.code`hint="${hint}"` : ""}
      ${labelHelp ? figma.code`labelHelp={helpText}` : ""}
      ${state === "error" ? figma.code`error="${message}"` : ""}
      ${state === "warning" ? figma.code`warning="${message}"` : ""}
      ${state === "success" ? figma.code`success="${message}"` : ""}
      ${required ? "required" : ""}
      ${optional ? "optional" : ""}
      ${state === "disabled" ? "disabled" : ""}
      ${state === "readOnly" ? "readOnly" : ""}
    />
  `,
  imports: ['import { Combobox } from "@mosje/design-system"'],
  id: "combobox-multiple",
  metadata: { nestable: true },
};
