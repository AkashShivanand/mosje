"use client";

import * as React from "react";
import NextLink from "next/link";
import { Icon } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import "./organisation-event-ribbon.css";

/**
 * A TIME-LIMITED OCCASION, AS ONE THIN ROW.
 *
 * Asked for in the 07 Sep 2026 review, in these words: a thin ribbon, between
 * the blue section and the data section, carrying the sixth-anniversary
 * observance and a way to file pre-event details.
 *
 * ── WHY IT IS A ROW AND NOT A PANEL ─────────────────────────────────────────
 *
 * The same review's other finding was that this page's first fold already
 * carries too much: a campaign band with its own helpline, QR, invitation and
 * dismiss; a hero with a logo, a title, a paragraph, two buttons and a
 * photograph carousel; and a fact strip. A second panel would have answered one
 * complaint by worsening the other. So the ribbon is one row — an occasion, a
 * sentence, a button and a link — and it is the only element on the page that
 * announces a deadline.
 *
 * ── SAFFRON, BECAUSE THE OTHER TWO COLOURS ARE TAKEN ────────────────────────
 *
 * Green above it is the Abhiyaan's own campaign identity and blue below it is
 * the department's. A third band in either would read as more of the thing above
 * it rather than as a separate, temporary notice. Saffron is the estate's second
 * brand ramp and it is used here at its quietest rung, with the emphasis carried
 * by a 3px rule rather than by a filled ground — a departmental page announcing
 * an anniversary should not be the loudest thing on the screen.
 *
 * ── ONE BUTTON AND ONE LINK ─────────────────────────────────────────────────
 *
 * Two audiences file through two different doors: a line Ministry or Department
 * through the administrative login it already holds, an autonomous body or a
 * corporate participant through the open activities register. `ActionBanner`'s
 * contract is the argument against making that two buttons — "a banner with two
 * equal buttons has no call to action, it has a decision" — so the majority
 * route is the button and the other names its audience in that audience's own
 * words, which is how a reader recognises which one is theirs.
 *
 * ── DISMISSAL, AND WHAT IT DOES NOT TAKE WITH IT ────────────────────────────
 *
 * In memory only, exactly as `OrganisationJoinBanner` does it, and for the same
 * reason: a reader pushing a departmental announcement out of the way for this
 * visit has not asked to switch it off for good. Unlike that band this one is a
 * single message, so dismissing it can safely remove the whole thing — there is
 * no helpline hiding inside it to lose.
 */
export function OrganisationEventRibbon({
  ribbon,
}: {
  ribbon: NonNullable<OrganisationDetail["eventRibbon"]>;
}): React.JSX.Element | null {
  const headingId = React.useId();
  const [gone, setGone] = React.useState(false);

  function dismiss() {
    /*
     * Focus has to land somewhere the reader recognises. The ribbon sits at the
     * top of `<main>`, so `#content` puts them almost exactly where it was —
     * rather than on <body>, which sends a keyboard user back behind the whole
     * masthead they had already tabbed past.
     */
    const main = document.getElementById("content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    setGone(true);
  }

  const external = ribbon.action.external || ribbon.action.href.startsWith("http");
  const altExternal =
    ribbon.altAction != null &&
    (ribbon.altAction.external || ribbon.altAction.href.startsWith("http"));

  return (
    <>
      {/*
       * Mounted empty from the first render. A live region INSERTED already
       * carrying its text is routinely not announced — assistive technology has
       * to have been watching the node before the words arrived.
       */}
      <p className="sr-only" role="status">
        {gone
          ? `${ribbon.eyebrow}: announcement dismissed. It returns when the page is reloaded.`
          : ""}
      </p>

      {gone ? null : (
        <section className="orger" aria-labelledby={headingId}>
          <div className="sa-container orger__inner">
            <span className="orger__mark" aria-hidden>
              <Icon name="calendar_month" size={20} />
            </span>

            <div className="orger__copy">
              <p id={headingId} className="orger__eyebrow">
                {ribbon.eyebrow}
              </p>
              <p className="orger__text">
                {ribbon.heading}
                {ribbon.until != null && (
                  <>
                    {" "}
                    <b className="orger__until">{ribbon.until}</b>
                  </>
                )}
                .
              </p>
            </div>

            <div className="orger__routes">
              <NextLink
                className="orger__cta"
                href={ribbon.action.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <span>{ribbon.action.label}</span>
                <Icon name={external ? "open_in_new" : "arrow_forward"} size={20} aria-hidden />
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </NextLink>

              {ribbon.altAction != null && (
                <NextLink
                  className="orger__alt"
                  href={ribbon.altAction.href}
                  target={altExternal ? "_blank" : undefined}
                  rel={altExternal ? "noreferrer" : undefined}
                >
                  {ribbon.altAction.label}
                  {altExternal && <span className="sr-only"> (opens in a new tab)</span>}
                </NextLink>
              )}
            </div>

            <button
              type="button"
              className="orger__dismiss"
              onClick={dismiss}
              aria-label={`Dismiss the ${ribbon.eyebrow} announcement`}
            >
              <Icon name="close" size={20} aria-hidden />
            </button>
          </div>
        </section>
      )}
    </>
  );
}
