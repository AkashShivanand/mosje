"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./auth-result.css";

/**
 * The end of an authentication journey: a mark, a sentence, and the way onward.
 *
 * Transcribed from `Auth / RecoveryFormCard`, `Step=Success` (390 × 208): a 48px
 * `check_circle` in `icon/status/success/base`, `Headline/headline-4` centred,
 * `Body/body-2` centred and subtle, then a full-width outlined button — with a
 * flat 16 between all four, which is this card's own rhythm and not
 * `AuthFormCard`'s 32/24.
 *
 * **Why this is not `EmptyState`.** `EmptyState` draws the same four things and
 * would have looked right, but it means something else: "this collection has
 * nothing in it". A password that has just been reset is not an absence, and
 * borrowing the component would put that meaning into the markup — its title is
 * a `<p>`, so the page would also lose its heading. A result gets a real
 * heading, at the level the page needs.
 *
 * **Why it is not a variant of `AuthFormCard`.** That card is a `<form>` with
 * seven regions around a slot. This has no form, no fields and nothing to
 * submit; expressing it as a mode of the card would mean every one of those
 * regions learning to be absent. Two small components beat one with a hollow
 * half.
 *
 * **The mark is decorative and the heading carries the meaning.** A green tick
 * is not an accessible way to say "successful" — a screen reader gets the
 * heading, and `role="status"` announces the outcome when this replaces a form
 * in place rather than arriving as a new page.
 */
export interface AuthResultProps {
  /**
   * The outcome. `success` is a green tick; `notice` is the neutral information
   * mark, for an outcome that is neither a success nor a failure — a link that
   * has expired, a session that has ended.
   *
   * @default "success"
   */
  status?: "success" | "notice";
  /**
   * The Material Symbols glyph. Defaults to the one the status implies, so a
   * caller only names it to say something the status does not.
   */
  icon?: string;
  /** The outcome, as a sentence a citizen would recognise. */
  heading: React.ReactNode;
  /**
   * Heading level. @default 2
   *
   * Pass 1 when this IS the page, which is what a standalone confirmation is.
   * The default is 2 because a result is also shown inside a card that already
   * sits under a page heading.
   */
  headingLevel?: 1 | 2 | 3;
  /** What happened, and what it means for them. Two lines at most. */
  description?: React.ReactNode;
  /** The way onward — usually one `Button`, full width. */
  action?: React.ReactNode;
  /**
   * Announce this to assistive technology when it appears.
   *
   * Pass `true` when the result REPLACES something in place — a form that has
   * just been submitted — because nothing else tells a screen-reader user the
   * page changed. Leave it off when the result arrives as its own page: the
   * navigation already announces the new heading, and a live region on top of
   * that reads the outcome twice.
   *
   * @default false
   */
  announce?: boolean;
  className?: string;
}

const DEFAULT_ICON: Record<NonNullable<AuthResultProps["status"]>, string> = {
  success: "check_circle",
  notice: "info",
};

export function AuthResult({
  status = "success",
  icon,
  heading,
  headingLevel = 2,
  description,
  action,
  announce = false,
  className,
}: AuthResultProps): React.JSX.Element {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";

  return (
    <div
      className={cn("ds-authresult", `ds-authresult--${status}`, className)}
      {...(announce ? { role: "status" } : {})}
    >
      {/* Decorative: the heading below says the same thing in words. */}
      <Icon
        name={icon ?? DEFAULT_ICON[status]}
        size={48}
        aria-hidden="true"
        className="ds-authresult__mark"
      />
      <Heading className="ds-authresult__heading">{heading}</Heading>
      {description ? <p className="ds-authresult__body">{description}</p> : null}
      {action ? <div className="ds-authresult__action">{action}</div> : null}
    </div>
  );
}
