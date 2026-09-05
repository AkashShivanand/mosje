// url=<SAMAVESH>?node-id=55783-4565
// source=packages/design-system/components/navigation/header/nav-parts.tsx
// component=MenuToggle
//
// The trigger for a PERSISTENT SIDEBAR. Its glyph is the sidebar's state, not its
// own: the sidebar is on screen either way, so the control says which way it will
// go. That is why it takes `expanded`.
//
// DO NOT USE THIS FOR THE MOBILE MASTHEAD. There the trigger opens Navbar/NavSheet,
// an overlay dismissed by its own close button — nothing to mirror, so it has one
// glyph and no state. Use SheetToggle. Putting a sidebar-shaped property on the
// overlay trigger describes state that does not exist.
//
// PROPERTY COVERAGE
//   Sidebar -> expanded   (Expanded ⇒ true ⇒ menu_open · Collapsed ⇒ false ⇒ menu)
//   Size    -> deliberatelyOmitted. Large (48) in the resting brand row, Default (40)
//              in the condensed bar — decided by WHERE the control sits, in CSS
//              (`.ds-hdr-cond__toggle`), never by a prop. Added to the master
//              2026-09-05 so the condensed bar could be drawn at the code's size.
//   State   -> deliberatelyOmitted. Hover / Focused / Pressed are the nested
//              IconButton's states surfaced on the toggle so a screen can show a
//              hovered or pressed trigger. In code they are :hover, :focus-visible
//              and :active — a caller cannot set "hovered".
import figma from "figma";

const instance = figma.selectedInstance;

const expanded = instance.getEnum("Sidebar", {
  Expanded: "true",
  Collapsed: "false",
});

export default {
  example: figma.code`<MenuToggle
  expanded={${expanded}}
  onToggle={toggleSidebar}
  controlsId="portal-sidebar"
/>`,
  imports: ['import { MenuToggle } from "@mosje/design-system"'],
  id: "navbar-menu-toggle",
  metadata: { nestable: true },
};
