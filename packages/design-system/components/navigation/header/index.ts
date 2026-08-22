// =============================================================================
// @mosje/design-system — Header (Navbar) barrel.
//
//   SiteHeader — the SAMAVESH Navbar (website · portal · compact).
//
//   Every part the Figma Navbar page names is exported here as a real component,
//   so a surface that needs one WITHOUT the whole masthead imports it instead of
//   re-implementing it. Figma name → export:
//
//     Navbar/BrandLockup   → BrandLockup
//     Navbar/MenuToggle    → MenuToggle      (sidebar trigger; glyph mirrors state)
//     Navbar/SheetToggle   → SheetToggle     (NavSheet trigger; one state)
//     Navbar/NavItem       → NavItemLink     (see the name note in nav-parts.tsx)
//     Navbar/NavDropdown   → NavDropdown
//     Navbar/DropdownItem  → DropdownItem
//     Navbar/MegaMenu      → MegaMenu
//     Navbar/MegaMenuItem  → MegaMenuItem
//     Navbar/NavSheet      → NavSheet
//     AccountMenu          → AccountMenu
//
//   The accessibility bar is NOT re-declared here: SiteHeader nests the shared
//   <AccessibilityBar> from components/navigation, which is the one place it lives.
// =============================================================================
export { SiteHeader } from "./site-header";
export type { SiteHeaderProps } from "./site-header";
export { BrandLockup } from "./brand-lockup";
export type { BrandLockupProps } from "./brand-lockup";
export { AccountMenu } from "./account-menu";
export type { AccountMenuProps } from "./account-menu";
export {
  MenuToggle,
  SheetToggle,
  NavItemLink,
  NavDropdown,
  DropdownItem,
  MegaMenu,
  MegaMenuItem,
  NewTabHint,
} from "./nav-parts";
export type {
  MenuToggleProps,
  SheetToggleProps,
  NavItemLinkProps,
  NavDropdownProps,
  DropdownItemProps,
  MegaMenuProps,
  MegaMenuItemProps,
} from "./nav-parts";
export { NavSheet } from "./nav-sheet";
export type { NavSheetProps } from "./nav-sheet";
export type {
  NavLink,
  NavItem,
  NavColumn,
  NavMegaItem,
  HeaderVariant,
  BrandLines,
  BrandMark,
  HeaderSearch,
  UtilityTone,
  HeaderAccount,
  AccountMenuItem,
} from "./types";
