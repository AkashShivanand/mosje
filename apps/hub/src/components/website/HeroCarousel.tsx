"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@mosje/design-system";
import { CarouselIndicators } from "./CarouselIndicators";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const count = 4;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (!isPlaying) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, isPlaying]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 border-b border-gray-200" aria-roledescription="carousel" aria-label="Highlights">
      <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[440px] w-full">
        {/* Slide 0: Mann Ki Baat Banner matching Figma node 8137:48670 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${index === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          aria-hidden={index !== 0}
          inert={index !== 0}
        >
          <div className="h-full w-full bg-white grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="md:col-span-6 px-8 py-10 md:px-16 lg:px-24 flex flex-col justify-center">
              <h2 className="text-[38px] sm:text-[50px] lg:text-[62px] font-black leading-[1.05] tracking-tight text-[#881337]">
                Mann<br />
                <span className="text-[#991b1b]">Ki Baat</span>
              </h2>
              <p className="mt-2 text-[18px] sm:text-[22px] font-bold text-gray-800 tracking-tight">
                on 26<sup className="text-xs">th</sup> Oct 2025
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-xs sm:text-sm font-bold text-gray-700">
                  <Icon name="schedule" size={20} className="text-gray-500" />
                  TIME : 11 AM
                </div>

                <a
                  href="https://pmindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#dc2626] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#b91c1c]"
                >
                  <Icon name="play_arrow" size={20} />
                  WATCH LIVE
                </a>
              </div>
            </div>

            {/* Right Photo */}
            <div className="md:col-span-6 h-[260px] md:h-full relative min-h-[300px]">
              <Image
                src="/website/images/Banner-6.png"
                alt="Hon'ble Prime Minister with citizens"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Slide 1 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${index === 1 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          aria-hidden={index !== 1}
          inert={index !== 1}
        >
          <Image
            src="/website/images/Banner-7.png"
            alt="Department Highlights"
            fill
            className="object-cover"
          />
        </div>

        {/* Slide 2 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${index === 2 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          aria-hidden={index !== 2}
          inert={index !== 2}
        >
          <Image
            src="/website/images/Banner-8.png"
            alt="Empowerment Schemes"
            fill
            className="object-cover"
          />
        </div>

        {/* Slide 3 */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${index === 3 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          aria-hidden={index !== 3}
          inert={index !== 3}
        >
          <Image
            src="/website/images/Banner-9.png"
            alt="Scholarships and Welfare"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Icon name="keyboard_arrow_left" size={24} />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-ink shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Icon name="keyboard_arrow_right" size={24} />
      </button>

      {/* Play/Pause & Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/50 px-3.5 py-1.5 backdrop-blur-xs">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause slide rotation" : "Play slide rotation"}
          className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white hover:text-ink"
        >
          <Icon name={isPlaying ? "pause" : "play_arrow"} size={16} />
        </button>

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
