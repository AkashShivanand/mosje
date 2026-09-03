// url=<SAMAVESH>?node-id=3-3497
// source=packages/design-system/components/actions/icon-button.tsx
// component=IconButton
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Sub-type` → `ButtonAppearance`. Exhaustive, and 1:1 with code since the
 * 2026-08-27 migration.
 *
 * Two things changed on the Figma side to make this mapping honest. `Tonal` was deleted
 * (zero instances, and the appearance no longer exists in code — its fill and border were
 * the same pale wash, so it had no findable edge). And the property was `Type` with a
 * value called `Default` that rendered with NO fill and NO stroke — it was the *text*
 * appearance wearing a name that made the quietest option sound like the normal one.
 */
/**
 * Figma `Type` → `ButtonVariant`. ADDED 2026-09-03, with the axis itself.
 *
 * The set had Size x Sub-type x State and nothing else, so a danger icon button — the
 * delete control on a table row, the commonest icon-only action in the estate — could not
 * be drawn at all, while `IconButton` extends `ButtonProps` and has always rendered one.
 * UX4G's own icon button carries a Color axis (Primary | Neutral), so we were behind the
 * library we descend from as well as behind the field.
 */
const variant = instance.getEnum("Type", {
  Primary: "primary",
  Success: "success",
  Danger: "danger",
  Neutral: "neutral",
});

const appearance = instance.getEnum("Sub-type", {
  Text: "text",
  Outlined: "outlined",
  Filled: "filled",
});

/** Figma `Size` → `ButtonSize`. Figma's "Default" is the code default `md`. */
const size = instance.getEnum("Size", {
  Large: "lg",
  Default: "md",
  Small: "sm",
});

/**
 * Figma `State` is a presentation variant, not a prop — hover, pressed and focused are CSS
 * states the browser owns. Only `Disabled` has a real counterpart.
 */
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Pressed: false,
  Focused: false,
  Disabled: true,
});

const icon = instance.getInstanceSwap("Change Icon");
let iconCode;
if (icon && icon.type === "INSTANCE") {
  iconCode = icon.executeTemplate().example;
}

/**
 * DIVERGENCES, recorded rather than papered over:
 *
 * 1. `aria-label` is REQUIRED by the code component and has no Figma counterpart — the set
 *    carries no text property, because an icon button has no visible label. The snippet
 *    therefore emits a placeholder a developer must replace. That is deliberate: it fails
 *    loudly at review rather than shipping an unlabelled control, and it is the whole
 *    reason IconButton is a component rather than an `iconOnly` prop on Button.
 *
 * 2. Figma has no INTENT axis (`variant`) and no `tone`, so a `danger` or inverse icon
 *    button cannot be expressed by a designer even though the code supports both. Logged
 *    in `docs/design-system/components/button.md`; resolve by adding the axes in Figma,
 *    not by removing them from code.
 */
export default {
  example: figma.code`
    <IconButton
      variant="${variant}"
      appearance="${appearance}"
      size="${size}"
      ${disabled ? "disabled" : ""}
      icon={${iconCode}}
      aria-label="TODO: what the control DOES, not what the glyph depicts"
    />
  `,
  imports: ['import { IconButton } from "@mosje/design-system"'],
  id: "icon-button",
  metadata: { nestable: true },
};
