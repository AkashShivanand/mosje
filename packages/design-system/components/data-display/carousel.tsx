"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./carousel.css";

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
        <div className="ds-carousel__track" ref={trackRef}>
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

      <div className="ds-carousel__controls">
        <button
          type="button"
          className="ds-carousel__arrow"
          aria-label={`Previous slide, ${label}`}
          onClick={() => goTo(index - 1)}
        >
          <span aria-hidden>&#8592;</span>
        </button>

        {showDots ? (
          <div className="ds-carousel__dots">
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
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}

        <button
          type="button"
          className="ds-carousel__arrow"
          aria-label={`Next slide, ${label}`}
          onClick={() => goTo(index + 1)}
        >
          <span aria-hidden>&#8594;</span>
        </button>

        {autoPlay && !reducedMotion ? (
          <button
            type="button"
            className="ds-carousel__play"
            // WCAG 2.2.2: anything that moves for more than five seconds needs
            // a way to stop it, and the control has to say which state pressing
            // it produces rather than which state it is in.
            aria-label={playing ? `Stop rotating ${label}` : `Start rotating ${label}`}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "Pause" : "Play"}
          </button>
        ) : null}
      </div>

      {/* Moving by button changes nothing a screen reader would notice on its
          own, so the new position is announced politely. */}
      <p className="ds-carousel__status" role="status" aria-live="polite">
        {`Slide ${index + 1} of ${count}`}
      </p>
    </section>
  );
}
