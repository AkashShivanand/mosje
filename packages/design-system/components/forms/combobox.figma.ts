// url=<SAMAVESH>?node-id=58545-1291
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

/**
 * Figma `State`. Empty, Hover and Focused are pictures of the browser, not props.
 * Error, Warning and Success carry the message text; Disabled and Read Only are the
 * native attributes; Filled only says a value is present.
 */
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

/*
 * Read but not emitted as a literal:
 *   Value       — the drawn LABEL of the chosen option; `value` in code is the option's
 *                 value, which Figma cannot know. Emitted as a state variable instead.
 *   Label Help  — a boolean in Figma; `labelHelp` in code is the help CONTENT, which
 *                 the design does not carry. Emitted as a placeholder the developer fills.
 */
const labelHelp = instance.getBoolean("Label Help");
const placeholderIsDefault = placeholder === "Start typing to search";

export default {
  example: figma.code`
    <Combobox
      label="${label}"
      options={options}
      value={value}
      onChange={setValue}
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
  id: "combobox",
  metadata: { nestable: true },
};
