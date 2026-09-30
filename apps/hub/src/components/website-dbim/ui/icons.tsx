import Image from "next/image";
import type * as React from "react";

/*
 * The DBIM design's contextual icons — every one taken from the DBIM Visual Library
 * (dbimtoolkit.digifootprint.gov.in → Visual Library → Iconography), line style, as
 * DBIM 3.0 §3.5 requires. The Material Symbols glyphs the design uses through `Icon`
 * are DBIM's Functional Icons, and are drawn from the same font DBIM exported them
 * from — see `dbim.css` (`--sa-font-icon`).
 *
 * The files in /website/dbim/icons/library/ are the library's drawings with five defects
 * repaired (audit: docs/audit/dbim-icon-library-audit-2026-09-28.md). They are EXPORTED
 * from the DBIM Figma handoff file (xdv8nEd7PhnRhahASd9UPY, page Icons & Logos) — edit the
 * glyph there, then re-export; do not hand-edit these files:
 *   - fixed greys (#2D2D2D / #2B2B2B) → currentColor, so §3.7 iii (key colour or white)
 *     is decided by a token, not by the file;
 *   - canvases of eight different sizes → one 64 × 64 square, never stretched (§3.7 iv);
 *   - art running to the edge → inset to the §3.4 Figure 8 frame (2px in 24, 5.33 in 64);
 *   - see-through layers and full-canvas clip wrappers from auto-tracing → removed;
 *   - line weights from 1.5 to 5.3 units → one weight, 3.0 units at 64 (1.5px at 32).
 *
 * Two glyphs are the DBIM 3.0 manual's own figures rather than the downloadable bank,
 * because the manual draws these exact sections with them and the design follows the
 * manual (instruction, 29 Sep 2026): `our-team` is the two-figure "Who's who" of Figure 55,
 * `social-media` the globe-and-player of Figure 61. They were the reference template's
 * glyphs until 28 Sep 2026, when the bank's Groups and Social Media Marketing replaced them.
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
  "social-media": "Social Media", // DBIM 3.0 Figure 61
  "announcement": "Announcement",
  "skip-to-content": "Skip to Content",
  "language": "Language",
  "accessibility": "Accessibility",
  // Log In or Register (§5.4). The Visual Library bank has no profile glyph: this is
  // Material Symbols Outlined account_circle, weight 400 — what the DBIM Toolkit's own
  // header draws for its login — exported from the handoff file's Icon/Account Circle.
  "account-circle": "Account Circle",
  // About Us tiles
  "our-team": "Our Team", // DBIM 3.0 Figure 55, "Who's who"
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
  // Functional Icons drawn as files, for design-system parts that are not an `Icon`:
  // the Select chevron, the mobile menu's close and the photo viewer's controls (dbim.css,
  // chrome.css)
  "expand-more": "Expand More",
  "close": "Close",
  "chevron-left": "Chevron Left",
  "chevron-right": "Chevron Right",
  "play-arrow": "Play Arrow",
  // Material's format_quote, FILLED, turned half a circle so it opens — the PM quote
  // band's mark (home/PmQuote.tsx). The static Outlined instance is FILL0 only.
  "format-quote": "Format Quote",
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
