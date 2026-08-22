// url=<SAMAVESH>?node-id=4258-33604
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=MegaMenuItem
//
// An organisation row: emblem, abbreviation, full name.
//
// PROPERTY COVERAGE
//   Org logo -> item.iconSrc   (a URL, not an import: each zone is mounted under its
//               own basePath and the design system cannot resolve one)
//   Active   -> item.active
//   State    -> deliberatelyOmitted. Hover / Focused / Disabled are CSS states.
import figma from "figma";

const instance = figma.selectedInstance;
const active = instance.getEnum("Active", { True: "true", False: "false" });

export default {
  example: figma.code`<MegaMenuItem
  item={{
    abbr: "NCSC",
    name: "National Commission for Scheduled Castes",
    href: "/website/organisation/…",
    iconSrc: \`\${basePath}/images/org-logos/ncsc.png\`,
    active: ${active},
  }}
  onSelect={close}
/>`,
  imports: ['import { MegaMenuItem } from "@mosje/design-system"'],
  id: "navbar-mega-menu-item",
  metadata: { nestable: true },
};
