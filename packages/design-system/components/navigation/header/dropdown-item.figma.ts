// url=<SAMAVESH>?node-id=4299-1940
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=DropdownItem
//
// One row inside a simple nav dropdown.
//
// PROPERTY COVERAGE
//   Active -> item.active
//   State  -> deliberatelyOmitted. Hover / Focused / Disabled are CSS states, not
//             props a caller sets.
import figma from "figma";

const instance = figma.selectedInstance;
const active = instance.getEnum("Active", { True: "true", False: "false" });

export default {
  example: figma.code`<DropdownItem
  item={{ label: "About Us", href: "/about-us", active: ${active} }}
  onSelect={close}
/>`,
  imports: ['import { DropdownItem } from "@mosje/design-system"'],
  id: "navbar-dropdown-item",
  metadata: { nestable: true },
};
