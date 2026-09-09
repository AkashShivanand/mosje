"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import { Fold, NMBA } from "./fold";
import "./standing-band.css";

/**
 * THE NUMBER LEADS — the band drawn from the handoff at 57913:17152, and the
 * four places that handoff is improved rather than copied.
 *
 * ── WHAT THE HANDOFF DECIDED, AND IS RIGHT ABOUT ────────────────────────────
 *
 * 1. THE HELPLINE IS THE LOUDEST THING IN THE BAND. Five digits at display
 *    scale, on the only solid white surface, against a 20px campaign heading.
 *    The previous composition had the number at 28px — polite, and wrong. On a
 *    page about drug de-addiction the most consequential object in the fold is
 *    not the volunteer drive; it is the number somebody may be looking for at
 *    four in the morning. Size is the only argument a band this size can make.
 *
 * 2. IT SITS ON THE TRAILING EDGE. Reading order follows the band's own
 *    purpose, which is the campaign; the number is found by TREATMENT, not by
 *    position — it is the brightest and largest object on the row, so it is
 *    found in one pass from anywhere.
 *
 * 3. THE EYEBROW GOES. Three stacked things in a 70px copy column left nothing
 *    room to breathe, and "Six Years of the Abhiyaan" already IS the eyebrow's
 *    information. What the eyebrow was carrying — telling the two offers apart —
 *    moves to marks that read further (below).
 *
 * 4. ONE LEADING MARK SLOT. The glyph tile and the code occupy the same square,
 *    sized by the copy beside it, so both panels have the same skeleton and the
 *    band cannot change shape as it turns.
 *
 * ── AND THE FOUR THINGS CHANGED FROM IT ─────────────────────────────────────
 *
 * A. THE PAGER TAKES THE GLASS'S MATERIAL, NOT WHITE. Drawn as a solid white
 *    pill with a grey hairline, it was the third white object on the row and the
 *    second-brightest thing in the band — after the national helpline and ahead
 *    of the campaign's own button. A control for advancing a slide should not
 *    outrank either. It is now the rotating card's own furniture: white at 14%
 *    with white marks, the same material as the card it pages. (The handoff's
 *    pause well was `white 14%` ON white, which is invisible; that goes with it.)
 *
 * B. THE CODE GETS A QUIET ZONE. Drawn bare on the translucent green, a code
 *    loses the light margin a scanner needs at its edges. A white tile with 6px
 *    of padding restores it, and has the side effect of giving panel B a leading
 *    mark of the same weight as panel A's tile.
 *
 * C. THE NUMBER'S TRACKING GOES NEGATIVE. The handoff sets +2px on a 52px
 *    numeral. Large figures read too far apart as they grow, not too close;
 *    positive tracking at display scale is the one typographic setting that
 *    makes a number harder to take in at a glance, which is the only thing this
 *    number has to do.
 *
 * D. THE CURRENT DOT SHOWS THE DWELL RUNNING. A reader has no way of knowing
 *    the band rotates until it has already rotated under them. The active dot
 *    fills across the six seconds, so the change is announced before it happens
 *    rather than explained after it. It stops with everything else — the pause
 *    button, hover, focus, and `prefers-reduced-motion`.
 *
 * ── HOW THE TWO OFFERS ARE TOLD APART ───────────────────────────────────────
 *
 * Two marks, both large, rather than four small ones: the LEADING SQUARE, which
 * is a saffron-tinted glyph tile on the observance and a white code tile on the
 * volunteer drive — different colour AND different kind of object — and the
 * card's own LIT TOP EDGE, which carries the panel's accent across the full
 * 889px as it turns. The eyebrow and the accent chip it replaced were each 40px
 * of a 1272px band, which is not a difference a reader notices at a glance.
 */

const OFFERS = [
  {
    id: "observance",
    accent: "saffron",
    icon: "celebration",
    /** For the pager's accessible name — the eyebrow's words survive here. */
    name: "Sixth Anniversary",
    heading: NMBA.ribbon.eyebrow,
    body: NMBA.ribbon.text,
    alt: NMBA.ribbon.alt,
    action: {
      label: NMBA.ribbon.action.label,
      href: NMBA.ribbon.action.href,
      icon: "arrow_forward",
    },
    qr: null,
  },
  {
    id: "mitr",
    accent: "leaf",
    icon: "volunteer_activism",
    name: "Volunteer",
    heading: NMBA.banner.heading,
    body: NMBA.banner.text,
    alt: null,
    action: {
      label: NMBA.banner.actionLabel,
      fullLabel: NMBA.banner.actionFullLabel,
      href: NMBA.banner.actionHref,
      icon: "open_in_new",
      external: true,
    },
    qr: NMBA.banner.qrSrc,
  },
] as const;

const DWELL_MS = 6000;

export function StandingBand() {
  const [i, setI] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const dotsRef = React.useRef<HTMLDivElement>(null);

  /* `OFFERS[i]` is indexed access; the modulo above guarantees it resolves, and
     this is what says so to the compiler without an assertion. */
  const current = OFFERS[i] ?? OFFERS[0];

  const [reduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  /* Four independent holds. Hover and focus are tracked separately: a reader who
     tabs in and then moves the mouse away must not have it start again. */
  const running = playing && !hovered && !focused && !reduced && !gone;

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % OFFERS.length), DWELL_MS);
    return () => window.clearInterval(t);
  }, [running]);

  function go(next: number) {
    const n = (next + OFFERS.length) % OFFERS.length;
    setI(n);
    setPlaying(false);
    dotsRef.current?.querySelector<HTMLButtonElement>(`[data-i="${n}"]`)?.focus();
  }

  if (gone) return <Fold band={null} />;

  return (
    <Fold
      band={
        <section
          className="sband"
          role="region"
          aria-roledescription="carousel"
          aria-label="Announcements"
          style={{ "--sband-dwell": `${DWELL_MS}ms` } as React.CSSProperties}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
        >
          <div className="sa-container sband__inner">
            {/* ── The rotating offer, on the leading edge ───────────────────
                It reads first because the band's own subject is the campaign.
                The helpline does not need to be first; it is found by weight. */}
            <div
              className="sband__stage"
              data-accent={current.accent}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${OFFERS.length}`}
              aria-live={running ? "off" : "polite"}
            >
              {OFFERS.map((o, n) => (
                /*
                 * BOTH PANELS SHARE ONE GRID CELL and the inactive one keeps its
                 * space with `visibility: hidden`. That is what makes the stage
                 * the height of its tallest panel without measuring anything,
                 * and what stops the band resizing as it turns.
                 */
                <div
                  key={o.id}
                  className="sband__offer"
                  data-accent={o.accent}
                  data-active={n === i || undefined}
                  {...(n === i ? {} : { inert: true })}
                >
                  {/*
                   * ONE SLOT, TWO KINDS OF OBJECT. The square is sized by the
                   * copy beside it — `align-self: stretch` and a 1:1 ratio — so
                   * neither panel can set the band's height on its own.
                   */}
                  {o.qr ? (
                    /*
                     * THE CODE ONLY EXISTS WHERE IT CAN BE SCANNED.
                     *
                     * A code is read by a SECOND device, so on a phone — the
                     * device already holding the page, at 40px — it is not a
                     * code, it is a grey square. Below 768 this panel shows its
                     * glyph instead, which is what the other panel shows at
                     * every width, so the two marks are the same kind of object
                     * on a phone as they are on a desktop.
                     *
                     * Both are rendered and one is hidden in CSS rather than
                     * switched in JS: a media query cannot be read on the server
                     * and a layout that only settles after hydration is a
                     * layout that shifts.
                     */
                    <>
                      <span className="sband__mark sband__mark--code">
                        <Image src={o.qr} alt="" width={128} height={128} />
                      </span>
                      <span className="sband__mark sband__mark--glyph sband__mark--phone" aria-hidden>
                        <Icon name={o.icon} size={40} />
                      </span>
                    </>
                  ) : (
                    <span className="sband__mark sband__mark--glyph" aria-hidden>
                      <Icon name={o.icon} size={40} />
                    </span>
                  )}

                  <div className="sband__copy">
                    <p className="sband__heading">{o.heading}</p>
                    <p className="sband__body">
                      {o.body}
                      {/*
                       * The second route is a CONDITION on the offer, so it
                       * lives in the prose rather than beside the button. A
                       * reader without a departmental account needs the
                       * sentence to know the link applies to them.
                       */}
                      {o.alt ? (
                        <>
                          {" "}
                          <span className="sband__alt-note">{o.alt.note}</span>{" "}
                          <a className="sband__alt" href={o.alt.href}>
                            {o.alt.label}
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>

                  <a
                    className={buttonClasses("success", "outlined", "md", "sband__cta", "inverse")}
                    href={o.action.href}
                    target={"external" in o.action && o.action.external ? "_blank" : undefined}
                    rel={"external" in o.action && o.action.external ? "noreferrer" : undefined}
                    /* The department's whole label where the button shows a
                       clause of it; the visible text is contained in it, so
                       §2.5.3 holds. */
                    aria-label={"fullLabel" in o.action ? o.action.fullLabel : undefined}
                  >
                    <span>{o.action.label}</span>
                    <Icon name={o.action.icon} size={20} aria-hidden />
                    {"external" in o.action && o.action.external ? (
                      <span className="ds-sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </div>
              ))}

              {/*
               * PAGINATION SITS INSIDE THE CARD IT PAGES, in its own corner —
               * position is the only explanation of a control's scope a reader
               * ever gets, and the band's dismiss is deliberately elsewhere.
               *
               * It must also sit ABOVE the panel: both share `grid-area: offer`,
               * so without the raised rung the panel paints over the dots and
               * swallows every click on them.
               */}
              <div className="sband__pager" data-running={running || undefined}>
                <div className="sband__dots" role="tablist" aria-label="Announcements" ref={dotsRef}>
                  {OFFERS.map((o, n) => (
                    <button
                      key={o.id}
                      type="button"
                      role="tab"
                      data-i={n}
                      aria-selected={n === i}
                      tabIndex={n === i ? 0 : -1}
                      className="sband__dot"
                      onClick={() => go(n)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
                        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
                      }}
                    >
                      <span className="ds-sr-only">{o.name}</span>
                    </button>
                  ))}
                </div>

                {/* WCAG 2.2 §2.2.2: anything auto-updating past five seconds
                    needs a mechanism to stop it. A 6s dwell is over that line,
                    so this control is what makes the band lawful — and it stops
                    the dwell indicator with it. */}
                {reduced ? null : (
                  <button
                    type="button"
                    className="sband__play"
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
            </div>

            {/* ── The standing service ─────────────────────────────────────
                The only solid white surface on the page's green, carrying the
                only display-scale figure in the fold. */}
            <a
              className="sband__helpline"
              href={`tel:${NMBA.banner.helplineNumber}`}
              aria-label={`${NMBA.banner.helplineLabel} ${NMBA.banner.helplineNumber}`}
            >
              <span className="sband__helpline-glyph" aria-hidden>
                <Icon name="call" size={24} />
              </span>
              <span className="sband__helpline-text">
                <span className="sband__helpline-label">{NMBA.banner.helplineShort}</span>
                <span className="sband__helpline-number">{NMBA.banner.helplineNumber}</span>
              </span>
            </a>

            {/* The dismiss is the BAND'S, so it sits on the band's own ground —
                outside both cards, sharing their top edge. */}
            <button
              type="button"
              className="sband__dismiss"
              onClick={() => setGone(true)}
              aria-label="Dismiss the announcements"
            >
              <Icon name="close" size={20} aria-hidden />
            </button>
          </div>
        </section>
      }
    />
  );
}
