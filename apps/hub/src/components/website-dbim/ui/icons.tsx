import Image from "next/image";
import type * as React from "react";

/*
 * The DBIM design's contextual icons — every one taken from the DBIM Visual Library
 * (dbimtoolkit.digifootprint.gov.in → Visual Library → Iconography), line style, as
 * DBIM 3.0 §3.5 requires. The Material Symbols glyphs the design uses through `Icon`
 * are DBIM's Functional Icons, and are drawn from the same font DBIM exported them
 * from — see `dbim.css` (`--sa-font-icon`).
 *
 * The files in /website/dbim/icons/library/ are the library's SVGs with four defects
 * repaired and nothing redrawn (audit: docs/audit/dbim-icon-library-audit-2026-09-28.md):
 *   - fixed greys (#2D2D2D / #2B2B2B) → currentColor, so §3.7 iii (key colour or white)
 *     is decided by a token, not by the file;
 *   - canvases of eight different sizes → one 64 × 64 square, never stretched (§3.7 iv);
 *   - art running to the edge → inset to the §3.4 Figure 8 frame (2px in 24, 5.33 in 64);
 *   - see-through layers and full-canvas clip wrappers from auto-tracing → removed.
 *
 * Painted as a CSS mask over currentColor: the colour follows the text colour exactly as
 * an inline SVG would, while the traced paths (up to 12 KB each) are fetched once and
 * cached instead of being written into every page's HTML and RSC payload.
 */

export const DBIM_ICON_LIBRARY = {
  // Section headings and header controls
  "department": "Department",
  "offerings": "Offerings",
  "whats-new": "What's New",
  "recent-documents": "Recent Documents",
  "user-personas": "User Personas",
  "important-links": "Important Links",
  "social-media-marketing": "Social Media Marketing",
  "announcement": "Announcement",
  "skip-to-content": "Skip to Content",
  "language": "Language",
  "accessibility": "Accessibility",
  // About Us tiles
  "groups": "Groups",
  "organisation": "Organisation",
  "performance": "Performance",
  // Persona tiles
  "schemes": "Schemes",
  "tenders": "Tenders",
  "publications": "Publications",
  "job-opportunity": "Job Opportunity",
  // Files and navigation
  "pdf": "PDF",
  "home": "Home",
  // Social platforms (footer)
  "facebook": "Facebook",
  "x": "X",
  "youtube": "YouTube",
  "instagram": "Instagram",
  "whatsapp": "WhatsApp",
} as const;

/** A DBIM Visual Library icon, by the slug of its library title. */
export type DbimIconName = keyof typeof DBIM_ICON_LIBRARY;

/**
 * A DBIM icon. Decorative: the control or heading beside it carries the name.
 * Size it with `size` or with a class that sets width and height — DBIM 3.0 §3.4
 * allows 24, 32, 48 and 64.
 */
export function DbimIcon({ name, className, size }: { name: DbimIconName; className?: string; size?: number }) {
  const style = {
    "--db-icon-src": `url(/website/dbim/icons/library/${name}.svg)`,
    ...(size ? { width: size, height: size } : null),
  } as React.CSSProperties;
  return (
    <span
      className={className ? `db-icon ${className}` : "db-icon"}
      style={style}
      aria-hidden="true"
      data-icon={name}
    />
  );
}

/**
 * The National Emblem as the reference draws it in the header (57 × 100).
 *
 * Served as a file, not inlined: the drawing is one 196 KB path, and inlining it
 * would put 196 KB into every page's HTML. As a file it is fetched once and cached.
 */
export function DbimEmblem({ className, alt = "" }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/website/dbim/brand/emblem.svg"
      alt={alt}
      width={57}
      height={100}
      className={className}
      unoptimized
      priority
    />
  );
}
