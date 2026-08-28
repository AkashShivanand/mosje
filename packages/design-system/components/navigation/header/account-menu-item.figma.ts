// url=<SAMAVESH>?node-id=56040-4083
// source=packages/design-system/components/navigation/header/types.ts
// component=AccountMenuItem
//
// One row inside the AccountMenu popover.
//
// NOT A COMPONENT — A DATA SHAPE. There is no `<AccountMenuItem>` to import; rows
// are objects in AccountMenu's `items` array and the menu renders them. Figma needs
// a component to hang the states on, code does not. Do not "fix" this by extracting
// a component nobody would call.
//
// PROPERTY COVERAGE
//   Label     -> label
//   Show icon -> omit `icon`
//   Tone      -> danger (Tone=Danger is `danger: true`)
//   State     -> deliberatelyOmitted. Default / Hover / Focused are CSS states.
//
// There is no Disabled state, deliberately: an action the signed-in user cannot take
// is left out of the menu rather than shown greyed, so the menu never advertises a
// dead end.
import figma from "figma";

const instance = figma.selectedInstance;
const label = instance.getString("Label#56040:0");
const showIcon = instance.getBoolean("Show icon#56040:7");
const tone = instance.getEnum("Tone", { Default: "", Danger: "\n  danger: true," });

export default {
  example: figma.code`// one entry in AccountMenu's \`items\`
{
  label: "${label}",
  onSelect: () => {},${showIcon ? figma.code`
  icon: <Icon name="person" size={16} />,` : ""}${tone}
}`,
  imports: ['import type { AccountMenuItem } from "@mosje/design-system"'],
  id: "navbar-account-menu-item",
  metadata: { nestable: true },
};
