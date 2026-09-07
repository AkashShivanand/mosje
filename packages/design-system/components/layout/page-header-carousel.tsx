"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./page-header-carousel.css";

export interface PageHeaderCarouselSlide {
  src: string;
  /**
   * What the photograph shows. NOT optional.
   *
   * The static portrait this replaces is decorative — the header hides it from
   * assistive technology by contract, because it repeats nothing the copy does
   * not already say. A carousel cannot make that claim: it carries several
   * different pictures and a reader moving through them is told which one they
   * are on. So each slide describes itself.
   */
  alt: string;
}

export interface PageHeaderCarouselProps {
  slides: PageHeaderCarouselSlide[];
  /** Names the carousel for assistive technology, e.g. "Abhiyaan photographs". */
  label: string;
  /**
   * Advance every N milliseconds. Omit for a carousel that only moves when the
   * reader moves it.
   *
   * AUTOPLAY STOPS ON INTERACTION AND NEVER STARTS UNDER `prefers-reduced-motion`.
   * WCAG 2.2 §2.2.2 gives a reader the right to pause anything that moves for
   * more than five seconds, and a government page is the last place to argue
   * with that.
   */
  autoPlayMs?: number;
  className?: string;
}

/**
 * The circular photo carousel in a landing page header.
 *
 * WHY IT IS NOT THE STATIC PORTRAIT. The source page cycles four photographs of
 * the campaign in the same circle the estate draws one picture in. Cloning that
 * as a single still lost three of the four, and made the page look like it had
 * less behind it than the campaign does.
 *
 * ONE SLIDE IS IN THE DOM AT A TIME, deliberately. A track of four absolutely
 * positioned images inside a circle means three pictures a screen reader walks
 * through and a sighted reader cannot see. The live region announces the change
 * instead.
 */
export function PageHeaderCarousel({
  slides,
  label,
  autoPlayMs,
  className,
}: PageHeaderCarouselProps): React.JSX.Element | null {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = slides.length;

  const go = React.useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (autoPlayMs == null || paused || count < 2) return;
    // Asked at effect time rather than at render, so a reader who changes the
    // system setting with the page open gets the new answer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), autoPlayMs);
    return () => window.clearInterval(t);
  }, [autoPlayMs, paused, count]);

  if (count === 0) return null;

  const stop = () => setPaused(true);

  return (
    <div
      className={cn("sa-hdrcar", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={stop}
      onFocusCapture={stop}
    >
      <div className="sa-hdrcar__frame">
        {/*
          `key` on the image so React replaces the element rather than mutating
          `src` — without it the browser paints the old picture until the new one
          decodes, which reads as the carousel lagging a beat behind its own dots.
        */}
        <img
          key={slides[index]!.src}
          className="sa-hdrcar__img"
          src={slides[index]!.src}
          alt={slides[index]!.alt}
          draggable={false}
        />
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="sa-hdrcar__nav sa-hdrcar__nav--prev"
            onClick={() => go(index - 1)}
          >
            <Icon name="chevron_left" size={24} aria-hidden />
            <span className="sr-only">Previous photograph</span>
          </button>
          <button
            type="button"
            className="sa-hdrcar__nav sa-hdrcar__nav--next"
            onClick={() => go(index + 1)}
          >
            <Icon name="chevron_right" size={24} aria-hidden />
            <span className="sr-only">Next photograph</span>
          </button>

          {/* Tabs, not a decorative row of dots: each one goes to a known slide,
              so each one says which. */}
          <div className="sa-hdrcar__dots" role="tablist" aria-label={`${label} — choose a photograph`}>
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Photograph ${i + 1} of ${count}`}
                className={cn("sa-hdrcar__dot", i === index && "sa-hdrcar__dot--on")}
                onClick={() => go(i)}
              />
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            {`Photograph ${index + 1} of ${count}: ${slides[index]!.alt}`}
          </p>
        </>
      )}
    </div>
  );
}
