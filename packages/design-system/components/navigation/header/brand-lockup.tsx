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
  /** Vertical gradient divider between emblem and text (portal navbar). @default false */
  divider?: boolean;
  /** Hide the text stack below a breakpoint (emblem-only on mobile). @default false */
  textHiddenOnMobile?: boolean;
  className?: string;
}

/**
 * SAMAVESH BrandLockup — the National Emblem + government text stack, matching the
 * UX4G / Portal Navbar Figma: a BETA badge on its own row above "Government of
 * India" (12px) · "Ministry …" (14px) · "Department …" (20px bold), with an
 * optional blue gradient divider between the emblem and text.
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
  divider = false,
  textHiddenOnMobile = false,
  className,
}: BrandLockupProps): React.JSX.Element {
  return (
    <a
      href={href}
      className={cn("ds-hdr-lockup", compact && "is-compact", className)}
      aria-label={`${lines.department} — Home`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ds-hdr-lockup__emblem" src={emblemSrc} alt={emblemAlt} />
      {divider && <span className="ds-hdr-lockup__divider" aria-hidden="true" />}
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
