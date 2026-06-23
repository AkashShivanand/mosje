// =============================================================================
// @mosje/design-system — Header (Navbar) barrel.
//   SiteHeader — the SAMAVESH Navbar (Website + Portal variants, 3-tier).
//   + shared parts: BrandLockup, AccountMenu.
// =============================================================================
export { SiteHeader } from "./site-header";
export type { SiteHeaderProps } from "./site-header";
export { BrandLockup } from "./brand-lockup";
export type { BrandLockupProps } from "./brand-lockup";
export { AccountMenu } from "./account-menu";
export type { AccountMenuProps } from "./account-menu";
// Functional accessibility-toolbar behaviour (text size + high contrast), reusable
// anywhere that needs the same controls (e.g. an accessibility widget).
export { useA11yToolbar, FONT_LEVELS } from "./a11y-controls";
export type { A11yToolbar, FontLevel } from "./a11y-controls";
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
