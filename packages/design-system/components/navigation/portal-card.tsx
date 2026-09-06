"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { OrgLogo } from "../brand/org-logo";
import type { OrgSlug } from "../brand/org-logo-registry";
import "./portal-card.css";

/**
 * How much of a portal the card shows.
 *
 * Both variants are the SAME OBJECT in the same visual language — saffron rule,
 * white ground, a mark in its tile, saffron code over a dark name. What changes
 * is how much the surface has room to say, never how the card looks.
 *
 * - `compact` — mark, code, name. DEFAULT. For a reader who already knows which
 *   portal they want and is FINDING it: the banner drawer, and the change-portal
 *   side sheet on a login page.
 * - `detailed` — adds the description, the category and an explicit action. For
 *   the `/portals` directory, where the reader is CHOOSING rather than finding.
 *
 * Pick by which of those two the reader is doing, never by how much space is
 * going spare.
 */
export type PortalCardVariant = "compact" | "detailed";

export interface PortalCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "href"> {
  /** Short code in the accent slot — "SCW", "PM-AJAY", "SMILE - Transgender". */
  code: string;
  /** Full name, under the code. */
  name: string;
  /**
   * Destination. REQUIRED, and that is the point.
   *
   * The card used to accept no href and fall back to a non-interactive `<div>`
   * carrying an "In development" note. Every surface now lists LIVE portals only,
   * so that state has no caller — and an OPTIONAL destination is how an unbuilt
   * portal got rendered as a link in the first place, which shipped a 404 to
   * citizens on every page of the website. A required prop makes that impossible
   * at build time instead of catching it at runtime.
   */
  href: string;
  /** Portal route, resolved to its mark through the `OrgLogo` registry. */
  path?: string;
  /** Org slug, if you have that rather than a route. */
  org?: OrgSlug;
  /**
   * Opens in a new tab.
   *
   * The cue is BUILT IN, not the caller's job: an `open_in_new` glyph beside the
   * name and a visually-hidden "(opens in a new tab)".
   *
   * Every portal is a separate property in production, so this ends up on for all
   * of them — and it is deliberately NOT a separate card style. A directory where
   * every card carries the same decoration is a directory where the decoration
   * means nothing, so it stays the quiet inline cue it is.
   */
  external?: boolean;
  /** How much of the portal to show. @default "compact" */
  variant?: PortalCardVariant;
  /** One line on what the portal does. `detailed` only. */
  description?: string;
  /** Category label in the footer. `detailed` only. */
  category?: string;
  /** Footer action label. `detailed` only. @default "Open portal" */
  ctaLabel?: string;
  /**
   * This is the portal the reader is already in — the change-portal side sheet's
   * current entry. Draws a filled check and sets `aria-current="true"`.
   *
   * The check is NOT the only signal: a visually-hidden "Current portal" rides
   * with it, because a green tick alone is colour and shape carrying meaning
   * [WCAG 1.4.1].
   */
  selected?: boolean;
  /**
   * The portal exists but this reader cannot open it — no permission, or not yet
   * live. @default false
   *
   * **`aria-disabled`, never the native attribute and never omission.** The card
   * stays in the DOM, stays focusable and keeps its name, so a screen-reader user
   * learns the portal exists and that it is closed to them. Removing it instead
   * tells them nothing; a natively disabled control drops out of the tab order,
   * which tells them nothing either. Same reasoning as `Tabs`.
   *
   * The `href` is dropped rather than kept-and-prevented, so middle-click and
   * "copy link address" cannot reach a portal the reader has no route into.
   *
   * A disabled card owes the reader a REASON somewhere nearby — this component
   * cannot know it, so say it in the surrounding copy. A card that is simply
   * greyed with no explanation reads as a bug.
   */
  disabled?: boolean;
}

/**
 * PortalCard — one portal in a grid of them.
 *
 * It is deliberately DUMB: it takes strings and renders them. Which portals to
 * show belongs to the caller reading the estate registry — a card that looked up
 * its own status would put that query in three places.
 *
 * Two variants, one visual language: `compact` for the banner drawer and the
 * change-portal side sheet, `detailed` for the `/portals` directory. Both are
 * real `<a>` elements. Never `role="listitem"` on one: an explicit role REPLACES
 * the implicit `link` one, and this component exists partly because that shipped.
 *
 * The mark comes from `OrgLogo`, never from a path written here.
 */
export const PortalCard = React.forwardRef<HTMLAnchorElement, PortalCardProps>(
  function PortalCard(
    {
      code,
      name,
      href,
      path,
      org,
      external,
      variant = "compact",
      description,
      category,
      ctaLabel = "Open portal",
      selected = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) {
    const detailed = variant === "detailed";

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        className={cn(
          "ds-portal-card",
          `ds-portal-card--${variant}`,
          selected && "ds-portal-card--selected",
          disabled && "ds-portal-card--disabled",
          className,
        )}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        aria-current={selected ? "true" : undefined}
        aria-disabled={disabled || undefined}
        /* No href when disabled, so middle-click and "copy link address" cannot
           reach it either; tabIndex keeps it findable by keyboard regardless. */
        tabIndex={disabled ? 0 : undefined}
        {...rest}
      >
        <span className="ds-portal-card__head">
          {/* The GROUND is the card's, not the mark's — `OrgLogo` stopped carrying
              a tile on 2026-09-06. `.ds-org-tile` is the estate's one definition
              of it; do not re-derive the ground in this component's stylesheet.

              No alt: the org's name is in real text immediately beside it, so an
              alt here reads the organisation twice [WCAG H67]. */}
          <span className="ds-org-tile ds-portal-card__mark">
            <OrgLogo path={path ?? href} org={org} size={detailed ? "lg" : "md"} />
          </span>

          <span className="ds-portal-card__content">
            <span className="ds-portal-card__code">{code}</span>
            <span className="ds-portal-card__name">
              {name}
              {external && (
                <>
                  {" "}
                  <Icon
                    name="open_in_new"
                    size={16}
                    aria-hidden="true"
                    className="ds-portal-card__external"
                  />
                  {/* The GLYPH is the visible cue; this is the one a screen reader
                      hears. Both are required — a sighted reader gets nothing from
                      an aria-label, and the glyph is aria-hidden. WCAG G201. */}
                  <span className="ds-portal-card__sr"> (opens in a new tab)</span>
                </>
              )}
            </span>
          </span>

          {selected && (
            <>
              <span className="ds-portal-card__check" aria-hidden="true">
                <Icon name="check" size={16} />
              </span>
              <span className="ds-portal-card__sr">Current portal</span>
            </>
          )}
        </span>

        {detailed && description && (
          <span className="ds-portal-card__desc">{description}</span>
        )}

        {detailed && (
          <span className="ds-portal-card__footer">
            {category && <span className="ds-portal-card__category">{category}</span>}
            <span className="ds-portal-card__cta">
              {ctaLabel}
              <Icon name="arrow_forward" size={16} aria-hidden="true" />
            </span>
          </span>
        )}
      </a>
    );
  },
);
