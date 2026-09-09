"use client";

import * as React from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Icon, Modal, buttonClasses } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import { dismissCampaign } from "@/lib/website/campaign-dismissed";
import "./organisation-announcement-band.css";

/**
 * THE ANNOUNCEMENT BAND — one green field, two cards of different material.
 *
 * Replaces `OrganisationJoinBanner` and `OrganisationEventRibbon`, which were
 * two stacked bands costing 154px of a 760px fold before the page had said what
 * it was. Chosen from `nmba/top-bands` in the explorations register on 9
 * September 2026; the five options that were weighed, and what each of them
 * cost, are recorded there.
 *
 * DS Audit: Icon ✅ existing · Modal ✅ existing · buttonClasses ✅ existing ·
 * the band itself ➕ built here, because its shape is the organisation record's
 * (`joinBanner` + `eventRibbon`) rather than anything the design system knows
 * about. Nothing in it is hand-rolled that the DS already publishes.
 *
 * ── THE ARGUMENT IT MAKES, AND HOW ──────────────────────────────────────────
 *
 * By WEIGHT, not by position. The campaign reads first because it is on the
 * leading edge and it is what the band is for; the helpline is found from
 * anywhere on the row because it is the brightest and largest object in it —
 * display-scale figures on the only solid white surface, against a 20px
 * heading. On a page about drug de-addiction the most consequential object in
 * the fold is not the volunteer drive, and size is the only argument a 150px
 * band can make.
 *
 * The two announcements are told apart two ways, both large: the LEADING
 * SQUARE — a saffron glyph tile on the observance, a white code tile on the
 * volunteer drive, different colour AND different kind of object — and the glass
 * card's LIT TOP EDGE, which carries the panel's accent across its full width as
 * it turns. An eyebrow and a 40px chip were the earlier answer; neither is a
 * difference a reader notices without looking for it.
 *
 * ── WHAT THE DISMISS TAKES, AND WHAT SURVIVES IT ────────────────────────────
 *
 * The × removes the whole band. That is safe because dismissal is ANNOUNCED to
 * `campaign-dismissed`, which puts the number back beside the organisation's
 * mark as `OrganisationHelplineBadge` — so refusing a recruitment drive does not
 * remove a national de-addiction helpline from the top of a page about drug
 * de-addiction.
 *
 * In memory only — not localStorage, not sessionStorage — so the band returns on
 * reload. A campaign the department is running is not something a reader
 * switches off for good by clicking one ×; it is something they push out of the
 * way to read the page underneath.
 *
 * ── EVERY STATE THIS BAND CAN BE IN ─────────────────────────────────────────
 *
 * The record decides how many announcements there are, so all four arrangements
 * are designed rather than assumed (`data-state-completeness.md`):
 *
 *   BOTH        two panels, a pager, a 6s rotation and the pause §2.2.2 requires
 *   BANNER ONLY one panel, NO pager and no rotation — there is nothing to page,
 *               and a carousel of one is a control that lies about what it does
 *   RIBBON ONLY one panel and no helpline card; the offer takes the full width
 *   NEITHER     the route does not render this component at all
 */

type Banner = NonNullable<OrganisationDetail["joinBanner"]>;
type Ribbon = NonNullable<OrganisationDetail["eventRibbon"]>;

interface Panel {
  id: string;
  accent: "saffron" | "leaf";
  icon: string;
  /** The pager's accessible name for this panel — never shown. */
  name: string;
  heading: string;
  body: React.ReactNode;
  /** A burst of confetti on arrival. The observance only. */
  celebrate: boolean;
  alt: { note?: string; label: string; href: string } | null;
  action: { label: string; full?: string; href: string; icon: string; external: boolean };
  qr: string | null;
}

const DWELL_MS = 6000;

function isExternal(href: string, flag?: boolean) {
  return flag === true || /^https?:\/\//.test(href);
}

export function OrganisationAnnouncementBand({
  banner,
  ribbon,
}: {
  banner?: Banner;
  ribbon?: Ribbon;
}): React.JSX.Element | null {
  const [i, setI] = React.useState(0);
  const [gone, setGone] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [zoom, setZoom] = React.useState(false);
  const dotsRef = React.useRef<HTMLDivElement>(null);

  const [reduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  /*
   * THE TEMPORARY ONE LEADS.
   *
   * The observance runs for weeks and the volunteer drive is permanent, so the
   * announcement a reader can still miss is the one they meet first. The
   * permanent one loses nothing by following: it is still here tomorrow.
   */
  const panels = React.useMemo<Panel[]>(() => {
    const out: Panel[] = [];
    if (ribbon) {
      out.push({
        id: "occasion",
        accent: "saffron",
        icon: "celebration",
        name: ribbon.eyebrow,
        heading: ribbon.eyebrow,
        celebrate: true,
        /* The closing date is the one word a reader scans for, so it carries
           weight rather than colour — a date told apart only by hue is invisible
           to a reader who cannot see the hue (§1.4.1). Absent from the record
           until the Department states one, and nothing is invented in its place. */
        body: ribbon.until ? (
          <>
            {ribbon.heading} until <strong className="orgab__until">{ribbon.until}</strong>.
          </>
        ) : (
          `${ribbon.heading}.`
        ),
        alt: ribbon.altAction ?? null,
        action: {
          label: ribbon.action.shortLabel ?? ribbon.action.label,
          full: ribbon.action.shortLabel ? ribbon.action.label : undefined,
          href: ribbon.action.href,
          icon: isExternal(ribbon.action.href, ribbon.action.external)
            ? "open_in_new"
            : "arrow_forward",
          external: isExternal(ribbon.action.href, ribbon.action.external),
        },
        qr: null,
      });
    }
    if (banner) {
      out.push({
        id: "campaign",
        accent: "leaf",
        icon: "volunteer_activism",
        name: banner.heading,
        heading: banner.heading,
        celebrate: false,
        body: banner.text,
        alt: null,
        action: {
          label: banner.action.shortLabel ?? banner.action.label,
          full: banner.action.shortLabel ? banner.action.label : undefined,
          href: banner.action.href,
          icon: isExternal(banner.action.href, banner.action.external)
            ? "open_in_new"
            : "arrow_forward",
          external: isExternal(banner.action.href, banner.action.external),
        },
        qr: banner.qrSrc ?? null,
      });
    }
    return out;
  }, [banner, ribbon]);

  const rotates = panels.length > 1;
  const current = panels[i] ?? panels[0];

  /*
   * SIX HOLDS, and each is a different reader saying "not yet". Hover and focus
   * are tracked separately: someone who tabs in and then moves the mouse away
   * must not have it start again. The dialog holds it too — the code on screen
   * belongs to the panel that opened it, and turning away from that panel would
   * leave a code for an announcement the reader can no longer see.
   */
  const running = rotates && playing && !hovered && !focused && !reduced && !gone && !zoom;

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % panels.length), DWELL_MS);
    return () => window.clearInterval(t);
  }, [running, panels.length]);

  function go(next: number) {
    const n = (next + panels.length) % panels.length;
    setI(n);
    /* Pressing a dot stops the rotation for good: a reader who chose a panel has
       said which one they want. */
    setPlaying(false);
    dotsRef.current?.querySelector<HTMLButtonElement>(`[data-i="${n}"]`)?.focus();
  }

  function dismiss() {
    /* Announced, so the number reappears beside the organisation's mark. */
    dismissCampaign();

    /*
     * FOCUS HAS TO GO SOMEWHERE. The button the reader just pressed is about to
     * leave the DOM, and a browser answers that by dropping focus on <body> —
     * which sends a keyboard user back to the top of the document, behind the
     * whole masthead they had already tabbed past. `#content` is this site's
     * <main> and the band sits at the top of it, so this lands almost exactly
     * where the band was.
     *
     * The tabindex is set here rather than in the markup, because a permanent
     * `tabindex="-1"` on <main> is a change to a shared layout for one
     * component's benefit.
     */
    const main = document.getElementById("content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
    setGone(true);
  }

  if (panels.length === 0 || !current) return null;

  return (
    <>
      {/*
       * THE LIVE REGION IS MOUNTED FROM THE FIRST RENDER, EMPTY.
       *
       * The band going away is announced, because focus moving on its own is not
       * an explanation of what happened. A region that is INSERTED carrying its
       * text is routinely not announced at all — assistive technology has to have
       * been observing the node before the text arrived — so the paragraph always
       * exists and only its contents change.
       */}
      <p className="ds-sr-only" role="status">
        {gone
          ? banner?.helplineNumber
            ? `Announcements dismissed. The ${banner.helplineLabel}, ${banner.helplineNumber}, is now shown beside the page heading. They return when the page is reloaded.`
            : "Announcements dismissed. They return when the page is reloaded."
          : ""}
      </p>

      {gone ? null : (
        <section
          className="orgab"
          {...(rotates
            ? { role: "region", "aria-roledescription": "carousel", "aria-label": "Announcements" }
            : { "aria-label": "Announcement" })}
          style={{ "--orgab-dwell": `${DWELL_MS}ms` } as React.CSSProperties}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
          }}
        >
          <div className="sa-container orgab__inner" data-solo={banner ? undefined : ""}>
            {/* ── The announcement, on the leading edge ──────────────────── */}
            <div
              className="orgab__stage"
              data-accent={current.accent}
              {...(rotates
                ? {
                    "aria-roledescription": "slide",
                    "aria-label": `${i + 1} of ${panels.length}`,
                    "aria-live": running ? "off" : "polite",
                  }
                : {})}
            >
              {panels.map((o, n) => (
                /*
                 * BOTH PANELS SHARE ONE GRID CELL and the inactive one keeps its
                 * space with `visibility: hidden`. That is what makes the stage
                 * the height of its tallest panel without measuring anything, and
                 * what stops the band resizing as it turns.
                 */
                <div
                  key={o.id}
                  className="orgab__offer"
                  data-accent={o.accent}
                  data-active={n === i || undefined}
                  {...(n === i ? {} : { inert: true })}
                >
                  {o.qr ? (
                    <>
                      {/*
                       * A BUTTON, BECAUSE 70px IS TOO SMALL TO SCAN AND ALWAYS
                       * WAS. A camera needs the code to fill a useful part of the
                       * frame; at 70px on a 1440 page a reader has to walk up to
                       * their own monitor. The tile is the way to a legible one,
                       * and it carries its badge AT REST — an affordance that only
                       * appears on hover does not exist for a reader on a touch
                       * screen, which is most of them.
                       *
                       * The image stays `alt=""`: the button is already named, and
                       * announcing the picture as well says the same thing twice.
                       */}
                      <button
                        type="button"
                        className="orgab__mark orgab__mark--code"
                        onClick={() => setZoom(true)}
                        aria-label="Show the registration code at a size a camera can read"
                      >
                        <Image src={o.qr} alt="" width={128} height={128} />
                        <span className="orgab__mark-badge" aria-hidden>
                          <Icon name="zoom_in" size={16} />
                        </span>
                      </button>
                      {/*
                       * THE CODE ONLY EXISTS WHERE IT CAN BE SCANNED. A code is
                       * read by a SECOND device, so on a phone — the device
                       * already holding the page, at 40px — it is not a code, it
                       * is a grey square. Below 768 this panel shows its glyph,
                       * which is what the other panel shows at every width.
                       *
                       * Both are rendered and one is hidden in CSS rather than
                       * switched in JS: a media query cannot be read on the
                       * server, and a layout that only settles after hydration is
                       * a layout that shifts.
                       */}
                      <span className="orgab__mark orgab__mark--glyph orgab__mark--phone" aria-hidden>
                        <Icon name={o.icon} size={40} />
                      </span>
                    </>
                  ) : (
                    <span
                      className={`orgab__mark orgab__mark--glyph${o.celebrate ? " orgab__mark--celebrate" : ""}`}
                      aria-hidden
                    >
                      <Icon name={o.icon} size={40} />
                      {/*
                       * SIX SPECKS, ONE BURST PER APPEARANCE. A glyph of confetti
                       * is a picture of a celebration; a glyph that goes off is
                       * one. It fires when the panel becomes the active one — the
                       * CSS animation starts when `[data-active]` begins to match.
                       *
                       * It runs 1s and stops, which is why it needs no control of
                       * its own under §2.2.2, and it can only recur when the band
                       * rotates — so the pause that stops the rotation stops this
                       * too. Nothing moves under `prefers-reduced-motion`.
                       */}
                      {o.celebrate
                        ? [0, 1, 2, 3, 4, 5].map((n2) => (
                            <span key={n2} className="orgab__spark" data-n={n2} />
                          ))
                        : null}
                    </span>
                  )}

                  <div className="orgab__copy">
                    {/*
                     * A `<p>`, NOT AN `<h2>` — and the region is still named by
                     * the section's own label. This band renders ABOVE the page's
                     * `<h1>`, so as a heading it opened the document outline at
                     * level 2 and then went UP to level 1: a screen-reader user
                     * listing headings met the announcement before the page had
                     * told them which page they were on.
                     */}
                    <p className="orgab__heading">{o.heading}</p>
                    <p className="orgab__body">
                      {o.body}
                      {/*
                       * The second route is a CONDITION on the announcement, so it
                       * lives in the prose rather than beside the button — a
                       * reader without a departmental account needs the sentence
                       * to know the link is theirs.
                       */}
                      {o.alt ? (
                        <>
                          {" "}
                          {o.alt.note ? (
                            <span className="orgab__alt-note">{o.alt.note}</span>
                          ) : null}{" "}
                          <NextLink className="orgab__alt" href={o.alt.href}>
                            {o.alt.label}
                          </NextLink>
                        </>
                      ) : null}
                    </p>
                  </div>

                  {o.action.external ? (
                    <a
                      className={buttonClasses("success", "outlined", "md", "orgab__cta", "inverse")}
                      href={o.action.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={o.action.full}
                    >
                      <span>{o.action.label}</span>
                      <Icon name={o.action.icon} size={20} aria-hidden />
                      <span className="ds-sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    /* `NextLink`, so an internal route is a client navigation
                       rather than a full document load. */
                    <NextLink
                      className={buttonClasses("success", "outlined", "md", "orgab__cta", "inverse")}
                      href={o.action.href}
                      aria-label={o.action.full}
                    >
                      <span>{o.action.label}</span>
                      <Icon name={o.action.icon} size={20} aria-hidden />
                    </NextLink>
                  )}
                </div>
              ))}

              {/*
               * PAGINATION ONLY WHERE THERE IS SOMETHING TO PAGE. With one
               * announcement in the record there is no second panel, so a pager
               * would be a control that lies about what it does — and the pause
               * §2.2.2 requires exists because something rotates, which it does
               * not. Its scope is the only thing its position has to explain, so
               * where it does appear it sits on the card it pages and nowhere
               * near the band's own dismiss.
               */}
              {rotates ? (
                <div className="orgab__pager" data-running={running || undefined}>
                  <div
                    className="orgab__dots"
                    role="tablist"
                    aria-label="Announcements"
                    ref={dotsRef}
                  >
                    {panels.map((o, n) => (
                      <button
                        key={o.id}
                        type="button"
                        role="tab"
                        data-i={n}
                        aria-selected={n === i}
                        tabIndex={n === i ? 0 : -1}
                        className="orgab__dot"
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
                      the dwell indicator and the confetti with it. Not rendered
                      under `prefers-reduced-motion`, where nothing rotates. */}
                  {reduced ? null : (
                    <button
                      type="button"
                      className="orgab__play"
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
              ) : null}
            </div>

            {/* ── The standing service ─────────────────────────────────────
                The only solid white surface on the page's green, carrying the
                only display-scale figure in the fold. Only where the record
                publishes a helpline; an organisation without one gets no empty
                card. */}
            {banner?.helplineNumber ? (
              <a
                className="orgab__helpline"
                href={`tel:${banner.helplineNumber}`}
                aria-label={`${banner.helplineLabel} ${banner.helplineNumber}`}
              >
                <span className="orgab__helpline-glyph" aria-hidden>
                  <Icon name="call" size={24} />
                </span>
                <span className="orgab__helpline-text">
                  <span className="orgab__helpline-label">
                    {banner.helplineShortLabel ?? banner.helplineLabel}
                  </span>
                  <span className="orgab__helpline-number">{banner.helplineNumber}</span>
                </span>
              </a>
            ) : null}

            {/* The dismiss is the BAND'S, so it sits on the band's own ground —
                outside both cards, sharing their top edge. Inside the glass card
                it would say it dismisses the announcement rather than the band. */}
            <button
              type="button"
              className="orgab__dismiss"
              onClick={dismiss}
              aria-label={rotates ? "Dismiss the announcements" : "Dismiss the announcement"}
            >
              <Icon name="close" size={20} aria-hidden />
            </button>
          </div>
        </section>
      )}

      {/*
       * ── THE CODE, AT A SIZE A CAMERA CAN READ ─────────────────────────────
       *
       * OUTSIDE the section, deliberately. The band carries `z-index` on the
       * raised rung, which makes it a stacking context; a dialog rendered inside
       * it can never rise above anything painted later in the document however
       * high its own z-index goes. The DS `Modal` does not portal, so the only
       * way it clears the hero beneath is to be a sibling of the band.
       *
       * It is the DS `Modal` and not a hand-rolled one, which is where the focus
       * trap, Escape, the backdrop and focus restoration to the tile come from.
       *
       * WHAT IS IN IT IS THE INSTRUCTION, NOT A BIGGER PICTURE. A code shown
       * inside a phone's own viewfinder says "point a camera at this" without a
       * caption having to; the sentence beside it says which form opens, and the
       * address is printed in full for a reader who cannot use a camera at all.
       * That last one is why this is not a lightbox — a scan-only dialog is a
       * dead end for anybody without a second device.
       */}
      {banner?.qrSrc ? (
        <Modal
          open={zoom}
          onClose={() => setZoom(false)}
          size="lg"
          title={banner.heading}
          className="orgbz"
        >
          <div className="orgbz__grid">
            <div className="orgbz__phone" aria-hidden>
              <span className="orgbz__speaker" />
              <span className="orgbz__screen">
                <span className="orgbz__view">
                  <Image
                    className="orgbz__code"
                    src={banner.qrSrc}
                    alt=""
                    width={686}
                    height={686}
                  />
                </span>
              </span>
            </div>

            <div className="orgbz__copy">
              <p className="orgbz__lead">
                Point a phone camera at this code. It opens the same form as the button below.
              </p>
              <p className="orgbz__or">Or open it directly at</p>
              <p className="orgbz__url">{banner.action.href.replace(/^https?:\/\//, "")}</p>
              <a
                className={buttonClasses("success", "filled", "md", "orgbz__cta")}
                href={banner.action.href}
                target="_blank"
                rel="noreferrer"
                aria-label={banner.action.label}
              >
                <span>{banner.action.shortLabel ?? banner.action.label}</span>
                <Icon name="open_in_new" size={20} aria-hidden />
                <span className="ds-sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
