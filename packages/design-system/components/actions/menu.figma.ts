// url=<SAMAVESH>?node-id=57541-4628
// source=packages/design-system/components/actions/menu.tsx
// component=Menu
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label");
const description = instance.getString("Description");
const showDescription = instance.getBoolean("Show description");
const showIcon = instance.getBoolean("Show icon");
const showTick = instance.getBoolean("Show tick");

const tone = instance.getEnum("Tone", {
  Neutral: "neutral",
  Warning: "warning",
  Danger: "danger",
});

/**
 * Figma publishes the ITEM; code publishes the menu, because a container of nine to
 * twelve rows is a variant explosion in Figma and adds nothing a designer can use.
 * This template emits a one-item menu.
 *
 * `Hover` is a rendering state, not a prop — the browser draws it. `Disabled` IS a
 * prop, and in code it sets `aria-disabled` rather than the native attribute, so the
 * item stays in the arrow-key sequence and a screen-reader user still learns the
 * action exists.
 */
const state = instance.getEnum("State", {
  Default: "default",
  Hover: "default",
  Disabled: "disabled",
});

const parts = [`id: "item-1"`, `label: "${label}"`];
if (showIcon) parts.push(`icon: "description"`);
if (showDescription) parts.push(`description: "${description}"`);
if (showTick) parts.push(`kind: "radio", checked: true`);
if (tone !== "neutral") parts.push(`tone: "${tone}"`);
if (state === "disabled") parts.push(`disabled: true`);

export default {
  example: figma.code`
    <Menu
      label="Actions for this application"
      items={[{ ${parts.join(", ")} }]}
      onSelect={run}
    >
      <IconButton icon="more_vert" label="Actions" />
    </Menu>
  `,
  imports: ['import { Menu } from "@mosje/design-system"'],
  id: "menu",
  metadata: { nestable: false },
};
