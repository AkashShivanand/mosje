"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/types/website";

const SLIDES: HeroSlide[] = [
  { image: "/website/images/Banner-6.png", alt: "Banner 6" },
  { image: "/website/images/Banner-7.png", alt: "Banner 7" },
  { image: "/website/images/Banner-8.png", alt: "Banner 8" },
  { image: "/website/images/Banner-9.png", alt: "Banner 9" },
  { image: "/website/images/Banner-10.png", alt: "Banner 10" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const count = SLIDES.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(id);
  }, [count]);

  return (
    <section className="relative w-full overflow-hidden bg-gray-100" aria-roledescription="carousel" aria-label="Highlights">
      <div className="relative aspect-[3/1] w-full">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            {/* sizes is "100vw" for EVERY slide, not just the active one. Each
                slide spans the full viewport width whenever it is shown, and
                `sizes` feeds srcset candidate selection — it is not a loading
                gate. The old `i === index ? "100vw" : "0px"` was inert under the
                app's custom image loader (which ignored width and returned the
                same full-size file for every candidate), but against the real
                optimizer it makes the browser pick the 32w candidate and stretch
                it across 1280px — a blurry smear, behind a green HTTP 200.
                Bandwidth is already governed by `priority`/`loading` below. */}
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
        className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow transition hover:bg-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-ink shadow transition hover:bg-white"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
