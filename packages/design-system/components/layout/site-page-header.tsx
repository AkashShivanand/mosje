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
   * Names the media column, which stops it being hidden from assistive
   * technology.
   *
   * THE STATIC PORTRAIT IS DECORATIVE AND THE CAROUSEL IS NOT. `media` is
   * `aria-hidden` by contract — it repeats nothing the copy says, so a reader
   * who never sees it loses nothing. That contract breaks the moment the slot
   * holds CONTROLS: buttons inside an `aria-hidden` subtree stay in the tab
   * order while being invisible to a screen reader, which is worse than either
   * hiding them properly or exposing them properly.
   *
   * So a caller passing interactive media passes a label with it, and the
   * column becomes a named region instead of a hidden one. This is the
   * difference between the `landing` header's two media variants — still and
   * carousel — and it is a real one, not a styling choice.
   */
  mediaLabel?: string;
  /**
   * A band that OVERLAPS the header's lower edge — the "at a glance" fact card.
   *
   * A slot rather than a `facts` array, because the design system already has
   * `FactStrip` and a second way to say the same thing is a second thing to keep
   * in sync. The header reserves the space and owns the overlap; what sits in it
   * is the page's business.
   */
  overlay?: React.ReactNode;
  /**
   * A card the CALLER renders overlaps this band's lower edge — reserve room for
   * it, without rendering it.
   *
   * Use when the overlap already exists elsewhere. The estate's organisation
   * template draws its own "at a glance" card and pulls it up over the band; the
   * band knew nothing about that, so the card ate into the standfirst instead of
   * into padding. Prefer `overlay` for anything new — this exists because that
   * template got there first.
   */
  reservesOverlap?: boolean;
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
  mediaLabel,
  overlay,
  reservesOverlap = false,
  headingId,
  className,
  ...rest
}: SitePageHeaderProps): React.JSX.Element {
  const isLanding = variant === "landing";

  return (
    <div className={cn("sa-siteheader", `sa-siteheader--${variant}`, className)}>
      <header
        className={cn(
          "sa-siteheader__band",
          overlay ? "sa-siteheader__band--overlaid" : undefined,
          !overlay && reservesOverlap ? "sa-siteheader__band--reserved" : undefined,
        )}
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

          {/* Decorative by contract UNLESS it is labelled — see `mediaLabel`.
              A still portrait repeats nothing the copy says and is hidden; a
              carousel carries its own pictures and controls and is not. */}
          {isLanding && media ? (
            <div
              className="sa-siteheader__media"
              aria-hidden={mediaLabel == null ? true : undefined}
              aria-label={mediaLabel}
              role={mediaLabel != null ? "region" : undefined}
            >
              <div className="sa-siteheader__halo">
                {/*
                 * THE PULSE IS ITS OWN ELEMENT BECAUSE THREE RINGS NEED THREE
                 * BOXES, and an element has only two pseudo-elements. This span
                 * carries one ring on itself and one on each of its own
                 * `::before` / `::after`, staggered by a third of the period —
                 * which is what "all three outer rings pulse in a loop" needs.
                 * It is purely decorative: the whole media column is already
                 * `aria-hidden`, and it is `position: absolute` so it adds
                 * nothing to layout.
                 */}
                <span className="sa-siteheader__pulse" />
                {media}
              </div>
            </div>
          ) : null}
        </Container>
      </header>

      {overlay ? <div className="sa-siteheader__overlay">{overlay}</div> : null}
    </div>
  );
}
