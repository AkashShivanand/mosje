"use client";

import * as React from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Icon, Modal, buttonClasses } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import { dismissCampaign } from "@/lib/website/campaign-dismissed";
import { ConfettiMark } from "./ConfettiMark";
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

/** The card's half-turn. Read by the CSS through `--orgab-flip`, so the
 *  duration and the fade that hides the controls during it cannot drift. */
const FLIP_MS = 520;

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
  /*
   * A TURN COUNT, NOT AN INDEX — because the card FLIPS.
   *
   * An index alternating 0,1,0,1 would rotate the card forward and then back,
   * which reads as a card being turned over and turned back rather than as a
   * deck advancing. The count only ever goes up, so every change is another
   * half-turn in the same direction; the panel on show is its parity.
   */
  const [turn, setTurn] = React.useState(0);

  /*
   * THE CONTROLS STAND ASIDE WHILE THE CARD TURNS.
   *
   * The pager is deliberately NOT inside the flipper — a control that
   * somersaults with the thing it controls is decoration pretending to be one.
   * The cost is that for half a second the card is edge-on and much narrower
   * than its footprint, so a pager pinned to that footprint sits on bare green
   * with nothing under it. Measured mid-flip at 1440: the card's right edge
   * pulls in to 742 while the pager stays at 900.
   *
   * So it fades for the length of the turn and comes back. 520ms is the
   * flipper's own duration and the two are set from the same constant.
   */
  const [turning, setTurning] = React.useState(false);
  const [gone, setGone] = React.useState(false);
  const [playing, setPlaying] = React.useState(true);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [zoom, setZoom] = React.useState(false);
  const dotsRef = React.useRef<HTMLDivElement>(null);

  /*
   * THE POP AND THE SPRAY HAPPEN ONCE.
   *
   * A celebration that fires every six seconds forever stops being a
   * celebration and becomes a tic — and it is the loudest movement in a band
   * that sits above the page's own title. So the burst belongs to the FIRST
   * appearance, which is the only one a reader has not seen, and the mark keeps
   * a quiet drift after that.
   *
   * ONE PIECE OF STATE AND NO GUARD. An earlier version carried a `seen` ref
   * alongside it and that ref is what broke the feature — see the effect below.
   */
  const [firstShow, setFirstShow] = React.useState(true);

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
  const i = panels.length ? turn % panels.length : 0;
  const current = panels[i] ?? panels[0];

  /*
   * SIX HOLDS, and each is a different reader saying "not yet". Hover and focus
   * are tracked separately: someone who tabs in and then moves the mouse away
   * must not have it start again. The dialog holds it too — the code on screen
   * belongs to the panel that opened it, and turning away from that panel would
   * leave a code for an announcement the reader can no longer see.
   */
  const running = rotates && playing && !hovered && !focused && !reduced && !gone && !zoom;

  /*
   * THE DRIFT IS NOT THE ROTATION, so it does not answer to the same holds.
   *
   * Hover and focus pause the rotation because a reader is reading and a
   * sentence must not move away mid-read. Neither is a reason to freeze a
   * decorative mark — so the ambient loop answers to the PAUSE button, to
   * `prefers-reduced-motion`, and to nothing else.
   *
   * It runs whether or not the band rotates, which is what makes the pause
   * control necessary even on a band with a single announcement: this loops
   * forever, and §2.2.2 wants a way to stop anything that does.
   */
  const hasDrift = panels.some((o) => o.celebrate) && !reduced && !gone;
  const drifting = hasDrift && playing;

  /*
   * ONE PLACE THE CARD IS TOLD TO TURN, and the fade is set in the same update
   * rather than in an effect watching the turn. Reacting to `turn` in an effect
   * is a cascading render and the React Compiler says so; it is also the wrong
   * shape — the fade is not a consequence of the turn arriving, it is half of
   * what "turn" means here.
   */
  const advance = React.useCallback((delta: number) => {
    if (delta <= 0) return;
    setTurn((t) => t + delta);
    setTurning(true);
  }, []);

  /* Only ever SCHEDULES, so nothing is set synchronously during the effect. */
  React.useEffect(() => {
    if (!turning) return;
    const t = window.setTimeout(() => setTurning(false), FLIP_MS);
    return () => window.clearTimeout(t);
  }, [turning]);

  React.useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => advance(1), DWELL_MS);
    return () => window.clearInterval(t);
  }, [running, advance]);

  /*
   * The observance has now been seen. Flipping this on the FIRST commit rather
   * than on a later one is what keeps the burst to a single appearance: the
   * mark reads `firstShow` while the CSS animation is starting, and every
   * appearance after this render is a quiet one.
   */
  /*
   * ── THE BURST RETIRES ON A TIMER, AND THE GUARD IS WHAT STOPPED IT ────────
   *
   * This ran the timer behind a `seen` ref: set the ref, schedule the flip,
   * clear it on cleanup. Under React's StrictMode the effect mounts, tears down
   * and mounts again — so the first run scheduled the flip, the cleanup cleared
   * it, and the second run hit `if (seen.current) return` and never scheduled
   * another. `firstShow` stayed true for the life of the page, and the pop and
   * the six specks fired on EVERY appearance of the observance: the exact
   * behaviour the one-off burst exists to prevent.
   *
   * Measured on the merged build before this fix — `data-burst` and six spark
   * elements present at t=0.3s, gone at t=6.5s while the volunteer panel was
   * up, and BACK at t=12.5s when the observance returned.
   *
   * No ref now. The effect is idempotent: while `firstShow` is true it schedules
   * the flip, and every re-run reschedules it. A double-invoke costs a second
   * timer and nothing else.
   *
   * It does not test which panel is showing. The observance leads, so it is on
   * screen from the first frame; and the burst is already scoped in the render
   * by `firstShow && n === i`, so a second condition here only added a way for
   * the flip never to happen.
   */
  React.useEffect(() => {
    if (!firstShow) return;
    const t = window.setTimeout(() => setFirstShow(false), 1400);
    return () => window.clearTimeout(t);
  }, [firstShow]);

  function go(next: number) {
    const len = panels.length;
    const n = ((next % len) + len) % len;
    /*
     * Advance to the panel by the FORWARD distance, so a press turns the card
     * the same way the timer does. Pressing the dot that is already showing
     * costs zero turns and the card does not move — it only stops the rotation.
     *
     * With two announcements the arrow keys' "previous" and "next" are the same
     * panel, so nothing is lost by never turning backwards. A third would want
     * a real direction, and this is the line that would have to learn it.
     */
    advance((((n - (turn % len)) % len) + len) % len);
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
              style={
                { "--orgab-turn": turn, "--orgab-flip": `${FLIP_MS}ms` } as React.CSSProperties
              }
              {...(rotates
                ? {
                    "aria-roledescription": "slide",
                    "aria-label": `${i + 1} of ${panels.length}`,
                    "aria-live": running ? "off" : "polite",
                  }
                : {})}
            >
              {/*
                * THE FLIPPER IS THE CARD. Both faces sit in one grid cell of it,
                * so it is still the height of its tallest panel and the band
                * still cannot resize as it turns; what changed is that the card
                * MATERIAL moved onto the faces, because a card that flips has to
                * have a front and a back rather than a background behind two
                * cross-fading panels.
                */}
              <div className="orgab__flipper">
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
                  /* Its own half-turn: face 0 faces out at rest, face 1 is
                     pre-rotated so it faces out when the flipper is at 180. */
                  data-face={n % 2}
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
                        {/*
                         * ON HOVER AND ON FOCUS, not at rest.
                         *
                         * A badge sitting on the code permanently is a second
                         * mark on a 72px tile whose whole job is to be one, and
                         * it covers the corner of a code. The earlier argument
                         * for keeping it visible was touch — an affordance that
                         * only appears on hover does not exist for a reader who
                         * cannot hover — and that argument does not apply HERE:
                         * this tile is not rendered below 768 at all. Where
                         * there is no pointer there is no code either.
                         *
                         * Focus is included with hover for the same reason it
                         * always is: a keyboard reader cannot hover, and this is
                         * a button.
                         */}
                        <span className="orgab__mark-zoom" aria-hidden>
                          <Icon name="zoom_in" size={20} fill weight={400} />
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
                      {o.celebrate ? (
                        <ConfettiMark burst={firstShow && n === i} loop={drifting} />
                      ) : (
                        <Icon name={o.icon} size={40} />
                      )}
                      {/*
                       * EIGHT PIECES, AND ONLY ON THE FIRST APPEARANCE.
                       *
                       * The pop and the spray are what say "this is an
                       * anniversary" to a reader meeting the band for the first
                       * time. Fired every six seconds for as long as the page is
                       * open they would say something else entirely, so they are
                       * spent once and the mark keeps a quiet drift afterwards.
                       *
                       * They are not rendered at all after that, rather than
                       * rendered and hidden: six elements carrying a finished
                       * animation are six things for the compositor to keep
                       * thinking about.
                       */}
                      {o.celebrate && firstShow && n === i
                        ? [0, 1, 2, 3, 4, 5, 6, 7].map((n2) => (
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
              </div>

              {/*
               * PAGINATION ONLY WHERE THERE IS SOMETHING TO PAGE. With one
               * announcement in the record there is no second panel, so a pager
               * would be a control that lies about what it does — and the pause
               * §2.2.2 requires exists because something rotates, which it does
               * not. Its scope is the only thing its position has to explain, so
               * where it does appear it sits on the card it pages and nowhere
               * near the band's own dismiss.
               */}
              {rotates || drifting ? (
                <div
                  className="orgab__pager"
                  data-running={running || undefined}
                  data-turning={turning || undefined}
                >
                  {/* Dots only where there is somewhere to go. On a band with one
                      announcement the pause still appears, because the mark
                      beside it never stops on its own. */}
                  {rotates ? (
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
                  ) : null}

                  {/* WCAG 2.2 §2.2.2: anything auto-updating past five seconds
                      needs a mechanism to stop it. Two things here are over that
                      line — the 6s dwell and the confetti's endless drift — so
                      this one control is what makes the band lawful, and it stops
                      the rotation, the dwell indicator and the drift together.
                      Not rendered under `prefers-reduced-motion`, where nothing
                      moves in the first place.

                      FILLED, and the one glyph in the band that is: a transport
                      control is read as a shape at 16px, and a 300-weight outline
                      of two bars is a shape you have to look at twice. */}
                  {reduced ? null : (
                    <button
                      type="button"
                      className="orgab__play"
                      aria-pressed={!playing}
                      onClick={() => setPlaying((p) => !p)}
                    >
                      <Icon name={playing ? "pause" : "play_arrow"} size={16} fill weight={400} aria-hidden />
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
                {/*
                  * FILLED AND HEAVIER, because it sits beside a 48px Bold
                  * numeral. At weight 300 and 24px in a 48px well it was a
                  * hairline watermark next to five of the boldest glyphs on the
                  * page — present in the markup and absent from the design,
                  * which is what "the call icon is missing" means when the icon
                  * is demonstrably there.
                  */}
                <span className="orgab__helpline-glyph" aria-hidden>
                  <Icon name="call" size={32} fill weight={500} />
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
          size="sm"
          /* Named for assistive technology and hidden from sight: the dialog IS
             a phone, and a phone does not have a page title bar. */
          title={banner.heading}
          hideClose
          className="orgabz"
        >
          <div className="orgabz__frame">
            <span className="orgabz__island" aria-hidden />

            <button
              type="button"
              className="orgabz__close"
              onClick={() => setZoom(false)}
              aria-label="Close"
            >
              <Icon name="close" size={16} weight={500} aria-hidden />
            </button>

            <div className="orgabz__screen">
              <span className="orgabz__code">
                <Image src={banner.qrSrc} alt="" width={686} height={686} />
              </span>

              {/*
               * ONE LINE, AND NO PRINTED ADDRESS.
               *
               * The wide dialog this replaces printed the URL, and the argument
               * for it was real: a reader with no second device cannot scan
               * anything, and a scan-only dialog is a dead end for them. The
               * button below is that reader's route, and it is a better one —
               * they are on a computer, and the address existed to be typed into
               * a device they do not have.
               *
               * It also would not fit. Measured on the 220px screen: 39
               * characters at 12px want 242, so it broke as "nasha-mukti-" /
               * "mitr" — an address split mid-word is worse than no address.
               */}
              <p className="orgabz__lead">Scan to register as a Nasha Mukt Mitr</p>

              <a
                className={buttonClasses("success", "filled", "sm", "orgabz__cta")}
                href={banner.action.href}
                target="_blank"
                rel="noreferrer"
                aria-label={banner.action.label}
              >
                <span>{banner.action.shortLabel ?? banner.action.label}</span>
                <Icon name="open_in_new" size={16} aria-hidden />
                <span className="ds-sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <span className="orgabz__home" aria-hidden />
          </div>
        </Modal>
      ) : null}
    </>
  );
}
