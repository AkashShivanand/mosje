"use client";

import * as React from "react";
import Image from "next/image";
import { Icon, buttonClasses } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import "./organisation-join-banner.css";

/**
 * The band a campaign page opens with, above its own title.
 *
 * ── THE THING THIS BAND WAS GETTING WRONG ────────────────────────────────────
 *
 * It held seven elements for TWO ENTIRELY DIFFERENT PEOPLE, at the same visual
 * weight, in one green rectangle:
 *
 *   · someone browsing a government campaign, who might volunteer — unhurried,
 *     exploring, perfectly willing to read a sentence first;
 *   · someone in trouble, or whose child is, who needs a telephone number — now,
 *     possibly at four in the morning, possibly on a bad connection.
 *
 * Every previous pass, this estate's and the source's, argued about which of
 * those two should be louder. That is the wrong argument: they are not two
 * treatments of one message, they are two messages — and the reason the band
 * kept reading as cluttered is that it was being asked to be two things at once.
 *
 * So the band now has an ANCHOR and a GUEST. The helpline is the anchor: first
 * in reading order, on the only white surface, and permanent. The campaign is
 * the guest: it introduces itself, offers two ways to accept, and can be shown
 * the door.
 *
 * ── AND THE DEFECT THAT FOLLOWS FROM IT ──────────────────────────────────────
 *
 * The dismiss shipped removing the WHOLE band — so a control whose job is "I do
 * not want this advertisement" also deleted the national de-addiction helpline
 * from the top of a page about drug de-addiction. Nobody decided that; it fell
 * out of two messages sharing one container.
 *
 * The helpline now sits OUTSIDE the collapsible region. Dismissing the campaign
 * leaves it exactly where it was and the band simply gets shorter. A promotion
 * can be refused; a number somebody might need at four in the morning is not
 * something they should be able to throw away by accident.
 *
 * ── THE QR AND THE BUTTON ARE ONE THING ──────────────────────────────────────
 *
 * They open the same URL. The source puts them at opposite ends of the band,
 * about 900px apart, where nothing tells a reader they are the same offer. They
 * are adjacent here, in one group, so proximity does the explaining and no
 * caption has to.
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
       * The campaign going away is announced, because focus moving on its own is
       * not an explanation of what happened. But a region that is INSERTED
       * carrying its text is routinely not announced at all — assistive
       * technology has to have been observing the node before the text arrived.
       * So the paragraph always exists and only its contents change.
       *
       * It says what SURVIVED as well as what went, because "dismissed" alone
       * would leave a reader who wanted the number believing they had lost it.
       */}
      <p className="sr-only" role="status">
        {gone
          ? `${banner.heading}: announcement dismissed. The ${banner.helplineLabel}, ${banner.helplineNumber}, is still here. The announcement returns when the page is reloaded.`
          : ""}
      </p>

      <section
        className="orgjb"
        /* Named by the campaign while the campaign is here, and by what remains
           once it is not — a region whose name describes something no longer
           inside it is worse than no name at all. */
        aria-labelledby={gone ? undefined : headingId}
        aria-label={gone ? banner.helplineLabel : undefined}
      >
        <div className="sa-container orgjb__inner">
          {/*
           * ── THE ANCHOR ──────────────────────────────────────────────────────
           *
           * Outside the collapsible region, first in the DOM, first in reading
           * order, and on the only white surface in the band — the one element
           * here allowed to be the brightest thing on the screen.
           *
           * It is a link, so it dials. It reached this estate as a heading with
           * the digits in a sibling element and no link at all.
           */}
          <a className="orgjb__helpline" href={`tel:${banner.helplineNumber}`}>
            <span className="orgjb__helpline-icon">
              <Icon name="call" size={20} aria-hidden />
            </span>
            <span className="orgjb__helpline-label">{banner.helplineLabel}</span>
            <span className="orgjb__helpline-number">{banner.helplineNumber}</span>
          </a>

          {/* ── THE GUEST ──────────────────────────────────────────────────── */}
          {gone ? null : (
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
                      *
                      * It was never a section heading anyway: the band is a
                      * promotional aside beside the page, not a division of it.
                      * `aria-labelledby` still points here, so the region keeps
                      * its accessible name and loses nothing but the outline
                      * entry it should never have had.
                      */}
                    <p id={headingId} className="orgjb__heading">
                      {banner.heading}
                    </p>
                    <p className="orgjb__text">{banner.text}</p>
                  </div>

                  {/* Scan it or press it — the same URL, so they are one group,
                      and proximity says so without a caption. */}
                  <div className="orgjb__join">
                    {banner.qrSrc ? (
                      /*
                       * DECORATIVE, and that is not a shortcut. The code encodes
                       * the same URL as the button beside it, which is already a
                       * link with a name — so describing the picture would
                       * announce the destination twice to a reader who cannot
                       * scan it anyway.
                       */
                      <span className="orgjb__qr">
                        <Image src={banner.qrSrc} alt="" width={72} height={72} />
                      </span>
                    ) : null}

                    {/*
                      * A DESIGN-SYSTEM BUTTON, not a re-implementation of one.
                      *
                      * `.orgjb__cta` used to declare its own padding, border,
                      * radius, type, weight, hover, press and transition —
                      * thirty-six lines restating what `Button` already owns.
                      * Every value was correctly token-bound and it even carried
                      * its own focus ring, so this was a re-implementation that
                      * was RIGHT — the harder case to argue. What it cost was
                      * not a defect but divergence: one button whose size,
                      * weight and press would drift from every other button in
                      * the estate the next time the component moved.
                      *
                      * `variant="success"` because the band is the Abhiyaan's
                      * own green rather than the department's blue, and the DS
                      * carries a success family for the inverse ladder. The one
                      * thing overridden is the EDGE, through `--sa-btn-edge` —
                      * the hook the component publishes for exactly this. The
                      * success default is `successScale-100`, a pale green that
                      * measures 4.79:1 on the band; the handoff draws the pill
                      * in WHITE at 6.72:1, and this change is about what builds
                      * the button, not about restyling it.
                      */}
                    <a
                      className={buttonClasses("success", "outlined", "sm", "orgjb__cta", "inverse")}
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
                  </div>

                  <button
                    type="button"
                    className="orgjb__dismiss"
                    onClick={dismiss}
                    /*
                     * Named by what it removes, not by its glyph — and it says
                     * "announcement" rather than "banner" so nobody reads it as
                     * the control that would take the helpline with it.
                     */
                    aria-label={`Dismiss the ${banner.heading} announcement`}
                  >
                    <Icon name="close" size={20} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
