// url=<SAMAVESH>?node-id=57295-59399
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=SheetToggle
//
// The MOBILE masthead trigger. It opens Navbar/NavSheet, an overlay.
//
// It has NO state property, deliberately — that is the design, not an oversight.
// The sheet is dismissed by its own close button, so this control never shows a
// second glyph and has no state to set. If you find yourself wanting `expanded`
// here, you want MenuToggle and a sidebar.
//
// PROPERTY COVERAGE
//   Size -> deliberatelyOmitted. Large (48) beside the resting brand row, Default
//           (40) in the condensed bar and as the overflow trigger — CSS decides by
//           placement (`.ds-hdr-cond .ds-hdr-burger`). Added 2026-09-05.
//   State -> deliberatelyOmitted. Hover / Focused / Pressed are the nested
//            IconButton's states, surfaced so a screen can show a pressed trigger;
//            in code they are :hover, :focus-visible and :active.
import figma from "figma";

export default {
  example: figma.code`<SheetToggle
  open={sheetOpen}
  onOpen={() => setSheetOpen(true)}
  controlsId="nav-sheet"
/>`,
  imports: ['import { SheetToggle } from "@mosje/design-system"'],
  id: "navbar-sheet-toggle",
  metadata: { nestable: true },
};
