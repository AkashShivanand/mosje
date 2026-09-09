"use client";

import * as React from "react";
import { Icon, buttonClasses } from "@mosje/design-system";
import { Campaign, Dismiss, Fold, Helpline, NMBA, Ribbon } from "./fold";
import "./campaign-band.css";

/**
 * THE DECISION: the fold opens with TWO announcement bands stacked — a green
 * campaign and a saffron anniversary notice. Should they stay separate, or share
 * one band?
 *
 * ── WHAT IS ACTUALLY BEING TRADED ───────────────────────────────────────────
 *
 * Height against readership, and the exchange rate is not symmetrical.
 *
 * Two bands cost 104 + 50 = 154px of a 1440×760 fold — a fifth of it — before
 * the page has said what it is. One band costs 104 and shows one message at a
 * time, which on every carousel ever measured means the second message is, in
 * practice, unread. The design system's own `Carousel` says so in its docstring.
 *
 * So this is not "which looks tidier". It is: is the anniversary notice worth
 * 50px of every reader's fold, or worth being seen by almost none of them?
 * Neither prototype answers that; the Department does.
 */

/* ══════════════════════════════════════════════════════════════════════════
   OPTION A — Two bands (what is built today)
   ══════════════════════════════════════════════════════════════════════════ */

export function OptionTwoBands() {
  const [campaign, setCampaign] = React.useState(true);
  const [notice, setNotice] = React.useState(true);

  return (
    <Fold
      band={
        <>
          {campaign ? (
            <section className="xband" aria-label={NMBA.banner.heading}>
              <div className="sa-container xband__inner">
                <Campaign />
                <Helpline />
                <Dismiss onClick={() => setCampaign(false)} label="Dismiss the campaign band" />
              </div>
            </section>
          ) : null}
          {notice ? <Ribbon onDismiss={() => setNotice(false)} /> : null}
        </>
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   OPTION B — One band, two panels
   ══════════════════════════════════════════════════════════════════════════ */

const PANELS = ["campaign", "notice"] as const;

export function OptionOneBand() {
  const [i, setI] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  /*
   * NOTHING ROTATES ON ITS OWN, AND THAT IS NOT A CONVENIENCE.
   *
   * `Carousel`'s own contract on this estate forbids autoplay for anything a
   * citizen reads: a strip that advances on a timer takes the sentence away
   * mid-sentence, and it does that most to the slowest readers. A band carrying
   * a de-addiction helpline and a filing deadline is exactly that content.
   *
   * WCAG 2.2 §2.2.2 would also require a pause control for anything moving for
   * more than five seconds — so an auto-rotating version of this band needs a
   * FOURTH control on a row that already has three. The reader advances it, or
   * it does not advance.
   */
  function go(next: number) {
    const n = (next + PANELS.length) % PANELS.length;
    setI(n);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-panel="${n}"]`)?.focus();
  }

  if (gone) return <Fold band={null} />;

  return (
    <Fold
      band={
        <section className="xband xband--one" aria-label="Announcements">
          <div className="sa-container xband__inner xband__inner--one">
            {/*
             * ONE LIVE REGION FOR THE WHOLE BAND. The panels swap inside it, so
             * a screen-reader user is told what arrived rather than being left
             * to discover that something changed.
             */}
            <div className="xband__panels" role="group" aria-live="polite">
              {i === 0 ? (
                <div className="xband__panel">
                  <Campaign />
                  <Helpline />
                </div>
              ) : (
                <div className="xband__panel xband__panel--notice">
                  <div className="xband__copy">
                    <p className="xband__heading">{NMBA.ribbon.eyebrow}</p>
                    <p className="xband__text">{NMBA.ribbon.text}</p>
                  </div>
                  <div className="xband__notice-routes">
                    <a
                      className={buttonClasses("success", "outlined", "md", undefined, "inverse")}
                      href={NMBA.ribbon.action.href}
                    >
                      <span>{NMBA.ribbon.action.label}</span>
                      <Icon name="arrow_forward" size={20} aria-hidden />
                    </a>
                    <a className="xband__alt" href={NMBA.ribbon.alt.href}>
                      {NMBA.ribbon.alt.label}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/*
             * The switch is a tablist, not two arrows. Two panels do not need
             * "previous" and "next" — a reader wants the OTHER one, and a pair of
             * chevrons makes them work out which chevron that is.
             */}
            <div className="xband__tabs" role="tablist" aria-label="Announcements" ref={tabsRef}>
              {PANELS.map((p, n) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  data-panel={n}
                  aria-selected={n === i}
                  tabIndex={n === i ? 0 : -1}
                  className="xband__tab"
                  onClick={() => setI(n)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
                    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
                  }}
                >
                  <span className="ds-sr-only">
                    {p === "campaign" ? NMBA.banner.heading : NMBA.ribbon.eyebrow}
                  </span>
                </button>
              ))}
            </div>

            <Dismiss onClick={() => setGone(true)} label="Dismiss the announcements" />
          </div>
        </section>
      }
    />
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   OPTION C — One band, the notice first, advancing on its own
   ══════════════════════════════════════════════════════════════════════════ */

const AUTO_PANELS = ["notice", "campaign"] as const;
/** Long enough to read a sentence and look away, short enough that the second
 *  panel is not effectively hidden. Both messages are one line of prose. */
const DWELL_MS = 6000;

export function OptionOneBandAuto() {
  const [i, setI] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  /** Hover and focus are two INDEPENDENT holds — a reader who tabs into the
   *  band and then moves the mouse away must not have it start moving again. */
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  /*
   * REDUCED MOTION DOES NOT AUTOPLAY AT ALL.
   *
   * §2.2.2 is satisfied by the pause control below, but the preference is a
   * separate promise and a slower rotation is not what it asks for. Read once,
   * on mount, so the band does not change behaviour under a reader mid-visit.
   */
  const [reduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const running = playing && !hovered && !focused && !reduced && !gone;

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % AUTO_PANELS.length), DWELL_MS);
    return () => window.clearInterval(t);
  }, [running]);

  function go(next: number) {
    const n = (next + AUTO_PANELS.length) % AUTO_PANELS.length;
    setI(n);
    /* Any deliberate move stops the rotation. A reader who has chosen a panel
       has said which one they want; taking it away four seconds later is the
       thing autoplay is most often blamed for. */
    setPlaying(false);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-panel="${n}"]`)?.focus();
  }

  if (gone) return <Fold band={null} />;

  const notice = i === 0;

  return (
    <Fold
      band={
        <section
          className="xband xband--one"
          /* A carousel, said in the one place assistive technology reads it. */
          role="region"
          aria-roledescription="carousel"
          aria-label="Announcements"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
        >
          <div className="sa-container xband__inner xband__inner--one">
            {/*
             * `aria-live` is OFF while it rotates and POLITE once it does not.
             * A region that announces itself every six seconds is not
             * accessible, it is relentless; one that says nothing after the
             * reader presses a dot has told them nothing at all.
             */}
            <div
              className="xband__panels"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${AUTO_PANELS.length}`}
              aria-live={running ? "off" : "polite"}
            >
              {notice ? (
                <div className="xband__panel xband__panel--notice">
                  <div className="xband__copy">
                    <p className="xband__heading">{NMBA.ribbon.eyebrow}</p>
                    <p className="xband__text">{NMBA.ribbon.text}</p>
                  </div>
                  <div className="xband__notice-routes">
                    <a
                      className={buttonClasses("success", "outlined", "md", undefined, "inverse")}
                      href={NMBA.ribbon.action.href}
                    >
                      <span>{NMBA.ribbon.action.label}</span>
                      <Icon name="arrow_forward" size={20} aria-hidden />
                    </a>
                    <a className="xband__alt" href={NMBA.ribbon.alt.href}>
                      {NMBA.ribbon.alt.label}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="xband__panel">
                  <Campaign />
                  <Helpline />
                </div>
              )}
            </div>

            <div className="xband__controls">
              <div className="xband__tabs" role="tablist" aria-label="Announcements" ref={tabsRef}>
                {AUTO_PANELS.map((p, n) => (
                  <button
                    key={p}
                    type="button"
                    role="tab"
                    data-panel={n}
                    aria-selected={n === i}
                    tabIndex={n === i ? 0 : -1}
                    className="xband__tab"
                    onClick={() => go(n)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
                      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
                    }}
                  >
                    <span className="ds-sr-only">
                      {p === "notice" ? NMBA.ribbon.eyebrow : NMBA.banner.heading}
                    </span>
                  </button>
                ))}
              </div>

              {/*
               * THE PAUSE IS NOT OPTIONAL, AND IT IS NOT DECORATION.
               *
               * WCAG 2.2 §2.2.2 requires a mechanism to pause, stop or hide any
               * content that moves, blinks or auto-updates for more than five
               * seconds beside other content. A 6s dwell is over that line the
               * moment the band mounts, so this control is what makes the
               * autoplay lawful rather than a nice extra.
               *
               * Hover and focus pause it too, which the clause does not require
               * and every reader does: nothing takes a sentence away while
               * somebody is reading it.
               */}
              {reduced ? null : (
                <button
                  type="button"
                  className="xband__play"
                  aria-pressed={!playing}
                  onClick={() => setPlaying((p) => !p)}
                >
                  <Icon name={playing ? "pause" : "play_arrow"} size={20} aria-hidden />
                  <span className="ds-sr-only">
                    {playing ? "Pause the announcements" : "Play the announcements"}
                  </span>
                </button>
              )}
            </div>

            <Dismiss onClick={() => setGone(true)} label="Dismiss the announcements" />
          </div>
        </section>
      }
    />
  );
}
