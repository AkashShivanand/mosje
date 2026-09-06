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
 * OrgLogo — an organisation or scheme mark. The mark, and only the mark.
 *
 * **THE GROUND IS NOT THE MARK'S BUSINESS — as of 2026-09-06.** This component
 * carried a `tile` boolean (a white ground, hairline rule, 8px radius) which was
 * on by default, so seventeen of the estate's twenty-six call sites had to switch
 * it OFF. A property that most callers must remember to turn off is the wrong
 * default and the wrong home for the decision.
 *
 * A mark that needs a ground gets one from its container, using the single
 * `.ds-org-tile` class in `org-logo.css` — one definition, applied where the
 * decision actually belongs. That matters: four surfaces drew this tile by hand
 * before it existed, at three different radii and two different sizes, and
 * `.ds-org-tile` is what stops that returning now the boolean is gone. Do NOT
 * re-derive the ground in a consumer's own stylesheet.
 *
 * `PortalCard` and `PortalLoginShell` are the two product surfaces that use it.
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
