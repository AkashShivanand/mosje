// url=<SAMAVESH>?node-id=2065-292757
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=NavItemLink
//
// One primary nav entry plus whichever menu it carries.
//
// NAME NOTE: the Figma component is `Navbar/NavItemLink`, but `NavItem` is already the
// DATA TYPE every consumer passes to `nav`. A TypeScript type and a component
// cannot share one name in one barrel, so the component is `NavItemLink` and the
// type keeps the name callers already write. Do not "fix" the snippet to `NavItem`.
//
// PROPERTY COVERAGE
//   Label  -> item.label
//   Active -> item.active   (renders aria-current="page")
//   Type   -> deliberatelyOmitted. Default vs Dropdown is not a prop: it is implied
//             by the DATA. `children` renders a dropdown, `columns` a mega-menu,
//             neither renders a plain link. A `type` prop could contradict the data.
//   State  -> deliberatelyOmitted. Hover / Focused / Disabled are CSS states, not
//             props — a caller cannot set "hovered".
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label#2065:0");
const active = instance.getEnum("Active", { True: "true", False: "false" });

export default {
  example: figma.code`<NavItemLink
  item={{ label: "${label}", href: "/…", active: ${active} }}
  open={openLabel === "${label}"}
  onOpenChange={(next) => setOpenLabel(next ? "${label}" : null)}
/>`,
  imports: ['import { NavItemLink } from "@mosje/design-system"'],
  id: "navbar-nav-item-link",
  metadata: { nestable: true },
};
