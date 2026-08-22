// url=<SAMAVESH>?node-id=4268-914
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=MegaMenu
//
// The multi-column organisation grid a nav item opens when it carries `columns`.
// Use it for org-heavy groupings (Commissions / Corporations / Councils) where a
// single column would scroll awkwardly. `columns` wins over `children` when both
// are given.
//
// PROPERTY COVERAGE
//   Device -> deliberatelyOmitted. Figma-only: the grid is CSS, and below 1024px it
//             does not render — NavSheet flattens the columns into one list, because
//             a 344px sheet has no room for a grid.
import figma from "figma";

export default {
  example: figma.code`<MegaMenu
  label="Associated Organisations"
  columns={[
    { heading: "Commissions", items: [{ abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/…" }] },
  ]}
  onSelect={close}
/>`,
  imports: ['import { MegaMenu } from "@mosje/design-system"'],
  id: "navbar-mega-menu",
  metadata: { nestable: true },
};
