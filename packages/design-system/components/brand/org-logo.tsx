"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { orgLogoSrc, portalLogoSrc, type OrgSlug } from "./org-logo-registry";
import "./org-logo.css";

/*
 * Re-exported so a consumer imports one name from one place. The SPLIT is an
 * implementation detail of server/client boundaries, not something callers
 * should have to reason about — see the header of `org-logo-registry.ts`.
 */
export {
  ORG_LOGOS,
  ORG_LOGO_FALLBACK,
  PORTAL_ORG_LOGOS,
  SAMAVESH_MARK,
  SAMAVESH_MARK_VECTOR,
  NATIONAL_EMBLEM,
  NATIONAL_EMBLEM_INVERSE,
  orgLogoSrc,
  portalLogoSrc,
} from "./org-logo-registry";
export type { OrgSlug } from "./org-logo-registry";

export type OrgLogoSize = "sm" | "md" | "lg";

export interface OrgLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which mark. Omit for the State Emblem. */
  org?: OrgSlug | null;
  /**
   * A portal route — resolved through `PORTAL_ORG_LOGOS`. Use INSTEAD of `org`
   * when what you have is a path rather than a slug, which is what the registry
   * hands you.
   */
  path?: string | null;
  /**
   * An explicit source, for a mark that is not in the registry yet.
   *
   * Reach for this ONLY while adding one — it is the escape hatch the registry
   * exists to make unnecessary, and `check:org-logos` reports every use so they
   * cannot accumulate quietly.
   */
  src?: string;
  /** Tile size. 32 / 48 / 56px. @default "md" */
  size?: OrgLogoSize;
  /**
   * The organisation's name, for the accessible name.
   *
   * OMIT IT — and that is the normal case. A mark sitting beside the org's name
   * in real text is decorative, so it takes an empty alt [WCAG H67]; passing a
   * name here would make a screen reader read the organisation twice. Pass one
   * only where the mark stands ALONE with no adjacent text.
   */
  name?: string;
}

/**
 * OrgLogo — an organisation or scheme mark in the estate's standard tile.
 *
 * The tile is part of the component, not the caller's job: white ground, hairline
 * rule, 8px radius, the mark contained rather than cropped. Four surfaces drew
 * that tile by hand with three different radii before this existed.
 *
 * ```tsx
 * <OrgLogo path="/portals/scw" />          // by route — what the registry gives you
 * <OrgLogo org="nmba" size="lg" />         // by slug
 * <OrgLogo name="National Commission for Scheduled Castes" />  // emblem, standing alone
 * ```
 */
export const OrgLogo = React.forwardRef<HTMLSpanElement, OrgLogoProps>(
  function OrgLogo({ org, path, src, size = "md", name, className, ...rest }, ref) {
    /*
     * An explicit `org` MUST beat a derived `path`. `PortalCard` passes
     * `path={path ?? href}` and `href` is REQUIRED, so the path branch was
     * always taken — which made `org` dead on every card that had one, and
     * silently rendered the State Emblem for organisations that do have a mark
     * (NCSC, in this component's own documentation specimen). Fixed 2026-08-31.
     */
    const resolved = src ?? (org != null ? orgLogoSrc(org) : portalLogoSrc(path));
    return (
      <span
        ref={ref}
        className={cn("ds-org-logo", `ds-org-logo--${size}`, className)}
        {...rest}
      >
        <img src={resolved} alt={name ?? ""} loading="lazy" decoding="async" />
      </span>
    );
  },
);
