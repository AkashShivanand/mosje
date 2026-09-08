"use client";

import * as React from "react";
import { Icon } from "../utilities/icon";
import { cn } from "../../utils/cn";
import "./carousel.css";

/**
 * Above this many slides the dot row stops being a position indicator and
 * becomes a wall. Six is the largest count that still reads as a countable set
 * at a glance — past it a reader stops counting and starts estimating, which is
 * the moment the row is doing no work a number would not do better.
 *
 * The reason is legibility, not width. An earlier version of this comment
 * argued from arithmetic — seven 44px dots plus two arrows asking for 460px on
 * a 375px phone — and that arithmetic stopped being true when the row was
 * tightened to a 24px pitch. At 24 the cluster only outgrows a narrow phone
 * somewhere past eleven slides, well above where it stops being readable.
 */
const MAX_DOTS = 6;

export interface CarouselProps {
  /**
   * The slides. Each child becomes one slide and is labelled "N of M" for
   * assistive technology, so pass the content only — no wrapper of your own.
   */
  children: React.ReactNode;
  /**
   * Names the carousel — "Departmental announcements". Required: a carousel
   * announced only as "carousel" tells a screen-reader user nothing about what
   * is rotating past them.
   */
  label: string;
  /**
   * Rotate on a timer. **Off by default, and it should usually stay off.**
   * WCAG 2.2.2 requires anything moving for more than five seconds to be
   * pausable, which the pause button provides — but the deeper problem is that
   * a citizen reading slide two does not get to finish it. Turn it on only for
   * decorative content nobody has to read.
   * @default false
   */
  autoPlay?: boolean;
  /** Seconds between slides when `autoPlay` is on. @default 7 */
  interval?: number;
  /** Show the dot indicators under the track. @default true */
  showDots?: boolean;
  className?: string;
}

/**
 * MoSJE / SAMAVESH Carousel.
 *
 * A band of slides the reader moves through — announcements, schemes on the
 * home page, a set of photographs.
 *
 * **Auto-rotation is off by default and the default should be respected.** A
 * carousel that moves on its own takes the sentence a citizen is reading away
 * mid-sentence, and it does that most to the slowest readers. WCAG 2.2.2 is met
 * here — the pause control appears whenever `autoPlay` is on, rotation stops on
 * hover and on focus, and `prefers-reduced-motion` disables it outright — but
 * meeting the criterion is not the same as the thing being a good idea.
 *
 * **Everything essential must also exist outside the carousel.** Slides two
 * onwards are, in practice, unread: they are behind an interaction most people
 * never perform. Put the important announcement on the page.
 *
 * The structure follows the WAI-ARIA carousel pattern: the region carries
 * `aria-roledescription="carousel"` and its name, each slide is a `group` with
 * `aria-roledescription="slide"` and an "N of M" label, and the previous/next
 * controls are ordinary buttons. Moving by button announces the new slide
 * through a polite live region, because the visual change alone tells a
 * screen-reader user nothing.
 */
export function Carousel({
  children,
  label,
  autoPlay = false,
  interval = 7,
  showDots = true,
  className,
}: CarouselProps): React.JSX.Element {
  const slides = React.Children.toArray(children).filter(Boolean);
  const count = slides.length;

  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoPlay);
  const [held, setHeld] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dotsRef = React.useRef<HTMLDivElement>(null);
  const baseId = React.useId();

  /**
   * Reduced motion disables auto-rotation outright rather than merely making
   * the transition instant. The request is "do not move things at me", and a
   * carousel that keeps advancing without animation is still moving things.
   */
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReducedMotion(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  const goTo = React.useCallback(
    (next: number) => {
      if (count === 0) return;
      const wrapped = (next + count) % count;
      setIndex(wrapped);
      const track = trackRef.current;
      const slide = track?.children[wrapped] as HTMLElement | undefined;
      if (track && slide) {
        track.scrollTo({
          left: slide.offsetLeft - track.offsetLeft,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    },
    [count, reducedMotion],
  );

  // Auto-rotation, suspended while the reader is hovering or focused inside —
  // both are signals that they are reading THIS slide.
  React.useEffect(() => {
    if (!playing || held || reducedMotion || count < 2) return;
    const t = setInterval(() => goTo(index + 1), Math.max(2, interval) * 1000);
    return () => clearInterval(t);
  }, [playing, held, reducedMotion, count, index, interval, goTo]);

  // Keep `index` honest when the reader swipes the track directly.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        const mid = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        children.forEach((child, i) => {
          const centre = child.offsetLeft - track.offsetLeft + child.clientWidth / 2;
          const distance = Math.abs(centre - mid);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        });
        setIndex(nearest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (count === 0) {
    return <div className={cn("ds-carousel", className)} />;
  }

  return (
    <section
      className={cn("ds-carousel", className)}
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div className="ds-carousel__viewport">
        {/*
          * FOCUSABLE, BECAUSE IT SCROLLS.
          *
          * The track is `overflow-x: auto`, and a scrollable region that cannot
          * be focused cannot be scrolled by anyone using a keyboard — WCAG
          * 2.1.1, and axe reports it as `scrollable-region-focusable`. The
          * arrows and dots move between slides, but they are not the same thing
          * as scrolling the region itself, and a slide taller or wider than the
          * viewport is reachable only this way.
          *
          * It takes a name of its own so the new tab stop announces what it is
          * rather than landing the reader on an unlabelled box.
          */}
        <div
          className="ds-carousel__track"
          ref={trackRef}
          /*
           * TWO LINTERS DISAGREE HERE, AND axe IS THE ONE TO FOLLOW.
           *
           * `jsx-a11y/no-noninteractive-tabindex` objects to a tab stop on a
           * non-interactive element, and is right in general. It is wrong for a
           * SCROLLABLE one: axe's `scrollable-region-focusable` reports the
           * same element as a WCAG 2.1.1 failure without the tab stop, because
           * a region that scrolls and cannot be focused cannot be scrolled by
           * anyone using a keyboard. The rule has no option that recognises a
           * scroll container, so the exception is stated here rather than
           * configured away for the whole package.
           */
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable (WCAG 2.1.1); see above
          tabIndex={0}
          role="group"
          aria-label={`${label} — slides`}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              id={`${baseId}-slide-${i}`}
              className="ds-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/*
        THREE ZONES, AND THE MIDDLE ONE IS THE ONLY ONE THAT IS CENTRED.

        The whole row used to be one centred flex line, so the moment the pause
        control joined it the dots slid 37px off the middle of the slide they
        report on — measured on this component's own documentation page, where
        the plain carousel's dots sat at 664 and the auto-rotating one's at 627
        over an identical 664 slide centre. The position indicator has to stay
        under the middle of the thing whose position it indicates, whatever else
        is on the row. `1fr auto 1fr` guarantees it: the step controls and dots
        own the centre column, and anything else lives in a side column that
        cannot push them.
      */}
      <div className="ds-carousel__controls">
        <div className="ds-carousel__controls-lead">
          {autoPlay && !reducedMotion ? (
            <button
              type="button"
              className="ds-carousel__play"
              // WCAG 2.2.2: anything that moves for more than five seconds needs
              // a way to stop it, and the control has to say which state pressing
              // it produces rather than which state it is in.
              //
              // THE WORD, NOT THE GLYPH — and this was briefly the other way
              // round. It was iconified because "Pause" and "Play" are 66px and
              // 55px wide, so the control changed size under the reader's own
              // finger and shifted its neighbours with it. The three-zone row
              // above has since removed that problem entirely: this control sits
              // in a side zone that fills, so its width cannot move the dots.
              //
              // With the only argument for a glyph gone, the argument against it
              // stands: a reader who has paused a carousel must be able to SEE
              // that it is paused, and a play/pause glyph is ambiguous about
              // which of the two states it is reporting. The Figma master and
              // the documentation page both say so.
              //
              // THE VISIBLE WORD IS THE START OF THE ACCESSIBLE NAME, not a
              // separate one. WCAG 2.5.3 (Label in Name, Level A): the name has
              // to CONTAIN the text a reader can see, so an `aria-label` of
              // "Stop rotating …" over a button reading "Pause" fails it — and
              // a speech-input user saying "click Pause" reaches nothing. The
              // fuller sentence is still spoken; it is appended out of sight
              // instead of replacing what is on screen.
              aria-pressed={!playing}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
              <span className="ds-carousel__sr">{` rotating ${label}`}</span>
            </button>
          ) : null}
        </div>

        <div className="ds-carousel__controls-main">
          <button
            type="button"
            className="ds-carousel__arrow"
            aria-label={`Previous slide, ${label}`}
            onClick={() => goTo(index - 1)}
          >
            <Icon name="chevron_left" size={20} />
          </button>

          {showDots && count <= MAX_DOTS ? (
            /*
             * ONE TAB STOP FOR THE WHOLE ROW — a roving tabindex, not six stops.
             *
             * Every dot used to be tabbable, so a four-slide carousel cost SEVEN
             * stops: the track, two arrows and four dots. Measured on the NMBA
             * organisation page, that was seven stops spent on a decorative
             * photograph before a keyboard user reached a word of the page.
             *
             * Roving is the documented answer and it takes nothing away: the
             * current dot is the only one in the tab order, and Left/Right/Home/
             * End move between them — so every slide is still reachable directly,
             * which is what 2.1.1 asks (a mouse user can click dot 3, therefore
             * a keyboard user must be able to get to dot 3). Removing the dots
             * from the tab order altogether would have been the cheap fix and it
             * would have failed that test.
             *
             * `group` with a name, not `tablist`: these are buttons that move a
             * scroll position, not tabs over panels that stay put — the same
             * reasoning the `aria-current` note below already carried.
             */
            <div className="ds-carousel__dots" role="group" aria-label={`${label} — slides`} ref={dotsRef}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={cn(
                    "ds-carousel__dot",
                    i === index && "ds-carousel__dot--current",
                  )}
                  // The dot is not a tab: it does not control a panel that stays
                  // put, so `aria-current` says "this is where you are" without
                  // claiming a tablist the rest of the markup does not support.
                  aria-current={i === index || undefined}
                  aria-label={`Slide ${i + 1} of ${count}`}
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => goTo(i)}
                  /*
                   * ON THE BUTTON, NOT ON THE GROUP. The first version put one
                   * handler on the wrapping `<div role="group">` and read the
                   * carousel's `index`; `jsx-a11y/no-noninteractive-element-
                   * interactions` refused it, and it was right — a keydown
                   * belongs on the thing that took the focus. Reading the
                   * button's own `i` is also more honest than reading `index`,
                   * which only happened to agree because focus follows selection.
                   */
                  onKeyDown={(e) => {
                    const next =
                      e.key === "ArrowRight" ? i + 1
                      : e.key === "ArrowLeft" ? i - 1
                      : e.key === "Home" ? 0
                      : e.key === "End" ? count - 1
                      : null;
                    if (next === null) return;
                    e.preventDefault();
                    const wrapped = (next + count) % count;
                    goTo(wrapped);
                    /*
                     * Focus follows the selection, or the reader is left on a
                     * dot that is no longer current and the next arrow press
                     * moves from the wrong place. Queued, because the button
                     * being focused is about to re-render with its new
                     * `tabIndex`.
                     */
                    requestAnimationFrame(() =>
                      dotsRef.current?.querySelectorAll("button")[wrapped]?.focus(),
                    );
                  }}
                />
              ))}
            </div>
          ) : showDots ? (
            /*
             * PAST SIX SLIDES THE POSITION IS SHOWN, NOT DRAWN.
             *
             * The dots are the reason `ds-carousel__status` is visually hidden —
             * "the position is announced, not shown, because the dots already
             * show it". Once the dots are gone that reasoning goes with them,
             * so the counter takes their place on screen. It is not a second
             * copy of anything; it is the only copy.
             *
             * It carries no jump-to-slide affordance because there is nothing
             * honest to offer: a set this long has no way to reach slide 9
             * directly that is better than pressing Next.
             */
            <p className="ds-carousel__counter">
              <span aria-hidden="true">{`${index + 1} / ${count}`}</span>
              <span className="ds-carousel__sr">{`Slide ${index + 1} of ${count}`}</span>
            </p>
          ) : null}

          <button
            type="button"
            className="ds-carousel__arrow"
            aria-label={`Next slide, ${label}`}
            onClick={() => goTo(index + 1)}
          >
            <Icon name="chevron_right" size={20} />
          </button>
        </div>

        {/* Balances the lead zone so the centre column really is centred. */}
        <div className="ds-carousel__controls-trail" aria-hidden="true" />
      </div>

      {/* Moving by button changes nothing a screen reader would notice on its
          own, so the new position is announced politely. */}
      <p className="ds-carousel__status" role="status" aria-live="polite">
        {`Slide ${index + 1} of ${count}`}
      </p>
    </section>
  );
}
