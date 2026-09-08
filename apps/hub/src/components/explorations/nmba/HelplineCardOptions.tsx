"use client";

import * as React from "react";
import { Icon, buttonClasses } from "@mosje/design-system";
import { Campaign, Dismiss, Fold, HelplineCard, NMBA } from "./fold";
import "./campaign-band.css";

/**
 * THE DECISION: what does the helpline look like inside the campaign band?
 *
 * Both options are shown in the real fold, in the band's real position, because
 * a control of this kind cannot be judged on a swatch — the question is how it
 * behaves against 1,272px of green with a QR, a sentence and a button already on
 * the row.
 */

function CampaignRow({ children }: { children: React.ReactNode }) {
  const [gone, setGone] = React.useState(false);
  if (gone) return null;
  return (
    <section className="xband" aria-label={NMBA.banner.heading}>
      <div className="sa-container xband__inner">
        <Campaign />
        {children}
        <Dismiss onClick={() => setGone(true)} label="Dismiss the campaign band" />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Icon first, static (what is built today)
   ══════════════════════════════════════════════════════════════════════════ */

export function HelplineStatic() {
  return (
    <Fold
      band={
        <CampaignRow>
          <a
            className={buttonClasses("success", "filled", "md", "xband__helpline-legacy", "inverse")}
            href={`tel:${NMBA.banner.helplineNumber}`}
            aria-label={`${NMBA.banner.helplineLabel} ${NMBA.banner.helplineNumber}`}
          >
            <Icon name="call" size={20} aria-hidden />
            <span className="xhcl__label">{NMBA.banner.helplineShort}</span>
            <span className="xhcl__number">{NMBA.banner.helplineNumber}</span>
          </a>
        </CampaignRow>
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — The card: number first, ringing glyph on the trailing edge
   ══════════════════════════════════════════════════════════════════════════ */

export function HelplineRinging() {
  /*
   * REMOUNTED ON DEMAND. The arrival ring fires twice and stops, so a reviewer
   * who wants to see it again needs a fresh instance rather than a page reload —
   * the viewer's own "Reset this prototype" does that, and this button does it
   * without leaving the option.
   */
  const [run, setRun] = React.useState(0);
  return (
    <>
      <Fold
        key={run}
        band={
          <CampaignRow>
            <HelplineCard size="band" />
          </CampaignRow>
        }
      />
      <p className="xhc-replay">
        <button type="button" className="xpl-viewer__reset-btn" onClick={() => setRun((n) => n + 1)}>
          <Icon name="restart_alt" size={20} aria-hidden />
          <span>Play the arrival ring again</span>
        </button>
      </p>
    </>
  );
}
