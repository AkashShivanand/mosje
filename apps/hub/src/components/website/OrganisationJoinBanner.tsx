"use client";

import * as React from "react";
import Image from "next/image";
import { Icon } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import "./organisation-join-banner.css";

/**
 * The call-to-action band a campaign page opens with, above its own title.
 *
 * NMBA's source page leads with a green band carrying the volunteer invitation,
 * a QR code, a Register Now button, the national de-addiction helpline and a
 * dismiss control — the campaign's front door, above the h1. This estate folded
 * it into the hero's quick actions, which lost the invitation and moved the
 * button below the page title.
 *
 * GREEN, AND DELIBERATELY NOT A BRAND COLOUR. The Abhiyaan publishes this band
 * in its own green, which is neither gov-blue nor saffron; it is the one place
 * on the estate where the campaign's identity outranks the department's, and it
 * is bound to the DS success ramp rather than to a literal.
 *
 * ── WHY THE HELPLINE OUTRANKS THE BUTTON ─────────────────────────────────────
 *
 * The source draws the register action as an OUTLINED button and the helpline as
 * a filled white pill — so on the department's own page the loudest object in
 * the band is the phone number, not the campaign's recruitment. An earlier pass
 * here inverted that, on the reasoning that a band should have exactly one
 * button. The reasoning was right and the conclusion was wrong: both are
 * actions, and on a page about drug de-addiction the four digits somebody in
 * trouble needs are correctly the more prominent of the two. The source's
 * hierarchy is reproduced rather than improved on.
 *
 * ── WHY THIS IS A CLIENT COMPONENT ───────────────────────────────────────────
 *
 * Only for the dismiss. The state is deliberately in memory and nowhere else —
 * not localStorage, not sessionStorage — so the band comes back on reload. A
 * campaign the department is running is not something a reader gets to switch
 * off permanently by clicking one X; it is something they can push out of the
 * way to read the page underneath.
 */
export function OrganisationJoinBanner({
  banner,
}: {
  banner: NonNullable<OrganisationDetail["joinBanner"]>;
}) {
  const headingId = React.useId();
  const [closing, setClosing] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  const external =
    banner.action.external || banner.action.href.startsWith("http");

  /*
   * A BACKSTOP FOR THE TRANSITION THAT MIGHT NOT RUN.
   *
   * The collapse animates `grid-template-rows`, which not every engine
   * interpolates. Where it does not, the rows snap to `0fr` and `transitionend`
   * never fires for that property — leaving a band that is invisible (opacity 0,
   * zero height) but still MOUNTED, so its button and its two links stay in the
   * tab order. A keyboard user would tab into a control they cannot see.
   *
   * So the unmount does not depend on the animation completing. Comfortably
   * longer than the 150ms exit so it never truncates a transition that IS
   * running; whichever arrives first wins, and setting `gone` twice is a no-op.
   */
  React.useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => setGone(true), 400);
    return () => window.clearTimeout(t);
  }, [closing]);

  function dismiss() {
    /*
     * FOCUS HAS TO GO SOMEWHERE. The button the reader just pressed is about to
     * leave the DOM, and a browser answers that by dropping focus on <body> —
     * which sends a keyboard user back to the very top of the document, behind
     * the whole masthead they had already tabbed past.
     *
     * `#content` is this site's <main>, and the band sits at the top of it, so
     * moving focus there lands almost exactly where the band was. The tabindex
     * is set here rather than in the markup because a permanent `tabindex="-1"`
     * on <main> is a change to a shared layout for one component's benefit.
     */
    const main = document.getElementById("content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setGone(true);
      return;
    }
    setClosing(true);
  }

  const band = gone ? null : (
    <section
      className={`orgjb${closing ? " orgjb--closing" : ""}`}
      aria-labelledby={headingId}
      /* The collapse is a grid-row transition; when it finishes, unmount. Bound
         to the transition rather than to a timer so the two can never disagree
         about how long the animation is. */
      onTransitionEnd={(e) => {
        if (e.propertyName === "grid-template-rows") setGone(true);
      }}
    >
      {/* Out of the tab order the moment it starts leaving: for the 150ms the
          band is fading it is still mounted, and a control at opacity 0 that can
          still be reached by Tab is worse than one that is simply gone. */}
      <div className="orgjb__collapse" inert={closing || undefined}>
        <div className="sa-container orgjb__inner">
          {banner.qrSrc ? (
            /*
             * DECORATIVE, and that is not a shortcut. The code encodes the same
             * URL as the button beside it, which is already a link with a name —
             * so describing the picture would announce the destination twice to
             * anyone who cannot scan it anyway.
             */
            <span className="orgjb__qr">
              <Image src={banner.qrSrc} alt="" width={80} height={80} />
            </span>
          ) : null}

          <div className="orgjb__copy">
            <h2 id={headingId} className="orgjb__heading">
              {banner.heading}
            </h2>
            <p className="orgjb__text">{banner.text}</p>
          </div>

          <a
            className="orgjb__cta"
            href={banner.action.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <span>{banner.action.label}</span>
            <Icon
              name={external ? "open_in_new" : "arrow_forward"}
              size={20}
              aria-hidden
            />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </a>

          {/* The helpline is a telephone number, so it dials. It reached this
              estate as a heading with the digits in a sibling element and no
              link at all. */}
          <a className="orgjb__helpline" href={`tel:${banner.helplineNumber}`}>
            <span className="orgjb__helpline-label">
              {banner.helplineLabel}
            </span>
            <span className="orgjb__helpline-pill">
              <span className="orgjb__helpline-icon">
                <Icon name="call" size={20} aria-hidden />
              </span>
              <span className="orgjb__helpline-number">
                {banner.helplineNumber}
              </span>
            </span>
          </a>

          <button
            type="button"
            className="orgjb__dismiss"
            onClick={dismiss}
            /*
             * Named by what it removes, not by its glyph. "Close" on its own
             * gives a screen-reader user a control and no idea what it closes,
             * on a page that also has a menu, a chat panel and a cookie notice.
             */
            aria-label={`Dismiss the ${banner.heading} announcement`}
          >
            <Icon name="close" size={20} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {/*
       * THE LIVE REGION IS MOUNTED FROM THE FIRST RENDER, EMPTY.
       *
       * The band going away is announced, because focus moving on its own is not
       * an explanation of what happened. But a region that is INSERTED carrying
       * its text is routinely not announced at all — assistive technology has to
       * have been observing the node before the text arrived. So the paragraph
       * always exists and only its contents change.
       */}
      <p className="sr-only" role="status">
        {gone
          ? `${banner.heading}: announcement dismissed. It returns when the page is reloaded.`
          : ""}
      </p>
      {band}
    </>
  );
}
