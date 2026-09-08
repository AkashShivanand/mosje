"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import { Campaign, Dismiss, Fold, HelplineCard, NMBA } from "./fold";
import "./campaign-band.css";

/**
 * THE DECISION: how is the campaign band composed?
 *
 * The SAMAVESH handoff draws it as `Nudge` (57774:19709) — 168px tall, a 120px
 * code on the left spanning the full height, and the copy and both buttons
 * stacked in a column beside it. What this estate ships is 104px, one row, with
 * the buttons on the trailing edge.
 *
 * Neither is a mistake. They are two answers to the same question and the
 * difference is 64px of a 760px fold — see `top-bands`, where the same currency
 * is being spent on a different thing.
 */

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Compact, one row (what is built today)
   ══════════════════════════════════════════════════════════════════════════ */

export function LayoutCompact() {
  const [gone, setGone] = React.useState(false);
  return (
    <Fold
      band={
        gone ? null : (
          <section className="xband" aria-label={NMBA.banner.heading}>
            <div className="sa-container xband__inner">
              <Campaign />
              <HelplineCard size="band" />
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

export function LayoutHandoff() {
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
