import * as React from "react";
import { cn } from "../../../utils/cn";
import type { BrandLines } from "./types";
import "./header.css";

export interface BrandLockupProps {
  /** National Emblem image URL (app supplies a basePath-aware src). */
  emblemSrc: string;
  emblemAlt?: string;
  /** Government text stack rendered beside the emblem. */
  lines: BrandLines;
  /** Home link href. @default "/" */
  href?: string;
  /** Show the BETA badge above the text stack. @default false */
  beta?: boolean;
  /** Compact lockup for the app-shell header (smaller emblem + tighter type). */
  compact?: boolean;
  /** Hide the text stack below a breakpoint (emblem-only on mobile). @default false */
  textHiddenOnMobile?: boolean;
  /**
   * Render for a dark ground — the text stack resolves to the inverse token.
   *
   * Portals whose masthead is navy used to hand-roll white text to get this, which
   * is how they ended up hand-rolling the whole lockup. Pass the white emblem
   * asset alongside it (`National_Emblem_logo_white.svg`).
   * @default false
   */
  inverse?: boolean;
  className?: string;
}

/**
 * SAMAVESH BrandLockup — the National Emblem + government text stack, matching the
 * UX4G / Portal Navbar Figma: a BETA badge on its own row above "Government of
 * India" (12/16) · "Ministry …" (12/16) · "Department …" (20/24 SemiBold), the four
 * rows flush at gap 0. Emblem 40x64. Measured against Figma 4235:3652.
 *
 * Server-safe; renders a plain <a>/<img> so it works in any basePath-ed zone.
 * Per estate rule, always the National Emblem — never an invented mark.
 */
export function BrandLockup({
  emblemSrc,
  emblemAlt = "National Emblem of India",
  lines,
  href = "/",
  beta = false,
  compact = false,
  textHiddenOnMobile = false,
  inverse = false,
  className,
}: BrandLockupProps): React.JSX.Element {
  return (
    <a
      href={href}
      className={cn("ds-hdr-lockup", compact && "is-compact", inverse && "is-inverse", className)}
      aria-label={`${lines.department} — Home`}
    >
      <img className="ds-hdr-lockup__emblem" src={emblemSrc} alt={emblemAlt} />
      <span
        className={cn(
          "ds-hdr-lockup__lines",
          textHiddenOnMobile && "is-hidden-mobile",
        )}
      >
        {beta && <span className="ds-hdr-badge">BETA</span>}
        {lines.org && <span className="ds-hdr-lockup__org">{lines.org}</span>}
        {lines.ministry && (
          <span className="ds-hdr-lockup__ministry">{lines.ministry}</span>
        )}
        <span className="ds-hdr-lockup__dept">{lines.department}</span>
      </span>
    </a>
  );
}
