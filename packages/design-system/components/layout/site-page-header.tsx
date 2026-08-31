import * as React from "react";
import { cn } from "../../utils/cn";
import { Container } from "./container";
import "./site-page-header.css";

export interface SitePageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * `landing` — an organisation or scheme's own front page (Figma L1). Carries a
   * logo, a lead paragraph, actions, a portrait, and usually an overlapping
   * fact card.
   *
   * `inner` — any page beneath one (Figma L2). A back link to the parent and a
   * title, nothing else. The restraint is the point: an inner page's job is the
   * content below the fold, and repeating the parent's furniture on every child
   * pushes it down.
   */
  variant?: "landing" | "inner";
  /** The page's `<h1>`. */
  title: string;
  /**
   * `inner` only — the back link to the parent, above the title.
   *
   * Deliberately NOT rendered on `landing`. A landing page is the top of its own
   * branch: it has nothing to go back to, and the handoff's L1 has no eyebrow.
   * Labelling it "Associated Organisation" said only what the breadcrumb above
   * already said, in a smaller font.
   */
  eyebrow?: React.ReactNode;
  /** `landing` only — the organisation's mark, shown at 100px. */
  logo?: React.ReactNode;
  /**
   * `landing` only — the standfirst, set italic against a left rule.
   *
   * A node, not a string, because the source's own copy opens with a bold
   * clause ("A Constitutional Body under Article 338…") and continues in
   * regular weight. Flattening that to one string would lose the emphasis the
   * department wrote.
   */
  lead?: React.ReactNode;
  /** `landing` only — primary call to action, e.g. "Login as Citizen". */
  actions?: React.ReactNode;
  /**
   * `landing` only — the portrait on the trailing edge.
   *
   * The halo is drawn by this component, not by the caller: the rings are the
   * band's own treatment and every landing page should get the same one. Pass
   * the picture; the plaque is ours.
   */
  media?: React.ReactNode;
  /**
   * A band that OVERLAPS the header's lower edge — the "at a glance" fact card.
   *
   * A slot rather than a `facts` array, because the design system already has
   * `FactStrip` and a second way to say the same thing is a second thing to keep
   * in sync. The header reserves the space and owns the overlap; what sits in it
   * is the page's business.
   */
  overlay?: React.ReactNode;
  /** Set on the heading so a region can point `aria-labelledby` at it. */
  headingId?: string;
}

/**
 * SitePageHeader — the blue band every website page opens with, in two levels.
 *
 * ── WHY THIS IS NOT `PageHeader` ─────────────────────────────────────────────
 * `PageHeader` is the portal title row: a heading, a meta line, some buttons, on
 * the page's own background. This is a full-bleed banner with a brand gradient,
 * a portrait and an overlapping card. They share a name in English and nothing
 * else, so they stay separate components.
 *
 * ── THE GRADIENT IS BUILT FROM THE BRAND RAMP, ON PURPOSE ────────────────────
 * The Figma design paints the band `#0373df → #3f83c6`. The first is the
 * `Primary/Source` variable; the second is a RAW HEX with no variable behind it
 * — an unbound fill on the design side, flagged for the library owner.
 *
 * Reproducing that hex literally would freeze the band to the blue brand. This
 * estate is white-label: `data-brand="navy"` and the DBIM palette have to
 * retheme it, and a hardcoded blue would sit unchanged inside a navy page. So
 * the second stop is the ramp's own next shade, which rethemes with everything
 * else and reads the same — brighter at the leading edge, deeper at the
 * trailing one.
 */
export function SitePageHeader({
  variant = "inner",
  title,
  eyebrow,
  logo,
  lead,
  actions,
  media,
  overlay,
  headingId,
  className,
  ...rest
}: SitePageHeaderProps): React.JSX.Element {
  const isLanding = variant === "landing";

  return (
    <div className={cn("sa-siteheader", `sa-siteheader--${variant}`, className)}>
      <header
        className={cn("sa-siteheader__band", overlay ? "sa-siteheader__band--overlaid" : undefined)}
        {...rest}
      >
        <Container size="page" className="sa-siteheader__container">
          <div className="sa-siteheader__col">
            {!isLanding && eyebrow ? (
              <div className="sa-siteheader__eyebrow">{eyebrow}</div>
            ) : null}
            {isLanding && logo ? <div className="sa-siteheader__logo">{logo}</div> : null}
            <h1 id={headingId} className="sa-siteheader__title">
              {title}
            </h1>
            {isLanding && lead ? <div className="sa-siteheader__lead">{lead}</div> : null}
            {isLanding && actions ? (
              <div className="sa-siteheader__actions">{actions}</div>
            ) : null}
          </div>

          {/* Decorative by contract: the portrait repeats nothing the copy does
              not already say, so a reader who never sees it loses nothing. */}
          {isLanding && media ? (
            <div className="sa-siteheader__media" aria-hidden="true">
              <div className="sa-siteheader__halo">{media}</div>
            </div>
          ) : null}
        </Container>
      </header>

      {overlay ? <div className="sa-siteheader__overlay">{overlay}</div> : null}
    </div>
  );
}
