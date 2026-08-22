// url=<SAMAVESH>?node-id=55798-4566
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=SheetToggle
//
// The MOBILE masthead trigger. It opens Navbar/NavSheet, an overlay.
//
// It has NO Figma properties, deliberately — that is the design, not an oversight.
// The sheet is dismissed by its own close button, so this control never shows a
// second glyph and has no state to set. If you find yourself wanting `expanded`
// here, you want MenuToggle and a sidebar.
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
