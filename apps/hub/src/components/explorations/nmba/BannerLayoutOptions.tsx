"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import { CampaignCopy, CampaignCta, Dismiss, Fold, HelplineCard, NMBA } from "./fold";
import "./campaign-band.css";

/**
 * THE DECISION: where do the band's two calls to action sit?
 *
 * On the TRAILING EDGE, as a pair beside the message — one row, 104px — or
 * BELOW THE COPY in a column, which is how the SAMAVESH handoff draws it
 * (`Nudge`, 57774:19709) at 168px.
 *
 * Neither is a mistake. The difference is 64px of a 760px fold, and it buys a
 * 120px code and a 28px heading rather than a 72px code and a label-sized one.
 * See `top-bands`, where the same currency is being spent on something else.
 */

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Both CTAs on the trailing edge, as a pair
   ══════════════════════════════════════════════════════════════════════════ */

export function LayoutCtasRight() {
  const [gone, setGone] = React.useState(false);
  return (
    <Fold
      band={
        gone ? null : (
          <section className="xband" aria-label={NMBA.banner.heading}>
            <div className="sa-container xband__inner xband__inner--pair">
              <CampaignCopy />
              {/*
               * THE TWO ROUTES AS ONE GROUP, 12 APART.
               *
               * They were 40 apart, deliberately: pairing the helpline with the
               * campaign's own button made it read as the second half of one
               * offer, when it is a standing public service that happens to be
               * printed here. As a pair that reading returns — the trade is a
               * tighter, calmer trailing edge against a slightly muddier
               * distinction between a campaign action and a permanent one.
               *
               * 12 is the gap, not 8 and not 16: at 8 the two pills touch
               * optically and read as a segmented control, and at 16 they stop
               * being a group at this size.
               */}
              <div className="xband__pair">
                <CampaignCta />
                <HelplineCard size="band" />
              </div>
              <Dismiss onClick={() => setGone(true)} label="Dismiss the campaign band" />
            </div>
          </section>
        )
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — Two rows, as the handoff draws it
   ══════════════════════════════════════════════════════════════════════════ */

export function LayoutCtasBelow() {
  const [gone, setGone] = React.useState(false);
  if (gone) return <Fold band={null} />;

  return (
    <Fold
      band={
        <section className="xnudge" aria-label={NMBA.banner.heading}>
          <div className="sa-container xnudge__inner">
            {/*
             * 120×120 at `--sa-shape-6`, spanning both rows. Four times the area
             * of the 72px code the compact band carries, and it is the reason
             * this layout is 168 rather than 104: the band's height is set by the
             * code, not by the copy.
             */}
            <span className="xnudge__qr">
              <Image src={NMBA.banner.qrSrc} alt="" width={120} height={120} />
            </span>

            <div className="xnudge__content">
              <div className="xnudge__copy">
                <p className="xnudge__heading">{NMBA.banner.heading}</p>
                {/*
                 * The handoff's own sentence, not this estate's. It says
                 * "Take the NMBA e-pledge today", which points at a DIFFERENT
                 * destination from the button beneath it — the pledge, not the
                 * volunteer register. Kept verbatim so the difference is visible
                 * and can be settled, rather than quietly harmonised here.
                 */}
                <p className="xnudge__text">
                  Take the NMBA e-pledge today and commit to a Nasha Mukt Bharat!
                </p>
              </div>

              <div className="xnudge__ctas">
                <a
                  className={buttonClasses("primary", "outlined", "md", "xnudge__cta", "inverse")}
                  href={NMBA.banner.actionHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{NMBA.banner.actionFullLabel}</span>
                  <Icon name="arrow_forward" size={16} aria-hidden />
                  <span className="ds-sr-only"> (opens in a new tab)</span>
                </a>

                {/*
                 * The handoff puts the glyph on the LEADING edge with a `pulse`
                 * instance around it (57895:11261) — so the animated call icon
                 * is the master's own idea, not an addition. It is rendered here
                 * as the handoff draws it; the trailing-edge variant is the other
                 * option in "The helpline inside the campaign band".
                 */}
                <a className="xnudge__helpline" href={`tel:${NMBA.banner.helplineNumber}`}>
                  <span className="xnudge__pulse" aria-hidden>
                    <Icon name="call" size={16} />
                  </span>
                  <span className="xnudge__helpline-label">{NMBA.banner.helplineLabel}</span>
                  <span className="xnudge__helpline-number">{NMBA.banner.helplineNumber}</span>
                </a>
              </div>
            </div>

            <button
              type="button"
              className="xnudge__dismiss"
              onClick={() => setGone(true)}
              aria-label={`Dismiss the ${NMBA.banner.heading} announcement`}
            >
              <Icon name="close" size={20} aria-hidden />
            </button>
          </div>
        </section>
      }
    />
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   OPTION C — Two zones: a campaign, and a standing service
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The band still carries both, and stops pretending they are the same kind of
 * thing.
 *
 * ── WHAT MAKES TWO CONTROLS READ AS SIBLINGS ────────────────────────────────
 *
 * Same ground, same height, same silhouette, 12px apart. All four said "these
 * are two ways to do one thing" about a volunteer form and a national helpline
 * — which are not related, are not for the same person, and are not even the
 * same medium. Worse, the band has THREE controls and TWO destinations: the code
 * and the button open the same URL, so the row read as one sentence with a
 * telephone number stuck on the end of it.
 *
 * ── WHAT SEPARATES THEM HERE ────────────────────────────────────────────────
 *
 * Three changes, and each does a different job:
 *
 * 1. ITS OWN GROUND. A darker panel — `successScale-800` against the band's
 *    600→700 — so the eye reads a seam before it reads any words. This is the
 *    one that does most of the work; the other two would not be enough alone.
 * 2. ITS OWN SHAPE. Not a pill with a label, but a FACT: a caption above a
 *    figure, which is how the key strip below states the same number. A button
 *    invites; a fact simply is.
 * 3. ITS OWN POSITION. Flush to the trailing edge and full height, so it reads
 *    as part of the band's furniture rather than as the last item in a list of
 *    actions.
 *
 * It is also the hero badge's structure — caption over figure, glyph leading —
 * so the thing that moves on dismissal is recognisably the same object arriving
 * in a lighter skin.
 */
export function LayoutTwoZones() {
  const [gone, setGone] = React.useState(false);
  return (
    <Fold
      band={
        gone ? null : (
          <section className="xband xband--zoned" aria-label={NMBA.banner.heading}>
            <div className="sa-container xband__inner xband__inner--zoned">
              <CampaignCopy />
              <CampaignCta />

              <a className="xband__service" href={`tel:${NMBA.banner.helplineNumber}`}>
                <span className="xband__service-icon" aria-hidden>
                  <Icon name="call" size={20} />
                </span>
                <span className="xband__service-text">
                  <span className="xband__service-label">{NMBA.banner.helplineShort}</span>
                  <span className="xband__service-number">{NMBA.banner.helplineNumber}</span>
                </span>
              </a>

              <Dismiss onClick={() => setGone(true)} label="Dismiss the campaign band" />
            </div>
          </section>
        )
      }
    />
  );
}
