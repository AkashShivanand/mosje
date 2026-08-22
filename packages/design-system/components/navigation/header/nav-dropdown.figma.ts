// url=<SAMAVESH>?node-id=4300-1950
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=NavDropdown
//
// The simple single-column menu a nav item opens when it carries `children`.
// `NavItemLink` renders it for you — reach for it directly only outside a masthead.
//
// PROPERTY COVERAGE
//   Device -> deliberatelyOmitted. Figma-only: in code the dropdown is positioned by
//             CSS against its trigger, and below 1024px it does not render at all —
//             those entries flatten into NavSheet instead.
import figma from "figma";

export default {
  example: figma.code`<NavDropdown
  label="Department"
  items={[{ label: "About Us", href: "/about-us" }]}
  onSelect={() => setOpenLabel(null)}
/>`,
  imports: ['import { NavDropdown } from "@mosje/design-system"'],
  id: "navbar-nav-dropdown",
  metadata: { nestable: true },
};
