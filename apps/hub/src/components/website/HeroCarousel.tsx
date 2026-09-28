"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon, IconButton } from "@mosje/design-system";
import { HOME_CAROUSEL_SNAPSHOT, type HomeBanner } from "@/lib/website-shared/home";
import { CarouselIndicators } from "./CarouselIndicators";

/**
 * The classic design's home carousel. Its slides are shared with every design
 * (lib/website-shared/home.ts): the CCPS banner first, then the live site's own.
 * The page passes them in from `getHomeBanners()`, so a configured CCPS feed
 * leads here as it does in the others. Until 28 Sep 2026 this held four slides of its own, the first a Mann Ki
 * Baat panel dated 26 Oct 2025.
 */
export function HeroCarousel({ slides = HOME_CAROUSEL_SNAPSHOT }: { slides?: readonly HomeBanner[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (!isPlaying || count < 2) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, isPlaying]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 border-b border-gray-200" aria-roledescription="carousel" aria-label="Highlights">
      {/* The banners are 3:1, so the frame is too — nothing is cropped at any width. */}
      <div className="relative aspect-[3/1] w-full">
        {slides.map((s, i) => {
          const img = (
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              unoptimized={/^https?:\/\//.test(s.src)}
              className="object-cover"
            />
          );
          return (
            <div
              key={s.src}
              className={`absolute inset-0 transition-opacity duration-700 ${index === i ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={index !== i}
              inert={index !== i}
            >
              {s.href ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                  {img}
                  <span className="sr-only"> (opens in a new window)</span>
                </a>
              ) : (
                img
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <IconButton
        icon={<Icon name="keyboard_arrow_left" size={24} />}
        aria-label="Previous slide"
        variant="neutral"
        shape="circle"
        size="md"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 sm:inline-flex bg-white/80 text-ink shadow-md hover:bg-white"
      />
      <IconButton
        icon={<Icon name="keyboard_arrow_right" size={24} />}
        aria-label="Next slide"
        variant="neutral"
        shape="circle"
        size="md"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 sm:inline-flex bg-white/80 text-ink shadow-md hover:bg-white"
      />

      {/* Play/Pause & Dots Indicator */}
      {/* Bottom-right, not centred: the CCPS banner prints its own text along the
          bottom of its left half, and a centred pill sat on top of it. On a phone
          the 3:1 banner is 125px tall, so the pill sits under it instead and the
          side arrows give way to it — the dots already move between slides. */}
      <div className="relative z-20 mx-auto my-2 flex w-fit items-center sm:absolute sm:bottom-4 sm:right-6 sm:m-0 gap-3 rounded-full bg-black/50 px-3.5 py-1.5 backdrop-blur-xs">
        <IconButton
          icon={<Icon name={isPlaying ? "pause" : "play_arrow"} size={16} />}
          aria-label={isPlaying ? "Pause slide rotation" : "Play slide rotation"}
          aria-pressed={!isPlaying}
          variant="neutral"
          appearance="text"
          tone="inverse"
          size="sm"
          shape="circle"
          onClick={() => setIsPlaying((p) => !p)}
          className="size-6 min-h-0 min-w-0 bg-white/20"
        />

        {/* Was a hand-written copy of the same dots the persona card had, at a
            different size and opacity. Both now come from one component, whose
            controls carry the 24x24 hit area WCAG 2.2 AA asks for — these were
            10px targets 10px apart, which the spacing exception does not cover. */}
        <CarouselIndicators
          count={count}
          activeIndex={index}
          onSelect={go}
          size="sm"
          label="Hero slides"
        />
      </div>
    </section>
  );
}
