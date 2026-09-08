"use client";

import * as React from "react";
import {
  flyGhost,
  motionEasing,
  motionMs,
  prefersReducedMotion,
  rectOf,
  type Rect,
} from "../flight";
import { BadgeInner, Campaign, Dismiss, Fold, Helpline, HelplineCard, HeroBadge, NMBA } from "./fold";
import "./campaign-band.css";

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Anchor and guest (what is built today)
   ══════════════════════════════════════════════════════════════════════════ */

export function OptionAnchorGuest() {
  const [gone, setGone] = React.useState(false);

  return (
    <Fold
      band={
        <section className="xband" aria-label={NMBA.banner.helplineLabel}>
          <div className="sa-container xband__inner" data-gone={gone || undefined}>
            {gone ? null : <Campaign />}
            {/* OUTSIDE the collapsible half — that is the whole option. */}
            <Helpline />
            {gone ? null : (
              <Dismiss onClick={() => setGone(true)} label="Dismiss the campaign announcement" />
            )}
          </div>
        </section>
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — The helpline flies to the hero
   ══════════════════════════════════════════════════════════════════════════ */

type Phase = "band" | "flying" | "landed";

export function OptionFlight() {
  const [phase, setPhase] = React.useState<Phase>("band");
  const bandRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLAnchorElement>(null);
  const badgeRef = React.useRef<HTMLAnchorElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const [ghostAt, setGhostAt] = React.useState<Rect | null>(null);
  const flight = React.useRef<{ from: Rect; to: Rect; ms: number; easing: string } | null>(null);

  function dismiss() {
    const band = bandRef.current;
    const pill = pillRef.current;
    const badge = badgeRef.current;
    if (!band || !pill || !badge) return;

    /*
     * REDUCED MOTION IS NOT A FASTER FLIGHT — IT IS NO FLIGHT.
     *
     * The estate's `--sa-motion-*` durations already collapse to 0.01ms under
     * the media query, so honouring the tokens alone would technically satisfy
     * the preference. It would still MOUNT the ghost and still move an element
     * across the viewport in one frame, which for a reader with a vestibular
     * disorder is the thing they asked not to happen, only briefer. The badge is
     * simply there, and the band is simply not.
     */
    if (prefersReducedMotion()) {
      setPhase("landed");
      return;
    }

    const from = rectOf(pill);
    const here = rectOf(badge);
    // The badge sits below the band in normal flow, so a band that collapses to
    // zero raises the badge by exactly the band's height. See `flight.ts`.
    const to: Rect = { ...here, top: here.top - band.offsetHeight };

    flight.current = {
      from,
      to,
      /*
       * EMPHASIS, NOT REVEAL — and the difference was visible, not theoretical.
       *
       * `--sa-motion-reveal-easing` is `cubic-bezier(0.22, 1, 0.36, 1)`, a very
       * front-loaded ease-out. It is the right curve for something ARRIVING in
       * place, and the wrong one for something TRAVELLING: at 45% of the
       * duration it had already covered 93% of the distance, so a frozen frame
       * mid-flight showed the badge sitting at its destination. The number
       * teleported and then settled, which is not what "flies" means.
       *
       * An object moving across the screen accelerates and decelerates, so the
       * curve is the emphasized in-out one — same 400ms, and the landing is
       * unaffected either way because both animations end at fixed positions.
       */
      ms: motionMs(band, "--sa-motion-emphasis-duration", 400),
      easing: motionEasing(band, "--sa-motion-emphasis-easing", "cubic-bezier(0.4, 0, 0.2, 1)"),
    };
    setGhostAt(to);
    setPhase("flying");
  }

  /*
   * `useLayoutEffect`, not `useEffect`: the ghost is mounted at the badge's
   * LANDING position, which is not where the pill is. Between paint and the
   * first animation frame it would flash there. A layout effect runs before the
   * browser paints, so the ghost's first painted frame is already the
   * animation's first keyframe.
   */
  React.useLayoutEffect(() => {
    if (phase !== "flying") return;
    const ghost = ghostRef.current;
    const f = flight.current;
    if (!ghost || !f) return;

    const anim = flyGhost(ghost, f.from, f.to, { duration: f.ms, easing: f.easing });
    let cancelled = false;
    anim.finished
      .then(() => {
        if (!cancelled) setPhase("landed");
      })
      .catch(() => {
        /* Cancelled by an unmount — the badge is already in its landed state. */
      });
    return () => {
      cancelled = true;
      anim.cancel();
    };
  }, [phase]);

  const arrived = phase === "landed";

  return (
    <>
      {/*
       * Mounted empty from the first render. A live region INSERTED carrying its
       * text is routinely not announced — assistive technology has to have been
       * watching the node before the text arrived.
       */}
      <p className="ds-sr-only" role="status">
        {arrived
          ? `Campaign announcement dismissed. The ${NMBA.banner.helplineLabel}, ${NMBA.banner.helplineNumber}, has moved to the page heading.`
          : ""}
      </p>

      <Fold
        band={
          arrived ? null : (
            <section
              className={`xband xband--flight${phase === "flying" ? " is-leaving" : ""}`}
              ref={bandRef}
              aria-label={NMBA.banner.heading}
              inert={phase === "flying" || undefined}
            >
              {/* The clip carries NO padding of its own — see `campaign-band.css`. */}
              <div className="xband__clip">
                <div className="sa-container xband__inner">
                  <Campaign />
                  <Helpline innerRef={pillRef} />
                  <Dismiss onClick={dismiss} label="Dismiss the campaign band" />
                </div>
              </div>
            </section>
          )
        }
        logoAside={<HeroBadge innerRef={badgeRef} arrived={arrived} />}
      />

      {phase === "flying" && ghostAt ? (
        <div
          className="xband-ghost"
          ref={ghostRef}
          aria-hidden
          style={{
            left: `${ghostAt.left}px`,
            top: `${ghostAt.top}px`,
            width: `${ghostAt.width}px`,
            height: `${ghostAt.height}px`,
          }}
        >
          <BadgeInner />
        </div>
      ) : null}
    </>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   OPTION C — The band goes; the badge simply arrives  (SHIPPED)
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * What the estate now does, and what the flight above was traded for.
 *
 * The whole band folds away and the helpline appears beside the mark — 6px up
 * and a fade, after the fold has finished. No ghost, no arc, no blur.
 *
 * The flight was legible and smooth and it was wrong for this page: 615ms of
 * theatre attached to the act of REFUSING an advertisement, on a government page
 * about drug de-addiction. The reader has just said "less of this"; answering
 * that with a flourish is the wrong register. What survives from it is the part
 * that mattered — the number is carried rather than kept.
 */
export function OptionArrive() {
  const [gone, setGone] = React.useState(false);

  return (
    <>
      <p className="ds-sr-only" role="status">
        {gone
          ? `${NMBA.banner.heading}: dismissed. The ${NMBA.banner.helplineLabel}, ${NMBA.banner.helplineNumber}, is now shown beside the page heading.`
          : ""}
      </p>

      <Fold
        band={
          gone ? null : (
            <section className="xband" aria-label={NMBA.banner.heading}>
              <div className="sa-container xband__inner">
                <Campaign />
                <Helpline />
                <Dismiss onClick={() => setGone(true)} label="Dismiss the campaign band" />
              </div>
            </section>
          )
        }
        logoAside={gone ? <span className="xarrive"><HelplineCard size="hero" /></span> : null}
      />
    </>
  );
}
