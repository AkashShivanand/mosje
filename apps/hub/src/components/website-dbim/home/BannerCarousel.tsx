"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, Icon, IconButton } from "@mosje/design-system";

import type { DbimImage } from "@/lib/website-dbim/assets";

/** Measured on the reference build, 25 Sep 2026: a slide every 5.0 s. */
const INTERVAL_MS = 5000;

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Does the reader ask for reduced motion?
 *
 * Read as an EXTERNAL STORE, not set into state from an effect. `setState` in an
 * effect body cascades renders (`react-hooks/set-state-in-effect`), and a lazy
 * initial state cannot be used either: the server renders `false`, so a client
 * that resolves `true` would hydrate to different markup. `getServerSnapshot`
 * keeps the first client render matching the server's, and subscribing means the
 * carousel also obeys the setting if it is changed while the page is open.
 */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const mq = window.matchMedia?.(REDUCE);
  mq?.addEventListener("change", onChange);
  return () => mq?.removeEventListener("change", onChange);
};
const readReduce = () => window.matchMedia?.(REDUCE).matches ?? false;
const readReduceOnServer = () => false;

/**
 * The home banner carousel — the reference's fading, full-bleed slides with square arrows,
 * a dot pager and a round pause button. WAI-ARIA carousel pattern: autoplay stops while
 * the pointer or keyboard focus is inside, stops for good on Pause, and never starts for
 * a reader who asked for reduced motion. The slide region is announced only while paused.
 */
export function BannerCarousel({ slides }: { slides: (DbimImage & { href?: string })[] }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  /** `null` follows the reader's own motion preference; a press of Pause/Play overrides it. */
  const [wanted, setWanted] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, readReduce, readReduceOnServer);
  const stopped = wanted === null ? reduce : !wanted;
  const playing = !stopped && !hovered && !focused && n > 1;

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % n), INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [playing, n]);

  const go = (i: number) => setIndex((i + n) % n);

  return (
    <section
      className="db-carousel"
      aria-roledescription="carousel"
      aria-label="Home Page Banners"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="db-carousel__slides" aria-live={playing ? "off" : "polite"}>
        {slides.map((s, i) => {
          const active = i === index;
          const img = (
            <Image
              src={s.src}
              alt={s.alt}
              width={s.width}
              height={s.height}
              sizes="100vw"
              priority={i === 0}
              className="db-carousel__img"
            />
          );
          return (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!active}
              inert={!active}
              className="db-carousel__slide"
              data-active={active || undefined}
            >
              {!s.href ? (
                img
              ) : isExternal(s.href) ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="db-carousel__link">
                  {img}
                  <span className="db-hometop-sr"> (opens in a new tab)</span>
                </a>
              ) : (
                <Link href={s.href} className="db-carousel__link">
                  {img}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <IconButton
        shape="circle"
        appearance="filled"
        className="db-carousel__play"
        aria-label={stopped ? "Play slides" : "Pause slides"}
        icon={<Icon name={stopped ? "play_arrow" : "pause"} size={24} />}
        onClick={() => setWanted(stopped)}
      />
      <IconButton
        appearance="filled"
        className="db-carousel__arrow db-carousel__arrow--prev"
        aria-label="Previous slide"
        icon={<Icon name="chevron_left" size={48} />}
        onClick={() => go(index - 1)}
      />
      <IconButton
        appearance="filled"
        className="db-carousel__arrow db-carousel__arrow--next"
        aria-label="Next slide"
        icon={<Icon name="chevron_right" size={48} />}
        onClick={() => go(index + 1)}
      />
      <div className="db-carousel__dots">
        {slides.map((s, i) => (
          <Button
            key={s.src}
            appearance="text"
            className="db-carousel__dot"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
