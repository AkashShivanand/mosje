"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import { Fold, NMBA } from "./fold";
import "./composed-band.css";

/**
 * ONE BAND, TWO HALVES: A STANDING SERVICE AND A ROTATING OFFER.
 *
 * ── WHAT THE PREVIOUS ATTEMPT GOT WRONG ─────────────────────────────────────
 *
 * It was assembled rather than designed. A flat green strip, one optical line,
 * small type on the left and three loose controls scattered at the right — dots,
 * a pause, a cross — none of them grouped with the thing they act on. The eye
 * had nothing to land on, so the band read as chrome and went unnoticed, which
 * is the one thing it must not do.
 *
 * And the two rotating panels were IDENTICAL: same ground, same layout, same
 * ink. The whole purpose of rotating them is that a reader notices the change,
 * and nothing about the change was noticeable.
 *
 * ── HOW THIS ONE IS BUILT ───────────────────────────────────────────────────
 *
 * 1. THE HEIGHT IS THE TALLER PANEL'S, always. Both panels occupy the same grid
 *    cell; the inactive one keeps its space with `visibility: hidden`. So the
 *    band is `max-content` of the two by construction and never resizes as it
 *    rotates — no JavaScript measuring, and no lurch.
 *
 * 2. THE HALVES ARE DIFFERENT MATERIALS. The helpline is the only white surface
 *    on the page's green: the lightest material draws the eye to the most
 *    important interactive thing, and here that is not the campaign — it is the
 *    number somebody may be looking for at four in the morning. The rotating
 *    half stays on the band's own ground.
 *
 * 3. THE TWO OFFERS ARE TOLD APART FOUR WAYS, because one is not enough at a
 *    glance: their own ACCENT (saffron for the observance, the Abhiyaan's leaf
 *    cream for the volunteer drive), their own GLYPH, their own EYEBROW naming
 *    what kind of thing it is, and their own SHAPE — the volunteer panel carries
 *    a code, the observance does not.
 *
 * 4. THE CONTROLS SIT WITH WHAT THEY CONTROL. Pagination is inside the rotating
 *    half, on the action row, because it pages THAT — not the band. The dismiss
 *    is at the band's top corner, because it dismisses the band. A control's
 *    position is the only explanation of its scope a reader ever reads.
 */

const OFFERS = [
  {
    id: "observance",
    accent: "saffron",
    icon: "celebration",
    eyebrow: "Sixth Anniversary",
    heading: NMBA.ribbon.eyebrow,
    body: NMBA.ribbon.text,
    action: { label: NMBA.ribbon.action.label, href: NMBA.ribbon.action.href, icon: "arrow_forward" },
    alt: NMBA.ribbon.alt,
    qr: null,
  },
  {
    id: "mitr",
    accent: "leaf",
    icon: "volunteer_activism",
    eyebrow: "Volunteer",
    heading: NMBA.banner.heading,
    body: NMBA.banner.text,
    action: {
      label: NMBA.banner.actionLabel,
      href: NMBA.banner.actionHref,
      icon: "open_in_new",
      external: true,
    },
    qr: NMBA.banner.qrSrc,
  },
] as const;

const DWELL_MS = 6000;

export function ComposedBand() {
  const [i, setI] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const dotsRef = React.useRef<HTMLDivElement>(null);

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
          className="cband"
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
          <div className="sa-container cband__inner">
            {/* ── The standing service ─────────────────────────────────────── */}
            <a
              className="cband__helpline"
              href={`tel:${NMBA.banner.helplineNumber}`}
              aria-label={`${NMBA.banner.helplineLabel} ${NMBA.banner.helplineNumber}`}
            >
              <span className="cband__helpline-glyph" aria-hidden>
                <Icon name="call" size={24} />
              </span>
              <span className="cband__helpline-text">
                <span className="cband__helpline-label">{NMBA.banner.helplineShort}</span>
                <span className="cband__helpline-number">{NMBA.banner.helplineNumber}</span>
              </span>
            </a>

            {/* ── The rotating offer ───────────────────────────────────────── */}
            <div
              className="cband__stage"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${OFFERS.length}`}
              aria-live={running ? "off" : "polite"}
            >
              {OFFERS.map((o, n) => (
                /*
                 * BOTH PANELS OCCUPY THE SAME CELL and the inactive one keeps
                 * its space. That is what makes the band the height of its
                 * tallest content without measuring anything, and what stops it
                 * resizing as it turns.
                 */
                <div
                  key={o.id}
                  className="cband__offer"
                  data-accent={o.accent}
                  data-active={n === i || undefined}
                  {...(n === i ? {} : { inert: true })}
                >
                  <span className="cband__offer-glyph" aria-hidden>
                    <Icon name={o.icon} size={20} />
                  </span>

                  <div className="cband__offer-copy">
                    <p className="cband__offer-eyebrow">{o.eyebrow}</p>
                    <p className="cband__offer-heading">{o.heading}</p>
                    <p className="cband__offer-body">
                      {o.body}
                      {/*
                       * THE SECOND ROUTE IS A NOTE ON THE OFFER, NOT A PEER OF
                       * THE BUTTON.
                       *
                       * Stacked under the action it made three things share one
                       * corner — button, link, pager — and the pager ended up
                       * touching the link. It is also the wrong reading: "file
                       * on the open register" is a condition attached to the
                       * offer, and conditions live with the prose.
                       */}
                      {"alt" in o && o.alt ? (
                        <>
                          {" "}
                          <a className="cband__alt" href={o.alt.href}>
                            {o.alt.label}
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>

                  {o.qr ? (
                    <span className="cband__offer-qr">
                      <Image src={o.qr} alt="" width={88} height={88} />
                    </span>
                  ) : null}

                  <div className="cband__offer-actions">
                    <a
                      className={buttonClasses("success", "outlined", "md", "cband__cta", "inverse")}
                      href={o.action.href}
                      target={"external" in o.action && o.action.external ? "_blank" : undefined}
                      rel={"external" in o.action && o.action.external ? "noreferrer" : undefined}
                    >
                      <span>{o.action.label}</span>
                      <Icon name={o.action.icon} size={20} aria-hidden />
                    </a>
                  </div>
                </div>
              ))}

              {/*
               * PAGINATION LIVES INSIDE THE ROTATING HALF, because it pages
               * THAT and not the band. Position is the only explanation of a
               * control's scope a reader ever reads.
               */}
              <div className="cband__pager">
                <div className="cband__dots" role="tablist" aria-label="Announcements" ref={dotsRef}>
                  {OFFERS.map((o, n) => (
                    <button
                      key={o.id}
                      type="button"
                      role="tab"
                      data-i={n}
                      aria-selected={n === i}
                      tabIndex={n === i ? 0 : -1}
                      className="cband__dot"
                      onClick={() => go(n)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
                        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
                      }}
                    >
                      <span className="ds-sr-only">{o.eyebrow}</span>
                    </button>
                  ))}
                </div>

                {/* WCAG 2.2 §2.2.2: anything auto-updating past five seconds
                    needs a way to stop it. A 6s dwell is over that line. */}
                {reduced ? null : (
                  <button
                    type="button"
                    className="cband__play"
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

            {/* The dismiss is the BAND'S, so it sits at the band's corner. */}
            <button
              type="button"
              className="cband__dismiss"
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
