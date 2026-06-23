// =============================================================================
// @mosje/design-system — Navbar shared types (server-safe, no "use client").
// SiteHeader (the SAMAVESH Navbar: Website + Portal variants) composes these.
// Apps pass data + asset URLs; the DS stays framework-agnostic (plain <a>/<img>,
// --ds-* tokens only).
// =============================================================================

/** A single navigation link. */
export interface NavLink {
  label: string;
  href: string;
  /** Marks the current page (renders the active treatment). */
  active?: boolean;
  /** Open in a new tab (adds rel="noreferrer"). */
  external?: boolean;
}

/**
 * A rich mega-menu item — an organisation/scheme row with an emblem, an
 * abbreviation (title) and a full name (description). Matches the Figma
 * `mega-menu-item` component.
 */
export interface NavMegaItem {
  /** Short title, e.g. "NCSC". */
  abbr: string;
  /** Full name / description, e.g. "National Commission for Scheduled Castes". */
  name: string;
  href: string;
  /** Emblem image URL (basePath-aware). Falls back to a neutral chip when absent. */
  iconSrc?: string;
  /** Open in a new tab (adds rel="noreferrer"). */
  external?: boolean;
  /** Marks the current page. */
  active?: boolean;
}

/**
 * A titled column inside a mega-menu (e.g. "Commissions"). Carry EITHER:
 *  - `items` — rich org rows (emblem + abbr + name), OR
 *  - `links` — plain text links.
 * If both are present, `items` wins.
 */
export interface NavColumn {
  /** Column heading (optional — omit for an untitled column). */
  heading?: string;
  links?: NavLink[];
  items?: NavMegaItem[];
}

/**
 * A primary nav entry. It can carry EITHER:
 *  - `children` — a simple single-column dropdown, OR
 *  - `columns`  — a multi-column mega-menu (org-heavy menus like
 *    "Associated Organisations": Commissions / Corporations / Councils).
 * If both are given, `columns` wins.
 */
export interface NavItem extends NavLink {
  children?: NavLink[];
  columns?: NavColumn[];
}

/** Which estate surface the header serves. Drives sensible behavioural defaults. */
export type HeaderVariant = "website" | "portal";

/** The three-line government text stack rendered beside the National Emblem. */
export interface BrandLines {
  /** e.g. "Government of India" (small, muted). */
  org?: string;
  /** e.g. "Ministry of Social Justice & Empowerment" (small, muted). */
  ministry?: string;
  /** e.g. "Department of Social Justice & Empowerment" (bold, primary line). */
  department: string;
}

/** A trailing brand mark (Digital India, SAMAVESH, …). */
export interface BrandMark {
  src: string;
  alt: string;
  href?: string;
  /** Rendered height in px (width auto). @default 44 */
  height?: number;
}

/** Controlled search field config shared by both headers. */
export interface HeaderSearch {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Accessible label. @default placeholder */
  ariaLabel?: string;
}

/** Utility-bar background tone. Blue = website default, navy = portal chrome. */
export type UtilityTone = "blue" | "navy";

/** The signed-in user rendered by the portal account block / dropdown. */
export interface HeaderAccount {
  name: string;
  email?: string;
  /** Human-readable role label, e.g. "State Nodal Officer". */
  role?: string;
  /** Avatar image URL. When absent, initials are derived from `name`. */
  avatarSrc?: string;
}

/** An item in the account dropdown. */
export interface AccountMenuItem {
  label: string;
  onSelect: () => void;
  /** Optional leading icon node (inline SVG). */
  icon?: React.ReactNode;
  /** Renders the destructive treatment (e.g. Sign out). */
  danger?: boolean;
}
