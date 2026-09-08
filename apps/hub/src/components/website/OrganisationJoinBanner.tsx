"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import { dismissCampaign } from "@/lib/website/campaign-dismissed";
import "./organisation-join-banner.css";

/**
 * The band a campaign page opens with, above its own title.
 *
 * ── ONE MESSAGE, THREE ROUTES ───────────────────────────────────────────────
 *
 * It used to hold two messages in one green rectangle, at the same weight: a
 * recruitment drive for someone browsing unhurried, and a telephone number for
 * someone in trouble at four in the morning. Every pass argued about which
 * should be louder, which is the wrong argument — they were two announcements
 * sharing a container, and that is what made the band read as cluttered.
 *
 * They are now ONE message with THREE ways to act on it. The band says what the
 * Abhiyaan is; the reader can call it, register for it, or scan it. Nothing in
 * the row is a second announcement, so nothing has to out-shout anything.
 *
 * Emphasis is carried by the buttons rather than by the layout: the helpline is
 * FILLED and the campaign is OUTLINED, because on a page about de-addiction the
 * number outranks the recruitment. That was previously done with a 362px white
 * pill — the widest and brightest object in the band, and not the band's own
 * message.
 *
 * ── WHAT THE DISMISS TAKES, AND WHY THAT IS NOW SAFE ─────────────────────────
 *
 * The × removes the whole band, helpline included. That is a deliberate change
 * from the arrangement where the helpline sat outside the collapsible region,
 * and it is safe on NMBA for one specific reason: the key-facts strip 200px
 * below carries `14446 · National de-addiction helpline` as its third figure,
 * restored on 08 September for exactly this eventuality.
 *
 * ANY organisation record that gains a `joinBanner` with a helpline should carry
 * that number in `facts` too. Nothing enforces it — it is a content decision, so
 * it is written here rather than asserted in code.
 *
 * ── THE QR AND THE BUTTON ARE ONE THING ──────────────────────────────────────
 *
 * They open the same URL. The source puts them at opposite ends of the band,
 * about 900px apart, where nothing tells a reader they are the same offer. They
 * are adjacent here — the QR closes the row at the trailing edge, immediately
 * after the button — so proximity does the explaining and no caption has to.
 *
 * ── GREEN, AND DELIBERATELY NOT A BRAND COLOUR ───────────────────────────────
 *
 * The Abhiyaan publishes this band in its own green, which is neither gov-blue
 * nor saffron; it is the one place on the estate where the campaign's identity
 * outranks the department's, and it is bound to the DS success ramp rather than
 * to a literal.
 *
 * ── WHY THIS IS A CLIENT COMPONENT ───────────────────────────────────────────
 *
 * Only for the dismiss. The state is in memory and nowhere else — not
 * localStorage, not sessionStorage — so the campaign returns on reload. A
 * campaign the department is running is not something a reader switches off
 * permanently by clicking one X; it is something they push out of the way to
 * read the page underneath.
 */
export function OrganisationJoinBanner({
  banner,
}: {
  banner: NonNullable<OrganisationDetail["joinBanner"]>;
}) {
  const headingId = React.useId();
  const [closing, setClosing] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  const external = banner.action.external || banner.action.href.startsWith("http");
  const ctaLabel = banner.action.shortLabel ?? banner.action.label;
  const helpLabel = banner.helplineShortLabel ?? banner.helplineLabel;

  /*
   * A BACKSTOP FOR THE TRANSITION THAT MIGHT NOT RUN.
   *
   * The collapse animates `grid-template-rows`, which not every engine
   * interpolates. Where it does not, the rows snap to `0fr` and `transitionend`
   * never fires for that property — leaving a campaign that is invisible
   * (opacity 0, zero height) but still MOUNTED, so its button and its link stay
   * in the tab order. A keyboard user would tab into controls they cannot see.
   *
   * So the unmount does not depend on the animation completing. Comfortably
   * longer than the 200ms collapse so it never truncates a transition that IS
   * running; whichever arrives first wins, and setting `gone` twice is a no-op.
   */
  React.useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => setGone(true), 450);
    return () => window.clearTimeout(t);
  }, [closing]);

  function dismiss() {
    /*
     * THE HELPLINE DOES NOT GO WITH THE ADVERTISEMENT.
     *
     * Announcing the dismissal to the store puts the number back beside the
     * organisation's mark, so refusing a recruitment drive no longer removes a
     * national de-addiction helpline from the top of a page about drug
     * de-addiction. Until this existed that was safe only because the key-facts
     * strip happens to carry the number — a coincidence of content standing in
     * for a design.
     */
    dismissCampaign();

    /*
     * FOCUS HAS TO GO SOMEWHERE. The button the reader just pressed is about to
     * leave the DOM, and a browser answers that by dropping focus on <body> —
     * which sends a keyboard user back to the very top of the document, behind
     * the whole masthead they had already tabbed past.
     *
     * `#content` is this site's <main>, and the band sits at the top of it, so
     * moving focus there lands almost exactly where the campaign was. NOT the
     * surviving helpline link, which was the other candidate: a reader who has
     * just said "less of this" should be put in front of the page, not left
     * standing on the one part of the band that did not go away.
     *
     * The tabindex is set here rather than in the markup because a permanent
     * `tabindex="-1"` on <main> is a change to a shared layout for one
     * component's benefit.
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
          ? `${banner.heading}: dismissed. The ${banner.helplineLabel}, ${banner.helplineNumber}, is now shown beside the page heading. The announcement returns when the page is reloaded.`
          : ""}
      </p>

      {gone ? null : (
        <section className="orgjb" aria-labelledby={headingId}>
          <div className="sa-container orgjb__inner">
            <div
              className={`orgjb__campaign${closing ? " orgjb__campaign--closing" : ""}`}
              onTransitionEnd={(e) => {
                if (e.propertyName === "grid-template-rows") setGone(true);
              }}
            >
              {/* Out of the tab order the moment it starts leaving: while it is
                  fading it is still mounted, and a control at opacity 0 that can
                  still be reached by Tab is worse than one simply gone. */}
              <div className="orgjb__campaign-clip" inert={closing || undefined}>
                <div className="orgjb__campaign-row">
                  {banner.qrSrc ? (
                    /*
                     * THE CODE LEADS, and it is the reason this band now has a
                     * left edge at all.
                     *
                     * It sits immediately before the heading it fulfils — "Join
                     * Nasha Mukt Bharat Abhiyaan" — with the button that opens
                     * the same URL directly after that heading. The three read
                     * left to right as one sentence: scan it, here is what it
                     * is, or press this. The source publishes the code and the
                     * button about 900px apart with nothing between them saying
                     * they are the same offer.
                     *
                     * DECORATIVE, and that is not a shortcut: the button beside
                     * it is already a link with a name, so describing the
                     * picture would announce the destination twice to a reader
                     * who cannot scan it anyway.
                     */
                    <span className="orgjb__qr">
                      <Image src={banner.qrSrc} alt="" width={72} height={72} />
                    </span>
                  ) : null}

                  <div className="orgjb__copy">
                    {/*
                      * A `<p>`, NOT AN `<h2>` — and the region is still named by it.
                      *
                      * This band renders ABOVE the page's own `<h1>`, so as a
                      * heading it opened the document outline at level 2 and then
                      * went UP to level 1. A screen-reader user listing headings
                      * met "Join Nasha Mukt Bharat Abhiyaan" before the page told
                      * them which page they were on, on every organisation page
                      * that carries a campaign band.
                      */}
                    <p id={headingId} className="orgjb__heading">
                      {banner.heading}
                    </p>
                    <p className="orgjb__text">{banner.text}</p>
                  </div>

                  {/*
                    * A DESIGN-SYSTEM BUTTON, not a re-implementation of one.
                    *
                    * `variant="success"` because the band is the Abhiyaan's own
                    * green rather than the department's blue, and the DS carries a
                    * success family for the inverse ladder. The one thing
                    * overridden is the EDGE, through `--sa-btn-edge` — the hook the
                    * component publishes for exactly this. The success default is
                    * `successScale-100`, a pale green that measures 4.79:1 on the
                    * band; the handoff draws the pill in WHITE at 6.72:1.
                    */}
                  <a
                    className={buttonClasses("success", "outlined", "md", "orgjb__cta", "inverse")}
                    href={banner.action.href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    /* The department's whole label, where the button shows a
                       clause of it. The visible text is contained in this
                       string, so §2.5.3 holds. */
                    aria-label={ctaLabel === banner.action.label ? undefined : banner.action.label}
                  >
                    <span>{ctaLabel}</span>
                    <Icon name={external ? "open_in_new" : "arrow_forward"} size={20} aria-hidden />
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>

                  {/*
                    * THE HELPLINE STANDS APART, AND IT IS THE ONLY FILLED CONTROL.
                    *
                    * It was next to the campaign's own button as a matched pair,
                    * which read as two halves of one offer — and it is not part of
                    * the offer. It is a standing public service that happens to be
                    * printed on this page, so it takes the band's trailing edge,
                    * a wider gap in front of it, and the only white fill.
                    *
                    * Set apart AND brightest: a reader looking for a number finds
                    * the one object on the band that is a solid block of white,
                    * wherever in the row it sits, and a reader following the
                    * campaign is never asked to step over it to reach the button.
                    */}
                  <a
                    className={buttonClasses("success", "filled", "md", "orgjb__helpline", "inverse")}
                    href={`tel:${banner.helplineNumber}`}
                    /* The department's full title, where the button shows a
                       shortened one. The visible text is contained in this
                       string, so WCAG 2.2 §2.5.3 holds. */
                    aria-label={
                      helpLabel === banner.helplineLabel
                        ? undefined
                        : `${banner.helplineLabel} ${banner.helplineNumber}`
                    }
                  >
                    <Icon name="call" size={20} aria-hidden />
                    <span className="orgjb__helpline-label">{helpLabel}</span>
                    <span className="orgjb__helpline-number">{banner.helplineNumber}</span>
                  </a>

                  <button
                    type="button"
                    className="orgjb__dismiss"
                    onClick={dismiss}
                    aria-label={`Dismiss the ${banner.heading} announcement`}
                  >
                    <Icon name="close" size={20} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
