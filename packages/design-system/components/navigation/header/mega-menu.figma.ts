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
//   Device -> deliberatelyOmitted. Figma-only: the three variants are CSS breakpoints.
//             Desktop is a 1272 panel of 400px columns 3-up; Tablet is 768 with 360px
//             columns 2-up; Mobile is not a grid at all but a vertical stack, which
//             is what NavSheet renders below 1024px — columns, headings and org rows
//             intact, not flattened to a list.
//
// NO COLUMN DIVIDERS. Figma's Col frames carry no strokes and the panel holds no
// divider nodes at any Device; 24px of gap does the separating. Hairlines were added
// in code once and removed again on 2026-08-24 when the design was actually checked.
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
