"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";
import { useCampaignDismissed, resetCampaignDismissal } from "@/lib/website/campaign-dismissed";
import "./organisation-helpline-badge.css";

/**
 * The helpline, beside the organisation's mark, once the campaign band has gone.
 *
 * ── WHAT THIS REPLACES ──────────────────────────────────────────────────────
 *
 * The band's × removes the whole band, helpline included. Until now that was
 * safe only because the key-facts strip 200px below happens to carry the number
 * as its third figure — a coincidence of content standing in for a design.
 *
 * This makes it a design: the number is not lost when the advertisement around
 * it is refused, it moves somewhere permanent.
 *
 * ── AND WHY IT DOES NOT FLY ─────────────────────────────────────────────────
 *
 * A prototype carried the card across the fold on a 615ms arc. It was legible,
 * it was smooth, and it was wrong for this page: an 860px flight is a piece of
 * theatre attached to the act of REFUSING an advertisement, on a government page
 * about drug de-addiction. The reader has just said "less of this"; answering
 * that with a flourish is the wrong register.
 *
 * So the badge simply arrives — 6px up and a fade, over the estate's own enter
 * duration, after the band has finished folding away. The whole transition is
 * two properties and one delay, and it survives `prefers-reduced-motion` by
 * having nothing to remove but the 6px.
 */
export function OrganisationHelplineBadge({
  label,
  number,
}: {
  /** The department's full title — "National De-Addiction Helpline". */
  label: string;
  number: string;
}): React.JSX.Element | null {
  const dismissed = useCampaignDismissed();

  /* A route change must not carry a dismissal onto the next organisation. The
     store is module-scoped, so nothing else clears it. */
  React.useEffect(() => resetCampaignDismissal, []);

  if (!dismissed) return null;

  return (
    <a
      className="orgb"
      href={`tel:${number}`}
      /* The visible text is a clause of this, so WCAG 2.2 §2.5.3 holds. */
      aria-label={`${label} ${number}`}
    >
      <span className="orgb__icon" aria-hidden>
        <Icon name="call" size={20} />
      </span>
      <span className="orgb__text">
        <span className="orgb__label">Helpline</span>
        <span className="orgb__number">{number}</span>
      </span>
    </a>
  );
}
