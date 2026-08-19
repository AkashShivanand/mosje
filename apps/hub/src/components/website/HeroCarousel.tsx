"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/types/website";
import { Icon } from "@mosje/design-system";

const SLIDES: HeroSlide[] = [
  { image: "/website/images/Banner-6.png", alt: "Banner 6" },
  { image: "/website/images/Banner-7.png", alt: "Banner 7" },
  { image: "/website/images/Banner-8.png", alt: "Banner 8" },
  { image: "/website/images/Banner-9.png", alt: "Banner 9" },
  { image: "/website/images/Banner-10.png", alt: "Banner 10" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const count = SLIDES.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (!isPlaying) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count, isPlaying]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-100" aria-roledescription="carousel" aria-label="Highlights">
      <div className="relative aspect-[3/1] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              loading={i <= 1 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Icon name="keyboard_arrow_left" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <Icon name="keyboard_arrow_right" />
      </button>

      {/* Play/Pause & Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-xs">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause slide rotation" : "Play slide rotation"}
          className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white hover:text-ink"
        >
          <Icon name={isPlaying ? "pause" : "play_arrow"} size={16} />
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
