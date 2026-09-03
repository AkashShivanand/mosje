// url=<SAMAVESH>?node-id=56793-1214
// source=packages/design-system/components/actions/button-group.tsx
// component=ButtonGroup
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Attached` → `attached`. The segmented form, for buttons that are ALTERNATIVES
 * to one another. Its variants draw the selected segment as Filled among Outlined
 * neighbours, which in code is `aria-pressed` on the Button — not a prop on the group.
 */
const attached = instance.getEnum("Attached", {
  No: false,
  Yes: true,
});

/**
 * Figma `Orientation` → `vertical`. Modelled as an enum here because a designer picks a
 * direction, and as a boolean in code because there are exactly two and `vertical` reads
 * better at the call site than `orientation="horizontal"`.
 */
const vertical = instance.getEnum("Orientation", {
  Horizontal: false,
  Vertical: true,
});

/**
 * `align` has NO variant, deliberately. It says where the group sits inside its parent,
 * which a component set cannot show without inventing a parent — so it is omitted here
 * and declared in the fixture's `deliberatelyOmitted` rather than being silently dropped.
 *
 * `aria-label` is required by the type system and has no Figma counterpart either: it
 * names the group for a screen reader, and only the consumer knows what the group is.
 * The snippet emits a placeholder so it cannot be forgotten.
 */
export default {
  example: figma.code`
    <ButtonGroup
      aria-label="Describe this group"
      ${vertical ? "vertical" : ""}
      ${attached ? "attached" : ""}
    >
      {/* Buttons go here. In an attached group, mark the current one with aria-pressed. */}
    </ButtonGroup>
  `,
  imports: ['import { ButtonGroup } from "@mosje/design-system"'],
  id: "button-group",
  metadata: { nestable: false },
};
